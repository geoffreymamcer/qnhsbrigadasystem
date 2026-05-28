import { z } from 'zod';

export const donationSchema = z.object({
  item_name: z.string().min(1, 'Item name is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unit: z.string().min(1, 'Unit is required'),
  date_received: z.string().min(1, 'Date is required'),
  donor_name: z.string().min(1, 'Donor name is required'),
  unit_cost: z.number().min(0, 'Unit cost must be positive'),
  total_cost: z.number().min(0),
});

export type DonationInput = z.infer<typeof donationSchema>;

export type Donation = DonationInput & {
  id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};
