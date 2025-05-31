"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditModalProps, FormField } from "@/types/table";

export function EditModal<T extends Record<string, any>>({
  isOpen,
  onClose,
  onSave,
  data,
  fields,
  title = "Düzenle",
  loading = false,
}: EditModalProps<T>) {
  const [formData, setFormData] = React.useState<T>({} as T);

  React.useEffect(() => {
    if (data) {
      setFormData({ ...data });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] || "";

    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.key}
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            disabled={field.disabled}
            placeholder={field.label}
          />
        );

      case "select":
        return (
          <Select
            value={String(value)}
            onValueChange={(newValue) => handleInputChange(field.key, newValue)}
            disabled={field.disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder={`${field.label} seçin`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "date":
        return (
          <Input
            id={field.key}
            type="date"
            value={
              value ? new Date(value as string).toISOString().split("T")[0] : ""
            }
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            disabled={field.disabled}
          />
        );

      default:
        return (
          <Input
            id={field.key}
            type={field.type}
            value={String(value)}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            disabled={field.disabled}
            placeholder={field.label}
          />
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.key} className="grid gap-2">
                <Label htmlFor={field.key} className="text-right">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              İptal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
