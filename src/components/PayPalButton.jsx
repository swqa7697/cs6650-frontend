import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAccessToken } from '../util/aws-cognito-session';
import { BASE_URL } from '../config/config.json';

export const PayPalButton = ({ total, currency, orderData }) => {
  const navigate = useNavigate();

  const confirmOrder = async (token, reservationId, airline, purchaseId) => {
    try {
      await axios.put(
        `${BASE_URL}/reservation/confirm`,
        {
          reservationId,
          purchaseId,
        },
        {
          headers: {
            'cognito-token': token,
            'airline-name': airline,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      console.log(err);
      console.log(err.response.data.err);
    }
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId:
          'AZWuGnE5Ks69nBLHHoEl1jA36QrmTw3x0ZlxMkkDAr5mLJnZBB__aZ00LXE0vXz9BeDDwmRZRCUG7fqI',
        currency,
        commit: true,
      }}
    >
      <PayPalButtons
        style={{
          layout: 'horizontal',
          color: 'blue',
          shape: 'pill',
          tagline: false,
        }}
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [
              {
                amount: { value: total },
              },
            ],
          })
        }
        onApprove={async (data) => {
          const token = await getAccessToken();
          if (!token) {
            console.log('No Access Token Found');
            return;
          }

          orderData.map(async (order) => {
            await confirmOrder(
              token,
              order.reservationId,
              order.airline,
              data.orderID,
            );
          });

          return navigate('/transfer', {
            replace: true,
            state: { to: '/user' },
          });
        }}
      />
    </PayPalScriptProvider>
  );
};
