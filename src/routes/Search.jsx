import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { fetchAuthSession } from 'aws-amplify/auth';
import { FaUser, FaArrowRotateRight } from 'react-icons/fa6';
import { SearchBar } from '../components/SearchBar';
import { FlightList } from '../components/FlightList';
import { FlightCard } from '../components/FlightCard';
import { tripOptions, passengerOptions } from '../util/constants';
import { departureFlightsAtom, returnFlightsAtom } from '../util/atoms';

import '../styles/search.css';
import '../styles/loading.css';

export default function Search() {
  const [isRoundTrip, setIsRoundTrip] = useState(tripOptions[0]);
  const [numPassengers, setNumPassengers] = useState(passengerOptions[0]);

  const [depFlights, setDepFlights] = useAtom(departureFlightsAtom);
  const [retFlights, setRetFlights] = useAtom(returnFlightsAtom);

  const [depSelected, setDepSelected] = useState(null);
  const [retSelected, setRetSelected] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [promptMsg, setPromptMsg] = useState('');

  useEffect(() => {
    setDepSelected(null);
    setRetSelected(null);
  }, [depFlights, retFlights]);

  const navigate = useNavigate();

  const goToBookingPage = async () => {
    setPromptMsg('');

    try {
      setIsLoading(true);

      const { accessToken } = (await fetchAuthSession()).tokens ?? {};

      if (!accessToken) {
        setPromptMsg('Please log in or sign up to book a flight');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      setPromptMsg(err);
    } finally {
      setIsLoading(false);
    }

    return navigate('/bookflight', {
      state: {
        isRoundTrip: isRoundTrip.value,
        numPassengers: numPassengers.value,
        depFlight: depSelected,
        retFlight: retSelected,
      },
    });
  };

  return (
    <>
      <Link
        to="/user"
        style={{ position: 'fixed', right: 15, top: 15, zIndex: 100 }}
      >
        <FaUser
          size={40}
          color="white"
          style={{ backgroundColor: 'grey', borderRadius: 30, padding: 5 }}
          onClick={() => {
            setDepFlights({});
            setRetFlights({});
          }}
        />
      </Link>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          position: 'sticky',
          top: 0,
          paddingTop: 20,
          backgroundColor: 'white',
        }}
      >
        <SearchBar
          isRoundTrip={isRoundTrip}
          setIsRoundTrip={setIsRoundTrip}
          numPassengers={numPassengers}
          setNumPassengers={setNumPassengers}
        />
      </div>
      <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
        {!depSelected ? (
          <FlightList
            flightsData={depFlights.flights}
            timezone={depFlights.timezone}
            flightSelected={depSelected}
            setFlight={setDepSelected}
          />
        ) : (
          <FlightCard
            flightId={depSelected.flightId}
            flightNumber={depSelected.flightNumber}
            departure={depSelected.departure}
            destination={depSelected.destination}
            departureTime={depSelected.departureTime}
            travelTime={depSelected.travelTime}
            price={depSelected.price}
            timezone={depFlights.timezone}
            flightSelected={depSelected}
            setFlight={setDepSelected}
          />
        )}
      </div>
      {isRoundTrip.value && depSelected ? (
        !retSelected ? (
          <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
            <p>Choose Returning Flight:</p>
            <FlightList
              flightsData={retFlights.flights}
              timezone={retFlights.timezone}
              flightSelected={retSelected}
              setFlight={setRetSelected}
            />
          </div>
        ) : (
          <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
            <FlightCard
              flightId={retSelected.flightId}
              flightNumber={retSelected.flightNumber}
              departure={retSelected.departure}
              destination={retSelected.destination}
              departureTime={retSelected.departureTime}
              travelTime={retSelected.travelTime}
              price={retSelected.price}
              timezone={retFlights.timezone}
              flightSelected={retSelected}
              setFlight={setRetSelected}
            />
          </div>
        )
      ) : null}
      {depSelected && (!isRoundTrip.value || retSelected) ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <button
            style={{ backgroundColor: 'orange' }}
            onClick={goToBookingPage}
          >
            Next
          </button>
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
      ) : null}
    </>
  );
}
