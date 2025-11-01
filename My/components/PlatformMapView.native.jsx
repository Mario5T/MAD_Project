import React from 'react';
import MapView, { Marker } from 'react-native-maps';

const PlatformMapView = ({ children, ...props }) => {
  return (
    <MapView {...props}>
      {children}
    </MapView>
  );
};

const PlatformMarker = (props) => {
  return <Marker {...props} />;
};

export { PlatformMapView, PlatformMarker };
