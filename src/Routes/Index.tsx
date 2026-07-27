import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Layout from '../Layout';
import {useSelector} from 'react-redux'; // Import useSelector

// routes
import {authProtectedRoutes, publicRoutes} from './allRoutes';

const Index = (): JSX.Element => {
  const token = useSelector((state: any) => state?.Login?.token);

  const isProtected = !!(token !== null && token !== undefined && token !== '');

  return (
    <Routes>
      <Route
        path="/"
        element={
          isProtected ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {publicRoutes.map((route, idx) => {
        const id = idx * Math.floor(Math.random() * 10);
        return (
          <Route
            key={id}
            path={route.path}
            element={
              isProtected ? (
                <Navigate to="/dashboard" replace state={{from: route.path}} />
              ) : (
                <route.component />
              )
            }
          />
        );
      })}

      {authProtectedRoutes.map((route, idx) => {
        const id = idx * Math.floor(Math.random() * 10);
        return (
          <Route
            key={id}
            path={route.path}
            element={
              !isProtected ? (
                <Navigate to="/login" replace state={{from: route.path}} />
              ) : (
                <Layout>
                  <route.component />
                </Layout>
              )
            }
          />
        );
      })}
    </Routes>
  );
};

export default Index;
