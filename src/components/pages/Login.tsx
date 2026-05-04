import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import { Wallet, ArrowRight, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

// Esquema de validacion para el formulario de acceso
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(100, 'Máximo 100 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Procesa el inicio de sesion conectando con el microservicio de auth
  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      
      // Adaptación de la respuesta del backend al estado global del frontend
      const userData = {
        id: response.userId,
        email: data.email, // El backend no devuelve el email, lo tomamos del formulario
        name: data.email.split('@')[0] // Fallback para el nombre
      };

      login(userData, response.accessToken);
      toast.success('Bienvenido de nuevo');
      navigate('/');
    } catch (error) {
      toast.error('Credenciales incorrectas');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-slate-50 flex flex-col p-4 font-sans selection:bg-blue-100">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[440px] animate-fade-in">
        <div className="flex flex-col items-center justify-center mb-10">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-200/50 rotate-3 transition-transform hover:rotate-0 cursor-default">
             <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tighter text-slate-900">FinTrack</h1>
          <p className="text-slate-500 text-lg mt-1 font-medium">Control Inteligente de Finanzas</p>
        </div>

        <div className="glass-effect p-8 rounded-3xl border border-white/40 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Iniciar Sesión</h2>
            <p className="text-slate-500 mt-1">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold text-sm ml-1">Correo Electrónico</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  {...register('email')}
                  type="email"
                  placeholder="ejemplo@correo.com"
                  className="pl-11 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700 font-semibold text-sm ml-1">Contraseña</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white/50"
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
               <label className="flex items-center gap-2 cursor-pointer group">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all" />
                 <span className="text-slate-600 group-hover:text-slate-900 transition-colors">Recordarme</span>
               </label>
            </div>

            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl gradient-brand font-bold text-sm tracking-wide shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'CARGANDO...' : 'ENTRAR AL SISTEMA'}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-slate-600 font-medium">
              ¿No tienes una cuenta activa? 
              <Link to="/register" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">Regístrate →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
