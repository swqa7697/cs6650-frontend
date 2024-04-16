/* eslint-disable react-refresh/only-export-components */
import { withAuthenticator } from '@aws-amplify/ui-react';
import { FaHome, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import '@aws-amplify/ui-react/styles.css';

const User = ({ signOut, user }) => {
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
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>{user.username}</div>
        <Link to="/search">
          <FaSignOutAlt
            size={35}
            color="grey"
            onClick={signOut}
            style={{ marginTop: 3 }}
          />
        </Link>
        <Link to="/search">
          <FaHome
            size={40}
            color="white"
            style={{ backgroundColor: 'grey', borderRadius: 40, padding: 6 }}
          />
        </Link>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 50,
          left: 0,
          width: '100%',
        }}
      >
        <h2>Booking History</h2>
      </div>
    </>
  );
};

export default withAuthenticator(User);
