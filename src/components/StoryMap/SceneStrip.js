import React, { useRef, useEffect, useCallback } from 'react';
import SceneCard from './SceneCard';

function SceneStrip({ scenes, activeIndex, onSceneChange }) {
  const stripRef = useRef(null);
  const isScrollingByCode = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Scroll to active card when activeIndex changes (from Prev/Next or external)
  useEffect(() => {
    if (!stripRef.current) return;
    const strip = stripRef.current;
    const cardWidth = 216; // 200px + 16px gap
    const targetScroll = activeIndex * cardWidth;
    isScrollingByCode.current = true;
    strip.scrollTo({ left: targetScroll, behavior: 'smooth' });
    // Release flag after animation completes
    setTimeout(() => { isScrollingByCode.current = false; }, 400);
  }, [activeIndex]);

  // Detect which card is centred when user manually scrolls
  const handleScroll = useCallback(() => {
    if (isScrollingByCode.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      if (!stripRef.current) return;
      const cardWidth = 216;
      const scrollLeft = stripRef.current.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      const clamped = Math.max(0, Math.min(scenes.length - 1, newIndex));
      if (clamped !== activeIndex) {
        onSceneChange(clamped);
      }
    }, 100);
  }, [activeIndex, onSceneChange, scenes.length]);

  return (
    <div
      className="scene-strip"
      ref={stripRef}
      onScroll={handleScroll}
    >
      <div className="scene-strip-inner">
        {scenes.map((scene, index) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            index={index}
            isActive={index === activeIndex}
            onClick={() => onSceneChange(index)}
          />
        ))}
        {/* Right padding spacer */}
        <div style={{ minWidth: 16, flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default SceneStrip;
