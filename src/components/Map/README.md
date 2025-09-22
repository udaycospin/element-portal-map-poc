# Enhanced Property Markers with Info Windows

This module provides comprehensive property marker functionality with detailed information windows, hover effects, and synchronization with list view highlighting.

## 🎯 Key Features

### **Enhanced Property Markers**
- **Detailed Info Windows**: Rich property information with images, stats, and actions
- **Hover Effects**: Visual feedback with marker size and opacity changes
- **Click Interactions**: Open detailed info windows with property data
- **Performance-Based Colors**: Red-to-green gradient based on property performance
- **List View Sync**: Markers highlight when properties are selected/hovered in list view

### **Information Window Features**
- **Property Images**: High-quality property photos with fallback gradients
- **Key Statistics**: Formatted financial and property data
- **Building Class Badges**: Color-coded building quality indicators
- **Interactive Actions**: Get directions and copy address functionality
- **Responsive Design**: Optimized for all screen sizes

## 🎨 Visual Enhancements

### **Marker States**
- **Default**: 8px scale, 80% opacity, 2px stroke
- **Hovered**: 10px scale, 90% opacity, 3px stroke
- **Selected**: 12px scale, 100% opacity, 4px stroke

### **Color Coding**
- **Performance Colors**: Red (outperforming) to Green (underperforming)
- **Building Classes**: Green (A), Yellow (B), Red (C)
- **Default Colors**: Blue markers for standard display

## 🔧 Component Usage

### **Basic MapContainer Usage**

```typescript
import { MapContainer } from './components/Map';

<MapContainer
  properties={properties}
  className="w-full h-full"
  colorParameter="askingRate"
  fitBounds={true}
/>
```

### **Advanced MapContainer Usage**

```typescript
<MapContainer
  properties={properties}
  className="w-full h-full"
  initialCenter={{ lat: 40.7128, lng: -74.0060 }}
  initialZoom={11}
  fitBounds={true}
  colorParameter="askingRate"
  usePerformanceColors={true}
  subjectPropertyId="subject-property-id"
  onPropertyClick={(property) => console.log('Clicked:', property)}
  onPropertyHover={(property) => setHoveredProperty(property)}
/>
```

### **PropertyInfoWindow Usage**

```typescript
import { PropertyInfoWindow } from './components/Map';

const infoWindow = PropertyInfoWindow({
  property: myProperty,
  map: mapInstance,
  colorParameter: 'askingRate',
  autoOpen: true,
  onOpen: () => console.log('Info window opened'),
  onClose: () => console.log('Info window closed')
});

// Open/close programmatically
infoWindow.openInfoWindow();
infoWindow.closeInfoWindow();
```

## 📊 Information Window Content

### **Header Section**
- **Property Image**: High-resolution property photo
- **Fallback Gradient**: Colorful gradient with property initial
- **Building Class Badge**: Color-coded quality indicator

### **Key Statistics Grid**
- **Primary Parameter**: Highlighted based on selected color parameter
- **Available SF**: Current available square footage
- **Total RBA**: Rentable Building Area
- **Year Built**: Construction year with age calculation

### **Property Details**
- **Property Type**: Office, Industrial, Retail, etc.
- **Parking Spaces**: Number of parking spots
- **Utilization**: Percentage of available space

### **Interactive Actions**
- **Get Directions**: Opens Google Maps with directions
- **Copy Address**: Copies full address to clipboard

## 🎭 Hover Effects & Synchronization

### **Marker Hover Effects**
```typescript
// Automatic hover effects
marker.addListener('mouseover', () => {
  marker.setIcon({
    path: google.maps.SymbolPath.CIRCLE,
    scale: 10, // Larger on hover
    fillColor: markerColor,
    fillOpacity: 0.9,
    strokeColor: '#ffffff',
    strokeWeight: 3
  });
});
```

### **List View Synchronization**
- **Selected Property**: Marker scales to 12px with full opacity
- **Hovered Property**: Marker scales to 10px with 90% opacity
- **Default State**: Marker scales to 8px with 80% opacity

### **State Management**
```typescript
// Sync with global state
useEffect(() => {
  markersRef.current.forEach(marker => {
    const property = findPropertyByMarker(marker);
    const isSelected = state.selectedProperty?.id === property.id;
    const isHovered = state.hoveredProperty?.id === property.id;
    
    // Update marker appearance based on state
    updateMarkerAppearance(marker, isSelected, isHovered);
  });
}, [state.selectedProperty, state.hoveredProperty]);
```

## 🎨 Styling & Customization

### **Info Window Styling**
- **Modern Design**: Clean, professional appearance
- **Responsive Layout**: Adapts to different screen sizes
- **Color Coding**: Consistent with application theme
- **Typography**: System fonts for optimal readability

### **Marker Customization**
```typescript
// Custom marker styling
const marker = new google.maps.Marker({
  position: coordinates,
  map,
  icon: {
    path: google.maps.SymbolPath.CIRCLE,
    scale: 8,
    fillColor: '#3B82F6',
    fillOpacity: 0.8,
    strokeColor: '#ffffff',
    strokeWeight: 2
  },
  animation: google.maps.Animation.DROP
});
```

## 🔄 Performance Optimizations

### **Efficient Rendering**
- **Marker Pooling**: Reuse marker instances when possible
- **Info Window Management**: Single info window per property
- **Event Cleanup**: Proper removal of event listeners
- **Memory Management**: Clear references on component unmount

### **State Updates**
- **Debounced Updates**: Prevent excessive re-renders
- **Selective Updates**: Only update changed markers
- **Batch Operations**: Group related updates together

## 🧪 Testing & Examples

### **Example Component**
```typescript
import { MapContainerExample } from './MapContainer.example';

// Full-featured example with controls
<MapContainerExample />
```

### **Test Scenarios**
- **Property Selection**: Click markers to open info windows
- **Hover Effects**: Mouse over markers for visual feedback
- **List Sync**: Select properties in list view
- **Performance Colors**: Toggle performance-based coloring
- **Responsive Design**: Test on different screen sizes

## 🚀 Integration Points

### **Context Integration**
- **MapContext**: Global state management
- **Property Selection**: Synchronized across components
- **Color Parameters**: Dynamic color scheme updates

### **Event Handling**
- **Click Events**: Property selection and info window display
- **Hover Events**: Visual feedback and state updates
- **Custom Callbacks**: Extensible event handling

## 📱 Mobile Optimization

### **Touch Interactions**
- **Touch-Friendly**: Optimized for mobile devices
- **Gesture Support**: Pinch-to-zoom and pan gestures
- **Responsive Info Windows**: Mobile-optimized layouts

### **Performance**
- **Lazy Loading**: Load images and data on demand
- **Efficient Rendering**: Optimized for mobile performance
- **Battery Optimization**: Reduced animation and effects

## 🔧 Configuration Options

### **MapContainer Props**
```typescript
interface MapContainerProps {
  properties: Property[];
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  fitBounds?: boolean;
  colorParameter?: ColorParameter;
  subjectPropertyId?: string;
  usePerformanceColors?: boolean;
  onPropertyClick?: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
}
```

### **PropertyInfoWindow Props**
```typescript
interface PropertyInfoWindowProps {
  property: Property;
  map: google.maps.Map;
  colorParameter: ColorParameter;
  autoOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}
```

The enhanced property markers provide a rich, interactive experience with detailed information windows, smooth hover effects, and seamless synchronization with list view highlighting.
