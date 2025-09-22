import React from 'react';
import { Property } from '../../types';
import { formatParameterValue, getParameterDisplayName } from '../../utils';
import { useMapContext } from '../../context/MapContext';

interface PropertyTileViewProps {
    properties: Property[];
    className?: string;
}

export function PropertyTileView({ properties, className = '' }: PropertyTileViewProps) {
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

            <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {properties.map((property) => {
                        const isSelected = state.selectedProperty?.id === property.id;
                        const isHovered = state.hoveredProperty?.id === property.id;

                        return (
                            <div
                                key={property.id}
                                className={`bg-white border rounded-lg p-4 cursor-pointer transition-all duration-200 ${isSelected
                                        ? 'border-blue-500 shadow-lg ring-2 ring-blue-200'
                                        : isHovered
                                            ? 'border-gray-300 shadow-md'
                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                                    }`}
                                onClick={() => handlePropertyClick(property)}
                                onMouseEnter={() => handlePropertyHover(property)}
                                onMouseLeave={() => handlePropertyHover(null)}
                            >
                                {property.imageUrl && (
                                    <div className="aspect-video bg-gray-200 rounded-md mb-3 overflow-hidden">
                                        <img
                                            src={property.imageUrl}
                                            alt={property.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                                        {property.name}
                                    </h3>

                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {property.address}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        {property.city}, {property.state}
                                    </p>

                                    <div className="pt-2 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {getParameterDisplayName(state.viewConfig.colorParameter)}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatParameterValue(getParameterValue(property), state.viewConfig.colorParameter)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500">Class</span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {property.buildingClass}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {properties.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    <p>No properties found</p>
                </div>
            )}
        </div>
    );
}
