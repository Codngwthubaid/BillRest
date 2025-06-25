import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <p>Role: {user?.role}</p>
    </div>
  );
};

export default Dashboard;