import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapContext } from '../../context/MapContext';
import { useGoogleMaps } from '../../hooks';
import { Property, ColorParameter } from '../../types';
import { LoadingSpinner } from '../common';
import { PropertyMarker } from './PropertyMarker';
import { CalloutToggle } from '../Controls';

interface MapContainerProps {
    /** Array of properties to display as markers */
    properties: Property[];
    /** Additional CSS classes */
    className?: string;
    /** Whether to fit map bounds to show all properties */
    fitBounds?: boolean;
    /** Color parameter for marker coloring */
    colorParameter?: ColorParameter;
    /** Whether to use performance-based coloring */
    usePerformanceColors?: boolean;
    /** Subject property ID for performance comparison */
    subjectPropertyId?: string;
    /** Callback when a property is clicked */
    onPropertyClick?: (property: Property) => void;
    /** Callback when a property is hovered */
    onPropertyHover?: (property: Property | null) => void;
}

export function MapContainer({
    properties,
    className = '',
    fitBounds = true
}: MapContainerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const { state, setMapInstance } = useMapContext();
    const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || '';

    const { isLoaded, loadError } = useGoogleMaps({
        apiKey
    });
    const [mapError, setMapError] = useState<string | null>(null);

    // Default map center and zoom
    const initialCenter = { lat: 30.2672, lng: -97.7431 }; // Austin, TX
    const initialZoom = 10;

    // Initialize map
    useEffect(() => {
        if (!isLoaded || !mapRef.current || state.mapInstance) return;

        try {
            const map = new google.maps.Map(mapRef.current, {
                center: initialCenter,
                zoom: initialZoom,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapId: 'DEMO_MAP_ID' // Required for AdvancedMarkerElement - Google's demo map ID
            });

            setMapInstance(map);

            // Add a listener to ensure map is fully loaded
            google.maps.event.addListenerOnce(map, 'idle', () => {
                console.log('MapContainer: Map is fully loaded and ready');
            });
        } catch (error) {
            console.error('Error initializing map:', error);
            setMapError('Failed to initialize map');
        }
    }, [isLoaded, initialCenter, initialZoom, state.mapInstance, setMapInstance]);

    // Fit map bounds when properties change
    const fitMapBounds = useCallback((map: google.maps.Map) => {
        if (!properties.length) return;

        const bounds = new google.maps.LatLngBounds();
        let hasValidCoordinates = false;

        properties.forEach((property) => {
            const { coordinates } = property;

            // Validate coordinates
            if (!coordinates ||
                typeof coordinates.lat !== 'number' ||
                typeof coordinates.lng !== 'number' ||
                isNaN(coordinates.lat) ||
                isNaN(coordinates.lng)) {
                console.warn(`Invalid coordinates for property ${property.id}:`, coordinates);
                return;
            }

            bounds.extend(coordinates);
            hasValidCoordinates = true;
        });

        // Fit bounds to show all properties if requested and we have valid coordinates
        if (fitBounds && hasValidCoordinates) {
            map.fitBounds(bounds);

            // Ensure minimum zoom level
            const listener = google.maps.event.addListener(map, 'idle', () => {
                if (map.getZoom() && map.getZoom()! > 15) {
                    map.setZoom(15);
                }
                google.maps.event.removeListener(listener);
            });
        }
    }, [properties, fitBounds]);

    // Fit map bounds when properties change
    useEffect(() => {
        if (state.mapInstance && properties.length > 0) {
            fitMapBounds(state.mapInstance);
        }
    }, [state.mapInstance, properties, fitMapBounds]);

    // Handle API key validation
    useEffect(() => {
        const envApiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY;
        if (!envApiKey || envApiKey === 'your_google_maps_api_key_here' || envApiKey.length < 10) {
            setMapError('Google Maps API key is not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables.');
        } else {
            setMapError(null); // Clear any previous error
        }
    }, []);

    // Error state
    if (loadError || mapError) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center p-6">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Error Loading Map
                    </h3>
                    <p className="text-gray-600 mb-4">
                        {mapError || loadError}
                    </p>
                    <div className="text-xs text-gray-500 text-left">
                        <p className="font-medium mb-2">Troubleshooting steps:</p>
                        <ul className="space-y-1">
                            <li>• Create a .env file in project root with VITE_GOOGLE_MAPS_API_KEY</li>
                            <li>• Verify API key has Maps JavaScript API enabled</li>
                            <li>• Ensure API key allows localhost (for development)</li>
                            <li>• Check browser console for detailed error messages</li>
                        </ul>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <div className="text-center">
                    <LoadingSpinner size="lg" className="mb-4" />
                    <p className="text-gray-600">Loading Google Maps...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {properties.length} properties ready to display
                    </p>
                </div>
            </div>
        );
    }

    console.log('MapContainer: Render state:', {
        hasMapInstance: !!state.mapInstance,
        propertiesCount: properties.length,
        mapInstance: state.mapInstance,
        properties: properties.map(p => ({ id: p.id, name: p.name, coordinates: p.coordinates }))
    });

    return (
        <div className={`relative ${className}`}>
            <div ref={mapRef} className="w-full h-full" />

            {/* Property Markers with Simple Offset */}
            {state.mapInstance && properties.map((property) => {
                return (
                    <PropertyMarker
                        key={property.id}
                        property={property}
                        map={state.mapInstance!}
                        allProperties={properties}
                        clientPropertyId="3"
                    />
                );
            })}


            {/* Callout Toggle */}
            <div className="absolute top-4 right-4 z-50">
                <CalloutToggle />
            </div>
        </div>
    );
}
