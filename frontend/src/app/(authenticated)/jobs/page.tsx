"use client";

import { useTableData } from "@/hooks/use-table-data";
import { DataTable } from "@/components/ui/data-table";
import { transformJobFromApi } from "@/types/mappings";
import { TABLE_COLUMNS, TABLE_TITLES, TableType } from "@/config/table-configs";
import backendApiService from "@/lib/services/backendApiService";
import { useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function JobsPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getJobs()
  );

  const jobs = useMemo(() => data?.map(transformJobFromApi) || [], [data]);

  const config = useMemo(
    () => ({
      type: "job" as TableType,
      columns: TABLE_COLUMNS["job"],
      title: TABLE_TITLES["job"],
      pageSize: 10,
    }),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>İş Yönetimi</CardTitle>
        <CardDescription>
          Tüm işlerinizi görüntüleyin ve yönetin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 text-center py-4">Hata: {error}</div>
        ) : (
          <DataTable
            data={jobs}
            config={config}
            loading={loading}
            error={error}
          />
        )}
      </CardContent>
    </Card>
  );
}
