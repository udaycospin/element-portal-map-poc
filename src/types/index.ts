/**
 * Represents a commercial property with all relevant details for map visualization
 */
export interface Property {
    /** Unique identifier for the property */
    id: string;

    /** Display name of the property */
    name: string;

    /** Street address of the property */
    address: string;

    /** City where the property is located */
    city: string;

    /** State where the property is located */
    state: string;

    /** ZIP code of the property location */
    zipCode: string;

    /** Geographic coordinates for map positioning */
    coordinates: {
        /** Latitude coordinate */
        lat: number;
        /** Longitude coordinate */
        lng: number;
    };

    /** Rentable Building Area in square feet */
    rba: number;

    /** Available square footage for lease */
    availableSF: number;

    /** Asking rental rate in dollars per square foot per year */
    askingRate: number;

    /** Building classification grade (A, B, or C) */
    buildingClass: 'A' | 'B' | 'C';

    /** Type of property (e.g., Office, Industrial, Retail) */
    propertyType: string;

    /** Year the building was constructed */
    yearBuilt: number;

    /** Number of parking spaces available */
    parkingSpaces: number;

    /** Optional URL to property image */
    imageUrl?: string;

    /** Optional detailed description of the property */
    description?: string;
}

/**
 * Available parameters for color-coding properties on the map
 */
export type ColorParameter = 'askingRate' | 'availableSF' | 'rba';

/**
 * Configuration for map view settings and display options
 */
export interface MapViewConfig {
    /** Parameter to use for color-coding markers */
    colorParameter: ColorParameter;

    /** Whether to display heat map visualization */
    showHeatMap: boolean;

    /** Display mode for property list (list or tiles) */
    viewMode: 'list' | 'tiles';

    /** Whether to show callout bubbles always or only on hover */
    showCallouts: boolean;
}

/**
 * Global state for the map application
 */
export interface MapState {
    /** Array of all properties to display */
    properties: Property[];

    /** Currently selected property */
    selectedProperty: Property | null;

    /** Property currently being hovered over */
    hoveredProperty: Property | null;

    /** Current view configuration settings */
    viewConfig: MapViewConfig;

    /** Google Maps instance reference */
    mapInstance: google.maps.Map | null;

    /** Loading state indicator */
    isLoading: boolean;

    /** Error message if any */
    error: string | null;
}

/**
 * Action types for map state management
 */
export type MapAction =
    | { type: 'SET_PROPERTIES'; payload: Property[] }
    | { type: 'SET_SELECTED_PROPERTY'; payload: Property | null }
    | { type: 'SET_HOVERED_PROPERTY'; payload: Property | null }
    | { type: 'SET_VIEW_CONFIG'; payload: Partial<MapViewConfig> }
    | { type: 'SET_MAP_INSTANCE'; payload: google.maps.Map | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null };

/**
 * Color scale configuration for heat map visualization
 */
export interface ColorScale {
    /** Minimum value for the scale */
    min: number;

    /** Maximum value for the scale */
    max: number;

    /** Function to get color for a given value */
    getColor: (value: number) => string;
}

/**
 * Filter criteria for property search and filtering
 */
export interface PropertyFilter {
    /** Filter by building class grades */
    buildingClass?: ('A' | 'B' | 'C')[];

    /** Filter by property types */
    propertyType?: string[];

    /** Minimum asking rate filter */
    minAskingRate?: number;

    /** Maximum asking rate filter */
    maxAskingRate?: number;

    /** Minimum available square footage filter */
    minAvailableSF?: number;

    /** Maximum available square footage filter */
    maxAvailableSF?: number;

    /** Minimum rentable building area filter */
    minRBA?: number;

    /** Maximum rentable building area filter */
    maxRBA?: number;
}

/**
 * Configuration for sorting properties
 */
export interface SortConfig {
    /** Property field to sort by */
    field: keyof Property;

    /** Sort direction */
    direction: 'asc' | 'desc';
}
