'use server';

import { getApiClient, handleApiCall } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Accomplishment, AccomplishmentInput, accomplishmentSchema } from '../types';

export async function getAccomplishments(): Promise<Accomplishment[]> {
  const supabase = await getApiClient();
  return await handleApiCall(
    supabase
      .from('accomplishments')
      .select('*')
      .order('report_date', { ascending: false })
  );
}

export async function createAccomplishment(input: AccomplishmentInput) {
  const supabase = await createClient();
  
  const validated = accomplishmentSchema.safeParse(input);
  if (!validated.success) throw new Error('Invalid accomplishment data');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('accomplishments').insert({
    ...validated.data,
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/reports');
  return { success: true };
}

export async function deleteAccomplishment(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('accomplishments')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/reports');
  return { success: true };
}
