import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';

interface AppointmentStatusChartProps {
  data: any;
  filterType: ReportFilterType;
}

export const AppointmentStatusChart: React.FC<AppointmentStatusChartProps> = ({ data, filterType }) => {
  const statusCounts = data.appointments.reduce((acc: any, appointment: any) => {
    acc[appointment.status] = (acc[appointment.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = [
    {
      name: 'Completed',
      value: statusCounts.completed || 0,
      color: '#10b981',
      icon: CheckCircle,
    },
    {
      name: 'Scheduled',
      value: statusCounts.scheduled || 0,
      color: '#f59e0b',
      icon: Clock,
    },
    {
      name: 'Cancelled',
      value: statusCounts.cancelled || 0,
      color: '#ef4444',
      icon: XCircle,
    },
    {
      name: 'No Show',
      value: statusCounts.no_show || 0,
      color: '#6b7280',
      icon: AlertCircle,
    },
  ].filter((item) => item.value > 0);

  const totalAppointments = statusData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-background border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{d.name}</p>
          <p className="text-sm text-muted-foreground">
            Count: {d.value} ({((d.value / totalAppointments) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statusData.map((status) => {
          const Icon = status.icon;
          const percentage = ((status.value / totalAppointments) * 100).toFixed(1);

          return (
            <Card key={status.name} className="border-0" style={{ backgroundColor: `${status.color}10` }}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-5 w-5" style={{ color: status.color }} />
                  <span className="text-xs font-medium" style={{ color: status.color }}>
                    {percentage}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{status.name}</p>
                  <p className="text-lg font-bold">{status.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Appointment Status Distribution
            </CardTitle>
            <CardDescription>
              Breakdown of appointment statuses ({filterType} period)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry: any) => (
                      <span style={{ color: entry.color }}>{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              Status Count Comparison
            </CardTitle>
            <CardDescription>
              Total number of appointments by status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                    formatter={(value: any) => [`${value.toLocaleString()}`, 'Appointments']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
