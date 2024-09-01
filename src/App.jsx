import React, { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Lazy load components
const SignUp = lazy(() => import('./pages/SignUp'));
const SignIn = lazy(() => import('./pages/SignIn'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ChickensPage = lazy(() => import('./pages/ChickensPage'));
const FinancesPage = lazy(() => import('./pages/FinancesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const Loading = () => <div>Loading...</div>;

function App() {
  return (
    <Provider store={store}>
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
              path="/dashboard/"
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
              path="/"
              element={<SignIn />}
            />
            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
