# Element Portal Map PoC - Technical Implementation Guide

## 1. Project Overview

### 1.1 Objective
Build a proof-of-concept for the Element Portal map functionality featuring:
- Interactive Google Maps integration
- Heat map visualization with red-to-green gradient
- Property markers with detailed call-out bubbles
- List/Tile toggle views synchronized with map
- Parameter-based coloring (Asking Rate, Available SF, RBA)

### 1.2 Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **State Management**: React Context + useReducer
- **Build Tool**: Vite
- **Package Manager**: npm

## 2. Project Setup

### 2.1 Initial Project Structure
```
element-portal-map-poc/
├── src/
│   ├── components/
│   │   ├── Map/
│   │   ├── PropertyList/
│   │   ├── Controls/
│   │   └── common/
│   ├── types/
│   ├── utils/
│   ├── data/
│   ├── hooks/
│   └── context/
├── public/
└── package.json
```

### 2.2 Required Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@google-maps/js-api-loader": "^1.16.2",
    "@types/google.maps": "^3.54.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "typescript": "^5.0.0",
    "vite": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

## 3. Data Models and Types

### 3.1 Property Data Structure
```typescript
export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  rba: number; // Rentable Building Area
  availableSF: number;
  askingRate: number; // $/SF/year
  buildingClass: 'A' | 'B' | 'C';
  propertyType: string;
  yearBuilt: number;
  parkingSpaces: number;
  imageUrl?: string;
  description?: string;
}

export type ColorParameter = 'askingRate' | 'availableSF' | 'rba';

export interface MapViewConfig {
  colorParameter: ColorParameter;
  showHeatMap: boolean;
  viewMode: 'list' | 'tiles';
}
```

### 3.2 Sample Test Data Structure
```typescript
export const testProperties: Property[] = [
  {
    id: "1",
    name: "Downtown Plaza",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    coordinates: { lat: 30.2672, lng: -97.7431 },
    rba: 50000,
    availableSF: 15000,
    askingRate: 35.50,
    buildingClass: "A",
    propertyType: "Office",
    yearBuilt: 2018,
    parkingSpaces: 200,
    imageUrl: "https://via.placeholder.com/300x200",
    description: "Modern office building in downtown Austin"
  }
  // ... add 14 more properties
];
```

## 4. Implementation Phases

### Phase 1: Basic Map Integration
**Goal**: Display properties on Google Maps with basic markers

**Key Components**:
- `MapContainer` - Main map wrapper
- `PropertyMarker` - Individual property markers
- `MapControls` - Basic controls

### Phase 2: Heat Map Visualization
**Goal**: Implement color-coded markers based on parameters

**Key Components**:
- `HeatMapLayer` - Color calculation logic
- `ColorLegend` - Display color scale
- `ParameterSelector` - Switch between parameters

### Phase 3: Interactive Features
**Goal**: Add call-out bubbles and hover effects

**Key Components**:
- `PropertyInfoWindow` - Detailed property popup
- `PropertyCard` - Standardized property display

### Phase 4: List/Tile Views
**Goal**: Synchronized list and tile views

**Key Components**:
- `PropertyListView` - List format display
- `PropertyTileView` - Tile format display
- `ViewToggle` - Switch between views

## 6. Implementation Checklist

### 6.1 Core Features
- [ ] Google Maps integration with API key
- [ ] Property markers with coordinates
- [ ] Color-coded markers (red-green gradient)
- [ ] Parameter switching (asking rate, available SF, RBA)
- [ ] Interactive info windows
- [ ] Hover effects with highlighting

### 6.2 UI Components
- [ ] Map container with loading states
- [ ] Property list view (sortable)
- [ ] Property tile view (responsive grid)
- [ ] View toggle controls
- [ ] Color legend
- [ ] Parameter selector dropdown

### 6.3 Interactive Features
- [ ] Map-list synchronization
- [ ] Hover highlighting across views
- [ ] Click navigation between views
- [ ] Smooth transitions and animations
- [ ] Mobile-responsive design

### 6.4 Data Management
- [ ] Property data context
- [ ] Filter and sort utilities
- [ ] Color calculation functions
- [ ] Geographic clustering logic

## 7. Testing Strategy

### 7.1 Manual Testing Checklist
- [ ] All 15 properties display on map
- [ ] Color gradients work for each parameter
- [ ] Info windows show correct data
- [ ] List/map synchronization works
- [ ] Mobile responsive behavior
- [ ] Performance with rapid parameter changes

### 7.2 Cursor Testing Prompts
```
Create a simple test harness that validates:
1. All properties have valid coordinates
2. Color calculations return expected hex values
3. Parameter switching updates marker colors
4. List sorting matches map display order
```

## 8. Environment Setup

### 8.1 Required API Keys
- Google Maps JavaScript API key
- Enable: Maps JavaScript API, Places API (optional)

### 8.2 Environment Variables
```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
VITE_APP_TITLE=Element Portal Map PoC
```

### 8.3 Local Development
```bash
npm install
npm run dev
# Open http://localhost:5173
```

## 9. Deployment Considerations

### 9.1 Build Configuration
- Optimize bundle size for Google Maps API
- Configure proper environment variables
- Set up source maps for debugging

### 9.2 Performance Optimization
- Lazy load Google Maps API
- Implement marker clustering for large datasets
- Use React.memo for expensive re-renders
- Optimize images and assets

## 10. Next Steps Beyond PoC

### 10.1 Integration Points
- Connect to real property API
- Add authentication and user context
- Implement property filtering
- Add export functionality

### 10.2 Advanced Features
- Real-time data updates
- Advanced map controls (zoom levels, map types)
- Property comparison tools
- Saved views and preferences

---

## Cursor Implementation Tips

1. **Always reference this guide** when asking Cursor for implementation help
2. **Be specific** about which section/component you're working on
3. **Include current code context** when asking for modifications
4. **Ask for explanations** of complex implementations
5. **Request TypeScript-first solutions** with proper error handling
6. **Test frequently** and ask Cursor to help debug issues
7. **Iterate in small steps** rather than requesting large code blocks

This approach ensures Cursor has proper context and can provide targeted, high-quality code that follows the established patterns and requirements.