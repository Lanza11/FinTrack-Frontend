
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

const registerSchema = z.object({
  name: z.string().min(2, 'Minimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Minimo 6 caracteres'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    if (data.email && data.password && data.name) {
      toast.success('Cuenta creada exitosamente');
      login({ id: '1', name: data.name, email: data.email });
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col p-4">
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-xl mb-4 shadow-sm">
             <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-800">Crear Cuenta</h1>
          <p className="text-gray-500 text-base mt-2">Únete a Fintrack hoy</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nombre Completo</Label>
              <Input 
                {...register('name')}
                placeholder="Juan Pérez"
                error={errors.name?.message}
              />
            </div>

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

            <div>
              <Label>Confirmar Contraseña</Label>
              <Input 
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button type="submit" className="w-full mt-6">
              REGISTRARSE
            </Button>
          </form>

          <p className="mt-6 text-center text-sm font-medium text-gray-600">
            ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 font-semibold hover:underline">Inicia sesión aquí →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
