# Performance-Based Color Utilities

This module provides comprehensive utilities for calculating marker colors based on property performance relative to a subject property using a red-to-green gradient scale.

## 🎨 Color Scale Logic

- **Red Colors**: Represent properties that **outperform** the subject property (better performance)
- **Green Colors**: Represent properties that **underperform** the subject property (worse performance)
- **Yellow Colors**: Represent properties with **similar performance** to the subject property

## 📊 Supported Parameters

- `askingRate`: Rental rate per square foot per year
- `availableSF`: Available square footage for lease
- `rba`: Rentable Building Area

## 🔧 Core Functions

### `createPerformanceColorScale(config)`

Creates a color scale for performance-based coloring.

```typescript
const config: PerformanceColorConfig = {
  subjectProperty: myProperty,
  parameter: 'askingRate',
  allProperties: allProperties,
  higherIsBetter: true
};

const colorScale = createPerformanceColorScale(config);
```

### `getPerformanceBasedColor(property, config)`

Gets the performance-based color for a specific property.

```typescript
const color = getPerformanceBasedColor(property, config);
// Returns: "#FF4444" (red for outperforming) or "#44FF44" (green for underperforming)
```

### `createPropertyPerformanceScale(properties, parameter, subjectPropertyId, higherIsBetter)`

Simplified function to create a performance color scale.

```typescript
const colorScale = createPropertyPerformanceScale(
  properties,
  'askingRate',
  'subject-property-id',
  true // Higher asking rate is better
);
```

### `getPropertyPerformanceColor(property, properties, parameter, subjectPropertyId, higherIsBetter)`

Simplified function to get performance-based color for a property.

```typescript
const color = getPropertyPerformanceColor(
  property,
  allProperties,
  'askingRate',
  'subject-property-id',
  true
);
```

## 🚀 Usage Examples

### Basic Usage

```typescript
import { getPropertyPerformanceColor } from './colorUtils';

// Get color for a property relative to subject
const color = getPropertyPerformanceColor(
  property,
  allProperties,
  'askingRate',
  'subject-property-id',
  true // Higher asking rate is better
);
```

### Advanced Usage

```typescript
import { createPerformanceColorScale, getPerformanceBasedColor } from './colorUtils';

const config: PerformanceColorConfig = {
  subjectProperty: subjectProperty,
  parameter: 'askingRate',
  allProperties: allProperties,
  higherIsBetter: true
};

// Create color scale
const colorScale = createPerformanceColorScale(config);

// Get color for specific property
const color = getPerformanceBasedColor(property, config);
```

### Map Integration

```typescript
// In MapContainer component
const markerColor = getPropertyPerformanceColor(
  property,
  properties,
  colorParameter,
  subjectPropertyId,
  true
);

const marker = new google.maps.Marker({
  position: property.coordinates,
  map,
  icon: {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: markerColor, // Performance-based color
    fillOpacity: 0.8,
    strokeColor: '#ffffff',
    strokeWeight: 2
  }
});
```

## 📈 Performance Calculation

The performance is calculated as a percentage difference from the subject property:

```typescript
// For parameters where higher is better (askingRate, availableSF, rba)
performance = (propertyValue - subjectValue) / subjectValue

// For parameters where lower is better (vacancy rate, etc.)
performance = (subjectValue - propertyValue) / subjectValue
```

## 🎯 Color Mapping

The performance percentage is mapped to colors using HSL color space:

- **Performance < 0** (underperforming): Green to Yellow gradient
- **Performance = 0** (same performance): Yellow
- **Performance > 0** (outperforming): Yellow to Red gradient

## 🧪 Testing

Run the test suite to see examples:

```typescript
import { runAllColorTests } from './colorUtils.test';

// Run all tests
const results = runAllColorTests();
```

## 🔍 Edge Cases

The utilities handle various edge cases:

- **Single Property**: Returns neutral color scale
- **Zero Values**: Returns gray color for invalid comparisons
- **Identical Values**: Returns yellow (neutral) color
- **Invalid Coordinates**: Logs warnings and skips properties

## 📝 TypeScript Interfaces

```typescript
interface PerformanceColorConfig {
  subjectProperty: Property;
  parameter: ColorParameter;
  allProperties: Property[];
  higherIsBetter?: boolean;
}

interface ColorScale {
  min: number;
  max: number;
  getColor: (value: number) => string;
}
```

## 🎨 Color Examples

| Performance | Color | Description |
|-------------|-------|-------------|
| +40% | `#FF4444` | Strongly outperforming (red) |
| +20% | `#FF8844` | Moderately outperforming (orange-red) |
| 0% | `#FFFF44` | Same performance (yellow) |
| -20% | `#88FF44` | Moderately underperforming (yellow-green) |
| -40% | `#44FF44` | Strongly underperforming (green) |

## 🔧 Configuration Options

### `higherIsBetter` Parameter

- `true`: Higher values are better (askingRate, availableSF, rba)
- `false`: Lower values are better (vacancy rate, operating expenses)

### Color Customization

The color utilities use HSL color space for smooth gradients:

- **Hue**: 0° (red) to 120° (green)
- **Saturation**: 85% (vibrant colors)
- **Lightness**: 55% (good contrast)

## 🚀 Integration with MapContainer

The MapContainer component supports performance-based coloring:

```typescript
<MapContainer
  properties={properties}
  usePerformanceColors={true}
  colorParameter="askingRate"
  subjectPropertyId="subject-property-id"
  className="w-full h-full"
/>
```

This will automatically color markers based on their performance relative to the subject property.
