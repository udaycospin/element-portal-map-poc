import { useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface UseGoogleMapsOptions {
    apiKey: string;
    libraries?: string[];
}

interface UseGoogleMapsReturn {
    isLoaded: boolean;
    loadError: string | null;
    map: google.maps.Map | null;
    setMap: (map: google.maps.Map | null) => void;
}

export function useGoogleMaps({
    apiKey,
    libraries = ['places', 'marker']
}: UseGoogleMapsOptions): UseGoogleMapsReturn {
    const [isLoaded, setIsLoaded] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);

    useEffect(() => {
        if (!apiKey) {
            setLoadError('API key is required');
            return;
        }

        const loader = new Loader({
            apiKey,
            version: 'weekly',
            libraries
        });

        loader
            .load()
            .then(() => {
                setIsLoaded(true);
                setLoadError(null);
            })
            .catch((error) => {
                console.error('Error loading Google Maps:', error);
                setLoadError(`Failed to load Google Maps: ${error.message}`);
                setIsLoaded(false);
            });
    }, [apiKey, libraries]);

    return {
        isLoaded,
        loadError,
        map,
        setMap
    };
}
