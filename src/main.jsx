import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import Search from './routes/Search.jsx';
import User from './routes/User.jsx';
import BookFlight from './routes/BookFlight.jsx';
import { Redirector } from './components/Redirector.jsx';
import awsConfig from './util/aws-config.js';

import './styles/index.css';

Amplify.configure(awsConfig);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate replace to="/search" />,
  },
  {
    path: '/search',
    element: <Search />,
  },
  {
    path: '/user',
    element: <User />,
  },
  {
    path: '/bookflight',
    element: <BookFlight />,
  },
  {
    path: '/transfer',
    element: <Redirector />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
