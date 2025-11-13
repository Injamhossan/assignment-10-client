import React from 'react';
import { createBrowserRouter } from 'react-router';
import Root from '../Root/Root';
import Home from '../pages/Home/Home';
import FindPartners from '../pages/FindPartners/FindPartners';
import CreatePartner from '../pages/CreatePartner/CreatePartner';
import MyConnections from '../pages/MyConnections/MyConnections';
import MyProfile from '../pages/MyProfile/MyProfile';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';
import PartnerDetail from '../components/PartnerDetail/PartnerDetail';

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
        path: "findpartners",
        element: <FindPartners/>
      },
      {
        path: "partner/:id", 
        element: <PartnerDetail />
      },
      {
        path: "createprofile",
        element: <CreatePartner/>
      },
      {
        path: "myconnection",
        element: <MyConnections/>
      },
      {
        path: "myprofile",
        element: <MyProfile/>
      },
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "*",
        element: <NotFound/>
      }
    ]
  },
]);