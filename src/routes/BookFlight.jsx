import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
import { getAccessToken } from '../util/aws-cognito-session';
import { BASE_URL } from '../config/config.json';

import '../styles/loading.css';

export default function BookFlight() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRoundTrip, numPassengers, depFlight, retFlight } = location.state;

  const initialInfo = Array.from({ length: numPassengers }, () => ({
    firstname: '',
    lastname: '',
    passport: '',
  }));

  const [passengerInfo, setPassengerInfo] = useState(initialInfo);

  const handleInputChange = (index, field, value) => {
    const newInfo = [...passengerInfo];
    newInfo[index][field] = value;
    setPassengerInfo(newInfo);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [promptMsg, setPromptMsg] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const reserveFlights = async () => {
    setPromptMsg('');

    // Check inputs
    for (let i = 0; i < numPassengers; i++) {
      if (
        passengerInfo[i].firstname === '' ||
        passengerInfo[i].lastname === '' ||
        passengerInfo[i].passport === ''
      ) {
        setPromptMsg('Please fill out information for all passengers');
        return;
      }
    }

    const token = await getAccessToken();
    if (!token) {
      setPromptMsg('Please log in or sign up to book a flight');
      return;
    }

    let isBookingReturn = false;
    try {
      setIsLoading(true);

      // Firstly book the departure flight
      const resDep = await axios.post(
        `${BASE_URL}/user/book`,
        {
          flightId: depFlight.flightId,
          numPassengers,
          passengerInfo,
        },
        {
          headers: {
            'cognito-token': token,
            'airline-name': depFlight.airline,
            'Content-Type': 'application/json',
          },
        },
      );

      // Then book the return flight if necessary
      if (isRoundTrip) {
        await axios
          .post(
            `${BASE_URL}/user/book`,
            {
              flightId: retFlight.flightId,
              numPassengers,
              passengerInfo,
              orderId: resDep.data.reservation.orderId,
            },
            {
              headers: {
                'cognito-token': token,
                'airline-name': retFlight.airline,
                'Content-Type': 'application/json',
              },
            },
          )
          .catch(async (err) => {
            await autoCancel(token, resDep.data.reservation._id);
            isBookingReturn = true;
            console.log(err);
            throw new Error(err.response.data.err);
          });
      }

      setPromptMsg(
        isRoundTrip ? 'Your flights are booked!' : 'Your flight is booked!',
      );
      setIsBooked(true);
    } catch (err) {
      if (isBookingReturn) {
        console.log(err.message);
      } else {
        console.log(err);
        console.log(err.response.data.err);
      }
      setPromptMsg('Failed to book your flight(s)');
    } finally {
      setIsLoading(false);
    }
  };

  const autoCancel = async (token, reservationId) => {
    // Cancel the departure flight if failed to book return flight
    try {
      await axios.put(
        `${BASE_URL}/reservation/autoCancel`,
        {
          reservationId,
        },
        {
          headers: {
            'cognito-token': token,
            'airline-name': depFlight.airline,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      console.log(err);
      console.log(err.response.data.err);
    }
  };

  return (
    <div>
      <div
        style={{
          position: 'fixed',
          right: 15,
          top: 15,
          zIndex: 100,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/search', { replace: true, state: {} })}
      >
        <FaHome
          size={40}
          color="white"
          style={{ backgroundColor: 'grey', borderRadius: 40, padding: 6 }}
        />
      </div>
      <h2
        style={{
          position: 'sticky',
          top: 0,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: 'white',
        }}
      >
        Enter Information Of Passengers
      </h2>
      {passengerInfo.map((item, index) => (
        <div key={index}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              margin: 10,
            }}
          >
            Passenger {index + 1}
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
              margin: 10,
            }}
          >
            <input
              type="text"
              placeholder="First Name"
              value={item.firstname}
              onChange={(e) =>
                handleInputChange(index, 'firstname', e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={item.lastname}
              onChange={(e) =>
                handleInputChange(index, 'lastname', e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Passport"
              value={item.passport}
              onChange={(e) =>
                handleInputChange(index, 'passport', e.target.value)
              }
            />
          </div>
        </div>
      ))}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        {!isBooked ? (
          <button
            onClick={reserveFlights}
            style={{ backgroundColor: 'orange', marginTop: 10 }}
          >
            Book Flight
          </button>
        ) : (
          <button
            onClick={() => navigate('/user', { replace: true, state: {} })}
            style={{ backgroundColor: 'orange', marginTop: 10 }}
          >
            Proceed to Purchase
          </button>
        )}
        {isLoading ? (
          <FaArrowRotateRight
            className="loader"
            size={26}
            style={{ marginTop: 15 }}
          />
        ) : null}
        {promptMsg !== '' ? (
          <div style={{ marginTop: 8 }}>{promptMsg}</div>
        ) : null}
      </div>
    </div>
  );
}
