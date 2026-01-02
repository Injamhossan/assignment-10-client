import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root/Root';
import DashboardLayout from '../Layouts/DashboardLayout';
import Home from '../pages/Home/Home';
import FindPartners from '../pages/FindPartners/FindPartners';
import CreatePartner from '../pages/CreatePartner/CreatePartner';
import MyConnections from '../pages/MyConnections/MyConnections';
import MyProfile from '../pages/MyProfile/MyProfile';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import NotFound from '../pages/NotFound/NotFound';
import PartnerDetail from '../components/PartnerDetail/PartnerDetail';
import DashboardHome from '../pages/Dashboard/DashboardHome';
import PrivateRoute from './PrivateRoute'; // Import the new PrivateRoute

import About from '../pages/About/About';
import Contact from '../pages/Contact/Contact';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <NotFound />,
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
        path: "login",
        element: <Login/>
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "about",
        element: <About/>
      },
      {
        path: "contact",
        element: <Contact/>
      }
    ]
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true, 
        element: <DashboardHome /> 
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
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);