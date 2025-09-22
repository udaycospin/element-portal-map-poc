import React from 'react';
import { useMapContext } from '../../context/MapContext';

interface ViewToggleProps {
    className?: string;
}

export function ViewToggle({ className = '' }: ViewToggleProps) {
    const { state, updateViewConfig } = useMapContext();

    const handleViewChange = (viewMode: 'list' | 'tiles') => {
        updateViewConfig({ viewMode });
    };

    return (
        <div className={`flex bg-gray-100 rounded-lg p-1 ${className}`}>
            <button
                onClick={() => handleViewChange('list')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${state.viewConfig.viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                </svg>
                List
            </button>

            <button
                onClick={() => handleViewChange('tiles')}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${state.viewConfig.viewMode === 'tiles'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
            >
                <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
                Tiles
            </button>
        </div>
    );
}
