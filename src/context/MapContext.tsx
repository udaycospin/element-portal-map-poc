import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { MapState, MapAction, Property, MapViewConfig } from '../types';

// Initial state
const initialState: MapState = {
    properties: [],
    selectedProperty: null,
    hoveredProperty: null,
    viewConfig: {
        colorParameter: 'availableSF',
        showHeatMap: true,
        viewMode: 'list',
        showCallouts: false // Default to off (hover only mode)
    },
    mapInstance: null,
    isLoading: false,
    error: null
};

// Reducer function
function mapReducer(state: MapState, action: MapAction): MapState {
    switch (action.type) {
        case 'SET_PROPERTIES':
            return { ...state, properties: action.payload };

        case 'SET_SELECTED_PROPERTY':
            return { ...state, selectedProperty: action.payload };

        case 'SET_HOVERED_PROPERTY':
            return { ...state, hoveredProperty: action.payload };

        case 'SET_VIEW_CONFIG':
            return {
                ...state,
                viewConfig: { ...state.viewConfig, ...action.payload }
            };

        case 'SET_MAP_INSTANCE':
            return { ...state, mapInstance: action.payload };

        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };

        case 'SET_ERROR':
            return { ...state, error: action.payload };

        default:
            return state;
    }
}

// Context type
interface MapContextType {
    state: MapState;
    dispatch: React.Dispatch<MapAction>;
    // Helper functions
    setProperties: (properties: Property[]) => void;
    setSelectedProperty: (property: Property | null) => void;
    setHoveredProperty: (property: Property | null) => void;
    updateViewConfig: (config: Partial<MapViewConfig>) => void;
    setMapInstance: (map: google.maps.Map | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// Create context
const MapContext = createContext<MapContextType | undefined>(undefined);

// Provider component
interface MapProviderProps {
    children: ReactNode;
}

export function MapProvider({ children }: MapProviderProps) {
    const [state, dispatch] = useReducer(mapReducer, initialState);

    // Helper functions - memoized to prevent re-renders
    const setProperties = useCallback((properties: Property[]) => {
        dispatch({ type: 'SET_PROPERTIES', payload: properties });
    }, []);

    const setSelectedProperty = useCallback((property: Property | null) => {
        dispatch({ type: 'SET_SELECTED_PROPERTY', payload: property });
    }, []);

    const setHoveredProperty = useCallback((property: Property | null) => {
        dispatch({ type: 'SET_HOVERED_PROPERTY', payload: property });
    }, []);

    const updateViewConfig = useCallback((config: Partial<MapViewConfig>) => {
        dispatch({ type: 'SET_VIEW_CONFIG', payload: config });
    }, []);

    const setMapInstance = useCallback((map: google.maps.Map | null) => {
        dispatch({ type: 'SET_MAP_INSTANCE', payload: map });
    }, []);

    const setLoading = useCallback((loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    }, []);

    const value: MapContextType = {
        state,
        dispatch,
        setProperties,
        setSelectedProperty,
        setHoveredProperty,
        updateViewConfig,
        setMapInstance,
        setLoading,
        setError
    };

    return (
        <MapContext.Provider value={value}>
            {children}
        </MapContext.Provider>
    );
}

// Custom hook to use the context
export function useMapContext() {
    const context = useContext(MapContext);
    if (context === undefined) {
        throw new Error('useMapContext must be used within a MapProvider');
    }
    return context;
}
