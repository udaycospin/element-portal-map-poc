import { Property, ColorParameter } from '../types';
import {
    createPerformanceColorScale,
    getPerformanceBasedColor,
    createPropertyPerformanceScale,
    getPropertyPerformanceColor,
    PerformanceColorConfig
} from './colorUtils';

/**
 * Test data for performance-based color calculations
 */
const testProperties: Property[] = [
    {
        id: "1",
        name: "Subject Property",
        address: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        coordinates: { lat: 40.7128, lng: -74.0060 },
        rba: 100000,
        availableSF: 50000,
        askingRate: 25.00,
        buildingClass: "A",
        propertyType: "Office",
        yearBuilt: 2020,
        parkingSpaces: 100
    },
    {
        id: "2",
        name: "High Performer",
        address: "456 Oak Ave",
        city: "New York",
        state: "NY",
        zipCode: "10002",
        coordinates: { lat: 40.7200, lng: -74.0000 },
        rba: 150000,
        availableSF: 75000,
        askingRate: 35.00, // 40% higher than subject
        buildingClass: "A",
        propertyType: "Office",
        yearBuilt: 2021,
        parkingSpaces: 150
    },
    {
        id: "3",
        name: "Low Performer",
        address: "789 Pine St",
        city: "New York",
        state: "NY",
        zipCode: "10003",
        coordinates: { lat: 40.7000, lng: -74.0100 },
        rba: 50000,
        availableSF: 25000,
        askingRate: 15.00, // 40% lower than subject
        buildingClass: "B",
        propertyType: "Office",
        yearBuilt: 2018,
        parkingSpaces: 50
    },
    {
        id: "4",
        name: "Average Performer",
        address: "321 Elm St",
        city: "New York",
        state: "NY",
        zipCode: "10004",
        coordinates: { lat: 40.7300, lng: -73.9900 },
        rba: 100000,
        availableSF: 50000,
        askingRate: 25.00, // Same as subject
        buildingClass: "A",
        propertyType: "Office",
        yearBuilt: 2020,
        parkingSpaces: 100
    }
];

/**
 * Test performance-based color calculation for asking rate
 */
export function testAskingRatePerformance() {
    console.log('=== Testing Asking Rate Performance Colors ===');

    const subjectProperty = testProperties[0];
    const parameter: ColorParameter = 'askingRate';

    const config: PerformanceColorConfig = {
        subjectProperty,
        parameter,
        allProperties: testProperties,
        higherIsBetter: true
    };

    const results = testProperties.map(property => {
        const color = getPerformanceBasedColor(property, config);
        const performance = ((property.askingRate - subjectProperty.askingRate) / subjectProperty.askingRate * 100).toFixed(1);

        return {
            property: property.name,
            askingRate: property.askingRate,
            performance: `${performance}%`,
            color,
            isOutperforming: property.askingRate > subjectProperty.askingRate
        };
    });

    console.table(results);
    return results;
}

/**
 * Test performance-based color calculation for RBA
 */
export function testRBAPerformance() {
    console.log('=== Testing RBA Performance Colors ===');

    const subjectProperty = testProperties[0];
    const parameter: ColorParameter = 'rba';

    const config: PerformanceColorConfig = {
        subjectProperty,
        parameter,
        allProperties: testProperties,
        higherIsBetter: true
    };

    const results = testProperties.map(property => {
        const color = getPerformanceBasedColor(property, config);
        const performance = ((property.rba - subjectProperty.rba) / subjectProperty.rba * 100).toFixed(1);

        return {
            property: property.name,
            rba: property.rba.toLocaleString(),
            performance: `${performance}%`,
            color,
            isOutperforming: property.rba > subjectProperty.rba
        };
    });

    console.table(results);
    return results;
}

/**
 * Test performance-based color calculation for Available SF
 */
export function testAvailableSFPerformance() {
    console.log('=== Testing Available SF Performance Colors ===');

    const subjectProperty = testProperties[0];
    const parameter: ColorParameter = 'availableSF';

    const config: PerformanceColorConfig = {
        subjectProperty,
        parameter,
        allProperties: testProperties,
        higherIsBetter: true
    };

    const results = testProperties.map(property => {
        const color = getPerformanceBasedColor(property, config);
        const performance = ((property.availableSF - subjectProperty.availableSF) / subjectProperty.availableSF * 100).toFixed(1);

        return {
            property: property.name,
            availableSF: property.availableSF.toLocaleString(),
            performance: `${performance}%`,
            color,
            isOutperforming: property.availableSF > subjectProperty.availableSF
        };
    });

    console.table(results);
    return results;
}

/**
 * Test simplified performance color function
 */
export function testSimplifiedPerformanceColors() {
    console.log('=== Testing Simplified Performance Colors ===');

    const parameter: ColorParameter = 'askingRate';
    const subjectPropertyId = "1";

    const results = testProperties.map(property => {
        const color = getPropertyPerformanceColor(
            property,
            testProperties,
            parameter,
            subjectPropertyId,
            true
        );

        const subjectProperty = testProperties.find(p => p.id === subjectPropertyId)!;
        const performance = ((property.askingRate - subjectProperty.askingRate) / subjectProperty.askingRate * 100).toFixed(1);

        return {
            property: property.name,
            askingRate: property.askingRate,
            performance: `${performance}%`,
            color,
            isOutperforming: property.askingRate > subjectProperty.askingRate
        };
    });

    console.table(results);
    return results;
}

/**
 * Test color scale creation
 */
export function testColorScaleCreation() {
    console.log('=== Testing Color Scale Creation ===');

    const parameter: ColorParameter = 'askingRate';
    const subjectPropertyId = "1";

    const colorScale = createPropertyPerformanceScale(
        testProperties,
        parameter,
        subjectPropertyId,
        true
    );

    console.log('Color Scale:', {
        parameter,
        subjectPropertyId,
        minPerformance: colorScale.min,
        maxPerformance: colorScale.max
    });

    // Test color scale with different performance values
    const testValues = [-0.4, -0.2, 0, 0.2, 0.4]; // -40%, -20%, 0%, +20%, +40%
    const testColors = testValues.map(value => ({
        performance: `${(value * 100).toFixed(0)}%`,
        color: colorScale.getColor(value)
    }));

    console.table(testColors);

    return {
        colorScale,
        testColors
    };
}

/**
 * Test edge cases
 */
export function testEdgeCases() {
    console.log('=== Testing Edge Cases ===');

    // Test with single property
    const singleProperty = [testProperties[0]];
    const singlePropertyScale = createPropertyPerformanceScale(
        singleProperty,
        'askingRate',
        "1",
        true
    );

    console.log('Single Property Scale:', singlePropertyScale);

    // Test with zero values
    const zeroValueProperty: Property = {
        ...testProperties[0],
        askingRate: 0
    };

    const zeroValueConfig: PerformanceColorConfig = {
        subjectProperty: testProperties[0],
        parameter: 'askingRate',
        allProperties: [testProperties[0], zeroValueProperty],
        higherIsBetter: true
    };

    const zeroValueColor = getPerformanceBasedColor(zeroValueProperty, zeroValueConfig);
    console.log('Zero Value Color:', zeroValueColor);

    // Test with identical values
    const identicalProperties = [
        testProperties[0],
        { ...testProperties[0], id: "5", name: "Identical Property" }
    ];

    const identicalConfig: PerformanceColorConfig = {
        subjectProperty: identicalProperties[0],
        parameter: 'askingRate',
        allProperties: identicalProperties,
        higherIsBetter: true
    };

    const identicalColor = getPerformanceBasedColor(identicalProperties[1], identicalConfig);
    console.log('Identical Value Color:', identicalColor);

    return {
        singlePropertyScale,
        zeroValueColor,
        identicalColor
    };
}

/**
 * Run all tests
 */
export function runAllColorTests() {
    console.log('🎨 Running Performance-Based Color Tests');
    console.log('=====================================');

    const results = {
        askingRate: testAskingRatePerformance(),
        rba: testRBAPerformance(),
        availableSF: testAvailableSFPerformance(),
        simplified: testSimplifiedPerformanceColors(),
        colorScale: testColorScaleCreation(),
        edgeCases: testEdgeCases()
    };

    console.log('✅ All tests completed!');
    return results;
}

// Export test functions
export const colorUtilsTests = {
    testAskingRatePerformance,
    testRBAPerformance,
    testAvailableSFPerformance,
    testSimplifiedPerformanceColors,
    testColorScaleCreation,
    testEdgeCases,
    runAllColorTests
};
