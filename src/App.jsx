import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';    
import Inspection from './pages/Inspection';   
import History from './pages/History';         
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ), 
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "inspection",
        element: <Inspection />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "settings",
        element: <div className="p-6">Settings (Coming Soon)</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;