import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';

import SignUp from './containers/SignUp';
import UserLayout from './components/layout/UserLayout';

// Create a Tanstack query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  }
});

const user = null;

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {user ? <UserLayout /> : <SignUp />}
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
