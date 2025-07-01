"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { portCrudOperations } from "@/services/LookupService";
import { getLookupFormConfig } from "@/config/lookup-form-configs";
import { createTableConfig } from "@/config/table-configs";
import { Port } from "@/types/lookup";
import { PortFormData } from "@/config/lookup-form-configs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

// Port CRUD Hook
const usePortCrud = createCrudHook<Port, PortFormData, Partial<PortFormData>>(
  portCrudOperations
);

export default function PortsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Port | null>(null);

  const {
    data: ports,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refetch,
  } = usePortCrud();

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (port: Port) => {
    setEditingItem(port);
    setIsModalOpen(true);
  };

  const handleDelete = async (port: Port) => {
    if (confirm("Bu limanı silmek istediğinizden emin misiniz?")) {
      await deleteItem(port.id);
      refetch();
    }
  };

  const handleSubmit = async (data: PortFormData) => {
    try {
      if (editingItem) {
        await updateItem(editingItem.id, data);
      } else {
        await createItem(data);
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      console.error("Liman kaydetme hatası:", error);
    }
  };

  const formConfig = getLookupFormConfig<PortFormData>("port");

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold tracking-tight">
                Limanlar
              </CardTitle>
              <CardDescription>Liman tanımlarını yönetin</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Liman
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-6">
          <DataTable
            data={ports}
            config={createTableConfig("port")}
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
