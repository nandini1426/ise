import React, { useMemo, useState } from 'react';
import { GoogleMap, OverlayView, useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places'];

const SUBMAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1a2744' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a0b4cc' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a2744' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0a1528' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#1e3040' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#3a5068' }] },
  { featureType: 'administrative.locality', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
];

const getThumbnailOffset = (w, h) => ({ x: -(w / 2), y: -(h / 2) });

function SubPlaceNode({ subPlace, isActive }) {
  const thumbSrc = subPlace.scenes?.[0]?.image || null;
  const [imgError, setImgError] = useState(false);
  const showThumb = thumbSrc && !imgError;

  return (
    <OverlayView
      position={subPlace.coordinates}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getThumbnailOffset}
    >
      <div className={`subplace-node ${isActive ? 'active' : ''}`}>
        {isActive && <div className="spn-glow-ring" />}

        {showThumb ? (
          <img
            src={thumbSrc}
            alt={subPlace.name}
            className="spn-thumbnail"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="spn-dot-fallback" />
        )}

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

  if (!isLoaded) {
    return (
      <div className="spm-loading">
        <span>🗺️</span>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={center}
      zoom={12}
      options={{
        styles: SUBMAP_STYLES,
        disableDefaultUI: true,
        gestureHandling: 'none',
        draggable: false,
        zoomControl: false,
        scrollwheel: false,
      }}
    >
      {place.subPlaces?.map((sp) => (
        <SubPlaceNode
          key={sp.id}
          subPlace={sp}
          isActive={sp.id === activeSubPlaceId}
        />
      ))}
    </GoogleMap>
  );
}

export default SubPlaceMap;
