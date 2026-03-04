'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollText, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DataTablePagination } from '@/components/common/data-table-pagination';
import { EmptyState } from '@/components/common/empty-state';
import { adminService } from '@/services/admin.service';
import { formatDateTime } from '@/lib/format';
import type { AuditLog, QueryParams } from '@/types';

export default function AdminAuditLogsPage() {
  const [params, setParams] = useState<QueryParams>({ page: 1, per_page: 25 });

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: () => adminService.getAuditLogs(params),
  });

  const logs = data?.data ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Audit Logs</h1>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState icon={ScrollText} title="Belum ada log audit" />
          ) : (
            <>
              <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Waktu</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Model</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log: AuditLog) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                      <TableCell>{log.user?.name ?? log.user_id}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {log.event}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {log.auditable_type.split('\\').pop()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
              {data?.meta && (
                <div className="mt-4">
                  <DataTablePagination
                    meta={data.meta}
                    onPageChange={(page) => setParams((p) => ({ ...p, page }))}
                    onPageSizeChange={(per_page) =>
                      setParams((p) => ({ ...p, per_page, page: 1 }))
                    }
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
