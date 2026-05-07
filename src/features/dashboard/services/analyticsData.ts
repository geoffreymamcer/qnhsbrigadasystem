import { DashboardStats, TimeFilter } from "../types";

export const getMockAnalytics = (filter: TimeFilter): DashboardStats => {
  // Simple deterministic randomization based on filter
  const multiplier = filter === 'Daily' ? 1 : filter === 'Weekly' ? 7 : filter === 'Monthly' ? 30 : 365;
  
  return {
    totalDonations: {
      count: 1250 * (multiplier / 10),
      trend: 12,
      history: [
        { name: 'P1', value: 100 }, { name: 'P2', value: 120 }, { name: 'P3', value: 150 },
        { name: 'P4', value: 130 }, { name: 'P5', value: 180 }, { name: 'P6', value: 200 }
      ]
    },
    totalValue: {
      amount: 450000 * multiplier,
      trend: 8.5,
      history: [
        { name: 'P1', value: 40000 }, { name: 'P2', value: 45000 }, { name: 'P3', value: 42000 },
        { name: 'P4', value: 50000 }, { name: 'P5', value: 55000 }, { name: 'P6', value: 60000 }
      ]
    },
    totalQuantity: {
      count: 8500 * multiplier,
      history: [
        { name: 'Paint', value: 1200 }, { name: 'Cement', value: 800 }, { name: 'Tiles', value: 1500 },
        { name: 'Plywood', value: 600 }, { name: 'Nails', value: 2000 }
      ]
    },
    activeDonors: {
      count: 450 * (multiplier / 15),
      history: [
        { name: 'P1', value: 40 }, { name: 'P2', value: 45 }, { name: 'P3', value: 55 },
        { name: 'P4', value: 50 }, { name: 'P5', value: 65 }, { name: 'P6', value: 80 }
      ]
    },
    topDonors: [
      { name: 'Alumni Assoc', value: 150000 },
      { name: 'LGU Local', value: 120000 },
      { name: 'Rotary Club', value: 95000 },
      { name: 'Private Corp X', value: 80000 },
      { name: 'Individual Y', value: 45000 }
    ],
    mostDonatedItems: [
      { name: 'Paints', value: 450 },
      { name: 'Roofing Sheets', value: 380 },
      { name: 'Cement Bags', value: 310 },
      { name: 'School Desks', value: 250 },
      { name: 'Lighting Fixtures', value: 210 }
    ],
    categoryDistribution: [
      { name: 'Construction', value: 45, color: '#2563eb' },
      { name: 'Educational', value: 25, color: '#3b82f6' },
      { name: 'Finances', value: 15, color: '#60a5fa' },
      { name: 'Labor', value: 15, color: '#93c5fd' }
    ],
    trendOverTime: [
      { name: 'W1', value: 100 }, { name: 'W2', value: 250 }, { name: 'W3', value: 180 },
      { name: 'W4', value: 320 }, { name: 'W5', value: 450 }, { name: 'W6', value: 390 }
    ],
    avgDonationValue: {
      amount: 3600,
      history: [
        { name: 'P1', value: 3000 }, { name: 'P2', value: 3200 }, { name: 'P3', value: 3800 },
        { name: 'P4', value: 3400 }, { name: 'P5', value: 3600 }
      ]
    },
    highestValueDonations: [
      { name: 'Building Renovation', value: 250000 },
      { name: 'IT Laboratory Equipment', value: 180000 },
      { name: 'Solar Panel Installation', value: 120000 },
      { name: 'New School Perimeter Fence', value: 95000 },
      { name: 'Water System Upgrade', value: 75000 }
    ]
  };
};
