import { getApiClient, handleApiCall } from '@/lib/api/client';

/**
 * Service to verify Supabase connectivity and health.
 */
export async function getSupabaseHealth() {
  const supabase = await getApiClient();
  
  // This is a simple query to check connection
  // We wrap it in handleApiCall for consistent error handling
  return await handleApiCall(
    supabase.from('_health').select('*').limit(1)
  );
}
