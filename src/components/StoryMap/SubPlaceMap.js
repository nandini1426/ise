import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ESRI World Shaded Relief — terrain shading, max zoom 13, zero labels
const RELIEF_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}';

const getOffset = (w, h) => ({ x: -(w / 2), y: -(h / 2) });

function subPlaceIcon(sp, isActive) {
  const thumbSrc = sp.scenes?.[0]?.image;
  const inner = thumbSrc
    ? `<img src="${thumbSrc}" class="spn-thumb-img" onerror="this.parentElement.innerHTML='<div class=\\'spn-dot-fb\\'></div>'" />`
    : `<div class="spn-dot-fb"></div>`;
  return L.divIcon({
    html: `<div class="spn-wrapper ${isActive ? 'spn-active' : ''}">
      ${isActive ? '<div class="spn-glow"></div>' : ''}
      ${inner}
      <div class="spn-lbl">${sp.name}</div>
    </div>`,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function SubPlaceMap({ place, activeSubPlaceId }) {
  return (
    <MapContainer
      center={[place.coordinates.lat, place.coordinates.lng]}
      zoom={13}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
    >
      <TileLayer url={RELIEF_TILES} maxZoom={13} />

      {place.subPlaces?.map(sp => (
        <Marker
          key={sp.id}
          position={[sp.coordinates.lat, sp.coordinates.lng]}
          icon={subPlaceIcon(sp, sp.id === activeSubPlaceId)}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}

export default SubPlaceMap;
