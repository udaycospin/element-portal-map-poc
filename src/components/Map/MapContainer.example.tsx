import React, { useState } from 'react';
import { MapContainer } from './MapContainer';
import { Property, ColorParameter } from '../../types';

// Example usage of enhanced MapContainer component
export function MapContainerExample() {
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
    const [colorParameter, setColorParameter] = useState<ColorParameter>('askingRate');
    const [usePerformanceColors, setUsePerformanceColors] = useState(false);

    const sampleProperties: Property[] = [
        {
            id: "1",
            name: "Downtown Plaza",
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            coordinates: { lat: 40.7128, lng: -74.0060 },
            rba: 100000,
            availableSF: 50000,
            askingRate: 25.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2020,
            parkingSpaces: 100,
            imageUrl: "https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Downtown+Plaza",
            description: "Premium office building in the heart of downtown with modern amenities and excellent transportation access."
        },
        {
            id: "2",
            name: "Tech Campus North",
            address: "456 Innovation Drive",
            city: "Brooklyn",
            state: "NY",
            zipCode: "11201",
            coordinates: { lat: 40.6782, lng: -73.9442 },
            rba: 150000,
            availableSF: 75000,
            askingRate: 30.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2021,
            parkingSpaces: 150,
            imageUrl: "https://via.placeholder.com/400x200/10B981/FFFFFF?text=Tech+Campus",
            description: "State-of-the-art tech campus with modern facilities, flexible workspaces, and cutting-edge technology infrastructure."
        },
        {
            id: "3",
            name: "Industrial Complex",
            address: "789 Warehouse Row",
            city: "Queens",
            state: "NY",
            zipCode: "11101",
            coordinates: { lat: 40.7505, lng: -73.9934 },
            rba: 200000,
            availableSF: 100000,
            askingRate: 18.00,
            buildingClass: "B",
            propertyType: "Industrial",
            yearBuilt: 2018,
            parkingSpaces: 200,
            imageUrl: "https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Industrial+Complex",
            description: "Large industrial facility with extensive loading docks, high ceilings, and direct highway access."
        },
        {
            id: "4",
            name: "Retail Center",
            address: "321 Commerce Blvd",
            city: "Manhattan",
            state: "NY",
            zipCode: "10016",
            coordinates: { lat: 40.7489, lng: -73.9857 },
            rba: 75000,
            availableSF: 25000,
            askingRate: 35.00,
            buildingClass: "A",
            propertyType: "Retail",
            yearBuilt: 2019,
            parkingSpaces: 75,
            imageUrl: "https://via.placeholder.com/400x200/EF4444/FFFFFF?text=Retail+Center",
            description: "Prime retail location with high foot traffic, modern storefronts, and excellent visibility."
        }
    ];

    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
        console.log('Property clicked:', property);
    };

    const handlePropertyHover = (property: Property | null) => {
        setHoveredProperty(property);
        if (property) {
            console.log('Property hovered:', property);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col">
            {/* Controls */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex flex-wrap gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color Parameter
                        </label>
                        <select
                            value={colorParameter}
                            onChange={(e) => setColorParameter(e.target.value as ColorParameter)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="askingRate">Asking Rate</option>
                            <option value="availableSF">Available SF</option>
                            <option value="rba">Rentable Building Area</option>
                        </select>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="performance-colors"
                            checked={usePerformanceColors}
                            onChange={(e) => setUsePerformanceColors(e.target.checked)}
                            className="mr-2"
                        />
                        <label htmlFor="performance-colors" className="text-sm font-medium text-gray-700">
                            Use Performance Colors
                        </label>
                    </div>

                    <div className="text-sm text-gray-600">
                        {selectedProperty && (
                            <span>Selected: <strong>{selectedProperty.name}</strong></span>
                        )}
                        {hoveredProperty && (
                            <span className="ml-4">Hovered: <strong>{hoveredProperty.name}</strong></span>
                        )}
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1">
                <MapContainer
                    properties={sampleProperties}
                    className="w-full h-full"
                    initialCenter={{ lat: 40.7128, lng: -74.0060 }}
                    initialZoom={11}
                    fitBounds={true}
                    colorParameter={colorParameter}
                    usePerformanceColors={usePerformanceColors}
                    subjectPropertyId="1" // Use first property as subject
                    onPropertyClick={handlePropertyClick}
                    onPropertyHover={handlePropertyHover}
                />
            </div>

            {/* Property Details Panel */}
            {selectedProperty && (
                <div className="bg-white border-t border-gray-200 p-4 max-h-64 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedProperty.name}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">Address:</span>
                            <p className="text-gray-600">{selectedProperty.address}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Asking Rate:</span>
                            <p className="text-gray-600">${selectedProperty.askingRate}/SF</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Available SF:</span>
                            <p className="text-gray-600">{selectedProperty.availableSF.toLocaleString()} SF</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Building Class:</span>
                            <p className="text-gray-600">Class {selectedProperty.buildingClass}</p>
                        </div>
                    </div>
                    {selectedProperty.description && (
                        <div className="mt-3">
                            <span className="font-medium text-gray-700">Description:</span>
                            <p className="text-gray-600 mt-1">{selectedProperty.description}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}