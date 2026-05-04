import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'sonner';
import { Wallet, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';

// Esquema de validacion para el registro de nuevos usuarios
const registerSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres').max(100, 'Máximo 100 caracteres'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Ejecuta el registro y luego un login automático para obtener el token
  const onSubmit = async (data: RegisterForm) => {
    try {
      // 1. Registro del usuario
      await authService.register({
        email: data.email,
        password: data.password
      });

      // 2. Login automático tras el registro exitoso / dado que el registro no devuelve token, hacemos login para obtenerlo
      const loginResponse = await authService.login({
        email: data.email,
        password: data.password
      });

      // 3. Adaptación de datos y establecimiento de estado global
      const userData = {
        id: loginResponse.userId,
        email: data.email,
        name: data.email.split('@')[0]
      };

      login(userData, loginResponse.accessToken);
      toast.success('Cuenta creada e inicio de sesión exitoso');
      navigate('/');
    } catch (error) {
      toast.error('Error al procesar el registro');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen items-center justify-center bg-slate-50 flex flex-col p-4 selection:bg-indigo-100">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[20%] right-[10%] w-[35%] h-[35%] bg-indigo-100/40 rounded-full blur-[100px]" />
        <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[35%] bg-blue-100/40 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] animate-fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex bg-white p-3 rounded-2xl shadow-premium mb-4">
             <Wallet className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Crea tu Cuenta</h1>
          <p className="text-slate-500 font-medium mt-1">Empieza a gestionar tu futuro hoy</p>
        </div>

        <div className="card-premium p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Correo Electrónico</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <Input 
                  {...register('email')}
                  type="email"
                  placeholder="juan@ejemplo.com"
                  className="pl-10 h-11 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/10 transition-all"
                  error={errors.email?.message}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Contraseña</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/10 transition-all"
                    error={errors.password?.message}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-slate-700 font-bold text-xs uppercase tracking-wider ml-1">Confirmar</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  <Input 
                    {...register('confirmPassword')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 h-11 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-indigo-500/10 transition-all"
                    error={errors.confirmPassword?.message}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
              >
                {isSubmitting ? 'REGISTRANDO...' : 'CREAR MI CUENTA'}
                {!isSubmitting && <UserPlus className="w-4 h-4" />}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm font-medium text-slate-500">
            ¿Ya tienes una cuenta? 
            <Link to="/login" className="ml-2 text-indigo-600 font-bold hover:underline underline-offset-4">Inicia Sesión →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
