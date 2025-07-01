"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { loadingPlaceCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { LoadingPlace } from "@/types/lookup";
import { LoadingPlaceFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Loading Place CRUD Hook
const useLoadingPlaceCrud = createCrudHook<
  LoadingPlace,
  LoadingPlaceFormData,
  Partial<LoadingPlaceFormData>
>(loadingPlaceCrudOperations);

export default function LoadingPlacesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LoadingPlace | null>(null);

  const {
    data: loadingPlaces,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useLoadingPlaceCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (loadingPlace: LoadingPlace) => {
    setEditingItem(loadingPlace);
    setIsModalOpen(true);
  };

  const handleDelete = async (loadingPlace: LoadingPlace) => {
    if (confirm("Bu yükleme yerini silmek istediğinizden emin misiniz?")) {
      await deleteItem(loadingPlace.id);
      refetch();
    }
  };

  const handleSubmit = async (data: LoadingPlaceFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Yükleme yeri kaydetme hatası:", error);
    }
  };

  const formConfig = getLookupFormConfig<LoadingPlaceFormData>("loadingPlace");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Yükleme Yerleri
              </CardTitle>
              <CardDescription>
                Yükleme yeri tanımlarını yönetin
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Yükleme Yeri
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={loadingPlaces}
            config={createTableConfig("loadingPlace")}
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
