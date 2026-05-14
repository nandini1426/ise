import React from 'react';
import { OverlayView } from '@react-google-maps/api';

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
});

function StoryNode({ place, isActive, onHover, onLeave, onClick }) {
  const isMajor = place.importance === 1;
  const size = isMajor ? 18 : 10;

  return (
    <OverlayView
      position={place.coordinates}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div
        className={`story-node-wrapper ${isMajor ? 'major' : 'minor'} ${isActive ? 'active' : ''}`}
        onMouseEnter={() => onHover(place)}
        onMouseLeave={onLeave}
        onClick={() => onClick(place)}
        title={place.name}
        style={{ '--node-size': `${size}px` }}
      >
        {/* Glow ring for active/hovered */}
        {isActive && <div className="node-glow-ring" />}

        {/* The dot */}
        <div className="node-dot" />

        {/* Label below */}
        {isMajor && (
          <div className="node-label">{place.name}</div>
        )}
      </div>
    </OverlayView>
  );
}

export default StoryNode;
