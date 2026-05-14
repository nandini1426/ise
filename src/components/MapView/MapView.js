import React, { useState, useRef, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, OverlayView, Polygon } from '@react-google-maps/api';
import SceneCard from '../StoryMap/SceneCard';
import { T } from '../../data/translations';
import { tp, tr } from '../../data/place_translations';
import './MapView.css';

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
  { featureType: 'landscape',                 elementType: 'geometry.fill', stylers: [{ color: '#e8d5a0' }] },
  { featureType: 'landscape.natural',         elementType: 'geometry.fill', stylers: [{ color: '#dfc990' }] },
  { featureType: 'landscape.natural.terrain', elementType: 'geometry.fill', stylers: [{ color: '#c8a870' }] },
  { featureType: 'poi.park',   elementType: 'geometry.fill', stylers: [{ color: '#d4c080' }] },
  { featureType: 'road',    stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi',     stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.country',  elementType: 'geometry.stroke', stylers: [{ color: '#9b7040' }, { weight: 1.5 }] },
  { featureType: 'administrative.province', stylers: [{ visibility: 'off' }] },
];

const STORY_REGIONS = {
  ramayana: [
    { name: 'Kosala Kingdom',  color: '#d4a020', center: { lat: 27.2, lng: 81.5 }, bounds: [{lat:28.5,lng:79.0},{lat:28.5,lng:83.5},{lat:25.5,lng:83.5},{lat:25.5,lng:79.0}] },
    { name: 'Mithila Kingdom', color: '#20a060', center: { lat: 26.8, lng: 85.8 }, bounds: [{lat:28.0,lng:84.0},{lat:28.0,lng:87.5},{lat:25.5,lng:87.5},{lat:25.5,lng:84.0}] },
    { name: 'Dandaka Forest',  color: '#508030', center: { lat: 21.0, lng: 80.5 }, bounds: [{lat:24.0,lng:75.5},{lat:24.0,lng:85.0},{lat:17.5,lng:85.0},{lat:17.5,lng:75.5}] },
    { name: 'Kishkindha',      color: '#8050c0', center: { lat: 15.3, lng: 76.0 }, bounds: [{lat:16.5,lng:74.5},{lat:16.5,lng:77.5},{lat:14.0,lng:77.5},{lat:14.0,lng:74.5}] },
    { name: "Ravana's Lanka",  color: '#c04040', center: { lat: 8.2,  lng: 80.8 }, bounds: [{lat:10.0,lng:79.5},{lat:10.0,lng:82.0},{lat:5.8,lng:82.0},{lat:5.8,lng:79.5}] },
  ],
  mahabharata: [
    { name: 'Kuru Kingdom',    color: '#d4a020', center: { lat: 29.8, lng: 77.0 }, bounds: [{lat:31.0,lng:75.5},{lat:31.0,lng:78.5},{lat:28.5,lng:78.5},{lat:28.5,lng:75.5}] },
    { name: 'Panchala Kingdom',color: '#20a060', center: { lat: 28.0, lng: 79.5 }, bounds: [{lat:29.0,lng:78.0},{lat:29.0,lng:81.0},{lat:27.0,lng:81.0},{lat:27.0,lng:78.0}] },
    { name: 'Yadava Kingdom',  color: '#c08040', center: { lat: 22.5, lng: 69.5 }, bounds: [{lat:24.0,lng:67.5},{lat:24.0,lng:72.0},{lat:20.5,lng:72.0},{lat:20.5,lng:67.5}] },
  ],
};

const getOffset = (w, h) => ({ x: -(w / 2), y: -(h / 2) });

function RegionLabel({ region, language }) {
  return (
    <OverlayView position={region.center} mapPaneName={OverlayView.OVERLAY_LAYER} getPixelPositionOffset={getOffset}>
      <div className="region-label-text">{tr(region.name, language)}</div>
    </OverlayView>
  );
}

function StoryNodeMarker({ place, isActive, onHover, onLeave, onClick, language }) {
  const isMajor = place.importance === 1;
  const size = isMajor ? 20 : 12;
  return (
    <OverlayView position={place.coordinates} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={() => ({ x: -(size/2), y: -(size/2) })}>
      <div className={`lf-node ${isMajor?'lf-major':'lf-minor'} ${isActive?'lf-active':''}`}
        onMouseEnter={() => onHover(place)} onMouseLeave={onLeave} onClick={() => onClick(place)}>
        {isActive && <div className="lf-glow" />}
        <div className="lf-dot" />
        {isMajor && <div className="lf-label">{tp(place.name, language)}</div>}
      </div>
    </OverlayView>
  );
}

function HoverCard({ place, onLeave, onClick, language }) {
  const t = T[language] || T.en;
  return (
    <OverlayView position={place.coordinates} mapPaneName={OverlayView.FLOAT_PANE}
      getPixelPositionOffset={(w) => ({ x: -(w/2), y: -130 })}>
      <div className="hover-tooltip" onMouseLeave={onLeave} onClick={onClick}>
        <div className="ht-story-name">{tp(place.name, language)}</div>
        <div className="ht-divider" />
        <div className="ht-modern-label">{t.modernLocation}</div>
        <div className="ht-modern-name">{place.modernName}</div>
        {place.modernInfo && <div className="ht-modern-info">{place.modernInfo}</div>}
        <div className="ht-cta">{t.tapHint.split(' ').slice(-3).join(' ')}</div>
      </div>
    </OverlayView>
  );
}

function MapView({ book, onPlaceClick, onBack, language = 'en' }) {
  const [zoom, setZoom]             = useState(book.defaultZoom || 5);
  const [hoveredPlace, setHoveredPlace]   = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY || '',
    libraries: LIBRARIES,
  });

  const regions = useMemo(() =>
    STORY_REGIONS[book.id] || STORY_REGIONS[book.book?.toLowerCase()] || [],
  [book]);

  const selectedScenes = useMemo(() => {
    if (!selectedPlace?.subPlaces) return [];
    return selectedPlace.subPlaces.flatMap(sp =>
      (sp.scenes || []).map(scene => ({ ...scene, subPlaceId: scene.subPlaceId || sp.id, subPlaceName: sp.name }))
    );
  }, [selectedPlace]);

  const shouldShowNode = useCallback(place => {
    if (place.importance === 1) return zoom >= 4;
    if (place.importance === 2) return zoom >= 7;
    if (place.importance === 3) return zoom >= 10;
    return true;
  }, [zoom]);

  const handleNodeClick = useCallback(place => {
    setSelectedPlace(place); setActiveSceneIndex(0); setHoveredPlace(null);
    if (mapRef.current) {
      mapRef.current.panTo(place.coordinates);
      if (mapRef.current.getZoom() < 6) mapRef.current.setZoom(6);
    }
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedPlace(null);
    if (mapRef.current) { mapRef.current.panTo(book.centerCoordinates); mapRef.current.setZoom(book.defaultZoom||5); }
  }, [book]);

  if (loadError) return <div className="mv-loading"><div className="mv-loading-content"><span>⚠️</span><p>Maps failed. Check API key in .env</p><button onClick={onBack}>← Back</button></div></div>;
  if (!isLoaded) return <div className="mv-loading"><div className="mv-loading-content"><span className="mv-loading-icon">🗺️</span><p>Unrolling the ancient map…</p></div></div>;

  return (
    <div className="map-view">
      <div className="mv-topbar">
        <div className="mv-topbar-left">
          <button className="mv-back-btn" onClick={onBack}>← Back</button>
          <div className="mv-logo-small">🗺️ StoryMaps</div>
          <span className="mv-bc-sep">›</span>
          <span className="mv-bc-book">{book.book}</span>
        </div>
        <div className="mv-topbar-right">
          <span className={`mv-zoom-tag ${zoom>=7?'active':''}`}>{zoom>=7?'All places visible':'Zoom in to see more'}</span>
          <span className="mv-legend-item"><span className="mv-legend-dot major"/>Major</span>
          <span className="mv-legend-item"><span className="mv-legend-dot minor"/>Minor</span>
        </div>
      </div>

      <div className="mv-map-wrapper">
        <GoogleMap
          mapContainerClassName="mv-map-canvas"
          center={book.centerCoordinates}
          zoom={book.defaultZoom || 5}
          options={{ styles: ANCIENT_STYLES, disableDefaultUI: true, zoomControl: true, gestureHandling: 'greedy', minZoom: 4, maxZoom: 14 }}
          onLoad={map => { mapRef.current = map; }}
          onZoomChanged={() => { if (mapRef.current) setZoom(mapRef.current.getZoom()); }}
          onClick={() => selectedPlace && handleCloseSheet()}
        >
          {regions.map(r => (
            <Polygon key={r.name} paths={r.bounds}
              options={{ strokeColor: r.color, strokeWeight: 2, strokeOpacity: 0.7, fillColor: r.color, fillOpacity: 0.15, strokeDashArray: '8 5' }} />
          ))}
          {regions.map(r => <RegionLabel key={`lbl-${r.name}`} region={r} language={language} />)}

          {book.places.filter(shouldShowNode).map(place => (
            <StoryNodeMarker key={place.id} place={place}
              isActive={selectedPlace?.id === place.id}
              onHover={setHoveredPlace} onLeave={() => setHoveredPlace(null)}
              onClick={handleNodeClick} language={language} />
          ))}

          {hoveredPlace && !selectedPlace && (
            <HoverCard place={hoveredPlace} onLeave={() => setHoveredPlace(null)} onClick={() => handleNodeClick(hoveredPlace)} language={language} />
          )}
        </GoogleMap>
        {!selectedPlace && <div className="mv-hint">Tap a glowing node to explore its story</div>}
      </div>

      <div className={`mv-sheet ${selectedPlace ? 'open' : ''}`}>
        {selectedPlace && (<>
          <div className="mv-sheet-handle-row" onClick={handleCloseSheet}><div className="mv-sheet-handle" /></div>
          <div className="mv-sheet-header">
            <div className="mv-sheet-header-left">
              <h2 className="mv-sheet-title">{tp(selectedPlace.name, language)}</h2>
              <div className="mv-sheet-region">🏰 {tr(selectedPlace.storyRegion, language)}</div>
            </div>
            <div className="mv-sheet-header-right">
              <div className="mv-sheet-modern-tag">📍 {selectedPlace.modernName}</div>
              <button className="mv-sheet-close" onClick={handleCloseSheet}>✕</button>
            </div>
          </div>
          <div className="mv-sheet-scenes">
            {selectedScenes.map((scene, i) => (
              <SceneCard key={scene.id} scene={scene} index={i}
                isActive={i === activeSceneIndex} onClick={() => setActiveSceneIndex(i)} language={language} />
            ))}
          </div>
          <div className="mv-sheet-actions">
            <button className="mv-btn-story" onClick={() => onPlaceClick(selectedPlace)}>Explore Full Story Map →</button>
            <button className="mv-btn-visit" onClick={() => { const u = selectedPlace.modernMapUrl||selectedPlace.mapsUrl; if(u) window.open(u,'_blank'); }}>🗺️ Visit Today</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

export default MapView;
