"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormConfig,
  FormFieldConfig,
  SelectOption,
} from "@/config/form-configs";

interface DynamicFormProps<T = any> {
  config: FormConfig<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  className?: string;
}

export function DynamicForm<T extends FieldValues = any>({
  config,
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  className,
}: DynamicFormProps<T>) {
  const [fieldOptions, setFieldOptions] = useState<
    Record<string, SelectOption[]>
  >({});
  const [loadingOptions, setLoadingOptions] = useState<Record<string, boolean>>(
    {}
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<T>({
    resolver: zodResolver(config.schema),
    defaultValues: initialData as any,
  });

  const watchedValues = watch();

  // Dynamic options yükleme
  useEffect(() => {
    const loadDynamicOptions = async () => {
      const optionsToLoad: Array<{
        fieldName: string;
        optionsFn: () => Promise<SelectOption[]>;
      }> = [];

      config.sections.forEach((section) => {
        section.fields.forEach((field) => {
          if (field.options && typeof field.options === "function") {
            optionsToLoad.push({
              fieldName: field.name,
              optionsFn: field.options,
            });
          }
        });
      });

      for (const { fieldName, optionsFn } of optionsToLoad) {
        try {
          setLoadingOptions((prev) => ({ ...prev, [fieldName]: true }));
          const options = await optionsFn();
          setFieldOptions((prev) => ({ ...prev, [fieldName]: options }));
        } catch (error) {
          console.error(`Error loading options for ${fieldName}:`, error);
        } finally {
          setLoadingOptions((prev) => ({ ...prev, [fieldName]: false }));
        }
      }
    };

    loadDynamicOptions();
  }, [config]);

  // Initial data değiştiğinde formu resetle
  useEffect(() => {
    if (initialData) {
      reset(initialData as any);
    }
  }, [initialData, reset]);

  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const renderField = (field: FormFieldConfig) => {
    const fieldError = errors[field.name as keyof T] as any;
    const isRequired = field.required;
    const isDisabled = field.disabled || loading;

    // Koşullu görünürlük kontrolü
    if (field.conditionalRender && !field.conditionalRender(watchedValues)) {
      return null;
    }

    // Field options (static veya dynamic)
    const options =
      typeof field.options === "function"
        ? fieldOptions[field.name] || []
        : field.options || [];

    const isLoadingFieldOptions = loadingOptions[field.name];

    const fieldContent = (
      <Controller
        name={field.name as any}
        control={control}
        render={({ field: formField }) => {
          switch (field.type) {
            case "text":
            case "email":
            case "password":
              return (
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className={cn(fieldError && "border-red-500")}
                />
              );

            case "number":
              return (
                <Input
                  {...formField}
                  type="number"
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className={cn(fieldError && "border-red-500")}
                  onChange={(e) =>
                    formField.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              );

            case "textarea":
              return (
                <Textarea
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className={cn(fieldError && "border-red-500")}
                  rows={3}
                />
              );

            case "date":
              return (
                <Input
                  {...formField}
                  type="date"
                  disabled={isDisabled}
                  className={cn(fieldError && "border-red-500")}
                />
              );

            case "select":
              return (
                <Select
                  value={formField.value || ""}
                  onValueChange={formField.onChange}
                  disabled={isDisabled || isLoadingFieldOptions}
                >
                  <SelectTrigger className={cn(fieldError && "border-red-500")}>
                    <SelectValue
                      placeholder={
                        isLoadingFieldOptions
                          ? "Yükleniyor..."
                          : field.placeholder || "Seçiniz"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={String(option.value)}
                        disabled={option.disabled}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              );

            case "checkbox":
              return (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.name}
                    checked={formField.value || false}
                    onCheckedChange={formField.onChange}
                    disabled={isDisabled}
                  />
                  <Label htmlFor={field.name} className="text-sm font-normal">
                    {field.label}
                  </Label>
                </div>
              );

            case "radio":
              return (
                <div className="space-y-2">
                  {options.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="radio"
                        id={`${field.name}-${option.value}`}
                        value={option.value}
                        checked={formField.value === option.value}
                        onChange={() => formField.onChange(option.value)}
                        disabled={isDisabled || option.disabled}
                        className="h-4 w-4"
                      />
                      <Label
                        htmlFor={`${field.name}-${option.value}`}
                        className="text-sm font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              );

            default:
              return (
                <Input
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={isDisabled}
                  className={cn(fieldError && "border-red-500")}
                />
              );
          }
        }}
      />
    );

    return (
      <div
        key={field.name}
        className={cn("space-y-2", field.gridColumn, field.className)}
      >
        {field.type !== "checkbox" && (
          <Label htmlFor={field.name} className="text-sm font-medium">
            {field.label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}

        {fieldContent}

        {field.description && (
          <p className="text-xs text-muted-foreground">{field.description}</p>
        )}

        {fieldError && (
          <p className="text-xs text-red-500">{fieldError.message}</p>
        )}
      </div>
    );
  };

  const getLayoutClassName = () => {
    switch (config.layout) {
      case "two-column":
        return "grid grid-cols-1 md:grid-cols-2 gap-4";
      case "grid":
        return "grid grid-cols-1 md:grid-cols-3 gap-4";
      default:
        return "space-y-4";
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={cn("space-y-6", className)}
    >
      {/* Form Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{config.title}</h2>
        {config.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </div>

      {/* Form Sections */}
      <div className="space-y-6">
        {config.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            {section.title && (
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                {section.description && (
                  <CardDescription>{section.description}</CardDescription>
                )}
              </CardHeader>
            )}
            <CardContent>
              <div className={getLayoutClassName()}>
                {section.fields.map(renderField)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-4 border-t">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || loading}
          >
            {config.cancelButtonText || "İptal"}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || loading}
          className="min-w-[120px]"
        >
          {isSubmitting || loading
            ? "Kaydediliyor..."
            : config.submitButtonText || "Kaydet"}
        </Button>
      </div>
    </form>
  );
}
