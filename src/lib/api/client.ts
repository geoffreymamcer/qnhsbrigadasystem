import { createClient } from '@/lib/supabase/server';

/**
 * Centralized API client for Supabase interactions.
 * This follows the "Server-First" rule by prioritizing server-side execution.
 * 
 * Each feature should have its own service that uses this client.
 */
export async function getApiClient() {
  return await createClient();
}

/**
 * Common error handling wrapper for API calls.
 */
export async function handleApiCall<T>(promise: Promise<{ data: T | null; error: any }>) {
  try {
    const { data, error } = await promise;
    if (error) {
      console.error('API Error:', error);
      throw new Error(error.message || 'An unexpected error occurred');
    }
    return data as T;
  } catch (err) {
    console.error('Network/Internal Error:', err);
    throw err;
  }
}
