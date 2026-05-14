import React, { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SceneCard from '../StoryMap/SceneCard';
import './MapView.css';

// Free ESRI physical terrain — no labels, no roads, looks like an atlas
const PHYSICAL_TILES = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}';

// Ancient kingdom regions — coloured polygons with labels
const STORY_REGIONS = {
  ramayana: [
    { name: 'Kosala Kingdom',  color: '#d4a020', fill: '#d4a020', center: [27.2,81.5], bounds: [[28.5,79.0],[28.5,83.5],[25.5,83.5],[25.5,79.0]] },
    { name: 'Mithila Kingdom', color: '#20a060', fill: '#20a060', center: [26.8,85.8], bounds: [[28.0,84.0],[28.0,87.5],[25.5,87.5],[25.5,84.0]] },
    { name: 'Dandaka Forest',  color: '#508030', fill: '#508030', center: [21.0,80.5], bounds: [[24.0,75.5],[24.0,85.0],[17.5,85.0],[17.5,75.5]] },
    { name: 'Kishkindha',      color: '#8050c0', fill: '#8050c0', center: [15.3,76.0], bounds: [[16.5,74.5],[16.5,77.5],[14.0,77.5],[14.0,74.5]] },
    { name: "Ravana's Lanka",  color: '#c04040', fill: '#c04040', center: [8.2, 80.8], bounds: [[10.0,79.5],[10.0,82.0],[5.8,82.0],[5.8,79.5]]  },
  ],
  mahabharata: [
    { name: 'Kuru Kingdom',    color: '#d4a020', fill: '#d4a020', center: [29.8,77.0], bounds: [[31.0,75.5],[31.0,78.5],[28.5,78.5],[28.5,75.5]] },
    { name: 'Panchala Kingdom',color: '#20a060', fill: '#20a060', center: [28.0,79.5], bounds: [[29.0,78.0],[29.0,81.0],[27.0,81.0],[27.0,78.0]] },
    { name: 'Matsya Kingdom',  color: '#2080c0', fill: '#2080c0', center: [27.5,75.5], bounds: [[28.5,74.5],[28.5,76.5],[26.5,76.5],[26.5,74.5]] },
    { name: 'Yadava Kingdom',  color: '#c08040', fill: '#c08040', center: [22.5,69.5], bounds: [[24.0,67.5],[24.0,72.0],[20.5,72.0],[20.5,67.5]] },
  ],
};

function regionLabelIcon(name) {
  return L.divIcon({
    html: `<div class="region-label-text">${name}</div>`,
    className: '',
    iconSize: [140, 28],
    iconAnchor: [70, 14],
  });
}

function nodeIcon(place, isActive) {
  const isMajor = place.importance === 1;
  const s = isMajor ? 20 : 12;
  return L.divIcon({
    html: `<div class="lf-node ${isMajor?'lf-major':'lf-minor'} ${isActive?'lf-active':''}">
      ${isActive ? '<div class="lf-glow"></div>' : ''}
      <div class="lf-dot"></div>
      ${isMajor ? `<div class="lf-label">${place.name}</div>` : ''}
    </div>`,
    className: '',
    iconSize: [s, s],
    iconAnchor: [s/2, s/2],
  });
}

function ZoomTracker({ onZoomChange }) {
  useMapEvents({ zoomend: e => onZoomChange(e.target.getZoom()) });
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: onMapClick });
  return null;
}

function MapView({ book, onPlaceClick, onBack }) {
  const [zoom, setZoom] = useState(book.defaultZoom || 5);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const regions = useMemo(() =>
    STORY_REGIONS[book.id] || STORY_REGIONS[book.book?.toLowerCase()] || [],
  [book]);

  const selectedScenes = useMemo(() => {
    if (!selectedPlace?.subPlaces) return [];
    return selectedPlace.subPlaces.flatMap(sp =>
      (sp.scenes || []).map(scene => ({
        ...scene,
        subPlaceId: scene.subPlaceId || sp.id,
        subPlaceName: sp.name,
      }))
    );
  }, [selectedPlace]);

  const shouldShowNode = useCallback(place => {
    if (place.importance === 1) return zoom >= 4;
    if (place.importance === 2) return zoom >= 7;
    if (place.importance === 3) return zoom >= 10;
    return true;
  }, [zoom]);

  const handleNodeClick = useCallback(place => {
    setSelectedPlace(place);
    setActiveSceneIndex(0);
  }, []);

  const handleCloseSheet = useCallback(() => setSelectedPlace(null), []);

  return (
    <div className="map-view">
      {/* Top Bar */}
      <div className="mv-topbar">
        <div className="mv-topbar-left">
          <button className="mv-back-btn" onClick={onBack}>← Back</button>
          <div className="mv-logo-small">🗺️ StoryMaps</div>
          <span className="mv-bc-sep">›</span>
          <span className="mv-bc-book">{book.book}</span>
        </div>
        <div className="mv-topbar-right">
          <span className={`mv-zoom-tag ${zoom >= 7 ? 'active' : ''}`}>
            {zoom >= 7 ? 'All places visible' : 'Zoom in to see more'}
          </span>
          <span className="mv-legend-item"><span className="mv-legend-dot major" />Major</span>
          <span className="mv-legend-item"><span className="mv-legend-dot minor" />Minor</span>
        </div>
      </div>

      {/* Ancient Map */}
      <div className="mv-map-wrapper">
        <MapContainer
          center={[book.centerCoordinates.lat, book.centerCoordinates.lng]}
          zoom={book.defaultZoom || 5}
          className="mv-map-canvas"
          zoomControl={false}
          attributionControl={false}
          minZoom={4}
          maxZoom={10}
        >
          {/* Physical terrain tiles — no labels, no roads */}
          <TileLayer url={PHYSICAL_TILES} maxZoom={10} />

          <ZoomTracker onZoomChange={setZoom} />
          <MapClickHandler onMapClick={() => selectedPlace && handleCloseSheet()} />

          {/* Kingdom / region polygons */}
          {regions.map(r => (
            <Polygon
              key={`poly-${r.name}`}
              positions={r.bounds}
              pathOptions={{
                color: r.color, weight: 2, opacity: 0.7, dashArray: '8 5',
                fillColor: r.fill, fillOpacity: 0.18,
              }}
            />
          ))}

          {/* Kingdom label markers (no interaction) */}
          {regions.map(r => (
            <Marker
              key={`lbl-${r.name}`}
              position={r.center}
              icon={regionLabelIcon(r.name)}
              interactive={false}
              zIndexOffset={-100}
            />
          ))}

          {/* Story place nodes */}
          {book.places.filter(shouldShowNode).map(place => (
            <Marker
              key={place.id + (selectedPlace?.id === place.id ? '-a' : '')}
              position={[place.coordinates.lat, place.coordinates.lng]}
              icon={nodeIcon(place, selectedPlace?.id === place.id)}
              eventHandlers={{ click: () => handleNodeClick(place) }}
              zIndexOffset={100}
            />
          ))}
        </MapContainer>

        {!selectedPlace && (
          <div className="mv-hint">Tap a glowing node to explore its story</div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className={`mv-sheet ${selectedPlace ? 'open' : ''}`}>
        {selectedPlace && (
          <>
            <div className="mv-sheet-handle-row" onClick={handleCloseSheet}>
              <div className="mv-sheet-handle" />
            </div>
            <div className="mv-sheet-header">
              <div className="mv-sheet-header-left">
                <h2 className="mv-sheet-title">{selectedPlace.name}</h2>
                <div className="mv-sheet-region">🏰 {selectedPlace.storyRegion}</div>
              </div>
              <div className="mv-sheet-header-right">
                <div className="mv-sheet-modern-tag">📍 {selectedPlace.modernName}</div>
                <button className="mv-sheet-close" onClick={handleCloseSheet}>✕</button>
              </div>
            </div>
            <div className="mv-sheet-scenes">
              {selectedScenes.map((scene, i) => (
                <SceneCard key={scene.id} scene={scene} index={i}
                  isActive={i === activeSceneIndex}
                  onClick={() => setActiveSceneIndex(i)} />
              ))}
            </div>
            <div className="mv-sheet-actions">
              <button className="mv-btn-story" onClick={() => onPlaceClick(selectedPlace)}>
                Explore Full Story Map →
              </button>
              <button className="mv-btn-visit" onClick={() => {
                const url = selectedPlace.modernMapUrl || selectedPlace.mapsUrl;
                if (url) window.open(url, '_blank', 'noopener,noreferrer');
              }}>🗺️ Visit Today</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MapView;
