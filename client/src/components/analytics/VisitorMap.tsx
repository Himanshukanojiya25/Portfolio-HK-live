import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Globe, AlertCircle } from 'lucide-react';
import { LocationData } from '@/services/analytics';

// Simple SVG world map component
const WorldMap = ({ locations, height = 300 }: { locations: LocationData[], height?: number }) => {
  const [mounted, setMounted] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // World map data - simplified coordinates for major countries
  const countryCoordinates: Record<string, { x: number; y: number; name: string }> = {
    'US': { x: 180, y: 105, name: 'United States' },
    'IN': { x: 580, y: 210, name: 'India' },
    'GB': { x: 370, y: 100, name: 'United Kingdom' },
    'DE': { x: 410, y: 100, name: 'Germany' },
    'CA': { x: 150, y: 80, name: 'Canada' },
    'AU': { x: 700, y: 300, name: 'Australia' },
    'BR': { x: 280, y: 250, name: 'Brazil' },
    'FR': { x: 390, y: 110, name: 'France' },
    'JP': { x: 680, y: 150, name: 'Japan' },
    'CN': { x: 600, y: 150, name: 'China' },
    'RU': { x: 500, y: 80, name: 'Russia' },
    'MX': { x: 160, y: 170, name: 'Mexico' },
    'ZA': { x: 430, y: 320, name: 'South Africa' },
    'NG': { x: 420, y: 220, name: 'Nigeria' },
    'EG': { x: 450, y: 160, name: 'Egypt' },
    'TR': { x: 470, y: 130, name: 'Turkey' },
    'KR': { x: 650, y: 150, name: 'South Korea' },
    'IT': { x: 400, y: 120, name: 'Italy' },
    'ES': { x: 370, y: 130, name: 'Spain' },
    'NL': { x: 390, y: 100, name: 'Netherlands' }
  };

  // Find max visitors for scaling
  const maxVisitors = Math.max(...locations.map(loc => loc.visitors), 1);

  // Get country code from country name
  const getCountryCode = (countryName: string): string => {
    const codeMap: Record<string, string> = {
      'United States': 'US',
      'India': 'IN',
      'United Kingdom': 'GB',
      'Germany': 'DE',
      'Canada': 'CA',
      'Australia': 'AU',
      'Brazil': 'BR',
      'France': 'FR',
      'Japan': 'JP',
      'China': 'CN',
      'Russia': 'RU',
      'Mexico': 'MX',
      'South Africa': 'ZA',
      'Nigeria': 'NG',
      'Egypt': 'EG',
      'Turkey': 'TR',
      'South Korea': 'KR',
      'Italy': 'IT',
      'Spain': 'ES',
      'Netherlands': 'NL'
    };
    
    return codeMap[countryName] || countryName.substring(0, 2).toUpperCase();
  };

  if (!mounted) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (locations.length === 0) {
    return (
      <Card className="h-full">
        <CardContent className="p-6 h-full flex flex-col items-center justify-center">
          <Globe className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Location Data</h3>
          <p className="text-gray-600 text-center mt-1">
            Visitor location data will appear here once available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full relative">
      <CardContent className="p-6">
        {/* SVG Map Container */}
        <div className="relative" style={{ height: `${height}px` }}>
          {/* World Map SVG */}
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 400"
            className="rounded-lg bg-gradient-to-b from-blue-50 to-gray-50"
          >
            {/* Continent Outlines */}
            <g className="continent-outlines" stroke="#cbd5e1" strokeWidth="1" fill="#f8fafc">
              {/* North America */}
              <path d="M100,80 L180,80 L200,150 L150,200 L100,180 Z" />
              {/* South America */}
              <path d="M200,200 L250,250 L300,300 L250,350 L180,300 Z" />
              {/* Europe */}
              <path d="M350,80 L450,80 L500,120 L450,150 L380,120 Z" />
              {/* Africa */}
              <path d="M400,150 L500,150 L550,250 L500,300 L380,250 Z" />
              {/* Asia */}
              <path d="M500,80 L700,80 L750,150 L700,250 L600,200 L550,120 Z" />
              {/* Australia */}
              <path d="M650,300 L750,300 L720,350 L650,330 Z" />
            </g>

            {/* Country Dots */}
            {locations.map((location) => {
              const countryCode = getCountryCode(location.country);
              const coords = countryCoordinates[countryCode];
              
              if (!coords) return null;

              const radius = 5 + (location.visitors / maxVisitors) * 15;
              const opacity = 0.5 + (location.visitors / maxVisitors) * 0.5;

              return (
                <g key={location.country}>
                  {/* Animated pulse effect */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={radius + 2}
                    fill="#3b82f6"
                    fillOpacity={0.2}
                    className="animate-pulse"
                  />
                  
                  {/* Main dot */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={radius}
                    fill="#3b82f6"
                    fillOpacity={opacity}
                    stroke="#1d4ed8"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200 hover:r-8"
                    onMouseEnter={() => setHoveredCountry(location.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                  
                  {/* Country label on hover */}
                  {hoveredCountry === location.country && (
                    <g>
                      <rect
                        x={coords.x - 50}
                        y={coords.y - 40}
                        width={100}
                        height={30}
                        rx="6"
                        fill="#1e293b"
                        fillOpacity="0.9"
                      />
                      <text
                        x={coords.x}
                        y={coords.y - 25}
                        textAnchor="middle"
                        fill="white"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {location.country}
                      </text>
                      <text
                        x={coords.x}
                        y={coords.y - 12}
                        textAnchor="middle"
                        fill="#60a5fa"
                        fontSize="9"
                      >
                        {location.visitors} visitors
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Legend */}
            <g>
              <rect x="10" y="10" width="180" height="80" rx="8" fill="white" fillOpacity="0.9" stroke="#e5e7eb" />
              <text x="20" y="30" fill="#374151" fontSize="12" fontWeight="bold">Visitor Locations</text>
              <text x="20" y="50" fill="#6b7280" fontSize="10">Dot size = visitor count</text>
              
              {/* Legend dots */}
              <circle cx="30" y="65" r="3" fill="#3b82f6" />
              <text x="40" y="69" fill="#374151" fontSize="9">Few visitors</text>
              
              <circle cx="100" y="65" r="8" fill="#3b82f6" />
              <text x="115" y="69" fill="#374151" fontSize="9">Many visitors</text>
            </g>
          </svg>

          {/* Loading overlay */}
          {!mounted && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Countries List */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Countries</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {locations.slice(0, 8).map((location, index) => (
              <div
                key={location.country}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-r from-blue-500 to-cyan-500 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{location.country}</p>
                    <p className="text-xs text-gray-500">{location.countryCode}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{location.visitors}</p>
                  <p className="text-xs text-gray-500">visitors</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Total Countries</p>
            <p className="text-lg font-semibold text-gray-900">{locations.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Visitors</p>
            <p className="text-lg font-semibold text-gray-900">
              {locations.reduce((sum, loc) => sum + loc.visitors, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main component - SIRF EK EXPORT DEFAULT
const VisitorMap = ({ locations = [], height = 300 }: { locations?: LocationData[], height?: number }) => {
  return (
    <div className="h-full">
      <WorldMap locations={locations} height={height} />
    </div>
  );
};

// SIRF YAHI EK EXPORT DEFAULT HOGA
export default VisitorMap;

// Remove any other export default statements at the end