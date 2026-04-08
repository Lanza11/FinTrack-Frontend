
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { toast } from 'sonner';
import { Wallet } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // Mock temporal para el flujo de frontend sin BD
    if (data.email && data.password) {
      toast.success('Inicio de sesión exitoso');
      login({ id: '1', name: 'Usuario Prueba', email: data.email });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-gray-50 flex flex-col p-4">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-sm">
             <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-800">Fintrack</h1>
          <p className="text-gray-500 text-base mt-2">Gestión Financiera Simple</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input 
                {...register('email')}
                type="email"
                placeholder="juan@ejemplo.com"
                error={errors.email?.message}
              />
            </div>

            <div>
              <Label>Contraseña</Label>
              <Input 
                {...register('password')}
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
              />
            </div>

            <div className="flex items-center mb-4">
               <input type="checkbox" id="remember" className="mr-2 rounded text-blue-600 border-gray-300" />
               <Label htmlFor="remember" className="mb-0">Recuérdame</Label>
            </div>

            <Button type="submit" className="w-full">
              INICIAR SESIÓN
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-gray-600">
            ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Crear una ahora →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
