import { Property, PropertyFilter, SortConfig } from '../types';

/**
 * Filters properties based on the provided filter criteria
 */
export function filterProperties(properties: Property[], filter: PropertyFilter): Property[] {
    return properties.filter(property => {
        // Building class filter
        if (filter.buildingClass && filter.buildingClass.length > 0) {
            if (!filter.buildingClass.includes(property.buildingClass)) {
                return false;
            }
        }

        // Property type filter
        if (filter.propertyType && filter.propertyType.length > 0) {
            if (!filter.propertyType.includes(property.propertyType)) {
                return false;
            }
        }

        // Asking rate range filter
        if (filter.minAskingRate !== undefined && property.askingRate < filter.minAskingRate) {
            return false;
        }
        if (filter.maxAskingRate !== undefined && property.askingRate > filter.maxAskingRate) {
            return false;
        }

        // Available SF range filter
        if (filter.minAvailableSF !== undefined && property.availableSF < filter.minAvailableSF) {
            return false;
        }
        if (filter.maxAvailableSF !== undefined && property.availableSF > filter.maxAvailableSF) {
            return false;
        }

        // RBA range filter
        if (filter.minRBA !== undefined && property.rba < filter.minRBA) {
            return false;
        }
        if (filter.maxRBA !== undefined && property.rba > filter.maxRBA) {
            return false;
        }

        return true;
    });
}

/**
 * Sorts properties based on the provided sort configuration
 */
export function sortProperties(properties: Property[], sortConfig: SortConfig): Property[] {
    return [...properties].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            const comparison = aValue.localeCompare(bValue);
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            const comparison = aValue - bValue;
            return sortConfig.direction === 'asc' ? comparison : -comparison;
        }

        return 0;
    });
}

/**
 * Gets unique values for a specific property field
 */
export function getUniqueValues<T>(properties: Property[], field: keyof Property): T[] {
    const values = properties.map(prop => prop[field] as T);
    return Array.from(new Set(values));
}

/**
 * Calculates statistics for a numeric field
 */
export function calculateStats(properties: Property[], field: keyof Property): {
    min: number;
    max: number;
    avg: number;
    count: number;
} {
    const values = properties
        .map(prop => prop[field])
        .filter((value): value is number => typeof value === 'number');

    if (values.length === 0) {
        return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;

    return { min, max, avg, count: values.length };
}

/**
 * Groups properties by a specific field
 */
export function groupPropertiesBy<T>(
    properties: Property[],
    field: keyof Property
): Record<string, Property[]> {
    return properties.reduce((groups, property) => {
        const key = String(property[field]);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(property);
        return groups;
    }, {} as Record<string, Property[]>);
}

/**
 * Searches properties by name, address, or city
 */
export function searchProperties(properties: Property[], query: string): Property[] {
    if (!query.trim()) {
        return properties;
    }

    const lowercaseQuery = query.toLowerCase();

    return properties.filter(property =>
        property.name.toLowerCase().includes(lowercaseQuery) ||
        property.address.toLowerCase().includes(lowercaseQuery) ||
        property.city.toLowerCase().includes(lowercaseQuery) ||
        property.state.toLowerCase().includes(lowercaseQuery)
    );
}

/**
 * Calculates distance between two coordinates (in miles)
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Finds properties within a certain radius of a center point
 */
export function findPropertiesInRadius(
    properties: Property[],
    centerLat: number,
    centerLng: number,
    radiusMiles: number
): Property[] {
    return properties.filter(property => {
        const distance = calculateDistance(
            centerLat,
            centerLng,
            property.coordinates.lat,
            property.coordinates.lng
        );
        return distance <= radiusMiles;
    });
}
