import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import ChickensPage from './pages/ChickensPage';
import FinancesPage from './pages/FinancesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
          {/* Default route */}
          <Route
            path="/"
            element={<SignIn />}
          />{' '}
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
