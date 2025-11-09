import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Root/Root';
import Home from '../pages/Home/Home';
import FindPartners from '../pages/FindPartners/FindPartners';
import CreatePartner from '../pages/CreatePartner/CreatePartner';
import MyConnections from '../pages/MyConnections/MyConnections';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "/findpartners",
        element: <FindPartners/>
      },
      {
        path: "/createprofile",
        element: <CreatePartner/>
      },
      {
        path: "/myconnection",
        element: <MyConnections/>
      },
      {
        path: "/login",
        element: <Login/>
      },
      {
        path: "/register",
        element: <Register/>
      },
      {
        path: "*",
        element: <NotFound/>
      }
    ]
  },
]);