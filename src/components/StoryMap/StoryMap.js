import React, { useState, useMemo } from 'react';
import SubPlaceMap from './SubPlaceMap';
import SceneStrip from './SceneStrip';
import { T } from '../../data/translations';
import './StoryMap.css';

function StoryMap({ place, bookName, onBack, language = 'en' }) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const t = T[language] || T.en;

  const allScenes = useMemo(() => {
    if (!place?.subPlaces) return [];
    return place.subPlaces.flatMap(sp =>
      (sp.scenes || []).map(scene => ({
        ...scene,
        subPlaceId: scene.subPlaceId || sp.id,
        subPlaceName: sp.name,
      }))
    );
  }, [place]);

  const activeSubPlaceId = useMemo(() =>
    allScenes[activeSceneIndex]?.subPlaceId || null,
  [allScenes, activeSceneIndex]);

  if (!place) return null;

  return (
    <div className="story-map">
      {/* Top Bar */}
      <div className="sm-topbar">
        <button className="sm-back-btn" onClick={onBack}>{t.backToMap}</button>
        <div className="sm-breadcrumb">
          <span className="sm-bc-book">{bookName}</span>
          <span className="sm-bc-sep">›</span>
          <span className="sm-bc-place">{place.name}</span>
        </div>
        <div className="sm-modern-tag">{t.modernLocation} {place.modernName?.split(',')[0]}</div>
      </div>

      {/* Map — 40% */}
      <div className="sm-map-area">
        <SubPlaceMap place={place} activeSubPlaceId={activeSubPlaceId} />
        <div className="sm-region-badge">🏰 {place.storyRegion}</div>
      </div>

      {/* Scene — 60% */}
      <div className="sm-scene-area">
        <SceneStrip
          scenes={allScenes}
          activeIndex={activeSceneIndex}
          onSceneChange={setActiveSceneIndex}
          language={language}
        />
      </div>

      {/* Bottom bar */}
      <div className="sm-bottombar">
        <button className="sm-visit-btn"
          onClick={() => {
            const url = place.modernMapUrl || place.mapsUrl;
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
          }}>
          {t.visitToday}
        </button>
        <div className="sm-nav-btns">
          <button className="sm-nav-btn" onClick={() => setActiveSceneIndex(i => Math.max(0, i-1))}
            disabled={activeSceneIndex === 0}>{t.prev}</button>
          <span className="sm-scene-counter">
            {activeSceneIndex + 1} {t.sceneOf} {allScenes.length}
          </span>
          <button className="sm-nav-btn"
            onClick={() => setActiveSceneIndex(i => Math.min(allScenes.length-1, i+1))}
            disabled={activeSceneIndex === allScenes.length - 1}>{t.next}</button>
        </div>
      </div>
    </div>
  );
}

export default StoryMap;
