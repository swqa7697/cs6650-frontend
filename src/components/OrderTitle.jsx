import { useState } from 'react';
import { statusColor } from '../util/constants';

export const OrderTitle = ({ group, groupLabel }) => {
  const [showPassenger, setShowPassenger] = useState(false);

  const status = group[0].reservation.status;
  const numPassengers = group[0].reservation.numPassengers;
  const passengers = group[0].reservation.passengers;
  const orderDate = new Date(group[0].reservation.createdAt)
    .toLocaleString('en-US')
    .split(' ')[0]
    .replace(/,/g, '');

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          fontSize: 14,
          gap: 5,
        }}
      >
        <b>Order:</b> {groupLabel}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 50,
        }}
      >
        <div
          onClick={() => setShowPassenger(!showPassenger)}
          style={{
            cursor: 'pointer',
            alignItems: 'center',
          }}
        >
          <div>Booked On: {orderDate}</div>
          {showPassenger ? (
            numPassengers > 1 ? (
              <u>{numPassengers} Passengers Included</u>
            ) : (
              <u>{numPassengers} Passenger Included</u>
            )
          ) : (
            <>
              {passengers.map((person, index) => (
                <div key={index}>
                  {person.firstname} {person.lastname}
                </div>
              ))}
            </>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 10,
            fontSize: 18,
          }}
        >
          {status === 'canceled' ? (
            <button
              onClick={() => {}}
              style={{
                backgroundColor: 'lightskyblue',
                padding: 6,
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              Pay
            </button>
          ) : null}
          <div style={{ color: statusColor[status] }}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
      </div>
    </>
  );
};
