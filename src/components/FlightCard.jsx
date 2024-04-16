import { FaArrowRight, FaPlane } from 'react-icons/fa6';

export const FlightCard = ({
  flightId,
  flightNumber,
  departure,
  destination,
  departureTime,
  travelTime,
  price,
  timezone,
  flightSelected,
  setFlight,
}) => {
  const depTime = new Date(departureTime);
  const arrTime = new Date(depTime.getTime() + travelTime * 60 * 1000);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timezone,
  };

  const depTimeString = new Intl.DateTimeFormat('en-US', options)
    .format(depTime)
    .replace(/,/g, '');
  const arrTimeString = new Intl.DateTimeFormat('en-US', options)
    .format(arrTime)
    .replace(/,/g, '');

  const selectFlight = () => {
    if (flightSelected) {
      setFlight(null);
    } else {
      setFlight({
        flightId,
        flightNumber,
        departure,
        destination,
        departureTime,
        travelTime,
        price,
      });
    }
  };

  return (
    <div style={{ height: 105, width: '100%', marginBottom: 10 }}>
      <button onClick={selectFlight} style={{ height: '100%', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <FaPlane style={{ marginRight: 6 }} />
            {flightNumber}
          </div>
          <div>${price}</div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', margin: '2%' }}>
              {departure}
            </div>
            <div>{depTimeString}</div>
          </div>
          <div>
            <FaArrowRight size={24} style={{ marginTop: '34%' }} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 'bold', margin: '2%' }}>
              {destination}
            </div>
            <div>{arrTimeString}</div>
          </div>
        </div>
      </button>
    </div>
  );
};
