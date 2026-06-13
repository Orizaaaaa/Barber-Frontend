import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loginSchema, registerSchema, LoginFormData, RegisterFormData } from '../schemas/auth.schema';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.displayMessage || error.response?.data?.message || 'Login failed';
      form.setError('root', { message: msg });
    }
  };

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
};

export const useRegister = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data.name, data.email, data.password, data.phone);
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error.displayMessage || error.response?.data?.message || 'Registration failed';
      form.setError('root', { message: msg });
    }
  };

  return { form, onSubmit, isSubmitting: form.formState.isSubmitting };
};
