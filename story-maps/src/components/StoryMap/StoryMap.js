import React, { useState, useMemo } from 'react';
import SubPlaceMap from './SubPlaceMap';
import SceneStrip from './SceneStrip';
import './StoryMap.css';

function StoryMap({ place, bookName, onBack }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  // Flatten all scenes across all subPlaces — inject subPlaceId + subPlaceName
  const allScenes = useMemo(() => {
    if (!place?.subPlaces) return [];
    return place.subPlaces.flatMap((sp) =>
      (sp.scenes || []).map((scene) => ({
        ...scene,
        subPlaceId: scene.subPlaceId || sp.id,   // use scene's own or parent id
        subPlaceName: sp.name,
      }))
    );
  }, [place]);

  // Find the active subPlace based on active scene
  const activeSubPlaceId = useMemo(() => {
    if (!allScenes[activeSceneIndex]) return null;
    return allScenes[activeSceneIndex].subPlaceId;
  }, [allScenes, activeSceneIndex]);

  const handlePrev = () => {
    setActiveSceneIndex((i) => Math.max(0, i - 1));
  };

  const handleNext = () => {
    setActiveSceneIndex((i) => Math.min(allScenes.length - 1, i + 1));
  };

  const handleVisitToday = () => {
    const url = place.modernMapUrl || place.mapsUrl;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!place) return null;

  return (
    <div className="story-map">
      {/* Top Bar */}
      <div className="sm-topbar">
        <div className="sm-topbar-left">
          <button className="sm-back-btn" onClick={onBack}>
            ← Map
          </button>
          <div className="sm-breadcrumb">
            <span className="sm-bc-book">{bookName}</span>
            <span className="sm-bc-sep">›</span>
            <span className="sm-bc-place">{place.name}</span>
          </div>
        </div>
        <div className="sm-topbar-right">
          <div className="sm-modern-tag">
            📍 {place.modernName}
          </div>
        </div>
      </div>

      {/* Map — top 60% */}
      <div className="sm-map-area">
        <SubPlaceMap place={place} activeSubPlaceId={activeSubPlaceId} />

        {/* Region badge on map */}
        <div className="sm-region-badge">
          🏰 {place.storyRegion}
        </div>

        {/* Scroll hint */}
        <div className="sm-scroll-hint">
          ↓ Scroll scenes to explore
        </div>
      </div>

      {/* Scene Strip — bottom 40% */}
      <div className="sm-strip-area">
        <SceneStrip
          scenes={allScenes}
          activeIndex={activeSceneIndex}
          onSceneChange={setActiveSceneIndex}
        />
      </div>

      {/* Bottom Bar */}
      <div className="sm-bottombar">
        <button className="sm-visit-btn" onClick={handleVisitToday}>
          🗺️ Visit {place.modernName?.split(',')[0]} today
        </button>
        <div className="sm-nav-btns">
          <button
            className="sm-nav-btn"
            onClick={handlePrev}
            disabled={activeSceneIndex === 0}
          >
            ← Prev
          </button>
          <span className="sm-scene-counter">
            {activeSceneIndex + 1} / {allScenes.length}
          </span>
          <button
            className="sm-nav-btn"
            onClick={handleNext}
            disabled={activeSceneIndex === allScenes.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoryMap;
