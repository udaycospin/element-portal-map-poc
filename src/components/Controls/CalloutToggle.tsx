import React from 'react';
import { useMapContext } from '../../context/MapContext';

export function CalloutToggle() {
    const { state, updateViewConfig } = useMapContext();

    const handleToggle = () => {
        updateViewConfig({ showCallouts: !state.viewConfig.showCallouts });
    };

    return (
        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 px-3 py-2">
            <span className="text-sm font-medium text-gray-700">
                Callout Bubbles:
            </span>
            <button
                onClick={handleToggle}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${state.viewConfig.showCallouts
                    ? 'bg-blue-600'
                    : 'bg-gray-200'
                    }`}
                role="switch"
                aria-checked={state.viewConfig.showCallouts}
                aria-label="Toggle callout bubbles"
            >
                <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${state.viewConfig.showCallouts
                        ? 'translate-x-5'
                        : 'translate-x-1'
                        }`}
                />
            </button>
            <span className="text-xs text-gray-500">
                {state.viewConfig.showCallouts ? 'Always On' : 'Hover Only'}
            </span>
        </div>
    );
}
