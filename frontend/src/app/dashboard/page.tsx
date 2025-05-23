'use client';

import AppLayout from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import CompaniesTable from '@/components/tables/CompaniesTable'; // This will be created next

// Mock data for the companies table
const mockCompanies = [
  { id: '1', name: 'Logistics Inc.', contact: 'John Doe', email: 'john@logistics.com', status: 'Active' },
  { id: '2', name: 'Transport Co.', contact: 'Jane Smith', email: 'jane@transport.co', status: 'Active' },
  { id: '3', name: 'ShipFast Ltd.', contact: 'Mike Brown', email: 'mike@shipfast.com', status: 'Inactive' },
  { id: '4', name: 'Global Movers', contact: 'Sarah Wilson', email: 'sarah@globalmovers.net', status: 'Active' },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Bid Bridge!</CardTitle>
            <CardDescription>
              This is your main dashboard. Manage your jobs, quotes, and company information here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Navigate using the sidebar to access different sections of the application.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Companies Overview</CardTitle>
            <CardDescription>
              A quick look at companies in the system. (Mock Data)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompaniesTable data={mockCompanies} />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
} 