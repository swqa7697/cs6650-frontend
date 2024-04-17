import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import axios from 'axios';
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

    try {
      setIsLoading(true);

      const { accessToken } = (await fetchAuthSession()).tokens ?? {};

      if (!accessToken) {
        setPromptMsg('Please log in or sign up to book a flight');
        setIsLoading(false);
        return;
      }

      // Firstly book the departure flight
      const resDep = await bookDeparture(accessToken);
      if (!resDep.success) {
        throw resDep.err;
      }

      // Then book the return flight if necessary
      if (isRoundTrip) {
        const resRet = await bookReturn(accessToken, resDep.orderId);

        if (!resRet.success) {
          await autoCancel(accessToken, resDep.reservationId);
          throw resRet.err;
        }
      }

      setPromptMsg(
        isRoundTrip ? 'Your flights are booked!' : 'Your flight is booked!',
      );
      setIsBooked(true);
    } catch (err) {
      setPromptMsg(err);
    } finally {
      setIsLoading(false);
    }
  };

  const bookDeparture = async (accessToken) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user/book`,
        {
          flightId: depFlight.flightId,
          numPassengers,
          passengerInfo,
        },
        {
          headers: {
            'cognito-token': accessToken.toString(),
            'airline-name': depFlight.airline,
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        success: true,
        reservationId: res.data.reservation._id,
        orderId: res.data.reservation.orderId,
      };
    } catch (err) {
      return { success: false, err };
    }
  };

  const bookReturn = async (accessToken, orderId) => {
    try {
      await axios.post(
        `${BASE_URL}/user/book`,
        {
          flightId: retFlight.flightId,
          numPassengers,
          passengerInfo,
          orderId,
        },
        {
          headers: {
            'cognito-token': accessToken.toString(),
            'airline-name': retFlight.airline,
            'Content-Type': 'application/json',
          },
        },
      );

      return { success: true };
    } catch (err) {
      return { success: false, err };
    }
  };

  const autoCancel = async (accessToken, reservationId) => {
    // Cancel the departure flight if failed to book return flight
    try {
      await axios.put(
        `${BASE_URL}/reservation/autoCancel`,
        {
          reservationId,
        },
        {
          headers: {
            'cognito-token': accessToken.toString(),
            'airline-name': retFlight.airline,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      console.log(err);
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
        <>
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
            key={index}
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
        </>
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
