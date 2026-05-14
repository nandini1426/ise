import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import StoryNode from './StoryNode';
import HoverTooltip from './HoverTooltip';
import './MapView.css';

const LIBRARIES = ['places'];

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#023e58' }] },
  { featureType: 'road', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
  { featureType: 'administrative.province', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

function MapView({ book, onPlaceClick, onBack }) {
  const [zoom, setZoom] = useState(book.defaultZoom || 5);
  const [hoveredPlace, setHoveredPlace] = useState(null);
  const [activeNodeId, setActiveNodeId] = useState(null);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || '',
    libraries: LIBRARIES,
  });

  const shouldShowNode = useCallback((place) => {
    if (place.importance === 1) return zoom >= 4;
    if (place.importance === 2) return zoom >= 7;
    if (place.importance === 3) return zoom >= 10;
    return true;
  }, [zoom]);

  const handleZoomChanged = useCallback(() => {
    if (mapRef.current) {
      setZoom(mapRef.current.getZoom());
    }
  }, []);

  const handleNodeHover = useCallback((place) => {
    setHoveredPlace(place);
    setActiveNodeId(place.id);
  }, []);

  const handleNodeLeave = useCallback(() => {
    setHoveredPlace(null);
    setActiveNodeId(null);
  }, []);

  const handleNodeClick = useCallback((place) => {
    onPlaceClick(place);
  }, [onPlaceClick]);

  if (loadError) {
    return (
      <div className="mv-error">
        <div className="mv-error-box">
          <span>⚠️</span>
          <p>Google Maps failed to load. Check your API key in <code>.env</code></p>
          <code>REACT_APP_GOOGLE_MAPS_KEY=your_key_here</code>
          <button onClick={onBack}>← Go Back</button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="mv-loading">
        <div className="mv-loading-content">
          <span className="mv-loading-icon">🗺️</span>
          <p>Loading the ancient map…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view">
      {/* Top Bar */}
      <div className="mv-topbar">
        <div className="mv-topbar-left">
          <button className="mv-back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="mv-logo-small">🗺️ StoryMaps</div>
          <div className="mv-breadcrumb">
            <span className="mv-breadcrumb-sep">›</span>
            <span className="mv-breadcrumb-book">{book.book}</span>
          </div>
        </div>
        <div className="mv-topbar-right">
          <div className="mv-zoom-info">
            {zoom >= 7 ? (
              <span className="mv-zoom-tag active">Showing all places</span>
            ) : (
              <span className="mv-zoom-tag">Zoom in to see more places</span>
            )}
          </div>
          <div className="mv-node-legend">
            <span className="mv-legend-item">
              <span className="mv-legend-dot major" />
              Major
            </span>
            <span className="mv-legend-item">
              <span className="mv-legend-dot minor" />
              Minor
            </span>
          </div>
        </div>
      </div>

      {/* Google Map */}
      <GoogleMap
        mapContainerClassName="mv-map-container"
        center={book.centerCoordinates}
        zoom={book.defaultZoom || 5}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: 'greedy',
          minZoom: 4,
          maxZoom: 14,
          restriction: {
            latLngBounds: { north: 38, south: -5, east: 100, west: 60 },
            strictBounds: false,
          },
        }}
        onLoad={(map) => { mapRef.current = map; }}
        onZoomChanged={handleZoomChanged}
      >
        {book.places
          .filter(shouldShowNode)
          .map((place) => (
            <StoryNode
              key={place.id}
              place={place}
              isActive={activeNodeId === place.id}
              onHover={handleNodeHover}
              onLeave={handleNodeLeave}
              onClick={handleNodeClick}
            />
          ))}

        {hoveredPlace && (
          <HoverTooltip
            place={hoveredPlace}
            onLeave={handleNodeLeave}
            onClick={() => handleNodeClick(hoveredPlace)}
          />
        )}
      </GoogleMap>

      {/* Tap hint */}
      <div className="mv-hint">
        Tap a glowing node to explore its story
      </div>
    </div>
  );
}

export default MapView;
