"use client";

import React from "react";
import { FieldValues } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DynamicForm } from "./DynamicForm";
import { FormConfig } from "@/config/form-configs";

interface CrudEditModalProps<T extends FieldValues = any> {
  isOpen: boolean;
  onClose: () => void;
  config: FormConfig<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  loading?: boolean;
  mode?: "create" | "edit";
}

export function CrudEditModal<T extends FieldValues = any>({
  isOpen,
  onClose,
  config,
  initialData,
  onSubmit,
  loading = false,
  mode = "create",
}: CrudEditModalProps<T>) {
  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling - form içinde gösterilecek
      console.error("Modal submit error:", error);
      throw error; // Re-throw to let form handle it
    }
  };

  const modalConfig = {
    ...config,
    title:
      mode === "edit" ? `${config.title} - Düzenle` : `${config.title} - Yeni`,
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalConfig.title}</DialogTitle>
        </DialogHeader>

        <DynamicForm<T>
          config={modalConfig}
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
          className="mt-4"
        />
      </DialogContent>
    </Dialog>
  );
}
