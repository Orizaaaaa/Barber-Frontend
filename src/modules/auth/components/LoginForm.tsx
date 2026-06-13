import React, { useEffect } from 'react';
import { useLogin } from '../actions/useAuthActions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Scissors, ArrowRight, Shield, Clock, Star } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { form, onSubmit, isSubmitting } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    form.setFocus('email');
  }, [form]);

  return (
    <div className="min-h-screen flex bg-neutral-50 dark:bg-neutral-950">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-gold-600/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-16 max-w-xl">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-gold-600 rounded-xl flex items-center justify-center shadow-gold">
                <Scissors className="w-6 h-6 text-white transform -rotate-45" />
              </div>
              <span className="text-3xl font-black text-white font-serif tracking-tighter">SUMA <span className="text-gradient-gold">BARBER</span></span>
            </div>
            <h2 className="text-4xl font-black text-white font-serif mb-4 leading-tight">
              Welcome Back to <span className="text-gradient-gold">Premium Grooming</span>
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Sign in to access your bookings, loyalty points, and exclusive member benefits.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: Shield, text: 'Secure & encrypted booking system' },
              { icon: Clock, text: 'Quick 30-second reservation' },
              { icon: Star, text: 'Exclusive member rewards' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <span className="text-sm text-neutral-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 bg-gradient-to-br from-accent to-gold-600 rounded-xl flex items-center justify-center shadow-gold">
                <Scissors className="w-7 h-7 text-white transform -rotate-45" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-2 font-serif tracking-tight">Welcome Back</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">Sign in to your account</p>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {errors.root && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                  {errors.root.message}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Password</label>
                  <a href="#" className="text-xs font-semibold text-accent hover:underline cursor-pointer">Forgot?</a>
                </div>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  {...register('password')}
                />
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full py-3.5"
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-6 text-center border-t border-neutral-50 dark:border-neutral-800 pt-6">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                New to Suma Barber?{' '}
                <a href="/register" className="text-accent font-semibold hover:underline cursor-pointer">Join Now</a>
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-block p-5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] mb-2">Demo Accounts</p>
              <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                <p>Admin: <span className="font-semibold text-neutral-900 dark:text-white">admin@barber.com</span> / admin123</p>
                <p>Barber: <span className="font-semibold text-neutral-900 dark:text-white">barber1@barber.com</span> / barber123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
