import { Property, ColorParameter } from '../../types';

export class PropertyCalloutOverlay {
    private property: Property;
    private isVisible: boolean;
    private onClose: () => void;
    private div: HTMLDivElement | null = null;
    private map: google.maps.Map | null = null;
    private colorParameter: ColorParameter;
    private zoomListener: google.maps.MapsEventListener | null = null;
    private boundsListener: google.maps.MapsEventListener | null = null;
    private updateTimeout: number | null = null;

    constructor(property: Property, isVisible: boolean, onClose: () => void, colorParameter: ColorParameter = 'availableSF') {
        this.property = property;
        this.isVisible = isVisible;
        this.onClose = onClose;
        this.colorParameter = colorParameter;
    }

    setMap(map: google.maps.Map | null) {
        this.map = map;
        if (map) {
            this.createCallout();
        } else {
            this.removeCallout();
        }
    }

    private createCallout() {
        if (!this.map) {
            console.log('PropertyCalloutOverlay: No map available for', this.property.name);
            return;
        }

        console.log('PropertyCalloutOverlay: Creating callout for', this.property.name);
        this.div = document.createElement('div');
        this.div.style.position = 'absolute';
        this.div.style.zIndex = '1000';
        this.div.style.pointerEvents = 'none'; // Prevent interference with marker hover
        this.div.style.display = this.isVisible ? 'block' : 'none'; // Respect initial visibility

        this.renderCallout();

        // Add to map container
        const mapContainer = this.map.getDiv();
        mapContainer.appendChild(this.div);
        console.log('PropertyCalloutOverlay: Callout div added to map container for', this.property.name);

        // Add map event listeners to update position on zoom/pan
        this.addMapListeners();
    }

    private removeCallout() {
        // Remove map listeners
        this.removeMapListeners();

        if (this.div && this.div.parentNode) {
            this.div.parentNode.removeChild(this.div);
            this.div = null;
        }
    }

    private addMapListeners() {
        if (!this.map) return;

        // Listen for zoom changes
        this.zoomListener = this.map.addListener('zoom_changed', () => {
            if (this.isVisible) {
                this.updatePosition();
            }
        });

        // Listen for bounds changes (pan/zoom) with throttling
        this.boundsListener = this.map.addListener('bounds_changed', () => {
            if (this.isVisible) {
                // Throttle position updates to avoid excessive calls during smooth pan/zoom
                if (this.updateTimeout) {
                    clearTimeout(this.updateTimeout);
                }
                this.updateTimeout = setTimeout(() => {
                    this.updatePosition();
                }, 50); // 50ms throttle
            }
        });
    }

    private removeMapListeners() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = null;
        }
        if (this.zoomListener) {
            google.maps.event.removeListener(this.zoomListener);
            this.zoomListener = null;
        }
        if (this.boundsListener) {
            google.maps.event.removeListener(this.boundsListener);
            this.boundsListener = null;
        }
    }

    private updatePosition() {
        if (!this.div || !this.map) {
            return;
        }

        // Use a much simpler approach with map projection
        const bounds = this.map.getBounds();
        if (!bounds) {
            // Map not ready, try again later
            setTimeout(() => this.updatePosition(), 500);
            return;
        }

        // Get the map's projection
        const projection = this.map.getProjection();
        if (!projection) {
            setTimeout(() => this.updatePosition(), 500);
            return;
        }

        try {
            // Convert lat/lng to world coordinates, then to pixel coordinates
            const latLng = new google.maps.LatLng(this.property.coordinates.lat, this.property.coordinates.lng);
            const worldCoordinate = projection.fromLatLngToPoint(latLng);

            if (!worldCoordinate) {
                return;
            }

            // Get current map bounds and zoom
            const mapBounds = this.map.getBounds()!;
            const ne = mapBounds.getNorthEast();
            const sw = mapBounds.getSouthWest();

            // Convert world coordinates to pixel coordinates
            const mapDiv = this.map.getDiv();
            const mapWidth = mapDiv.clientWidth;
            const mapHeight = mapDiv.clientHeight;

            // Get corner points for coordinate conversion
            const nePoint = projection.fromLatLngToPoint(ne);
            const swPoint = projection.fromLatLngToPoint(sw);

            if (!nePoint || !swPoint) {
                return;
            }

            // Calculate pixel position
            const pixelX = (worldCoordinate.x - swPoint.x) / (nePoint.x - swPoint.x) * mapWidth;
            const pixelY = (worldCoordinate.y - nePoint.y) / (swPoint.y - nePoint.y) * mapHeight;

            // Position the callout
            const calloutWidth = 170;
            const calloutHeight = 60;

            let left = pixelX - (calloutWidth / 2);
            let top = pixelY - calloutHeight - 10;

            // Keep within bounds
            left = Math.max(5, Math.min(left, mapWidth - calloutWidth - 5));
            if (top < 5) {
                top = pixelY + 30; // Show below marker if no space above
            }
            top = Math.max(5, Math.min(top, mapHeight - calloutHeight - 5));

            // Apply position
            this.div.style.left = left + 'px';
            this.div.style.top = top + 'px';
            this.div.style.transform = 'none';

        } catch (error) {
            console.error('PropertyCalloutOverlay: Error positioning callout:', error);
        }
    }

    updateVisibility(isVisible: boolean) {
        this.isVisible = isVisible;
        console.log('CALLOUT VISIBILITY:', this.property.name, 'Setting to:', isVisible);
        if (this.div) {
            if (isVisible) {
                this.updatePosition();
                this.div.style.display = 'block';
                console.log('CALLOUT DISPLAY:', this.property.name, 'Set to block');
            } else {
                this.div.style.display = 'none';
                console.log('CALLOUT DISPLAY:', this.property.name, 'Set to none');
            }
        } else {
            console.log('CALLOUT ERROR:', this.property.name, 'No div element found');
        }
    }

    updateColorParameter(colorParameter: ColorParameter) {
        this.colorParameter = colorParameter;
        if (this.div) {
            this.renderCallout(); // Re-render with new parameter
        }
    }

    private renderCallout() {
        if (!this.div) return;

        // Get the parameter label and value
        const getParameterInfo = () => {
            switch (this.colorParameter) {
                case 'askingRate':
                    return {
                        label: 'Asking Rate',
                        value: this.property.askingRate > 0
                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.property.askingRate)
                            : 'N/A'
                    };
                case 'availableSF':
                    return {
                        label: 'Available SF',
                        value: new Intl.NumberFormat('en-US').format(this.property.availableSF) + ' SF'
                    };
                case 'rba':
                    return {
                        label: 'RBA',
                        value: new Intl.NumberFormat('en-US').format(this.property.rba) + ' SF'
                    };
                default:
                    return {
                        label: 'Available SF',
                        value: new Intl.NumberFormat('en-US').format(this.property.availableSF) + ' SF'
                    };
            }
        };

        const paramInfo = getParameterInfo();

        this.div.innerHTML = `
            <div style="background: white; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; padding: 8px 12px; min-width: 140px; max-width: 200px; position: relative; font-family: system-ui, -apple-system, sans-serif;">
                <!-- Arrow pointing down -->
                <div style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 100%);">
                    <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid white;"></div>
                    <div style="position: absolute; top: 0; left: 50%; transform: translate(-50%, -1px);">
                        <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid #e5e7eb;"></div>
                    </div>
                </div>

                <!-- Property name -->
                <div style="font-weight: 600; color: #111827; font-size: 13px; line-height: 1.2; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${this.property.name}
                </div>

                <!-- Parameter value -->
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 11px; font-weight: 500; color: #6b7280;">${paramInfo.label}:</span>
                    <span style="font-size: 12px; font-weight: 600; color: #111827;">
                        ${paramInfo.value}
                    </span>
                </div>
            </div>
        `;

        this.div.className = 'callout-container';
        this.div.style.display = this.isVisible ? 'block' : 'none'; // Respect visibility state
    }
}
