'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { loginSchema, type LoginInput } from '../types';
import { login } from '../services/auth';
import { cn } from '@/lib/utils/utils';

const SLIDESHOW_IMAGES = [
  '/assets/auth/v1.png',
  '/assets/auth/v2.png',
  '/assets/auth/v3.png',
];

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slideshow logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(data);
      if (result?.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden bg-white">
      {/* Left Side: Slideshow (Desktop/Laptop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={SLIDESHOW_IMAGES[currentSlide]}
              alt="School Volunteers"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent z-10" />

        <div className="relative z-20 p-20 flex flex-col justify-end h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-1 bg-blue-500 rounded-full" />
              <span className="text-blue-400 font-black text-xs uppercase tracking-[0.3em]">
                Community Driven
              </span>
            </div>
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Building a better future, <br />
              <span className="text-blue-400 underline decoration-blue-500/30 underline-offset-8">one school at a time.</span>
            </h2>
            <p className="text-slate-300 text-lg font-medium leading-relaxed">
              Brigada Eskwela System provides the digital infrastructure to manage volunteers, 
              donations, and school improvements with transparency and speed.
            </p>
          </motion.div>

          {/* Slide Indicators */}
          <div className="flex gap-2 mt-12">
            {SLIDESHOW_IMAGES.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 transition-all duration-500 rounded-full",
                  currentSlide === i ? "w-8 bg-blue-500" : "w-2 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-20 bg-white relative">
        <div className="w-full max-w-md">
          <div className="mb-12 flex flex-col items-center lg:items-start">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20"
            >
              <LogIn className="w-6 h-6 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Login to System</h1>
            <p className="text-slate-500 font-medium mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-sm font-bold text-rose-600">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="admin@brigada.edu.ph"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all",
                      errors.email && "border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/5"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs font-bold text-rose-500 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:underline">
                    Forgot?
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register('password')}
                    type="password"
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all",
                      errors.password && "border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/5"
                    )}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs font-bold text-rose-500 ml-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:hover:scale-100 transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Need technical support?{' '}
              <button className="text-blue-600 font-black hover:underline underline-offset-4">
                Open Help Center
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
