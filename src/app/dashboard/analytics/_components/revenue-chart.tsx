"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { trapsEnabled } from "@/lib/traps"
import { revenueData } from "@/lib/mock-data/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RevenueChart() {
  if (trapsEnabled) {
    // TRAP: canvas chart with no a11y fallback
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64"> {/* TRAP: no figure, no aria-label, no sr-only data table */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-chart-1, #2563eb)" />
                <Bar dataKey="expenses" fill="var(--color-chart-2, #e11d48)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <figure role="img" aria-label="Bar chart showing monthly revenue and expenses for January through December. Revenue grew from $12,400 in January to $48,700 in December.">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-chart-1, #2563eb)" />
                <Bar dataKey="expenses" fill="var(--color-chart-2, #e11d48)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <table className="sr-only">
            <caption>Monthly revenue and expenses data</caption>
            <thead>
              <tr><th>Month</th><th>Revenue</th><th>Expenses</th></tr>
            </thead>
            <tbody>
              {revenueData.map((d) => (
                <tr key={d.month}>
                  <td>{d.month}</td>
                  <td>${d.revenue.toLocaleString()}</td>
                  <td>${d.expenses.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      </CardContent>
    </Card>
  )
}
