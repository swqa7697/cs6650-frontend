/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { tripOptions, passengerOptions } from '../util/constants';
import { departureFlightsAtom, returnFlightsAtom } from '../util/atoms';
//import { BASE_URL } from '../config/config.json';

const BASE_URL = process.env.BASE_URL;

import 'react-datepicker/dist/react-datepicker.css';
import '../styles/inputStyle.css';
import '../styles/loading.css';

export const SearchBar = ({
  isRoundTrip,
  setIsRoundTrip,
  numPassengers,
  setNumPassengers,
}) => {
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);

  const setDepartureFlights = useSetAtom(departureFlightsAtom);
  const setReturnFlights = useSetAtom(returnFlightsAtom);

  const [errMsg, setErrMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setDepartureFlights([]);
    setReturnFlights([]);
  }, [isRoundTrip]);

  const searchFlights = async () => {
    setErrMsg('');
    setDepartureFlights([]);
    setReturnFlights([]);

    if (
      !departure ||
      !destination ||
      departure.length !== 3 ||
      destination.length !== 3
    ) {
      setErrMsg(
        'Locations should be an iata airport code which has exactly 3 letters',
      );
      return;
    }

    if (departure === destination) {
      setErrMsg('Departure and destination should not be same');
      return;
    }

    if (!departureDate || (isRoundTrip.value && !returnDate)) {
      setErrMsg('Please choose date(s) of departure (and return)');
      return;
    }

    if (
      isRoundTrip.value &&
      departureDate.toISOString() > returnDate.toISOString()
    ) {
      setErrMsg('Returning date should be after departure');
      return;
    }

    const depDateString = departureDate
      .toLocaleString('en-US')
      .split(' ')[0]
      .replace(/,/g, '');

    if (
      depDateString <
      new Date().toLocaleString('en-US').split(' ')[0].replace(/,/g, '')
    ) {
      setErrMsg('Departure date should be a current or future date');
      return;
    }

    try {
      setIsLoading(true);

      const depFlightsRes = await axios.get(`${BASE_URL}/flight/flights`, {
        params: {
          departure,
          destination,
          departureDate: depDateString,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setDepartureFlights(depFlightsRes.data);
    } catch (err) {
      console.log(err);
      setErrMsg(err.message);
      setDepartureFlights([]);
      setReturnFlights([]);
      setIsLoading(false);
      return;
    }

    if (isRoundTrip.value) {
      const retDateString = returnDate
        .toLocaleString('en-US')
        .split(' ')[0]
        .replace(/,/g, '');

      try {
        const retFlightsRes = await axios.get(`${BASE_URL}/flight/flights`, {
          params: {
            departure: destination,
            destination: departure,
            departureDate: retDateString,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });

        setReturnFlights(retFlightsRes.data);
      } catch (err) {
        setErrMsg(err.message);
        setReturnFlights([]);
        setIsLoading(false);
      }
    } else {
      setReturnFlights([]);
    }

    setIsLoading(false);
  };

  return (
    <div style={{ marginBottom: 10, maxWidth: '85%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 10,
          marginBottom: 5,
        }}
      >
        <Select
          defaultValue={isRoundTrip}
          onChange={setIsRoundTrip}
          options={tripOptions}
        />
        <Select
          defaultValue={numPassengers}
          onChange={setNumPassengers}
          options={passengerOptions}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <input
          type="text"
          placeholder="Where from?"
          style={{ minWidth: 125 }}
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
            setDeparture(event.target.value);
          }}
          maxLength={3}
        />
        <input
          type="text"
          placeholder="Where to?"
          style={{ minWidth: 125 }}
          onChange={(event) => {
            event.target.value = event.target.value.toUpperCase();
            setDestination(event.target.value);
          }}
          maxLength={3}
        />

        <DatePicker
          selected={departureDate}
          onChange={(date) => {
            setDepartureDate(date);
          }}
          customInput={<input type="text" style={{ minWidth: 105 }} />}
          placeholderText="Departure"
        />
        <DatePicker
          selected={returnDate}
          onChange={(date) => {
            setReturnDate(date);
          }}
          customInput={<input type="text" style={{ minWidth: 105 }} />}
          placeholderText="Return"
          disabled={!isRoundTrip.value}
        />

        <button
          onClick={searchFlights}
          style={{ minWidth: 150, backgroundColor: 'lightskyblue' }}
        >
          Search Flights
        </button>
      </div>
      {errMsg !== '' ? <div style={{ margin: 5 }}>{errMsg}</div> : null}
      {isLoading ? (
        <FaArrowRotateRight
          className="loader"
          size={26}
          style={{ margin: 10 }}
        />
      ) : null}
    </div>
  );
};
