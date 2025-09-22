import { useState, useEffect, useMemo } from 'react';
import { Property, PropertyFilter, SortConfig } from '../types';
import { filterProperties, sortProperties, searchProperties } from '../utils';

interface UsePropertyDataOptions {
    initialProperties: Property[];
    initialFilter?: PropertyFilter;
    initialSort?: SortConfig;
}

interface UsePropertyDataReturn {
    properties: Property[];
    filteredProperties: Property[];
    searchQuery: string;
    filter: PropertyFilter;
    sortConfig: SortConfig;
    setSearchQuery: (query: string) => void;
    setFilter: (filter: PropertyFilter) => void;
    setSortConfig: (sort: SortConfig) => void;
    clearFilter: () => void;
    clearSearch: () => void;
}

export function usePropertyData({
    initialProperties,
    initialFilter = {},
    initialSort = { field: 'name', direction: 'asc' }
}: UsePropertyDataOptions): UsePropertyDataReturn {
    const [properties] = useState<Property[]>(initialProperties);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<PropertyFilter>(initialFilter);
    const [sortConfig, setSortConfig] = useState<SortConfig>(initialSort);

    // Memoized filtered and sorted properties
    const filteredProperties = useMemo(() => {
        let result = properties;

        // Apply search filter
        if (searchQuery.trim()) {
            result = searchProperties(result, searchQuery);
        }

        // Apply property filters
        if (Object.keys(filter).length > 0) {
            result = filterProperties(result, filter);
        }

        // Apply sorting
        result = sortProperties(result, sortConfig);

        return result;
    }, [properties, searchQuery, filter, sortConfig]);

    const clearFilter = () => {
        setFilter({});
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    return {
        properties,
        filteredProperties,
        searchQuery,
        filter,
        sortConfig,
        setSearchQuery,
        setFilter,
        setSortConfig,
        clearFilter,
        clearSearch
    };
}
