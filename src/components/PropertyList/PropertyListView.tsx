import React from 'react';
import { Property } from '../../types';
import { formatParameterValue, getParameterDisplayName } from '../../utils';
import { useMapContext } from '../../context/MapContext';

interface PropertyListViewProps {
    properties: Property[];
    className?: string;
}

export function PropertyListView({ properties, className = '' }: PropertyListViewProps) {
    const { state, setSelectedProperty, setHoveredProperty } = useMapContext();

    const handlePropertyClick = (property: Property) => {
        setSelectedProperty(property);
    };

    const handlePropertyHover = (property: Property | null) => {
        setHoveredProperty(property);
    };

    const getParameterValue = (property: Property) => {
        switch (state.viewConfig.colorParameter) {
            case 'askingRate':
                return property.askingRate;
            case 'availableSF':
                return property.availableSF;
            case 'rba':
                return property.rba;
            default:
                return 0;
        }
    };

    return (
        <div className={`bg-white ${className}`}>
            <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Properties ({properties.length})
                </h2>
                <p className="text-sm text-gray-600">
                    Sorted by {getParameterDisplayName(state.viewConfig.colorParameter)}
                </p>
            </div>

            <div className="divide-y divide-gray-200">
                {properties.map((property) => {
                    const isSelected = state.selectedProperty?.id === property.id;
                    const isHovered = state.hoveredProperty?.id === property.id;

                    return (
                        <div
                            key={property.id}
                            className={`p-4 cursor-pointer transition-colors ${isSelected
                                    ? 'bg-blue-50 border-l-4 border-blue-500'
                                    : isHovered
                                        ? 'bg-gray-50'
                                        : 'hover:bg-gray-50'
                                }`}
                            onClick={() => handlePropertyClick(property)}
                            onMouseEnter={() => handlePropertyHover(property)}
                            onMouseLeave={() => handlePropertyHover(null)}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-gray-900">
                                        {property.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {property.address}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {property.city}, {property.state} {property.zipCode}
                                    </p>
                                </div>

                                <div className="text-right ml-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatParameterValue(getParameterValue(property), state.viewConfig.colorParameter)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Class {property.buildingClass} • {property.propertyType}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {properties.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No properties found</p>
                </div>
            )}
        </div>
    );
}
