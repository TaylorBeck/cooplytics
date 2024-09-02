import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

// Lazy load components
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChickensPage = lazy(() => import('./pages/ChickensPage'));
const FinancesPage = lazy(() => import('./pages/FinancesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrivateRoute = lazy(() => import('./components/PrivateRoute'));

// Loading component
const Loading = () => (
  <div style={spinnerStyles.spinnerContainer}>
    <div style={spinnerStyles.spinner}></div>
  </div>
);

const spinnerStyles = {
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  },
  spinner: {
    border: '16px solid #f3f3f3',
    borderTop: '16px solid #3498db',
    borderRadius: '50%',
    width: '120px',
    height: '120px',
    animation: 'spin 2s linear infinite'
  }
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
      >
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route
                path="/sign-up"
                element={<SignUp />}
              />
              <Route
                path="/sign-in"
                element={<SignIn />}
              />
              <Route
                path="/"
                element={<SignIn />}
              />

              <Route element={<PrivateRoute />}>
                <Route
                  path="/dashboard"
                  element={<Dashboard />}
                />
                <Route
                  path="/chickens"
                  element={<ChickensPage />}
                />
                <Route
                  path="/finances"
                  element={<FinancesPage />}
                />
                <Route
                  path="/settings"
                  element={<SettingsPage />}
                />
                <Route
                  path="/calendar"
                  element={<SettingsPage />}
                />
              </Route>

              <Route
                path="*"
                element={<NotFound />}
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
