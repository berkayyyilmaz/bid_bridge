import React, { useEffect, useState } from "react";
import { useTableData } from "@/hooks/useTableData";
import { backendApiService } from "@/services/backendApiService";
import { transformQuoteFromApi } from "@/utils/transformQuoteFromApi";
import { DataTable } from "@/components/DataTable";
import { TABLE_COLUMNS, TABLE_TITLES } from "@/constants/tableConstants";

export default function QuotesPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getQuotes()
  );
  const quotes = data?.map(transformQuoteFromApi) || [];
  const config = {
    type: "orders", // quotes için ayrı bir config eklenirse burada güncellenmeli
    columns: TABLE_COLUMNS["orders"],
    title: TABLE_TITLES["orders"],
    pageSize: 10,
  };

  return (
    <DataTable data={quotes} config={config} loading={loading} error={error} />
  );
}
