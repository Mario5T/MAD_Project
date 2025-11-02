import React from 'react';
import WebMapView from './WebMapView';

const PlatformMapView = ({ children, ...props }) => {
  return <WebMapView {...props} />;
};

const PlatformMarker = (props) => {
  // Markers are handled within WebMapView
  return null;
};

export { PlatformMapView, PlatformMarker };
