"use client";

import { useTableData } from "@/hooks/use-table-data";
import { DataTable } from "@/components/ui/data-table";
import { transformCompanyFromApi } from "@/types/mappings";
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

export default function CompaniesPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getCompanies()
  );

  const companies = useMemo(
    () => data?.map(transformCompanyFromApi) || [],
    [data]
  );

  const config = useMemo(
    () => ({
      type: "companies" as TableType,
      columns: TABLE_COLUMNS["companies"],
      title: TABLE_TITLES["companies"],
      pageSize: 10,
    }),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Şirket Yönetimi</CardTitle>
        <CardDescription>
          Sistemdeki tüm şirketleri görüntüleyin ve yönetin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 text-center py-4">Hata: {error}</div>
        ) : (
          <DataTable
            data={companies}
            config={config}
            loading={loading}
            error={error}
          />
        )}
      </CardContent>
    </Card>
  );
}
