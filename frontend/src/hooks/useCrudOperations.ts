import { useState, useCallback, useEffect } from "react";

// Generic CRUD operasyonları için interface
export interface CrudOperations<
  T,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TUpdate = Partial<T>,
> {
  getAll: () => Promise<T[]>;
  getById: (id: string) => Promise<T>;
  create: (data: TCreate) => Promise<T>;
  update: (id: string, data: TUpdate) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

// Generic CRUD hook state interface
export interface CrudState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;
}

// Generic CRUD hook return interface
export interface CrudHookReturn<T, TCreate, TUpdate> {
  // State
  data: T[];
  loading: boolean;
  error: string | null;
  selectedItem: T | null;

  // Actions
  fetchAll: () => Promise<void>;
  fetchById: (id: string) => Promise<T | null>;
  createItem: (data: TCreate) => Promise<T | null>;
  updateItem: (id: string, data: TUpdate) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
  setSelectedItem: (item: T | null) => void;
  refetch: () => Promise<void>;
}

/**
 * Generic CRUD hook factory
 * SOLID prensiplerine uygun, yeniden kullanılabilir CRUD operasyonları
 */
export function createCrudHook<
  T,
  TCreate = Omit<T, "id" | "createdAt" | "updatedAt">,
  TUpdate = Partial<T>,
>(operations: CrudOperations<T, TCreate, TUpdate>) {
  return function useCrud(): CrudHookReturn<T, TCreate, TUpdate> {
    const [state, setState] = useState<CrudState<T>>({
      data: [],
      loading: false,
      error: null,
      selectedItem: null,
    });

    // Tüm verileri getir
    const fetchAll = useCallback(async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));
        const data = await operations.getAll();
        setState((prev) => ({ ...prev, data, loading: false }));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Veri getirilirken hata oluştu";
        setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      }
    }, [operations]);

    useEffect(() => {
      fetchAll();
    }, [fetchAll]);

    // ID ile tek veri getir
    const fetchById = useCallback(
      async (id: string): Promise<T | null> => {
        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));
          const item = await operations.getById(id);
          setState((prev) => ({ ...prev, selectedItem: item, loading: false }));
          return item;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Veri getirilirken hata oluştu";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
          return null;
        }
      },
      [operations]
    );

    // Yeni veri oluştur
    const createItem = useCallback(
      async (data: TCreate): Promise<T | null> => {
        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));
          const newItem = await operations.create(data);
          setState((prev) => ({
            ...prev,
            data: [...prev.data, newItem],
            loading: false,
          }));
          return newItem;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Veri oluşturulurken hata oluştu";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
          return null;
        }
      },
      [operations]
    );

    // Veri güncelle
    const updateItem = useCallback(
      async (id: string, data: TUpdate): Promise<T | null> => {
        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));
          const updatedItem = await operations.update(id, data);
          setState((prev) => ({
            ...prev,
            data: prev.data.map((item) =>
              (item as any).id === id ? updatedItem : item
            ),
            selectedItem:
              prev.selectedItem && (prev.selectedItem as any).id === id
                ? updatedItem
                : prev.selectedItem,
            loading: false,
          }));
          return updatedItem;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Veri güncellenirken hata oluştu";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
          return null;
        }
      },
      [operations]
    );

    // Veri sil
    const deleteItem = useCallback(
      async (id: string): Promise<boolean> => {
        try {
          setState((prev) => ({ ...prev, loading: true, error: null }));
          await operations.delete(id);
          setState((prev) => ({
            ...prev,
            data: prev.data.filter((item) => (item as any).id !== id),
            selectedItem:
              prev.selectedItem && (prev.selectedItem as any).id === id
                ? null
                : prev.selectedItem,
            loading: false,
          }));
          return true;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Veri silinirken hata oluştu";
          setState((prev) => ({
            ...prev,
            error: errorMessage,
            loading: false,
          }));
          return false;
        }
      },
      [operations]
    );

    // Seçili item'ı set et
    const setSelectedItem = useCallback((item: T | null) => {
      setState((prev) => ({ ...prev, selectedItem: item }));
    }, []);

    // Verileri yeniden getir (alias for fetchAll)
    const refetch = useCallback(async () => {
      await fetchAll();
    }, []);

    return {
      // State
      data: state.data,
      loading: state.loading,
      error: state.error,
      selectedItem: state.selectedItem,

      // Actions
      fetchAll,
      fetchById,
      createItem,
      updateItem,
      deleteItem,
      setSelectedItem,
      refetch,
    };
  };
}
