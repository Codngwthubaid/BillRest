import React from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, UserPlus } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';

interface Appointment {
  _id: string;
  createdAt: string;
  patient: {
    name: string;
  };
  date: string;
  time: string;
  status: string;
}

interface AppointmentChartProps {
  data: {
    appointments: Appointment[];
  };
  filterType: ReportFilterType;
}

export const AppointmentChart: React.FC<AppointmentChartProps> = ({ data, filterType }) => {
  const chartData = data?.appointments?.map((appointment: Appointment) => {
    const date = new Date(appointment.createdAt);

    return {
      period: date.toLocaleDateString('en-US', {
        month: filterType === 'monthly' ? 'short' : undefined,
        weekday: filterType === 'daily' ? 'short' : undefined,
        day: filterType === 'daily' ? 'numeric' : undefined,
      }),
      appointments: 1,
    };
  });

  // Aggregate by period
  const aggregatedData: { [key: string]: number } = {};
  chartData.forEach(({ period }) => {
    aggregatedData[period] = (aggregatedData[period] || 0) + 1;
  });

  const formattedChartData = Object.entries(aggregatedData).map(([period, count]) => ({
    period,
    appointments: count,
  }));

  const totalAppointments = formattedChartData.reduce((sum, item) => sum + item.appointments, 0);
  const avgAppointments = formattedChartData.length
    ? Math.round(totalAppointments / formattedChartData.length)
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Appointments</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {totalAppointments.toLocaleString()}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Average Appointments</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {avgAppointments.toLocaleString()}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Appointment Trend Over Time
            <span className="text-sm font-normal text-muted-foreground capitalize">
              ({filterType} view)
            </span>
          </CardTitle>
          <CardDescription>
            Track your patient appointments and understand engagement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedChartData}>
                <defs>
                  <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: any, name: string) => [value, 'Appointments']}
                />
                <Area
                  type="monotone"
                  dataKey="appointments"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#appointmentsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
