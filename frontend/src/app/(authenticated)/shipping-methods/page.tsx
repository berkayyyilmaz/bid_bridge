"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { shippingMethodCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { ShippingMethod } from "@/types/lookup";
import { ShippingMethodFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Shipping Method CRUD Hook
const useShippingMethodCrud = createCrudHook<
  ShippingMethod,
  ShippingMethodFormData,
  Partial<ShippingMethodFormData>
>(shippingMethodCrudOperations);

export default function ShippingMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShippingMethod | null>(null);

  const {
    data: shippingMethods,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = useShippingMethodCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shippingMethod: ShippingMethod) => {
    setEditingItem(shippingMethod);
    setIsModalOpen(true);
  };

  const handleDelete = async (shippingMethod: ShippingMethod) => {
    if (confirm("Bu nakliye yöntemini silmek istediğinizden emin misiniz?")) {
      await deleteItem(shippingMethod.id);
      refetch();
    }
  };

  const handleSubmit = async (data: ShippingMethodFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Nakliye yöntemi kaydetme hatası:", error);
    }
  };

  const formConfig =
    getLookupFormConfig<ShippingMethodFormData>("shippingMethod");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Nakliye Yöntemleri
              </CardTitle>
              <CardDescription>
                Nakliye yöntemi tanımlarını yönetin
              </CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Nakliye Yöntemi
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={shippingMethods}
            config={createTableConfig("shippingMethod")}
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
