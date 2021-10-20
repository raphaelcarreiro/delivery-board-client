import React, { createContext, useState, useContext } from 'react';

interface LocationContextValue {
  location: Location | null;
  isPermittionDenied: boolean;
  askPermittionForLocation(): void;
}

interface Location {
  latitude: number;
  longitude: number;
}

const LocationContext = createContext<LocationContextValue>({} as LocationContextValue);

const LocationProvider: React.FC = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [isPermittionDenied, setIsPermittionDenied] = useState(false);

  function askPermittionForLocation() {
    setIsPermittionDenied(false);

    navigator.geolocation.getCurrentPosition(
      success => {
        setLocation({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        });
      },
      error => {
        console.error(error);
        setIsPermittionDenied(true);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  }

  return (
    <LocationContext.Provider value={{ location, askPermittionForLocation, isPermittionDenied }}>
      {children}
    </LocationContext.Provider>
  );
};

export function useLocation(): LocationContextValue {
  const context = useContext(LocationContext);
  return context;
}

export default LocationProvider;
