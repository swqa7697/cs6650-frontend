import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import { BASE_URL } from '../config/config.json';

export const PayPalButton = ({ price, currency, reservationIds }) => {
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

  const confirmOrder = async (token, reservationId, purchaseId) => {
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
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (err) {
      console.log(err.message);
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
                amount: { value: price },
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

          reservationIds.map(async (reservationId) => {
            await confirmOrder(token, reservationId, data.orderID);
          });

          window.location.reload();
        }}
      />
    </PayPalScriptProvider>
  );
};
