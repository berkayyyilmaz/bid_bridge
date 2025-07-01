"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { CrudEditModal } from "@/components/forms/CrudEditModal";
import { createCrudHook } from "@/hooks/useCrudOperations";
import { jobCrudOperations } from "@/services/JobService";
import { createFormConfig, JobFormData } from "@/config/form-configs";
import { createTableConfig } from "@/config/table-configs";
import { Job } from "@/types/job";
import { SelectOption } from "@/config/form-configs";
import { Plus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  getIncotermOptions,
  getShippingMethodOptions,
  getPortOptions,
  getLoadingPlaceOptions,
  getLoadingStyleOptions,
} from "@/services/LookupService";

// Job için CRUD hook'u oluştur
const useJobCrud = createCrudHook(jobCrudOperations);

export default function JobsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formConfig, setFormConfig] = useState(
    createFormConfig<JobFormData>("job")
  );
  const [formOptionsLoading, setFormOptionsLoading] = useState(false);

  // CRUD hook'u kullan
  const {
    data: jobs,
    loading,
    error,
    fetchAll,
    createItem,
    updateItem,
    deleteItem,
  } = useJobCrud();

  // Sayfa yüklendiğinde verileri getir
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Form config'ini dynamic options ile güncelle
  useEffect(() => {
    const updateFormConfig = async () => {
      setFormOptionsLoading(true);
      const config = createFormConfig<JobFormData>("job");

      try {
        console.log("Jobs page - Loading form options...");
        // API'den gerçek seçenekleri çek
        const [
          incotermOptions,
          shippingMethodOptions,
          portOptions,
          loadingPlaceOptions,
          loadingStyleOptions,
        ] = await Promise.all([
          getIncotermOptions(),
          getShippingMethodOptions(),
          getPortOptions(),
          getLoadingPlaceOptions(),
          getLoadingStyleOptions(),
        ]);

        console.log("Jobs page - All form options loaded successfully");

        // Form config'indeki field'ları güncelle
        config.sections.forEach((section) => {
          section.fields.forEach((field) => {
            switch (field.name) {
              case "incotermId":
                field.options = async () => incotermOptions;
                break;
              case "shippingMethodId":
                field.options = async () => shippingMethodOptions;
                break;
              case "portId":
                field.options = async () => portOptions;
                break;
              case "loadingPlaceId":
                field.options = async () => loadingPlaceOptions;
                break;
              case "loadingStyleId":
                field.options = async () => loadingStyleOptions;
                break;
            }
          });
        });

        setFormConfig(config);
      } catch (error) {
        console.error("Dropdown seçenekleri yüklenirken hata:", error);
        alert("Form seçenekleri yüklenemedi. Lütfen sayfayı yenileyin.");

        // Hata durumunda fallback - boş seçenekler
        config.sections.forEach((section) => {
          section.fields.forEach((field) => {
            switch (field.name) {
              case "incotermId":
              case "shippingMethodId":
              case "portId":
              case "loadingPlaceId":
              case "loadingStyleId":
                field.options = async () => [];
                break;
            }
          });
        });

        setFormConfig(config);
      } finally {
        setFormOptionsLoading(false);
      }
    };

    updateFormConfig();
  }, []);

  // Tablo konfigürasyonu
  const tableConfig = createTableConfig("job");

  // Modal işlemleri
  const handleCreateJob = () => {
    setEditingJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (job: Job) => {
    if (confirm("Bu işi silmek istediğinizden emin misiniz?")) {
      await deleteItem(job.id);
    }
  };

  const handleModalSubmit = async (data: JobFormData) => {
    if (editingJob) {
      await updateItem(editingJob.id, data);
    } else {
      await createItem(data);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  // Form için initial data hazırla
  const getInitialData = (): Partial<JobFormData> | undefined => {
    if (!editingJob) return undefined;

    return {
      title: editingJob.title,
      incotermId: editingJob.incoterm_id,
      shippingMethodId: editingJob.shipping_method_id,
      loadingPlaceId: editingJob.loading_place_id,
      portId: editingJob.port_id,
      loadingDate: editingJob.loading_date,
      loadingStyleId: editingJob.loading_style_id,
      estimatedAnnualTonnage: editingJob.estimated_annual_tonnage,
      address: editingJob.address,
      note: editingJob.note,
    };
  };

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500 text-center">Hata: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">İşler</CardTitle>
              <CardDescription>
                Nakliye işlerini yönetin ve takip edin
              </CardDescription>
            </div>
            <Button
              onClick={handleCreateJob}
              className="flex items-center gap-2"
              disabled={formOptionsLoading}
            >
              <Plus className="h-4 w-4" />
              {formOptionsLoading ? "Seçenekler Yükleniyor..." : "Yeni İş"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Veri Tablosu */}
      <Card>
        <CardContent className="p-6">
          <DataTable
            data={jobs}
            config={tableConfig}
            loading={loading}
            onRowEdit={handleEditJob}
            onRowDelete={handleDeleteJob}
            error={error}
          />
        </CardContent>
      </Card>

      {/* CRUD Modal */}
      <CrudEditModal<JobFormData>
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        config={formConfig}
        initialData={getInitialData()}
        onSubmit={handleModalSubmit}
        loading={loading}
        mode={editingJob ? "edit" : "create"}
      />
    </div>
  );
}
