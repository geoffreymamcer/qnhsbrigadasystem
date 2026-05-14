'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginInput, loginSchema } from '../types';
import { redirect } from 'next/navigation';

/**
 * Server Action to handle user login.
 * This ensures the session is established securely on the server.
 */
export async function login(input: LoginInput) {
  const supabase = await createClient();

  // Validate input
  const validated = loginSchema.safeParse(input);
  if (!validated.success) {
    return { error: 'Invalid input' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Redirect to dashboard on success
  redirect('/dashboard');
}

/**
 * Server Action to handle logout.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
