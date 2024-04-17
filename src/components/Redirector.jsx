import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRotateRight } from 'react-icons/fa6';

import '../styles/loading.css';
import { useEffect } from 'react';

export const Redirector = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redir = (target) => {
    return navigate(target, { replace: true, state: {} });
  };

  const defaultRedir = () => {
    setTimeout(() => {
      return navigate('/', { replace: true, state: {} });
    }, 2000);
  };

  useEffect(() => {
    if (!location.state || !location.state.to) {
      defaultRedir();
    } else {
      redir(location.state.to);
    }
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <FaArrowRotateRight
        className="loader"
        size={40}
        style={{ margin: 0, padding: 0 }}
      />
    </div>
  );
};
