"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { companyCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { Company } from "@/types/lookup";
import { CompanyFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Company CRUD Hook
const useCompanyCrud = createCrudHook<
  Company,
  CompanyFormData,
  Partial<CompanyFormData>
>(companyCrudOperations);

export default function CompaniesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Company | null>(null);

  const {
    data: companies,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useCompanyCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (company: Company) => {
    setEditingItem(company);
    setIsModalOpen(true);
  };

  const handleDelete = async (company: Company) => {
    if (confirm("Bu şirketi silmek istediğinizden emin misiniz?")) {
      await deleteItem(company.id);
      refetch();
    }
  };

  const handleSubmit = async (data: CompanyFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Şirket kaydetme hatası:", error);
    }
  };

  const formConfig = getLookupFormConfig<CompanyFormData>("company");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Şirketler
              </CardTitle>
              <CardDescription>Şirket tanımlarını yönetin</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Şirket
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={companies}
            config={createTableConfig("companies")}
            onRowEdit={handleEdit}
            onRowDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <CrudEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        config={formConfig}
        initialData={editingItem ? { name: editingItem.name } : undefined}
        onSubmit={handleSubmit}
        mode={editingItem ? "edit" : "create"}
      />
    </div>
  );
}
