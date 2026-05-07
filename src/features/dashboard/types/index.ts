export type TimeFilter = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

export type ChartDataPoint = {
  name: string;
  value: number;
};

export type CategoryData = {
  name: string;
  value: number;
  color: string;
};

export type DashboardStats = {
  totalDonations: { count: number; trend: number; history: ChartDataPoint[] };
  totalValue: { amount: number; trend: number; history: ChartDataPoint[] };
  totalQuantity: { count: number; history: ChartDataPoint[] };
  activeDonors: { count: number; history: ChartDataPoint[] };
  topDonors: ChartDataPoint[];
  mostDonatedItems: ChartDataPoint[];
  categoryDistribution: CategoryData[];
  trendOverTime: ChartDataPoint[];
  avgDonationValue: { amount: number; history: ChartDataPoint[] };
  highestValueDonations: { name: string; value: number }[];
};
