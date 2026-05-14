import React from 'react';
import SceneCard from './SceneCard';

function SceneStrip({ scenes, activeIndex, onSceneChange, language }) {
  if (!scenes.length) return null;
  const scene = scenes[activeIndex];
  return (
    <div className="scene-strip">
      <SceneCard key={scene.id} scene={scene} index={activeIndex}
        isActive={true} onClick={() => {}} language={language} />
      <div className="ss-dots">
        {scenes.map((_, i) => (
          <button key={i} className={`ss-dot ${i === activeIndex ? 'active' : ''}`}
            onClick={() => onSceneChange(i)} />
        ))}
      </div>
    </div>
  );
}

export default SceneStrip;
