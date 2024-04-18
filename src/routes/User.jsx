/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlatList from 'flatlist-react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { FlightCard } from '../components/FlightCard';
import { OrderTitle } from '../components/OrderTitle';
import { getAccessToken } from '../util/aws-cognito-session';
import { BASE_URL } from '../config/config.json';

import '@aws-amplify/ui-react/styles.css';
import '../styles/loading.css';

const User = ({ signOut, user }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchOrderHistory = async () => {
    const token = await getAccessToken();
    if (!token) {
      console.log('No Access Token Found');
      return;
    }

    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/user/reservations`, {
        headers: {
          'cognito-token': token,
          'Content-Type': 'application/json',
        },
      });
      setOrderHistory(res.data);
    } catch (err) {
      console.log(err);
      console.log(err.response.data.err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <>
      <div
        style={{
          position: 'fixed',
          right: 15,
          top: 15,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 15,
          zIndex: 100,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{user.username}</div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/search', { replace: true, state: {} })}
        >
          <FaSignOutAlt
            size={35}
            color="grey"
            onClick={signOut}
            style={{ marginTop: 3 }}
          />
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/search', { replace: true, state: {} })}
        >
          <FaHome
            size={40}
            color="white"
            style={{ backgroundColor: 'grey', borderRadius: 40, padding: 6 }}
          />
        </div>
      </div>
      <div
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          width: '100%',
          paddingTop: 20,
          paddingBottom: 10,
          backgroundColor: 'white',
        }}
      >
        <h2>Booking History</h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        {isLoading ? (
          <FaArrowRotateRight
            className="loader"
            size={26}
            style={{ marginTop: 15 }}
          />
        ) : null}
      </div>
      <div>
        <FlatList
          list={orderHistory}
          renderItem={(order, idx) => {
            return (
              <FlightCard
                key={idx}
                flightId={order.reservation.flight._id}
                flightNumber={order.reservation.flight.flightNumber}
                departure={order.reservation.flight.departure}
                destination={order.reservation.flight.destination}
                departureTime={order.reservation.flight.departureTime}
                travelTime={order.reservation.flight.travelTime}
                timezone={order.reservation.flight.timezone}
                price={order.reservation.flight.price}
                isSearch={false}
              />
            );
          }}
          renderWhenEmpty={() => <div>No Order Found</div>}
          sortBy={[{ key: 'reservation.createdAt', descending: true }]}
          group={{
            by: 'reservation.orderId',
            sortedBy: 'reservation.createdAt',
            separator: (group, idx, groupLabel) => {
              return <OrderTitle group={group} groupLabel={groupLabel} />;
            },
          }}
        />
      </div>
    </>
  );
};

export default withAuthenticator(User);
