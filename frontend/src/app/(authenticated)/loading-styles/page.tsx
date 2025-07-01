"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { loadingStyleCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { LoadingStyle } from "@/types/lookup";
import { LoadingStyleFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Loading Style CRUD Hook
const useLoadingStyleCrud = createCrudHook<
  LoadingStyle,
  LoadingStyleFormData,
  Partial<LoadingStyleFormData>
>(loadingStyleCrudOperations);

export default function LoadingStylesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LoadingStyle | null>(null);

  const {
    data: loadingStyles,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useLoadingStyleCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loadingStyle: LoadingStyle) => {
    setEditingItem(loadingStyle);
    setIsModalOpen(true);
  };

  const handleDelete = async (loadingStyle: LoadingStyle) => {
    if (confirm("Bu yükleme stilini silmek istediğinizden emin misiniz?")) {
      await deleteItem(loadingStyle.id);
      refetch();
    }
  };

  const handleSubmit = async (data: LoadingStyleFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Yükleme stili kaydetme hatası:", error);
    }
  };

  const formConfig = getLookupFormConfig<LoadingStyleFormData>("loadingStyle");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Yükleme Stilleri
              </CardTitle>
              <CardDescription>
                Yükleme stili tanımlarını yönetin
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Yükleme Stili
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={loadingStyles}
            config={createTableConfig("loadingStyle")}
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
