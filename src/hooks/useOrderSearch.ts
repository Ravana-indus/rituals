import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { OrderSearchFilters, PaginatedOrders } from '../types/database';

const DEFAULT_PAGINATION = { page: 1, per_page: 20, sort_by: 'created_at', sort_dir: 'desc' as const };

export function useOrderSearch() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<OrderSearchFilters>({});
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [result, setResult] = useState<PaginatedOrders | null>(null);
  const [loading, setLoading] = useState(true);

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.orders.search(filters, pagination);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => { search(); }, [search]);

  const setPage = (page: number) => setPagination(p => ({ ...p, page }));
  const setSort = (sort_by: string) => setPagination(p => ({
    ...p,
    sort_by,
    sort_dir: p.sort_by === sort_by && p.sort_dir === 'asc' ? 'desc' : 'asc',
  }));
  const setFilter = (key: keyof OrderSearchFilters, value: unknown) =>
    setFilters(f => ({ ...f, [key]: value }));
  const clearFilters = () => { setFilters({}); setPagination(DEFAULT_PAGINATION); };

  return {
    query, setQuery,
    filters, setFilter, clearFilters,
    pagination, setPage, setSort,
    orders: result?.data ?? [],
    total: result?.total ?? 0,
    totalPages: result?.total_pages ?? 0,
    loading,
    refresh: search,
  };
}
