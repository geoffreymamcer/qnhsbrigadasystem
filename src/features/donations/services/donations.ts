'use server';

import { getApiClient, handleApiCall } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Donation, DonationInput, donationSchema } from '../types';

/**
 * Fetch all donations from Supabase.
 * Follows the Server-First rule.
 */
export async function getDonations(): Promise<Donation[]> {
  const supabase = await getApiClient();
  return await handleApiCall(
    supabase
      .from('donations')
      .select('*')
      .order('date_received', { ascending: false })
  );
}

/**
 * Server Action to create a new donation.
 */
export async function createDonation(input: DonationInput) {
  const supabase = await createClient();
  
  // Validate input
  const validated = donationSchema.safeParse(input);
  if (!validated.success) {
    throw new Error('Invalid donation data');
  }

  // Get current user for metadata
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('donations').insert({
    ...validated.data,
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/donations');
  return { success: true };
}

/**
 * Server Action to delete a donation.
 */
export async function deleteDonation(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/donations');
  return { success: true };
}
