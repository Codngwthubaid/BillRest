import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { registerSchema } from '@/lib/schemas';
import { register } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormError } from '../components/FormError';
import { User, Mail, Phone, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data); // setAuth handled in authService
      navigate('/login');
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 metallb w-5 text-gray-400" />
              <Input placeholder="Name" className="pl-10" {...formRegister('name')} />
            </div>
            <FormError message={errors.name?.message} />
          </div>
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input type="email" placeholder="Email" className="pl-10" {...formRegister('email')} />
            </div>
            <FormError message={errors.email?.message} />
          </div>
          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input type="tel" placeholder="Phone" className="pl-10" {...formRegister('phone')} />
            </div>
            <FormError message={errors.phone?.message} />
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input type="password" placeholder="Password" className="pl-10" {...formRegister('password')} />
            </div>
            <FormError message={errors.password?.message} />
          </div>
          <FormError message={errors.root?.message} />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <p className="text-center text-sm">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;