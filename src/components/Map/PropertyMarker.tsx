import { useEffect, useRef } from 'react';
import { Property } from '../../types';
import { getPropertyColor, getColorScaleForParameter, getLighterColor, getPropertyColorCrossParameter } from '../../utils';
import { useMapContext } from '../../context/MapContext';
import { PropertyCalloutOverlay } from './PropertyCalloutOverlay';

// Helper function to create small offsets for overlapping markers (zoom-out mode only)
function calculateMinimalOffset(property: Property, allProperties: Property[]): { lat: number; lng: number } {
    const threshold = 0.0001; // Same threshold for detecting overlap
    const overlappingProperties = allProperties.filter(p =>
        Math.abs(p.coordinates.lat - property.coordinates.lat) < threshold &&
        Math.abs(p.coordinates.lng - property.coordinates.lng) < threshold
    );

    if (overlappingProperties.length <= 1) {
        return property.coordinates; // No overlap, use original coordinates
    }

    // Find the index of this property among overlapping ones
    const overlapIndex = overlappingProperties.findIndex(p => p.id === property.id);

    // Create offset to clearly separate overlapping markers
    const angle = (overlapIndex * 2 * Math.PI) / overlappingProperties.length;
    const radius = 0.004; // Balanced offset for clear separation without excessive displacement

    return {
        lat: property.coordinates.lat + (radius * Math.cos(angle)),
        lng: property.coordinates.lng + (radius * Math.sin(angle))
    };
}

interface PropertyMarkerProps {
    property: Property;
    map: google.maps.Map;
    allProperties: Property[];
    clientPropertyId?: string;
}

export function PropertyMarker({ property, map, allProperties, clientPropertyId = "3" }: PropertyMarkerProps) {
    const markerRef = useRef<google.maps.Marker | google.maps.marker.AdvancedMarkerElement | null>(null);
    const calloutOverlayRef = useRef<PropertyCalloutOverlay | null>(null);
    const { state, setSelectedProperty, setHoveredProperty } = useMapContext();

    // WORKING SOLUTION: Use simple marker approach with callout functionality
    useEffect(() => {
        if (!map) return;

        // Get color and size for the marker using cross-parameter logic
        const parameterValue = state.viewConfig.colorParameter === 'askingRate' ? property.askingRate : property.availableSF;
        const markerColor = getPropertyColorCrossParameter(property, state.viewConfig.colorParameter, allProperties);

        // Calculate size relative to client property
        const isClientProperty = property.id === clientPropertyId;
        const clientProperty = allProperties.find(p => p.id === clientPropertyId);
        let markerSize = 30; // Default fallback size

        if (isClientProperty) {
            // Client property gets fixed baseline size
            markerSize = 40;
        } else if (clientProperty) {
            // Calculate size relative to client property value
            const clientValue = state.viewConfig.colorParameter === 'askingRate' ? clientProperty.askingRate : clientProperty.availableSF;

            const clientBaseSize = 40; // Client property baseline size
            const ratio = parameterValue / clientValue;

            // Calculate proportional size with reasonable bounds
            const minSize = 10;  // Minimum visible size
            const maxSize = 120; // Maximum reasonable size

            // Direct proportional scaling: if property is 2x client value, marker is 2x client size
            const proportionalSize = clientBaseSize * ratio;

            // Clamp to reasonable bounds but maintain proportionality
            markerSize = Math.max(minSize, Math.min(maxSize, proportionalSize));

            console.log(`Size calculation for ${property.name}:
                Client value: ${clientValue}
                Property value: ${parameterValue}  
                Ratio: ${ratio.toFixed(2)}x
                Proportional size: ${proportionalSize.toFixed(1)}px
                Final size: ${markerSize.toFixed(1)}px`);
        } else {
            // Fallback if no client property found
            markerSize = 30;
        }

        // Apply minimal offset for overlapping markers (just enough to see all)
        const offsetCoords = calculateMinimalOffset(property, allProperties);
        const markerPosition = new google.maps.LatLng(offsetCoords.lat, offsetCoords.lng);

        // Create marker with appropriate icon and proper anchoring
        let marker;
        if (isClientProperty) {
            // For client property: Create two markers - circle background + star foreground
            // 1. Circle background
            const circleMarker = new google.maps.Marker({
                position: markerPosition,
                map: map,
                zIndex: Math.round(1000 - markerSize - 1), // Behind the star
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: markerSize / 2,
                    fillColor: markerColor,
                    fillOpacity: 0.6,
                    strokeColor: getLighterColor(markerColor),
                    strokeWeight: 2,
                    anchor: new google.maps.Point(0, 0)
                }
            });

            // 2. Star foreground (main marker)
            marker = new google.maps.Marker({
                position: markerPosition,
                map: map,
                title: property.name,
                zIndex: Math.round(1000 - markerSize), // On top
                icon: {
                    path: 'M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z',
                    fillColor: '#3B82F6', // Blue star
                    fillOpacity: 1,
                    strokeColor: getLighterColor('#3B82F6'), // Light blue border
                    strokeWeight: 2,
                    scale: markerSize / 20,
                    anchor: new google.maps.Point(12, 12)
                }
            });

            // Store reference to circle marker for cleanup
            (marker as any).circleMarker = circleMarker;
        } else {
            // Regular circle marker for other properties
            marker = new google.maps.Marker({
                position: markerPosition,
                map: map,
                title: property.name,
                zIndex: Math.round(1000 - markerSize), // Smaller markers on top
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: markerSize / 2,
                    fillColor: markerColor,
                    fillOpacity: 0.8,
                    strokeColor: getLighterColor(markerColor),
                    strokeWeight: 2,
                    anchor: new google.maps.Point(0, 0)
                }
            });
        }

        // Create callout overlay (use original coordinates, not offset position)
        const calloutOverlay = new PropertyCalloutOverlay(property, false, () => {
            calloutOverlay.updateVisibility(false);
        }, state.viewConfig.colorParameter);
        calloutOverlay.setMap(map);
        calloutOverlayRef.current = calloutOverlay;

        // Add event listeners
        marker.addListener('click', () => {
            setSelectedProperty(property);
        });

        marker.addListener('mouseover', () => {
            setHoveredProperty(property);
        });

        marker.addListener('mouseout', () => {
            setHoveredProperty(null);
        });

        markerRef.current = marker;

        return () => {
            marker.setMap(null);
            // Clean up circle marker for client property
            if ((marker as any).circleMarker) {
                (marker as any).circleMarker.setMap(null);
            }
            if (calloutOverlayRef.current) {
                calloutOverlayRef.current.setMap(null);
            }
        };
    }, [map, property, allProperties, state.viewConfig.colorParameter, clientPropertyId]);

    // Update marker appearance when parameter changes or selection state changes
    useEffect(() => {
        if (markerRef.current && map) {
            const parameterValue = state.viewConfig.colorParameter === 'askingRate' ? property.askingRate : property.availableSF;
            const markerColor = getPropertyColorCrossParameter(property, state.viewConfig.colorParameter, allProperties);

            const isClientProperty = property.id === clientPropertyId;
            const clientProperty = allProperties.find(p => p.id === clientPropertyId);
            let markerSize = 30; // Default fallback size

            if (isClientProperty) {
                markerSize = 40;
            } else if (clientProperty) {
                const clientValue = state.viewConfig.colorParameter === 'askingRate' ? clientProperty.askingRate : clientProperty.availableSF;

                const clientBaseSize = 40; // Client property baseline size
                const ratio = parameterValue / clientValue;

                // Calculate proportional size with reasonable bounds
                const minSize = 10;  // Minimum visible size
                const maxSize = 120; // Maximum reasonable size

                // Direct proportional scaling: if property is 2x client value, marker is 2x client size
                const proportionalSize = clientBaseSize * ratio;

                // Clamp to reasonable bounds but maintain proportionality
                markerSize = Math.max(minSize, Math.min(maxSize, proportionalSize));
            }

            if (isClientProperty) {
                // Update star marker
                const starIcon = {
                    path: 'M12,2L15.09,8.26L22,9.27L17,14.14L18.18,21.02L12,17.77L5.82,21.02L7,14.14L2,9.27L8.91,8.26L12,2Z',
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: getLighterColor('#3B82F6'),
                    strokeWeight: 2,
                    scale: markerSize / 20,
                    anchor: new google.maps.Point(12, 12)
                };

                // Update circle background marker
                const circleIcon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: markerSize / 2,
                    fillColor: markerColor,
                    fillOpacity: 0.6,
                    strokeColor: getLighterColor(markerColor),
                    strokeWeight: 2,
                    anchor: new google.maps.Point(0, 0)
                };

                const zIndex = Math.round(1000 - markerSize);
                (markerRef.current as google.maps.Marker).setZIndex(zIndex);
                (markerRef.current as google.maps.Marker).setIcon(starIcon);

                // Update circle marker if it exists
                const circleMarker = (markerRef.current as any).circleMarker;
                if (circleMarker) {
                    circleMarker.setZIndex(zIndex - 1);
                    circleMarker.setIcon(circleIcon);
                }
            } else {
                // Update regular circle marker
                const newIcon = {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: markerSize / 2,
                    fillColor: markerColor,
                    fillOpacity: 0.8,
                    strokeColor: getLighterColor(markerColor),
                    strokeWeight: 2,
                    anchor: new google.maps.Point(0, 0)
                };

                const zIndex = Math.round(1000 - markerSize);
                (markerRef.current as google.maps.Marker).setZIndex(zIndex);
                (markerRef.current as google.maps.Marker).setIcon(newIcon);
            }
        }

        // Update callout overlay with new color parameter and toggle state
        if (calloutOverlayRef.current) {
            calloutOverlayRef.current.updateColorParameter(state.viewConfig.colorParameter);

            // Update visibility based on toggle state and hover state
            const isCurrentlyHovered = state.hoveredProperty?.id === property.id;
            const shouldBeVisible = state.viewConfig.showCallouts || isCurrentlyHovered;

            calloutOverlayRef.current.updateVisibility(shouldBeVisible);
        }
    }, [state.viewConfig.colorParameter, state.viewConfig.showCallouts, property, allProperties, map, state.selectedProperty, state.hoveredProperty, clientPropertyId]);

    return null;
}