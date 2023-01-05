import React from 'react';
import create from 'zustand';

type PaginationState = {
  totalItems: number;
  pageSize: number;
  currentPage?: number;
};

type PaginationMeta = {
  totalPages: number;
  previousEnabled: boolean;
  nextEnabled: boolean;
};

type Pagination = PaginationState & PaginationMeta;
type PaginationArgs = Pick<PaginationState, 'totalItems' | 'pageSize'>;

export const usePaginationContext = create<{
  pagination: Pagination;
  setPagination: (pg: Pagination) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  setFirstPage: () => void;
}>((set, get) => ({
  pagination: {
    totalPages: 0,
    pageSize: 0,
    currentPage: 0,
    nextEnabled: false,
    previousEnabled: false,
    totalItems: 0,
  },
  setPagination: (args: PaginationArgs) =>
    set(({ pagination }) => ({
      pagination: {
        ...pagination,
        ...args,
        nextEnabled: args.totalItems - args.pageSize > 0,
        totalPages: Math.ceil(args.totalItems / args.pageSize),
      },
    })),
  setNextPage: () =>
    set(({ pagination }) => ({
      pagination: {
        ...pagination,
        currentPage: pagination.currentPage + 1,
        nextEnabled: pagination.currentPage + 1 < pagination.totalPages,
        previousEnabled: true,
      },
    })),
  setPrevPage: () =>
    set(({ pagination }) => ({
      pagination: {
        ...pagination,
        currentPage: pagination.currentPage - 1,
        nextEnabled: true,
        previousEnabled: Boolean(pagination.currentPage),
      },
    })),
  setFirstPage: () =>
    set(({ pagination }) => ({
      pagination: {
        ...pagination,
        currentPage: 0,
        nextEnabled: pagination.totalItems - pagination.pageSize > 0,
        totalPages: Math.ceil(pagination.totalItems / pagination.pageSize),
      },
    })),
}));

export interface ListContextProps {
  total: number;
  perPage: number;
  currentPage?: number;
}

type ListPaginationContextProps = ListContextProps;

const ListPaginationContextProvider: FCC<{ value: ListPaginationContextProps }> = ({ children, value }) => {
  const { setPagination, pagination } = usePaginationContext();

  React.useEffect(() => {
    setPagination({
      ...pagination,
      totalItems: value.total,
      currentPage: value.currentPage ?? 0,
      pageSize: value.perPage,
    });
  }, [value]);

  return <>{children}</>;
};

export default ListPaginationContextProvider;
