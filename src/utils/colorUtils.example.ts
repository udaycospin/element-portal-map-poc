import { Property, ColorParameter } from '../types';
import {
    createPerformanceColorScale,
    getPerformanceBasedColor,
    createPropertyPerformanceScale,
    getPropertyPerformanceColor,
    PerformanceColorConfig
} from './colorUtils';

// Example usage of performance-based color utilities

/**
 * Example: Basic performance-based coloring
 */
export function basicPerformanceExample() {
    const properties: Property[] = [
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
            name: "Outperforming Property",
            address: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            coordinates: { lat: 40.7200, lng: -74.0000 },
            rba: 120000,
            availableSF: 60000,
            askingRate: 30.00, // Higher asking rate = outperforming
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2021,
            parkingSpaces: 120
        },
        {
            id: "3",
            name: "Underperforming Property",
            address: "789 Pine St",
            city: "New York",
            state: "NY",
            zipCode: "10003",
            coordinates: { lat: 40.7000, lng: -74.0100 },
            rba: 80000,
            availableSF: 40000,
            askingRate: 20.00, // Lower asking rate = underperforming
            buildingClass: "B",
            propertyType: "Office",
            yearBuilt: 2018,
            parkingSpaces: 80
        }
    ];

    const subjectProperty = properties[0]; // Subject property
    const parameter: ColorParameter = 'askingRate';

    // Method 1: Using the detailed configuration
    const config: PerformanceColorConfig = {
        subjectProperty,
        parameter,
        allProperties: properties,
        higherIsBetter: true // Higher asking rate is better
    };

    const colorScale = createPerformanceColorScale(config);

    // Get colors for each property
    const colors = properties.map(property => ({
        property: property.name,
        askingRate: property.askingRate,
        color: getPerformanceBasedColor(property, config),
        performance: ((property.askingRate - subjectProperty.askingRate) / subjectProperty.askingRate * 100).toFixed(1) + '%'
    }));

    console.log('Performance-based colors (Asking Rate):', colors);
    return colors;
}

/**
 * Example: Simplified performance-based coloring
 */
export function simplifiedPerformanceExample() {
    const properties: Property[] = [
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
            name: "Large Property",
            address: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            coordinates: { lat: 40.7200, lng: -74.0000 },
            rba: 150000, // Larger RBA = outperforming
            availableSF: 75000,
            askingRate: 30.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2021,
            parkingSpaces: 150
        },
        {
            id: "3",
            name: "Small Property",
            address: "789 Pine St",
            city: "New York",
            state: "NY",
            zipCode: "10003",
            coordinates: { lat: 40.7000, lng: -74.0100 },
            rba: 50000, // Smaller RBA = underperforming
            availableSF: 25000,
            askingRate: 20.00,
            buildingClass: "B",
            propertyType: "Office",
            yearBuilt: 2018,
            parkingSpaces: 50
        }
    ];

    const parameter: ColorParameter = 'rba';
    const subjectPropertyId = "1"; // Subject property ID

    // Method 2: Using the simplified function
    const colors = properties.map(property => ({
        property: property.name,
        rba: property.rba,
        color: getPropertyPerformanceColor(
            property,
            properties,
            parameter,
            subjectPropertyId,
            true // Higher RBA is better
        ),
        performance: ((property.rba - properties[0].rba) / properties[0].rba * 100).toFixed(1) + '%'
    }));

    console.log('Performance-based colors (RBA):', colors);
    return colors;
}

/**
 * Example: Different parameter types with different "better" directions
 */
export function differentParameterTypesExample() {
    const properties: Property[] = [
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
            name: "High Performance Property",
            address: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            coordinates: { lat: 40.7200, lng: -74.0000 },
            rba: 120000,
            availableSF: 60000,
            askingRate: 30.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2021,
            parkingSpaces: 120
        },
        {
            id: "3",
            name: "Low Performance Property",
            address: "789 Pine St",
            city: "New York",
            state: "NY",
            zipCode: "10003",
            coordinates: { lat: 40.7000, lng: -74.0100 },
            rba: 80000,
            availableSF: 40000,
            askingRate: 20.00,
            buildingClass: "B",
            propertyType: "Office",
            yearBuilt: 2018,
            parkingSpaces: 80
        }
    ];

    const subjectProperty = properties[0];
    const results: any = {};

    // Test different parameters
    const parameters: { param: ColorParameter; higherIsBetter: boolean; description: string }[] = [
        { param: 'askingRate', higherIsBetter: true, description: 'Higher asking rate is better' },
        { param: 'availableSF', higherIsBetter: true, description: 'More available SF is better' },
        { param: 'rba', higherIsBetter: true, description: 'Larger RBA is better' }
    ];

    parameters.forEach(({ param, higherIsBetter, description }) => {
        const config: PerformanceColorConfig = {
            subjectProperty,
            parameter: param,
            allProperties: properties,
            higherIsBetter
        };

        const colors = properties.map(property => ({
            property: property.name,
            value: property[param],
            color: getPerformanceBasedColor(property, config)
        }));

        results[param] = {
            description,
            colors
        };
    });

    console.log('Performance-based colors for different parameters:', results);
    return results;
}

/**
 * Example: Color scale creation for map visualization
 */
export function colorScaleForMapExample() {
    const properties: Property[] = [
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
            name: "Property A",
            address: "456 Oak Ave",
            city: "New York",
            state: "NY",
            zipCode: "10002",
            coordinates: { lat: 40.7200, lng: -74.0000 },
            rba: 120000,
            availableSF: 60000,
            askingRate: 30.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2021,
            parkingSpaces: 120
        },
        {
            id: "3",
            name: "Property B",
            address: "789 Pine St",
            city: "New York",
            state: "NY",
            zipCode: "10003",
            coordinates: { lat: 40.7000, lng: -74.0100 },
            rba: 80000,
            availableSF: 40000,
            askingRate: 20.00,
            buildingClass: "B",
            propertyType: "Office",
            yearBuilt: 2018,
            parkingSpaces: 80
        },
        {
            id: "4",
            name: "Property C",
            address: "321 Elm St",
            city: "New York",
            state: "NY",
            zipCode: "10004",
            coordinates: { lat: 40.7300, lng: -73.9900 },
            rba: 150000,
            availableSF: 75000,
            askingRate: 35.00,
            buildingClass: "A",
            propertyType: "Office",
            yearBuilt: 2022,
            parkingSpaces: 150
        }
    ];

    const parameter: ColorParameter = 'askingRate';
    const subjectPropertyId = "1";

    // Create color scale for map visualization
    const colorScale = createPropertyPerformanceScale(
        properties,
        parameter,
        subjectPropertyId,
        true // Higher asking rate is better
    );

    // Get colors for all properties
    const propertyColors = properties.map(property => ({
        id: property.id,
        name: property.name,
        askingRate: property.askingRate,
        color: getPropertyPerformanceColor(
            property,
            properties,
            parameter,
            subjectPropertyId,
            true
        )
    }));

    console.log('Color scale for map visualization:', {
        parameter,
        subjectPropertyId,
        minPerformance: colorScale.min,
        maxPerformance: colorScale.max,
        propertyColors
    });

    return {
        colorScale,
        propertyColors
    };
}

// Export all examples for testing
export const colorUtilsExamples = {
    basicPerformanceExample,
    simplifiedPerformanceExample,
    differentParameterTypesExample,
    colorScaleForMapExample
};
