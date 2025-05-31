"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Settings2,
  Search,
  Edit,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTableProps, ColumnConfig } from "@/types/table";

export function DataTable<T extends Record<string, any>>({
  data,
  config,
  loading = false,
  onSelectionChange,
  onRowClick,
  onRowEdit,
  onRowDelete,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  // Dinamik kolon oluşturma
  const columns = React.useMemo<ColumnDef<T>[]>(() => {
    const cols: ColumnDef<T>[] = [];

    // Seçim kolonu - sadece multiple selection için checkbox
    if (config.selectable && config.rowSelection === "multiple") {
      cols.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Tümünü seç"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Satırı seç"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 50,
      });
    }

    // Veri kolonları
    config.columns.forEach((colConfig: ColumnConfig<T>) => {
      cols.push({
        accessorKey: colConfig.key as string,
        id: colConfig.key as string,
        header: ({ column }) => {
          if (!colConfig.sortable) {
            return (
              <div className="font-medium flex items-center">
                {colConfig.title}
              </div>
            );
          }
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="h-8 p-0 font-medium hover:bg-transparent flex items-center"
            >
              {colConfig.title}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ getValue, row }) => {
          const value = getValue();
          if (colConfig.render) {
            return colConfig.render(value, row.original);
          }

          // Tip bazlı rendering
          switch (colConfig.type) {
            case "boolean":
              return (
                <Badge variant={value ? "default" : "secondary"}>
                  {value ? "Evet" : "Hayır"}
                </Badge>
              );
            case "date":
              if (!value) return "-";
              try {
                return new Date(value as string | number).toLocaleDateString(
                  "tr-TR"
                );
              } catch {
                return String(value);
              }
            case "number":
              return typeof value === "number"
                ? value.toLocaleString("tr-TR")
                : String(value || "");
            default:
              const displayValue = String(value || "");
              return (
                <div className="truncate max-w-[200px]" title={displayValue}>
                  {displayValue}
                </div>
              );
          }
        },
        enableSorting: colConfig.sortable,
        enableHiding: true,
        enableResizing: config.columnResizing,
        size: colConfig.width,
      });
    });

    // İşlemler kolonu
    if (onRowEdit || onRowDelete) {
      cols.push({
        id: "actions",
        header: "İşlemler",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            {onRowEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowEdit(row.original);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onRowDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRowDelete(row.original);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 120,
      });
    }

    return cols;
  }, [
    config.columns,
    config.selectable,
    config.rowSelection,
    config.columnResizing,
    onRowEdit,
    onRowDelete,
  ]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    enableColumnResizing: config.columnResizing,
    enableRowSelection: config.selectable ? true : false,
    enableMultiRowSelection: config.rowSelection === "multiple",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: config.pageSize || 10,
      },
    },
  });

  // Seçim değişikliğini parent'a bildir
  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  // Export fonksiyonu
  const exportToCSV = () => {
    const visibleColumns = config.columns.filter(
      (col) => columnVisibility[col.key as string] !== false
    );

    const headers = visibleColumns.map((col) => col.title).join(",");
    const rows = table.getFilteredRowModel().rows.map((row) =>
      visibleColumns
        .map((col) => {
          const value = row.original[col.key];
          return typeof value === "string" && value.includes(",")
            ? `"${value}"`
            : value;
        })
        .join(",")
    );

    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${config.title || "data"}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" />
          <Skeleton className="h-8 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Başlık ve Kontroller */}
      <div className="flex items-center justify-between">
        <div>
          {config.title && (
            <h2 className="text-2xl font-semibold tracking-tight">
              {config.title}
            </h2>
          )}
          <p className="text-sm text-muted-foreground">
            Toplam {table.getFilteredRowModel().rows.length} kayıt
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {config.exportable && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV İndir
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Kolonlar
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  const colConfig = config.columns.find(
                    (c) => c.key === column.id
                  );
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {colConfig?.title || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Arama ve Filtreler */}
      <div className="flex items-center space-x-2">
        {config.searchable && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Ara..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(String(e.target.value))}
              className="pl-8"
            />
          </div>
        )}

        {/* Kolon bazlı filtreler */}
        {config.columns
          .filter(
            (col) =>
              col.filterable && col.type === "select" && col.filterOptions
          )
          .map((col) => (
            <Select
              key={col.key as string}
              value={
                (table
                  .getColumn(col.key as string)
                  ?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value) =>
                table
                  .getColumn(col.key as string)
                  ?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`${col.title} filtrele`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                {col.filterOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
      </div>

      {/* Tablo */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sonuç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Sayfa başına satır</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Sayfa {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">İlk sayfaya git</span>
              {"<<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Önceki sayfa</span>
              {"<"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Sonraki sayfa</span>
              {">"}
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Son sayfaya git</span>
              {">>"}
            </Button>
          </div>
        </div>
      </div>

      {/* Seçim Bilgisi */}
      {config.selectable &&
        table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} /{" "}
            {table.getFilteredRowModel().rows.length} satır seçildi.
          </div>
        )}
    </div>
  );
}
