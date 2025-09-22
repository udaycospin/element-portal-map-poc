import React, { useEffect, useRef } from 'react';
import { Property, ColorParameter } from '../../types';
import { formatParameterValue, getParameterDisplayName } from '../../utils';

interface PropertyInfoWindowProps {
  property: Property;
  map: google.maps.Map;
  colorParameter: ColorParameter;
  /** Whether to show the info window immediately */
  autoOpen?: boolean;
  /** Callback when info window is opened */
  onOpen?: () => void;
  /** Callback when info window is closed */
  onClose?: () => void;
}

export function PropertyInfoWindow({
  property,
  map,
  colorParameter,
  autoOpen = false,
  onOpen,
  onClose
}: PropertyInfoWindowProps) {
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  useEffect(() => {
    if (!map) return;

    const infoWindow = new google.maps.InfoWindow({
      content: createInfoWindowContent(property, colorParameter),
      maxWidth: 400,
      pixelOffset: new google.maps.Size(0, -10)
    });

    // Add event listeners
    infoWindow.addListener('closeclick', () => {
      onClose?.();
    });

    infoWindow.addListener('domready', () => {
      onOpen?.();
    });

    infoWindowRef.current = infoWindow;

    // Auto-open if requested
    if (autoOpen) {
      openInfoWindow();
    }

    return () => {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [map, property, colorParameter, autoOpen, onOpen, onClose]);

  const createInfoWindowContent = (property: Property, param: ColorParameter) => {
    const value = param === 'askingRate' ? property.askingRate :
      param === 'availableSF' ? property.availableSF : property.rba;

    // Format currency values
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    };

    // Format large numbers
    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US').format(num);
    };

    // Get building class color
    const getBuildingClassColor = (buildingClass: string) => {
      switch (buildingClass) {
        case 'A': return '#10B981'; // Green
        case 'B': return '#F59E0B'; // Yellow
        case 'C': return '#EF4444'; // Red
        default: return '#6B7280'; // Gray
      }
    };

    // Calculate age
    const currentYear = new Date().getFullYear();
    const age = currentYear - property.yearBuilt;

    return `
      <div class="property-info-window" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <!-- Header with Image -->
        <div class="relative">
          ${property.imageUrl ? `
            <div class="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
              <img 
                src="${property.imageUrl}" 
                alt="${property.name}"
                class="w-full h-full object-cover"
                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
              />
              <div class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold" style="display: none;">
                ${property.name.charAt(0)}
              </div>
            </div>
          ` : `
            <div class="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold rounded-t-lg">
              ${property.name.charAt(0)}
            </div>
          `}
          
          <!-- Building Class Badge -->
          <div class="absolute top-3 right-3">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white" 
                  style="background-color: ${getBuildingClassColor(property.buildingClass)};">
              Class ${property.buildingClass}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-4">
          <!-- Property Name and Address -->
          <div class="mb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-1">${property.name}</h3>
            <p class="text-sm text-gray-600 mb-1">${property.address}</p>
            <p class="text-sm text-gray-500">${property.city}, ${property.state} ${property.zipCode}</p>
          </div>

          <!-- Key Stats Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">${getParameterDisplayName(param)}</div>
              <div class="text-lg font-semibold text-gray-900">
                ${param === 'askingRate' ? formatCurrency(value) : `${formatNumber(value)} SF`}
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Available SF</div>
              <div class="text-lg font-semibold text-gray-900">${formatNumber(property.availableSF)} SF</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Total RBA</div>
              <div class="text-lg font-semibold text-gray-900">${formatNumber(property.rba)} SF</div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-3">
              <div class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Year Built</div>
              <div class="text-lg font-semibold text-gray-900">${property.yearBuilt} (${age} years)</div>
            </div>
          </div>

          <!-- Property Details -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-700">Property Type</span>
              <span class="text-sm text-gray-900">${property.propertyType}</span>
            </div>
            
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-700">Parking Spaces</span>
              <span class="text-sm text-gray-900">${formatNumber(property.parkingSpaces)}</span>
            </div>
            
            <div class="flex justify-between items-center py-2">
              <span class="text-sm font-medium text-gray-700">Utilization</span>
              <span class="text-sm text-gray-900">
                ${((property.availableSF / property.rba) * 100).toFixed(1)}% Available
              </span>
            </div>
          </div>

          <!-- Description -->
          ${property.description ? `
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p class="text-sm text-gray-600 leading-relaxed">${property.description}</p>
            </div>
          ` : ''}

          <!-- Action Buttons -->
          <div class="mt-4 flex space-x-2">
            <button 
              onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${property.coordinates.lat},${property.coordinates.lng}', '_blank')"
              class="flex-1 bg-blue-600 text-white text-sm font-medium py-2 px-3 rounded-md hover:bg-blue-700 transition-colors">
              Get Directions
            </button>
            <button 
              onclick="navigator.clipboard.writeText('${property.address}, ${property.city}, ${property.state} ${property.zipCode}')"
              class="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-3 rounded-md hover:bg-gray-200 transition-colors">
              Copy Address
            </button>
          </div>
        </div>
      </div>
    `;
  };

  const openInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.setPosition(property.coordinates);
      infoWindowRef.current.open(map);
    }
  };

  const closeInfoWindow = () => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }
  };

  return {
    openInfoWindow,
    closeInfoWindow,
    infoWindow: infoWindowRef.current
  };
}
