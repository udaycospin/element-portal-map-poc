// Test function to validate marker creation logic
export function validateMarkerCreation() {
    console.log('=== MARKER CREATION VALIDATION ===');

    // Test 1: Check if Google Maps is loaded
    console.log('Test 1 - Google Maps API:', {
        google: typeof google !== 'undefined',
        maps: typeof google?.maps !== 'undefined',
        marker: typeof google?.maps?.Marker !== 'undefined',
        advancedMarker: typeof google?.maps?.marker?.AdvancedMarkerElement !== 'undefined'
    });

    // Test 2: Check test properties
    const testProperties = [
        {
            id: "test1",
            name: "Test Property 1",
            coordinates: { lat: 30.2672, lng: -97.7431 },
            askingRate: 15.00,
            availableSF: 100000,
            rba: 100000
        },
        {
            id: "test2",
            name: "Test Property 2",
            coordinates: { lat: 30.3000, lng: -97.8000 },
            askingRate: 20.00,
            availableSF: 200000,
            rba: 200000
        }
    ];

    console.log('Test 2 - Test Properties:', testProperties);

    // Test 3: Simple color test (skip complex import for now)
    console.log('Test 3 - Skipping color calculation test for now');

    // Test 4: Check marker content creation
    try {
        function createMarkerContent(size: number, color: string): HTMLElement {
            const element = document.createElement('div');
            element.style.width = `${size}px`;
            element.style.height = `${size}px`;
            element.style.borderRadius = '50%';
            element.style.backgroundColor = color;
            element.style.border = '2px solid #ffffff';
            element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
            element.style.cursor = 'pointer';
            return element;
        }

        const testContent = createMarkerContent(30, '#FF0000');
        console.log('Test 4 - Marker Content:', testContent);
        console.log('Test 4 - Content styles:', {
            width: testContent.style.width,
            height: testContent.style.height,
            backgroundColor: testContent.style.backgroundColor
        });
    } catch (error) {
        console.error('Test 4 - Marker content creation error:', error);
    }

    console.log('=== VALIDATION COMPLETE ===');
}

// Auto-run validation when this module is loaded
if (typeof window !== 'undefined') {
    setTimeout(validateMarkerCreation, 1000); // Wait 1 second for Google Maps to load
}
