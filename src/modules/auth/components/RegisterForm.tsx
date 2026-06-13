import React, { useEffect } from 'react';
import { useRegister } from '../actions/useAuthActions';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Scissors } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { form, onSubmit, isSubmitting } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    form.setFocus('name');
  }, [form]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 px-6 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
              <Scissors className="w-7 h-7 text-accent transform -rotate-45" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-neutral-900 dark:text-white mb-2 font-serif tracking-tight">Create Account</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">Join our premium community</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {errors.root && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-medium">
                {errors.root.message}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Phone (optional)"
              type="tel"
              placeholder="+62 812 3456 7890"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full py-3.5"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-neutral-50 dark:border-neutral-800 pt-6">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-accent font-semibold hover:underline">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
