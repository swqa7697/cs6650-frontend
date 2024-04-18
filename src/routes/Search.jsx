import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { FaUser } from 'react-icons/fa6';
import { SearchBar } from '../components/SearchBar';
import { FlightList } from '../components/FlightList';
import { FlightCard } from '../components/FlightCard';
import { getAccessToken } from '../util/aws-cognito-session';
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

  const [promptMsg, setPromptMsg] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  useEffect(() => {
    setDepSelected(null);
    setRetSelected(null);
  }, [depFlights, retFlights]);

  const navigate = useNavigate();

  const goToBookingPage = async () => {
    setPromptMsg('');

    const token = await getAccessToken();

    if (!token) {
      setPromptMsg('Please log in or sign up to book a flight');
      return;
    }

    return navigate('/bookflight', {
      replace: true,
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
      <div
        style={{
          position: 'fixed',
          right: 15,
          top: 15,
          zIndex: 100,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/user', { replace: true, state: {} })}
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
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          paddingTop: 15,
          gap: 20,
          backgroundColor: 'white',
        }}
      >
        <h2>Search Flights</h2>
        <SearchBar
          isRoundTrip={isRoundTrip}
          setIsRoundTrip={setIsRoundTrip}
          numPassengers={numPassengers}
          setNumPassengers={setNumPassengers}
          setIsSearched={setIsSearched}
        />
      </div>
      <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
        {!depSelected ? (
          <FlightList
            flightsData={depFlights}
            flightSelected={depSelected}
            setFlight={setDepSelected}
            isSearched={isSearched}
          />
        ) : (
          <FlightCard
            flightId={depSelected.flightId}
            airline={depSelected.airline}
            flightNumber={depSelected.flightNumber}
            departure={depSelected.departure}
            destination={depSelected.destination}
            departureTime={depSelected.departureTime}
            travelTime={depSelected.travelTime}
            timezone={depSelected.timezone}
            price={depSelected.price}
            flightSelected={depSelected}
            setFlight={setDepSelected}
            isSearch={true}
          />
        )}
      </div>
      {isRoundTrip.value && depSelected ? (
        !retSelected ? (
          <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
            <p>Choose Returning Flight:</p>
            <FlightList
              flightsData={retFlights}
              flightSelected={retSelected}
              setFlight={setRetSelected}
              isSearched={isSearched}
            />
          </div>
        ) : (
          <div style={{ width: '55%', maxWidth: 600, margin: 'auto' }}>
            <FlightCard
              flightId={retSelected.flightId}
              airline={retSelected.airline}
              flightNumber={retSelected.flightNumber}
              departure={retSelected.departure}
              destination={retSelected.destination}
              departureTime={retSelected.departureTime}
              travelTime={retSelected.travelTime}
              timezone={retSelected.timezone}
              price={retSelected.price}
              flightSelected={retSelected}
              setFlight={setRetSelected}
              isSearch={true}
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
          {promptMsg !== '' ? (
            <div style={{ marginTop: 8 }}>{promptMsg}</div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
