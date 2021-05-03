import React, { createContext, useEffect, useState } from 'react';

interface LocationContextValue {
  location: Location;
}

interface Location {
  latitude: number;
  longitude: number;
}

const LocationContext = createContext<LocationContextValue>({} as LocationContextValue);

const LocationProvider: React.FC = ({ children }) => {
  const [location, setLocation] = useState<Location>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      success => {
        console.log(success);
        setLocation({
          latitude: success.coords.latitude,
          longitude: success.coords.longitude,
        });
      },
      error => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  }, []);

  return <LocationContext.Provider value={{ location }}>{children}</LocationContext.Provider>;
};

export default LocationProvider;
