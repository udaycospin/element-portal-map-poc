# Element Portal Map PoC

A proof-of-concept application for visualizing commercial real estate properties on an interactive map with advanced color-coding and comparison features.

## Features

- **Interactive Google Maps Integration** with property markers
- **Dynamic Color Gradients** for competitive analysis:
  - Red = Competitive threats (better performance)
  - Green = Less competitive properties
- **Relative Marker Sizing** based on property parameters
- **Client Property Visualization** with star marker
- **Smart Overlapping Marker Handling** with automatic offset
- **Hover Callout Bubbles** with property details
- **Parameter Switching** (Asking Rate, Available SF, RBA)
- **Responsive Design** with Tailwind CSS

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Google Maps JavaScript API
- **State Management**: React Context + useReducer

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd element-portal-map-poc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the project root
   echo "VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here" > .env
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional)
4. Create an API key
5. Restrict the API key to your domain (for production)

## Project Structure

```
src/
├── components/
│   ├── Map/
│   │   ├── MapContainer.tsx          # Main map component
│   │   ├── PropertyMarker.tsx        # Individual marker component
│   │   ├── PropertyInfoWindow.tsx    # Property details popup
│   │   └── PropertyCalloutOverlay.tsx # Hover callout bubbles
│   ├── Controls/
│   │   ├── ParameterSelector.tsx     # Color parameter switcher
│   │   └── CalloutToggle.tsx         # Callout visibility toggle
│   └── common/
├── context/
│   └── MapContext.tsx                # Global state management
├── hooks/
│   ├── useGoogleMaps.ts              # Google Maps API loader
│   └── usePropertyData.ts            # Property data management
├── utils/
│   └── colorUtils.ts                 # Color gradient calculations
├── types/
│   └── index.ts                      # TypeScript type definitions
└── data/
    └── testProperties.ts             # Sample property data
```

## Usage

### Color Parameter Analysis

- **Asking Rate**: Red = Lower rates (competitive threats), Green = Higher rates
- **Available SF**: Red = More space available (competitive threats), Green = Less space
- **RBA**: Red = Larger buildings, Green = Smaller buildings

### Client Property Reference

- One property is designated as the "client property" (marked with a blue star)
- All other marker sizes are relative to the client property's parameter value
- This enables easy competitive comparison

### Interactive Features

- **Click markers** to view detailed property information
- **Hover markers** to see quick callout bubbles (when enabled)
- **Switch parameters** to see different competitive perspectives
- **Toggle callout bubbles** between always-on and hover-only modes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Properties

Edit `src/data/testProperties.ts` to add new properties with:
- Unique ID
- Name and address
- Coordinates (lat/lng)
- RBA, Available SF, and Asking Rate
- Building class and other details

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is a proof-of-concept and is not intended for production use without proper licensing and security considerations.