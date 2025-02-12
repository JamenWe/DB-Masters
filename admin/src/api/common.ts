import axios from 'axios';
import {useNotification} from 'src/components/notifications/NotificationContextProvider';
import {DefaultError, QueryClient, QueryKey, useQuery, UseQueryOptions, UseQueryResult,} from '@tanstack/react-query';
import {useEffect, useState} from 'react';

export type ErrorType = {
    title: string;
    message: string;
    error?: string;
};

export type PageType = {
    // the current element offset, starting with offset 0
    offset: number;
    // the maximum amount of entries per page
    limit: number;
    // the total number of elements across all pages
    total: number;
};

export type PaginatedItemsType<T> = {
    // the items of the current page
    items: T[];
    // the current pagination information
    page: PageType;
};

// filter parameters to be used for paginated requests
export type PageableFilterParamsType<T> = {
    // the item offset for pagination, starting at 0
    offset?: number;
    // the maximum amount of items, which should get returned, defaults to 50
    limit?: number;
    // the field name to sort the items
    sortField?: keyof T;
    // the sort direction to be used for the `sortField`
    sortDir?: 'asc' | 'desc';
};

export type DateType = `${number}-${number}-${number}`;
export type TimeType = `${number}:${number}:${number}`;

// ISO-8601 formatted timestamp, as formatted and parsed by the backend
export type DateTimeType = `${DateType}T${TimeType}Z`;

// type predicate for DateType
export const isDate = (date?: string): date is DateType => {
    return date !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(date);
};

// type predicate for TimeType
export const isTime = (time?: string): time is TimeType => {
    return time !== undefined && /^\d{2}:\d{2}:\d{2}$/.test(time);
};

// type predicate for DateTimeType
export const isDateTime = (datetime?: string): datetime is DateTimeType => {
    return datetime !== undefined && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(datetime);
};

export type BigDecimal = string;

/**
 * Common handler for extracting error messages from errors coming from the BE
 * See {@link GlobalExceptionHandler} in BE
 */
export const extractErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        if (typeof responseData === 'string' && responseData.trim().length !== 0) {
            return responseData;
        }
        return responseData?.data?.message.en ?? responseData?.error ?? error.message;
    } else if (error instanceof Error) {
        return error.message;
    }
    return `${error}`;
};

export function useQueryWithErrorNotification<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    queryClient?: QueryClient,
): UseQueryResult<TData, TError> {
    const useQueryResult = useQuery(options, queryClient);

    const { dispatchShowNotification } = useNotification();

    const [didHandleError, setDidHandleError] = useState(false);
    useEffect(() => {
        if (useQueryResult.isError && !didHandleError) {
            dispatchShowNotification('error', extractErrorMessage(useQueryResult.error));
            setDidHandleError(true);
        }
    }, [didHandleError, useQueryResult.isError, useQueryResult.error, dispatchShowNotification]);

    return useQueryResult;
}