import React, { useEffect } from 'react';
import { MapProvider, useMapContext } from './context/MapContext';
import { MapContainer } from './components/Map';
import { PropertyListView } from './components/PropertyList';
import { ParameterSelector, CalloutToggle } from './components/Controls';
import { ErrorBoundary } from './components/common';
import { testProperties } from './data/testProperties';
import { usePropertyData } from './hooks';

function AppContent() {
    const { state } = useMapContext();
    const { filteredProperties } = usePropertyData({
        initialProperties: testProperties
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Parameter Filter */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Element Portal Map PoC
                            </h1>
                            <p className="text-sm text-gray-600">
                                Interactive property map with heat visualization
                            </p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-500">
                                {filteredProperties.length} properties
                            </div>
                            {/* Callout Toggle */}
                            <CalloutToggle />
                            {/* Parameter Filter - Top Right */}
                            <div className="w-64">
                                <ParameterSelector />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

                {/* Full Width Map */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        <div className="h-[600px]">
                            <MapContainer
                                properties={filteredProperties}
                                className="w-full h-full"
                                fitBounds={true}
                                colorParameter={state.viewConfig.colorParameter}
                            />
                        </div>
                    </div>
                </div>

                {/* Property Table Below Map */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <PropertyListView
                        properties={filteredProperties}
                        className="max-h-96 overflow-y-auto"
                    />
                </div>
            </div>

        </div>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <MapProvider>
                <AppContent />
            </MapProvider>
        </ErrorBoundary>
    );
}

export default App;
