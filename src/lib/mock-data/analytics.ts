export const revenueData = [
  { month: "Jan", revenue: 12400, expenses: 8200 },
  { month: "Feb", revenue: 18300, expenses: 9100 },
  { month: "Mar", revenue: 22100, expenses: 11400 },
  { month: "Apr", revenue: 19800, expenses: 10200 },
  { month: "May", revenue: 25600, expenses: 12800 },
  { month: "Jun", revenue: 31200, expenses: 14100 },
  { month: "Jul", revenue: 28900, expenses: 13500 },
  { month: "Aug", revenue: 34500, expenses: 15200 },
  { month: "Sep", revenue: 38200, expenses: 16800 },
  { month: "Oct", revenue: 42100, expenses: 18400 },
  { month: "Nov", revenue: 45230, expenses: 19800 },
  { month: "Dec", revenue: 48700, expenses: 21300 },
]

export const metricCards = [
  { label: "Total Revenue", shortValue: "$45.2K", fullValue: "$45,230.47", change: "+12.5%" },
  { label: "Active Users", shortValue: "2.4K", fullValue: "2,431", change: "+8.2%" },
  { label: "Conversion Rate", shortValue: "3.2%", fullValue: "3.247%", change: "-0.4%" },
  { label: "Avg Order Value", shortValue: "$127", fullValue: "$127.43", change: "+5.1%" },
]

export const tabOptions = ["Overview", "Revenue", "Users", "Conversions"] as const
export type AnalyticsTab = (typeof tabOptions)[number]
