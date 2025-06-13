"use client";

import { useTableData } from "@/hooks/use-table-data";
import { DataTable } from "@/components/ui/data-table";
import { transformQuoteFromApi } from "@/types/mappings";
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

export default function QuotesPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getQuotes()
  );

  const quotes = useMemo(() => data?.map(transformQuoteFromApi) || [], [data]);

  const config = useMemo(
    () => ({
      type: "orders" as TableType, // quotes için ayrı bir config eklenirse burada güncellenmeli
      columns: TABLE_COLUMNS["orders"],
      title: TABLE_TITLES["orders"],
      pageSize: 10,
    }),
    []
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Teklif Yönetimi</CardTitle>
        <CardDescription>
          Aldığınız teklifleri görüntüleyin ve yönetin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-red-500 text-center py-4">Hata: {error}</div>
        ) : (
          <DataTable
            data={quotes}
            config={config}
            loading={loading}
            error={error}
          />
        )}
      </CardContent>
    </Card>
  );
}
