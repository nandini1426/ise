import React, { useState } from 'react';

const PLACEHOLDER_COLORS = ['#FAEEDA', '#EAF3DE', '#E1F5EE', '#E6F1FB', '#FAECE7'];
const PLACEHOLDER_ICONS  = ['👑', '⚔️', '🏹', '🌿', '🙏'];

function SceneCard({ scene, index, isActive, onClick }) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !scene.image || imgError;

  return (
    <div
      className={`scene-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {/* Image area */}
      <div className="sc-image-area">
        {showPlaceholder ? (
          <div
            className="sc-placeholder"
            style={{ background: PLACEHOLDER_COLORS[index % 5] }}
          >
            <span className="sc-placeholder-icon">
              {PLACEHOLDER_ICONS[index % 5]}
            </span>
          </div>
        ) : (
          <img
            src={scene.image}
            alt={scene.title}
            className="sc-img"
            onError={() => setImgError(true)}
          />
        )}

        {/* Scene number badge */}
        <div className="sc-badge">#{scene.sceneNumber}</div>

        {/* Sub-place location tag */}
        {scene.subPlaceName && (
          <div className="sc-location-tag">📍 {scene.subPlaceName}</div>
        )}
      </div>

      {/* Text body */}
      <div className="sc-body">
        <div className="sc-title">{scene.title}</div>
        <div className="sc-desc">{scene.description}</div>
      </div>
    </div>
  );
}

export default SceneCard;
