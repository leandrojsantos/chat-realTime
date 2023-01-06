import React, { lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

const Login = lazy(() => import('../pages/Login'));

const UnAuthorisedApp = () => {
  const location = useLocation();
  return (
    <Routes>
      <Route exact path="/" component={Login} />
      <Navigate
        to={{
          pathname: '/',
          state: { from: location },
        }}
      />
    </Routes>
  );
};

export default UnAuthorisedApp;
