"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { EditModal } from "@/components/ui/edit-modal";
import { createTableConfig } from "@/config/field-mappings";
import { TableConfig, FormField } from "@/types/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockProfiles, Profile } from "@/lib/mock-data";
import { Edit, Trash2 } from "lucide-react";

export default function TestTablePage() {
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Tablo konfigürasyonu - mapping sistemi ile
  const tableConfig: TableConfig<Profile> = createTableConfig(
    "profiles",
    ["full_name", "company_name", "role", "created_at"],
    {
      title: "Kullanıcı Yönetimi",
      columns: [
        {
          key: "full_name",
          title: "Ad Soyad",
          sortable: true,
          filterable: true,
          type: "text",
        },
        {
          key: "company_name",
          title: "Şirket",
          sortable: true,
          filterable: true,
          type: "text",
        },
        {
          key: "role",
          title: "Rol",
          sortable: true,
          filterable: true,
          type: "select",
          filterOptions: [
            { label: "Admin", value: "ADMIN" },
            { label: "Kullanıcı", value: "USER" },
          ],
          render: (value) => (
            <Badge variant={value === "ADMIN" ? "destructive" : "default"}>
              {value === "ADMIN" ? "Admin" : "Kullanıcı"}
            </Badge>
          ),
        },
        {
          key: "created_at",
          title: "Kayıt Tarihi",
          sortable: true,
          type: "date",
        },
        {
          key: "id",
          title: "İşlemler",
          sortable: false,
          filterable: false,
          render: (_, row) => (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(row)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(row.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ),
        },
      ],
    }
  );

  // Form alanları - modal için
  const formFields: FormField[] = [
    { key: "full_name", label: "Ad Soyad", type: "text", required: true },
    {
      key: "company_name",
      label: "Şirket",
      type: "text",
      required: true,
      disabled: true,
    },
    {
      key: "role",
      label: "Rol",
      type: "select",
      required: true,
      options: [
        { label: "Admin", value: "ADMIN" },
        { label: "Kullanıcı", value: "USER" },
      ],
    },
  ];

  const handleEdit = (profile: Profile) => {
    setSelectedProfile(profile);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSaveProfile = async (profileData: Profile) => {
    setLoading(true);
    try {
      // API çağrısı simülasyonu
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileData.id ? { ...profileData } : profile
        )
      );

      setIsEditModalOpen(false);
      alert("Profil başarıyla güncellendi");
    } catch (error) {
      alert("Güncellenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (selectedRows: Profile[]) => {
    console.log("Seçilen profiller:", selectedRows);
  };

  const handleRowClick = (profile: Profile) => {
    console.log("Profil tıklandı:", profile);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Tablo Test Sayfası</h1>
        <p className="text-muted-foreground">
          Bu sayfa DataTable componentinin tüm özelliklerini test etmek için
          oluşturulmuştur.
        </p>
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Not:</strong> Bu sayfa sadece test amaçlıdır. Mock
            veriler kullanılmaktadır. Gerçek API entegrasyonu sonrası
            kaldırılacaktır.
          </p>
        </div>
      </div>

      <DataTable
        data={profiles}
        config={tableConfig}
        onRowClick={handleRowClick}
        onSelectionChange={handleSelectionChange}
      />

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        data={selectedProfile}
        fields={formFields}
        title={
          selectedProfile
            ? `${selectedProfile.full_name} - Düzenle`
            : "Profil Düzenle"
        }
        loading={loading}
      />
    </div>
  );
}
