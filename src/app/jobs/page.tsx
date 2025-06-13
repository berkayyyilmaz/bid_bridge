import React, { useEffect, useState } from "react";
import { useTableData } from "@/hooks/useTableData";
import { backendApiService } from "@/services/backendApiService";
import { transformJobFromApi } from "@/utils/transformJobFromApi";
import { DataTable } from "@/components/DataTable";
import { TableType } from "@/types/TableType";
import { TABLE_COLUMNS, TABLE_TITLES } from "@/constants/tableConstants";

export default function JobsPage() {
  const { data, loading, error } = useTableData(() =>
    backendApiService.getJobs()
  );
  const jobs = data?.map(transformJobFromApi) || [];
  const config = {
    type: "job" as TableType,
    columns: TABLE_COLUMNS["job"],
    title: TABLE_TITLES["job"],
    pageSize: 10,
  };

  return (
    <DataTable data={jobs} config={config} loading={loading} error={error} />
  );
}
