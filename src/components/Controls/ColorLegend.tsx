import React from 'react';
import { Property } from '../../types';
import { getColorScaleForParameter, formatParameterValue, getParameterDisplayName } from '../../utils';
import { useMapContext } from '../../context/MapContext';

interface ColorLegendProps {
    properties: Property[];
    className?: string;
}

export function ColorLegend({ properties, className = '' }: ColorLegendProps) {
    const { state } = useMapContext();

    if (properties.length === 0) return null;

    // For cross-parameter logic: color is based on the opposite parameter
    const colorParameter = state.viewConfig.colorParameter === 'availableSF' ? 'askingRate' : 'availableSF';
    const colorScale = getColorScaleForParameter(properties, colorParameter);

    // Create gradient stops
    const gradientStops = [
        { offset: '0%', color: colorScale.getColor(colorScale.min) },
        { offset: '25%', color: colorScale.getColor(colorScale.min + (colorScale.max - colorScale.min) * 0.25) },
        { offset: '50%', color: colorScale.getColor(colorScale.min + (colorScale.max - colorScale.min) * 0.5) },
        { offset: '75%', color: colorScale.getColor(colorScale.min + (colorScale.max - colorScale.min) * 0.75) },
        { offset: '100%', color: colorScale.getColor(colorScale.max) }
    ];

    // Get display names for both parameters
    const selectedParameterName = getParameterDisplayName(state.viewConfig.colorParameter);
    const colorParameterName = getParameterDisplayName(colorParameter);

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
                Color Scale: {colorParameterName}
            </h3>

            <div className="space-y-3">
                {/* Gradient bar */}
                <div className="relative h-4 rounded-md overflow-hidden">
                    <div
                        className="w-full h-full"
                        style={{
                            background: `linear-gradient(to right, ${gradientStops.map(stop => `${stop.color} ${stop.offset}`).join(', ')})`
                        }}
                    />
                </div>

                {/* Scale labels */}
                <div className="flex justify-between text-xs text-gray-600">
                    <span>{formatParameterValue(colorScale.min, colorParameter)}</span>
                    <span>{formatParameterValue(colorScale.max, colorParameter)}</span>
                </div>

                {/* Legend description */}
                <div className="text-xs text-gray-500">
                    <p>Marker size based on {selectedParameterName}</p>
                    <p>Color based on {colorParameterName} (Red = lower, Green = higher)</p>
                </div>
            </div>
        </div>
    );
}
