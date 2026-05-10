export interface BenchmarkInfo {
  avgSpendPerDev: number;
  label: string;
  percentile: number; // 0-100, where higher means "higher than others"
  estimatedDevCount: number;
}

export const TEAM_SIZE_BENCHMARKS: Record<string, BenchmarkInfo> = {
  "1–10": {
    avgSpendPerDev: 140,
    label: "Early Stage Startup",
    percentile: 0, // calculated at runtime
    estimatedDevCount: 5,
  },
  "11–50": {
    avgSpendPerDev: 110,
    label: "Scaling Startup",
    percentile: 0,
    estimatedDevCount: 30,
  },
  "51–250": {
    avgSpendPerDev: 85,
    label: "Mid-Market Growth",
    percentile: 0,
    estimatedDevCount: 150,
  },
  "251–1,000": {
    avgSpendPerDev: 65,
    label: "Large Enterprise",
    percentile: 0,
    estimatedDevCount: 600,
  },
  "1,000+": {
    avgSpendPerDev: 55,
    label: "Fortune 500 / Scale",
    percentile: 0,
    estimatedDevCount: 2000,
  },
};

export function calculateBenchmark(totalMonthlySpend: number, teamSize: string) {
  const benchmark = TEAM_SIZE_BENCHMARKS[teamSize] || TEAM_SIZE_BENCHMARKS["1–10"];
  const userSpendPerDev = totalMonthlySpend / benchmark.estimatedDevCount;
  
  // Calculate a mock percentile based on distance from average
  // If user spend is 0, they are in the 100th percentile (most efficient)
  // If user spend is 2x benchmark, they are in the 10th percentile (least efficient)
  const ratio = userSpendPerDev / benchmark.avgSpendPerDev;
  let percentile = 100 - (ratio * 50);
  
  if (percentile > 99) percentile = 99;
  if (percentile < 1) percentile = 1;

  return {
    userSpendPerDev,
    avgSpendPerDev: benchmark.avgSpendPerDev,
    label: benchmark.label,
    percentile: Math.round(percentile),
    status: ratio < 0.9 ? "optimized" : ratio > 1.3 ? "at_risk" : "average"
  };
}
