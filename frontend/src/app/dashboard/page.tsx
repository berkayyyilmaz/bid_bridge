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
import CompaniesTable from "@/components/tables/CompaniesTable"; // This will be created next

// Mock data for the companies table
const mockCompanies = [
  {
    id: "1",
    name: "Logistics Inc.",
    contact: "John Doe",
    email: "john@logistics.com",
    status: "Active",
  },
  {
    id: "2",
    name: "Transport Co.",
    contact: "Jane Smith",
    email: "jane@transport.co",
    status: "Active",
  },
  {
    id: "3",
    name: "ShipFast Ltd.",
    contact: "Mike Brown",
    email: "mike@shipfast.com",
    status: "Inactive",
  },
  {
    id: "4",
    name: "Global Movers",
    contact: "Sarah Wilson",
    email: "sarah@globalmovers.net",
    status: "Active",
  },
];

export default function DashboardPage() {
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
                Sistemdeki şirketlere hızlı bir bakış. (Örnek Veri)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompaniesTable data={mockCompanies} />
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    </AuthGuard>
  );
}
