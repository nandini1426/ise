import React, { useMemo } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const ANCIENT_STYLES = [
  { featureType: 'all', elementType: 'labels',             stylers: [{ visibility: 'off' }] },
  { featureType: 'all', elementType: 'labels.text',        stylers: [{ visibility: 'off' }] },
  { featureType: 'all', elementType: 'labels.text.fill',   stylers: [{ visibility: 'off' }] },
  { featureType: 'all', elementType: 'labels.text.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'all', elementType: 'labels.icon',        stylers: [{ visibility: 'off' }] },
  { featureType: 'all',               elementType: 'geometry.fill',   stylers: [{ color: '#e8d5a0' }] },
  { featureType: 'all',               elementType: 'geometry.stroke', stylers: [{ color: '#c9a96e' }] },
  { featureType: 'water', elementType: 'geometry.fill',    stylers: [{ color: '#7ab3cc' }] },
  { featureType: 'landscape.natural',         elementType: 'geometry.fill', stylers: [{ color: '#dfc990' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry.fill', stylers: [{ color: '#c8a870' }] },
  { featureType: 'road',    stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', stylers: [{ visibility: 'off' }] },
];

const getOffset = (w, h) => ({ x: -(w / 2), y: -(h / 2) });

function SubPlaceNode({ subPlace, isActive }) {
  const [imgError, setImgError] = React.useState(false);
  const thumbSrc = subPlace.scenes?.[0]?.image;
  const showThumb = thumbSrc && !imgError;

  return (
    <OverlayView position={subPlace.coordinates} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} getPixelPositionOffset={getOffset}>
      <div className={`subplace-node ${isActive ? 'active' : ''}`}>
        {isActive && <div className="spn-glow-ring" />}
        {showThumb
          ? <img src={thumbSrc} alt={subPlace.name} className="spn-thumbnail" onError={() => setImgError(true)} />
          : <div className="spn-dot-fallback" />}
        <div className="spn-label">{subPlace.name}</div>
      </div>
    </OverlayView>
  );
}

function SubPlaceMap({ place, activeSubPlaceId }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || '',
    libraries: LIBRARIES,
  });
  const center = useMemo(() => place.coordinates, [place.coordinates]);

  if (!isLoaded) return <div className="spm-loading"><span>🗺️</span></div>;

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={13}
      options={{
        styles: ANCIENT_STYLES,
        disableDefaultUI: false,
        zoomControl: true,
        gestureHandling: 'greedy',
        minZoom: 8,
        maxZoom: 18,
      }}
    >
      {place.subPlaces?.map(sp => (
        <SubPlaceNode key={sp.id} subPlace={sp} isActive={sp.id === activeSubPlaceId} />
      ))}
    </GoogleMap>
  );
}

export default SubPlaceMap;
