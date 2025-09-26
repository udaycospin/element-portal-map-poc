import React from 'react';
import { ColorParameter } from '../../types';
import { getParameterDisplayName } from '../../utils';
import { useMapContext } from '../../context/MapContext';

interface ParameterSelectorProps {
    className?: string;
}

export function ParameterSelector({ className = '' }: ParameterSelectorProps) {
    const { state, updateViewConfig } = useMapContext();

    const parameters: ColorParameter[] = ['askingRate', 'availableSF'];

    const handleParameterChange = (parameter: ColorParameter) => {
        updateViewConfig({ colorParameter: parameter });
    };

    return (
        <div className={className}>
            <label htmlFor="parameter-select" className="block text-sm font-medium text-gray-700 mb-2">
                Color by Parameter
            </label>
            <select
                id="parameter-select"
                value={state.viewConfig.colorParameter}
                onChange={(e) => handleParameterChange(e.target.value as ColorParameter)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
                {parameters.map((parameter) => (
                    <option key={parameter} value={parameter}>
                        {getParameterDisplayName(parameter)}
                    </option>
                ))}
            </select>
        </div>
    );
}
