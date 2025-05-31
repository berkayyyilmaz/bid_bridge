"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import AppLayout from "@/components/layout/AppLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { useTableData } from "@/hooks/use-table-data";
import { Company, transformCompanyFromApi } from "@/types/company";
import { createTableConfig } from "@/config/field-mappings";
import backendApiService from "@/lib/services/backendApiService";

export default function DashboardPage() {
  const {
    data: companiesApi,
    loading,
    error,
  } = useTableData(() => backendApiService.getCompanies());

  // API'den gelen veriyi frontend formatına dönüştür
  const companies: Company[] = companiesApi?.map(transformCompanyFromApi) || [];

  // Companies tablosu için konfigürasyon
  const tableConfig = createTableConfig<Company>(
    "companies",
    ["name", "created_at"],
    {
      pageSize: 5,
      exportable: true,
      searchable: true,
    }
  );

  return (
    <AuthGuard requireAuth={true}>
      <AppLayout>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bid Bridge'e Hoş Geldiniz!</CardTitle>
              <CardDescription>
                Bu ana kontrol panelinizdir. İşlerinizi, tekliflerinizi ve
                şirket bilgilerinizi buradan yönetebilirsiniz.
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
                <div className="text-red-500 text-center py-4">
                  Hata: {error}
                </div>
              ) : (
                <DataTable<Company>
                  data={companies}
                  config={tableConfig}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
