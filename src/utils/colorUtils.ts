import { Property, ColorParameter, ColorScale } from '../types';

/**
 * Converts HSL color to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Creates a color scale for the red-to-green gradient
 */
export function createColorScale(min: number, max: number): ColorScale {
    return {
        min,
        max,
        getColor: (value: number) => {
            // Normalize value between 0 and 1
            const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

            // Create red-to-green gradient
            // Red (0) -> Yellow (0.5) -> Green (1)
            let hue: number;
            if (normalized <= 0.5) {
                // Red to Yellow: 0 to 60 degrees
                hue = normalized * 2 * 60;
            } else {
                // Yellow to Green: 60 to 120 degrees
                hue = 60 + (normalized - 0.5) * 2 * 60;
            }

            // Use high saturation and medium lightness for vibrant colors
            return hslToHex(hue, 80, 50);
        }
    };
}

/**
 * Gets the color scale for a specific parameter
 */
export function getColorScaleForParameter(
    properties: Property[],
    parameter: ColorParameter
): ColorScale {
    const values = properties.map(prop => {
        switch (parameter) {
            case 'askingRate':
                return prop.askingRate;
            case 'availableSF':
                return prop.availableSF;
            default:
                return 0;
        }
    });

    const min = Math.min(...values);
    const max = Math.max(...values);

    return createColorScale(min, max);
}

/**
 * Gets the color for a specific property based on the parameter
 * Implements the new gradient system: Red = Outperforming, Green = Underperforming
 */
export function getPropertyColor(
    property: Property,
    parameter: ColorParameter,
    colorScale: ColorScale
): string {
    let value: number;

    switch (parameter) {
        case 'askingRate':
            value = property.askingRate;
            break;
        case 'availableSF':
            value = property.availableSF;
            break;
        default:
            value = 0;
    }

    // Calculate normalized position (0-1) within the range
    const normalizedValue = (value - colorScale.min) / (colorScale.max - colorScale.min);

    // Apply parameter-specific color logic
    let colorPosition: number;

    switch (parameter) {
        case 'askingRate':
            // Red = Lower asking rate (competitive threat), Green = Higher asking rate
            colorPosition = normalizedValue; // Lower values should be red, so don't invert
            break;
        case 'availableSF':
            // Red = More available space (competitive threat), Green = Less available space
            colorPosition = 1 - normalizedValue; // Invert so higher values are red
            break;
        default:
            colorPosition = normalizedValue;
    }

    // Clamp to 0-1 range
    colorPosition = Math.max(0, Math.min(1, colorPosition));

    // Convert to red-green gradient
    return getRedGreenGradientColor(colorPosition);
}

/**
 * Gets the color for a property using cross-parameter logic
 * If selectedParameter is 'availableSF', color is based on 'askingRate'
 * If selectedParameter is 'askingRate', color is based on 'availableSF'
 */
export function getPropertyColorCrossParameter(
    property: Property,
    selectedParameter: ColorParameter,
    properties: Property[]
): string {
    // Determine which parameter to use for coloring (opposite of selected)
    const colorParameter: ColorParameter = selectedParameter === 'availableSF' ? 'askingRate' : 'availableSF';
    
    // Get color scale for the color parameter
    const colorScale = getColorScaleForParameter(properties, colorParameter);
    
    // Get the color using the cross-parameter
    return getPropertyColor(property, colorParameter, colorScale);
}

/**
 * Configuration for consistent marker sizing
 */
export interface MarkerSizeConfig {
    /** Minimum marker size in pixels */
    minSize: number;
    /** Maximum marker size in pixels */
    maxSize: number;
    /** Client property baseline size */
    clientSize: number;
}

/**
 * Default marker size configuration
 */
export const DEFAULT_MARKER_SIZE_CONFIG: MarkerSizeConfig = {
    minSize: 15,
    maxSize: 80,
    clientSize: 40
};

/**
 * Gets normalized marker size for a property using consistent scaling across parameters
 * Uses min-max normalization to ensure consistent visual scaling regardless of parameter
 */
export function getNormalizedMarkerSize(
    property: Property,
    parameter: ColorParameter,
    properties: Property[],
    clientPropertyId: string,
    config: MarkerSizeConfig = DEFAULT_MARKER_SIZE_CONFIG
): number {
    const isClientProperty = property.id === clientPropertyId;
    
    if (isClientProperty) {
        return config.clientSize;
    }

    // Get all values for the parameter to determine min/max range
    const values = properties.map(prop => {
        const value = parameter === 'askingRate' ? prop.askingRate : prop.availableSF;
        // Filter out zero values for asking rate (missing data)
        return parameter === 'askingRate' && value === 0 ? null : value;
    }).filter(v => v !== null) as number[];

    if (values.length === 0) {
        return config.minSize;
    }

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const propertyValue = parameter === 'askingRate' ? property.askingRate : property.availableSF;

    // Handle edge cases
    if (maxValue === minValue || propertyValue === 0) {
        return config.minSize;
    }

    // Normalize the property value between 0 and 1
    const normalizedValue = (propertyValue - minValue) / (maxValue - minValue);
    
    // Map normalized value to size range
    const sizeRange = config.maxSize - config.minSize;
    const calculatedSize = config.minSize + (normalizedValue * sizeRange);
    const finalSize = Math.max(config.minSize, Math.min(config.maxSize, calculatedSize));

    // Debug logging for size calculation
    console.log(`Normalized size calculation for property ${property.id}:
        Parameter: ${parameter}
        Property value: ${propertyValue}
        Min value: ${minValue}
        Max value: ${maxValue}
        Normalized: ${normalizedValue.toFixed(3)}
        Final size: ${finalSize.toFixed(1)}px`);

    return finalSize;
}

/**
 * Converts a position (0-1) to a red-green gradient color
 * 0 = Red (outperforming), 1 = Green (underperforming)
 */
function getRedGreenGradientColor(position: number): string {
    // 5-level gradient scale for nuanced comparison
    const levels = [
        { pos: 0.0, color: '#FF0000' }, // Red
        { pos: 0.25, color: '#FF8000' }, // Orange-Red
        { pos: 0.5, color: '#FFFF00' }, // Yellow
        { pos: 0.75, color: '#80FF00' }, // Yellow-Green
        { pos: 1.0, color: '#00FF00' }  // Green
    ];

    // Find the two levels to interpolate between
    let lowerLevel = levels[0];
    let upperLevel = levels[levels.length - 1];

    for (let i = 0; i < levels.length - 1; i++) {
        if (position >= levels[i].pos && position <= levels[i + 1].pos) {
            lowerLevel = levels[i];
            upperLevel = levels[i + 1];
            break;
        }
    }

    // Interpolate between the two colors
    const ratio = (position - lowerLevel.pos) / (upperLevel.pos - lowerLevel.pos);
    return interpolateColor(lowerLevel.color, upperLevel.color, ratio);
}

/**
 * Interpolates between two hex colors
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);

    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);

    const r = Math.round(r1 + (r2 - r1) * ratio);
    const g = Math.round(g1 + (g2 - g1) * ratio);
    const b = Math.round(b1 + (b2 - b1) * ratio);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Formats a number for display based on the parameter type
 */
export function formatParameterValue(value: number, parameter: ColorParameter): string {
    switch (parameter) {
        case 'askingRate':
            return `$${value.toFixed(2)}/SF`;
        case 'availableSF':
            return `${value.toLocaleString()} SF`;
        default:
            return value.toString();
    }
}

/**
 * Gets the display name for a parameter
 */
export function getParameterDisplayName(parameter: ColorParameter): string {
    switch (parameter) {
        case 'askingRate':
            return 'Asking Rate';
        case 'availableSF':
            return 'Available SF';
        default:
            return parameter;
    }
}

/**
 * Performance-based color calculation interface
 */
export interface PerformanceColorConfig {
    /** The subject property to compare against */
    subjectProperty: Property;
    /** The parameter to analyze */
    parameter: ColorParameter;
    /** All properties in the dataset */
    allProperties: Property[];
    /** Whether higher values are better (true) or lower values are better (false) */
    higherIsBetter?: boolean;
}

/**
 * Calculates marker colors based on property performance relative to a subject property
 * Red = Outperforming the subject (better performance)
 * Green = Underperforming the subject (worse performance)
 * 
 * @param config Configuration for performance-based coloring
 * @returns Color scale that maps property values to performance-based colors
 */
export function createPerformanceColorScale(config: PerformanceColorConfig): ColorScale {
    const { subjectProperty, parameter, allProperties, higherIsBetter = true } = config;

    // Get the subject property's value for the parameter
    const subjectValue = getPropertyValue(subjectProperty, parameter);

    // Get all property values for the parameter
    const allValues = allProperties.map(prop => getPropertyValue(prop, parameter));

    // Calculate performance relative to subject
    const performanceValues = allValues.map(value => {
        if (subjectValue === 0) return 0; // Avoid division by zero

        if (higherIsBetter) {
            // For parameters where higher is better (like asking rate)
            // Positive values = outperforming, negative = underperforming
            return (value - subjectValue) / subjectValue;
        } else {
            // For parameters where lower is better (like vacancy rate)
            // Positive values = underperforming, negative = outperforming
            return (subjectValue - value) / subjectValue;
        }
    });

    // Find the range of performance values
    const minPerformance = Math.min(...performanceValues);
    const maxPerformance = Math.max(...performanceValues);

    return {
        min: minPerformance,
        max: maxPerformance,
        getColor: (performanceValue: number) => {
            // Normalize performance value between 0 and 1
            const normalized = Math.max(0, Math.min(1,
                (performanceValue - minPerformance) / (maxPerformance - minPerformance)
            ));

            // Create red-to-green gradient based on performance
            // Red (0) = underperforming, Green (1) = outperforming
            // But we want Red = outperforming, Green = underperforming
            // So we invert the normalized value
            const invertedNormalized = 1 - normalized;

            let hue: number;
            if (invertedNormalized <= 0.5) {
                // Red to Yellow: 0 to 60 degrees (outperforming)
                hue = invertedNormalized * 2 * 60;
            } else {
                // Yellow to Green: 60 to 120 degrees (underperforming)
                hue = 60 + (invertedNormalized - 0.5) * 2 * 60;
            }

            // Use high saturation and medium lightness for vibrant colors
            return hslToHex(hue, 85, 55);
        }
    };
}

/**
 * Gets the performance-based color for a property relative to a subject property
 * 
 * @param property The property to get the color for
 * @param config Performance color configuration
 * @returns Hex color string
 */
export function getPerformanceBasedColor(
    property: Property,
    config: PerformanceColorConfig
): string {
    const colorScale = createPerformanceColorScale(config);
    const propertyValue = getPropertyValue(property, config.parameter);
    const subjectValue = getPropertyValue(config.subjectProperty, config.parameter);

    if (subjectValue === 0) return '#808080'; // Gray for invalid comparison

    let performanceValue: number;
    if (config.higherIsBetter) {
        performanceValue = (propertyValue - subjectValue) / subjectValue;
    } else {
        performanceValue = (subjectValue - propertyValue) / subjectValue;
    }

    return colorScale.getColor(performanceValue);
}

/**
 * Helper function to get property value for a given parameter
 */
function getPropertyValue(property: Property, parameter: ColorParameter): number {
    switch (parameter) {
        case 'askingRate':
            return property.askingRate;
        case 'availableSF':
            return property.availableSF;
        default:
            return 0;
    }
}

/**
 * Creates a performance-based color scale for multiple properties
 * 
 * @param properties Array of properties to analyze
 * @param parameter The parameter to analyze
 * @param subjectPropertyId ID of the subject property (optional, uses first property if not provided)
 * @param higherIsBetter Whether higher values are better for this parameter
 * @returns Color scale for performance-based coloring
 */
export function createPropertyPerformanceScale(
    properties: Property[],
    parameter: ColorParameter,
    subjectPropertyId?: string,
    higherIsBetter: boolean = true
): ColorScale {
    if (properties.length === 0) {
        return createColorScale(0, 1);
    }

    const subjectProperty = subjectPropertyId
        ? properties.find(p => p.id === subjectPropertyId) || properties[0]
        : properties[0];

    return createPerformanceColorScale({
        subjectProperty,
        parameter,
        allProperties: properties,
        higherIsBetter
    });
}

/**
 * Gets performance-based color for a property with simplified parameters
 * 
 * @param property The property to get the color for
 * @param properties All properties in the dataset
 * @param parameter The parameter to analyze
 * @param subjectPropertyId ID of the subject property
 * @param higherIsBetter Whether higher values are better
 * @returns Hex color string
 */
export function getPropertyPerformanceColor(
    property: Property,
    properties: Property[],
    parameter: ColorParameter,
    subjectPropertyId?: string,
    higherIsBetter: boolean = true
): string {
    const subjectProperty = subjectPropertyId
        ? properties.find(p => p.id === subjectPropertyId) || properties[0]
        : properties[0];

    return getPerformanceBasedColor(property, {
        subjectProperty,
        parameter,
        allProperties: properties,
        higherIsBetter
    });
}

/**
 * Converts a hex color to HSL values
 */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    // Remove the hash if present
    hex = hex.replace('#', '');

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Generates a lighter version of a given hex color for border/stroke use
 * @param hexColor - The base hex color (e.g., '#FF0000')
 * @param lightnessIncrease - How much to increase lightness (default: 30%)
 * @returns Lighter hex color for border use
 */
export function getLighterColor(hexColor: string, lightnessIncrease: number = 30): string {
    const { h, s, l } = hexToHsl(hexColor);

    // Increase lightness while maintaining the same hue and saturation
    const newLightness = Math.min(100, l + lightnessIncrease);

    // Optionally reduce saturation slightly for a softer border effect
    const newSaturation = Math.max(20, s * 0.7); // Reduce saturation by 30%

    return hslToHex(h, newSaturation, newLightness);
}
