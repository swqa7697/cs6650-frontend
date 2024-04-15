import FlatList from 'flatlist-react';
import { FlightCard } from './FlightCard';

export const FlightList = () => {
  const data = [
    {
      flightNumber: 'AB 1234',
      departure: 'LAX',
      destination: 'SFO',
      departureTime: '2024-04-12T12:15:00.000Z',
      travelTime: 100,
      price: 200,
    },
    {
      flightNumber: 'AB 3221',
      departure: 'LAX',
      destination: 'SFO',
      departureTime: '2024-04-12T15:00:00.000Z',
      travelTime: 100,
      price: 185,
    },
  ];

  const timezone = 'America/Los_Angeles';

  return (
    <FlatList
      list={data}
      renderItem={(flight, idx) => {
        return (
          <FlightCard
            key={idx}
            flightNumber={flight.flightNumber}
            departure={flight.departure}
            destination={flight.destination}
            departureTime={flight.departureTime}
            travelTime={flight.travelTime}
            price={flight.price}
            timezone={timezone}
          />
        );
      }}
      renderWhenEmpty={() => <div>List is empty!</div>}
      sortBy="price"
    />
  );
};
