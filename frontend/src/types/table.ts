import { ReactNode } from "react";

export interface ColumnConfig<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  render?: (value: any, row: T) => ReactNode;
  type?: "text" | "number" | "date" | "boolean" | "select";
  filterOptions?: { label: string; value: string }[];
  resizable?: boolean;
  pinnable?: boolean;
}

export interface TableConfig<T = any> {
  columns: ColumnConfig<T>[];
  title?: string;
  searchable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  selectable?: boolean;
  columnReordering?: boolean;
  columnResizing?: boolean;
  rowSelection?: "single" | "multiple" | false;
}

export interface DataTableProps<T = any> {
  data: T[];
  config: TableConfig<T>;
  loading?: boolean;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowClick?: (row: T) => void;
  onRowEdit?: (row: T) => void;
  onRowDelete?: (row: T) => void;
}

export interface FormField {
  key: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "date";
  options?: { label: string; value: string }[];
  required?: boolean;
  disabled?: boolean;
}

export interface EditModalProps<T = any> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  data: T | null;
  fields: FormField[];
  title?: string;
  loading?: boolean;
}
