import React from 'react';
import { ParameterSelector } from './ParameterSelector';
import { ColorLegend } from './ColorLegend';
import { ViewToggle } from '../PropertyList/ViewToggle';
import { Property } from '../../types';

interface MapControlsProps {
    properties: Property[];
    className?: string;
}

export function MapControls({ properties, className = '' }: MapControlsProps) {
    return (
        <div className={`space-y-4 ${className}`}>
            {/* Parameter Selection */}
            <ParameterSelector />

            {/* View Toggle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    View Mode
                </label>
                <ViewToggle />
            </div>

            {/* Color Legend */}
            <ColorLegend properties={properties} />
        </div>
    );
}
