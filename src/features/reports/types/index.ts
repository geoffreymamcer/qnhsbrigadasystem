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
