import React, { useRef, useState, useEffect, useCallback } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { tp } from '../../data/place_translations';

// Journey stops per book with multilingual notes
const JOURNEY_STOPS = {
  ramayana: [
    { placeId: 'ayodhya',     zoom: 7,  note: { en: '🏰 Ram begins 14 years of exile', hi: '🏰 राम का 14 वर्षों का वनवास शुरू', te: '🏰 రాముని 14 సంవత్సరాల వనవాసం ప్రారంభం' } },
    { placeId: 'chitrakoot',  zoom: 8,  note: { en: '🌿 11 peaceful years in the forest', hi: '🌿 वन में 11 शांतिपूर्ण वर्ष', te: '🌿 అడవిలో 11 సంవత్సరాల శాంతి' } },
    { placeId: 'panchavati',  zoom: 8,  note: { en: '💔 Sita abducted. The quest begins.', hi: '💔 सीता का अपहरण। खोज शुरू होती है।', te: '💔 సీత అపహరణ. వెతుకులాట మొదలు.' } },
    { placeId: 'kishkindha',  zoom: 8,  note: { en: '🤝 Ram meets Hanuman & Sugriva', hi: '🤝 राम की हनुमान और सुग्रीव से भेंट', te: '🤝 రాముడు హనుమంతుడు & సుగ్రీవుడిని కలిశాడు' } },
    { placeId: 'rameshwaram', zoom: 8,  note: { en: '🌊 The bridge to Lanka is built', hi: '🌊 लंका तक सेतु का निर्माण', te: '🌊 లంకకు వారధి నిర్మాణం' } },
    { placeId: 'lanka',       zoom: 7,  note: { en: '⚔️ Great battle! Sita freed! 🎉', hi: '⚔️ महायुद्ध! सीता मुक्त! 🎉', te: '⚔️ మహాయుద్ధం! సీత విముక్తి! 🎉' } },
  ],
  mahabharata: [
    { placeId: 'hastinapur',   zoom: 8, note: { en: '🎲 Dice game. Pandavas exiled.', hi: '🎲 पासों का खेल। पांडव निर्वासित।', te: '🎲 పాచికల ఆట. పాండవులు వనవాసం.' } },
    { placeId: 'indraprastha', zoom: 8, note: { en: '✨ Palace of illusions built', hi: '✨ मायामहल का निर्माण', te: '✨ మాయా సభ నిర్మాణం' } },
    { placeId: 'kurukshetra',  zoom: 8, note: { en: '🙏 The Gita is spoken. 18 days of war.', hi: '🙏 गीता का उपदेश। 18 दिन का युद्ध।', te: '🙏 గీత చెప్పబడింది. 18 రోజుల యుద్ధం.' } },
    { placeId: 'dwarka',       zoom: 7, note: { en: '🌊 Dwarka submerged. An era ends.', hi: '🌊 द्वारका डूबी। एक युग का अंत।', te: '🌊 ద్వారక మునిగింది. ఒక యుగం అంతం.' } },
  ],
};

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

// Interpolate N points between two coordinates
function interpolatePoints(from, to, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push({
      lat: from.lat + (to.lat - from.lat) * (i / steps),
      lng: from.lng + (to.lng - from.lng) * (i / steps),
    });
  }
  return pts;
}

// Journey popup shown at each stop
function JourneyPopup({ place, note, language }) {
  return (
    <OverlayView
      position={place.coordinates}
      mapPaneName={OverlayView.FLOAT_PANE}
      getPixelPositionOffset={(w) => ({ x: -(w / 2), y: -100 })}
    >
      <div className="journey-popup">
        <div className="jp-place">{tp(place.name, language)}</div>
        <div className="jp-note">{note[language] || note.en}</div>
      </div>
    </OverlayView>
  );
}

export function PlayButton({ onClick, isPlaying, onStop, language, hasJourney }) {
  const t_play = { en: '▶ Play Journey', hi: '▶ यात्रा देखें', te: '▶ యాత్ర చూడండి' };
  const t_stop = { en: '◼ Stop', hi: '◼ रोकें', te: '◼ ఆపు' };
  if (!hasJourney) return null;
  return isPlaying
    ? <button className="mv-stop-btn" onClick={onStop}>{t_stop[language] || t_stop.en}</button>
    : <button className="mv-play-btn" onClick={onClick}>{t_play[language] || t_play.en}</button>;
}

export function useJourneyAnimation({ book, mapRef, language }) {
  const [isPlaying, setIsPlaying]           = useState(false);
  const [activePopup, setActivePopup]       = useState(null); // { place, note }
  const polylineRef  = useRef(null);
  const cancelledRef = useRef(false);

  const bookKey = book?.id || book?.book?.toLowerCase();
  const stops   = JOURNEY_STOPS[bookKey] || [];
  const hasJourney = stops.length > 0;

  // Clean up polyline on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  const stopAnimation = useCallback(() => {
    cancelledRef.current = true;
    setIsPlaying(false);
    setActivePopup(null);
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(async () => {
    if (!mapRef.current || !stops.length) return;
    const map = mapRef.current;
    cancelledRef.current = false;

    // Remove old polyline
    if (polylineRef.current) { polylineRef.current.setMap(null); }

    // Create glowing polyline directly via Google Maps API
    polylineRef.current = new window.google.maps.Polyline({
      path: [],
      strokeColor: '#EF9F27',
      strokeWeight: 4,
      strokeOpacity: 0.95,
      geodesic: true,
      map,
      icons: [{
        icon: {
          path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 3.5,
          fillColor: '#EF9F27',
          fillOpacity: 1,
          strokeWeight: 0,
        },
        offset: '100%',
      }],
    });

    setIsPlaying(true);
    setActivePopup(null);

    // Pan back to start
    map.panTo(book.centerCoordinates);
    map.setZoom(5);
    await sleep(800);

    // Resolve place objects from IDs
    const placeMap = {};
    book.places.forEach(p => { placeMap[p.id] = p; });

    let prevCoords = null;

    for (let i = 0; i < stops.length; i++) {
      if (cancelledRef.current) break;

      const stop  = stops[i];
      const place = placeMap[stop.placeId];
      if (!place) continue;

      // Pan + zoom to this stop
      map.panTo(place.coordinates);
      map.setZoom(stop.zoom || 7);
      await sleep(700);
      if (cancelledRef.current) break;

      // Draw animated line from previous stop
      if (prevCoords) {
        const interp = interpolatePoints(prevCoords, place.coordinates, 35);
        for (const pt of interp) {
          if (cancelledRef.current) break;
          polylineRef.current?.getPath().push(new window.google.maps.LatLng(pt.lat, pt.lng));
          await sleep(45);
        }
      } else {
        // First point
        polylineRef.current?.getPath().push(
          new window.google.maps.LatLng(place.coordinates.lat, place.coordinates.lng)
        );
      }

      if (cancelledRef.current) break;

      // Show popup
      setActivePopup({ place, note: stop.note });
      await sleep(2200);
      setActivePopup(null);
      await sleep(200);

      prevCoords = place.coordinates;
    }

    if (!cancelledRef.current) {
      // Zoom back out to show full journey
      map.panTo(book.centerCoordinates);
      map.setZoom(book.defaultZoom || 5);
    }

    setIsPlaying(false);
  }, [book, mapRef, stops, language]);

  return { isPlaying, activePopup, hasJourney, startAnimation, stopAnimation };
}

export { JourneyPopup };
