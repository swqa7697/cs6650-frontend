import FlatList from 'flatlist-react';
import { FlightCard } from './FlightCard';

export const FlightList = ({
  flightsData,
  timezone,
  flightSelected,
  setFlight,
}) => {
  return (
    <FlatList
      list={flightsData}
      renderItem={(flight, idx) => {
        return (
          <FlightCard
            key={idx}
            flightId={flight._id}
            flightNumber={flight.flightNumber}
            departure={flight.departure}
            destination={flight.destination}
            departureTime={flight.departureTime}
            travelTime={flight.travelTime}
            price={flight.price}
            timezone={timezone}
            flightSelected={flightSelected}
            setFlight={setFlight}
          />
        );
      }}
      renderWhenEmpty={() => null}
      sortBy="price"
    />
  );
};
