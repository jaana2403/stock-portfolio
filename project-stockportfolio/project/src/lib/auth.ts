import { supabase } from './supabase';
import { AuthError } from '@supabase/supabase-js';

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error: formatAuthError(error) };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error: formatAuthError(error) };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: formatAuthError(error) };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function formatAuthError(error: AuthError | null) {
  if (!error) return null;
  
  switch (error.message) {
    case 'Invalid login credentials':
      return new Error('Invalid email or password');
    case 'Email not confirmed':
      return new Error('Please check your email to confirm your account');
    default:
      return error;
  }
}