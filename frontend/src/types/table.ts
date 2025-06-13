import { ReactNode } from "react";
import type {
  TableType,
  TableConfig,
  TableColumnConfig,
} from "@/config/table-configs";

export interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  config: TableConfig;
  loading?: boolean;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selectedRows: T[]) => void;
  onRowEdit?: (row: T) => void;
  onRowDelete?: (row: T) => void;
  error?: string | null;
}

export interface FormField {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "select" | "textarea";
  required?: boolean;
  options?: Array<{ label: string; value: string }>;
}

export interface EditModalProps<T extends Record<string, any>> {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  data?: T;
  fields: FormField[];
  title?: string;
  loading?: boolean;
}

export type { TableConfig, TableColumnConfig };

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  render?: (value: any) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  tableType: TableType;
  customConfig?: Partial<TableConfig>;
  loading?: boolean;
}
