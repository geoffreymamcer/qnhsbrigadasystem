import { z } from 'zod';

export const accomplishmentSchema = z.object({
  activity: z.string().min(1, 'Activity is required'),
  status: z.enum(['completed', 'started but not yet completed', 'not done']),
  remarks: z.string().optional(),
  report_date: z.string().min(1, 'Date is required'),
});

export type AccomplishmentInput = z.infer<typeof accomplishmentSchema>;

export type Accomplishment = AccomplishmentInput & {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export const facilityNeedSchema = z.object({
  facility_name: z.string().min(1, 'Facility name is required'),
  condition: z.enum(['satisfactory', 'unsatisfactory']),
  remarks: z.string().optional(),
  improvement_needed: z.string().optional(),
  materials_needed: z.string().optional(),
  manpower_needed: z.string().optional(),
  assessment_date: z.string().min(1, 'Date is required'),
});

export type FacilityNeedInput = z.infer<typeof facilityNeedSchema>;

export type FacilityNeed = FacilityNeedInput & {
  id: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
};

