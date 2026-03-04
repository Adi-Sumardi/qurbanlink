'use client';

import { useQuery } from '@tanstack/react-query';
import { Building2, Users, CreditCard, Activity, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { adminService } from '@/services/admin.service';
import { formatNumber } from '@/lib/format';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminService.getDashboard(),
  });

  const stats = data?.data as Record<string, number> | undefined;

  const cards = [
    { title: 'Total Tenant', value: stats?.total_tenants ?? 0, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Pengguna', value: stats?.total_users ?? 0, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Langganan Aktif', value: stats?.active_subscriptions ?? 0, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Event Aktif', value: stats?.active_events ?? 0, icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`rounded-lg p-2.5 ${card.bg}`}>
                  <card.icon className={`size-5 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{formatNumber(card.value)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
