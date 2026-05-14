import React from 'react';
import { OverlayView } from '@react-google-maps/api';

const getPixelPositionOffset = (width) => ({
  x: -(width / 2),
  y: -120, // position above the node
});

function HoverTooltip({ place, onClick, onLeave }) {
  return (
    <OverlayView
      position={place.coordinates}
      mapPaneName={OverlayView.FLOAT_PANE}
      getPixelPositionOffset={getPixelPositionOffset}
    >
      <div
        className="hover-tooltip"
        onMouseLeave={onLeave}
        onClick={onClick}
      >
        <div className="ht-story-name">{place.name}</div>
        <div className="ht-divider" />
        <div className="ht-modern-label">📍 Modern India</div>
        <div className="ht-modern-name">{place.modernName}</div>
        {place.modernInfo && (
          <div className="ht-modern-info">{place.modernInfo}</div>
        )}
        {place.storyRegion && (
          <div className="ht-region">🏰 {place.storyRegion}</div>
        )}
        <div className="ht-cta">click to explore →</div>
      </div>
    </OverlayView>
  );
}

export default HoverTooltip;
