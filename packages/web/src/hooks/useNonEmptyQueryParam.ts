'use client';

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

/**
 * Helper hook that returns the value of a query parameter if it is:
 * a) defined, and
 * b) non-empty
 * 
 * otherwise it returns undefined.
 * 
 * For example, let's assume we are calling `useNonEmptyQueryParam('bar')`:
 *  - `/foo?bar=hello` -> `hello`
 *  - `/foo?bar=`      -> `undefined`
 *  - `/foo`           -> `undefined`
 */
export const useNonEmptyQueryParam = (param: string) => {
    const searchParams = useSearchParams();
    const inviteId = useMemo(() => {
        return getSearchParam(param, searchParams);
    }, [param, searchParams]);

    return inviteId;
};

/**
 * @see useNonEmptyQueryParam
 */
export const getSearchParam = (param: string, searchParams: URLSearchParams | null) => {
    const paramValue = searchParams?.get(param) ?? undefined;
    return (paramValue !== undefined && paramValue.length > 0) ? paramValue : undefined;
}