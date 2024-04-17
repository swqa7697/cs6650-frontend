import FlatList from 'flatlist-react';
import { FlightCard } from './FlightCard';

export const FlightList = ({ flightsData, flightSelected, setFlight }) => {
  return (
    <FlatList
      list={flightsData}
      renderItem={(flight, idx) => {
        return (
          <FlightCard
            key={idx}
            flightId={flight._id}
            airline={flight.airline}
            flightNumber={flight.flightNumber}
            departure={flight.departure}
            destination={flight.destination}
            departureTime={flight.departureTime}
            travelTime={flight.travelTime}
            price={flight.price}
            timezone={flight.timezone}
            flightSelected={flightSelected}
            setFlight={setFlight}
            isSearch={true}
          />
        );
      }}
      renderWhenEmpty={() => null}
      sortBy="price"
    />
  );
};
