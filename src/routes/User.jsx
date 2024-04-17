/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FlatList from 'flatlist-react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { FaArrowRotateRight } from 'react-icons/fa6';
import { FlightCard } from '../components/FlightCard';
import { OrderTitle } from '../components/OrderTitle';
//import { BASE_URL } from '../config/config.json';

const BASE_URL = process.env.BASE_URL;

import '@aws-amplify/ui-react/styles.css';
import '../styles/loading.css';

const User = ({ signOut, user }) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptMsg, setPromptMsg] = useState('');

  const navigate = useNavigate();

  const getAccessToken = async () => {
    try {
      const { accessToken } = (await fetchAuthSession()).tokens ?? {};
      if (!accessToken) {
        throw new Error('No access token found');
      }

      return accessToken.toString();
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  const fetchOrderHistory = async () => {
    setIsLoading(true);
    setPromptMsg('');

    const token = await getAccessToken();
    if (!token) {
      setPromptMsg('No Access Token Found');
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/user/reservations`, {
        headers: {
          'cognito-token': token,
          'Content-Type': 'application/json',
        },
      });

      setOrderHistory(res.data);
    } catch (err) {
      setPromptMsg(err.message);
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
        {promptMsg !== '' ? (
          <div style={{ marginTop: 8 }}>{promptMsg}</div>
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
