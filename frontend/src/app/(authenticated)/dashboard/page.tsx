"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useTableData } from "@/hooks/use-table-data";
import { transformCompanyFromApi } from "@/types/mappings";
import { Company } from "@/types/company";
import backendApiService from "@/lib/services/backendApiService";
import { TABLE_COLUMNS, TABLE_TITLES, TableType } from "@/config/table-configs";
import { useMemo } from "react";

export default function DashboardPage() {
  const {
    data: companiesApi,
    loading,
    error,
  } = useTableData(() => backendApiService.getCompanies());

  // API'den gelen veriyi frontend formatına dönüştür - memoize edildi
  const companies: Company[] = useMemo(
    () => companiesApi?.map(transformCompanyFromApi) || [],
    [companiesApi]
  );

  const config = useMemo(
    () => ({
      type: "companies" as TableType,
      columns: TABLE_COLUMNS["companies"],
      title: TABLE_TITLES["companies"],
      pageSize: 5,
    }),
    []
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bid Bridge'e Hoş Geldiniz!</CardTitle>
          <CardDescription>
            Bu ana kontrol panelinizdir. İşlerinizi, tekliflerinizi ve şirket
            bilgilerinizi buradan yönetebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Uygulamanın farklı bölümlerine erişmek için yan menüyü kullanın.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Şirketler Genel Bakış</CardTitle>
          <CardDescription>
            Sistemdeki şirketlere hızlı bir bakış.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 text-center py-4">Hata: {error}</div>
          ) : (
            <DataTable<Company>
              data={companies}
              config={config}
              loading={loading}
              error={error}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
