'use server';

import { getApiClient, handleApiCall } from '@/lib/api/client';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { 
  Accomplishment, AccomplishmentInput, accomplishmentSchema,
  FacilityNeed, FacilityNeedInput, facilityNeedSchema
} from '../types';

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

/**
 * Fetch all physical facilities needs assessments from Supabase.
 */
export async function getFacilityNeeds(): Promise<FacilityNeed[]> {
  const supabase = await getApiClient();
  return await handleApiCall(
    supabase
      .from('facility_needs')
      .select('*')
      .order('facility_name', { ascending: true })
  );
}

/**
 * Server Action to create a new facility need entry.
 */
export async function createFacilityNeed(input: FacilityNeedInput) {
  const supabase = await createClient();
  
  const validated = facilityNeedSchema.safeParse(input);
  if (!validated.success) throw new Error('Invalid facility need data');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('facility_needs').insert({
    ...validated.data,
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/reports');
  return { success: true };
}

/**
 * Server Action to update an existing facility need entry.
 */
export async function updateFacilityNeed(id: string, input: FacilityNeedInput) {
  const supabase = await createClient();
  
  const validated = facilityNeedSchema.safeParse(input);
  if (!validated.success) throw new Error('Invalid facility need data');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('facility_needs')
    .update({
      ...validated.data,
    })
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/reports');
  return { success: true };
}

/**
 * Server Action to delete a facility need entry.
 */
export async function deleteFacilityNeed(id: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('facility_needs')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);

  revalidatePath('/reports');
  return { success: true };
}

