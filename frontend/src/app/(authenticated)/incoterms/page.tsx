"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { incotermCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { Incoterm } from "@/types/lookup";
import { IncotermFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Incoterm CRUD Hook
const useIncotermCrud = createCrudHook<
  Incoterm,
  IncotermFormData,
  Partial<IncotermFormData>
>(incotermCrudOperations);

export default function IncotermsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Incoterm | null>(null);

  const {
    data: incoterms,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useIncotermCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (incoterm: Incoterm) => {
    setEditingItem(incoterm);
    setIsModalOpen(true);
  };

  const handleDelete = async (incoterm: Incoterm) => {
    if (confirm("Bu incoterm'i silmek istediğinizden emin misiniz?")) {
      await deleteItem(incoterm.id);
      refetch();
    }
  };

  const handleSubmit = async (data: IncotermFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Incoterm kaydetme hatası:", error);
    }
  };

  const formConfig = getLookupFormConfig<IncotermFormData>("incoterm");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Incoterms
              </CardTitle>
              <CardDescription>Incoterm tanımlarını yönetin</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Incoterm
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={incoterms}
            config={createTableConfig("incoterm")}
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
