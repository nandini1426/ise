import React, { useState, useEffect } from 'react';
import { LANG_META, T } from '../../data/translations';
import { translateScene } from '../../utils/translate';

const PLACEHOLDER_COLORS = ['#2a1a3e','#0e2a1a','#1a2a0e','#1a1a2e','#2e1a0e'];
const PLACEHOLDER_ICONS  = ['👑','⚔️','🏹','🌿','🙏'];

// Pick best available TTS voice for the language
function getVoice(targetLang) {
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const prefix = targetLang.split('-')[0];
  return (
    voices.find(v => v.lang === targetLang) ||
    voices.find(v => v.lang.startsWith(prefix)) ||
    null
  );
}

function SceneCard({ scene, index, isActive, onClick, language = 'en' }) {
  const [imgError, setImgError]         = useState(false);
  const [speaking, setSpeaking]         = useState(false);
  const [translating, setTranslating]   = useState(false);
  const [displayScene, setDisplayScene] = useState(scene);

  const t = T[language] || T.en;
  const showPlaceholder = !scene.image || imgError;

  // Translate when scene or language changes
  useEffect(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);

    if (language === 'en') {
      setDisplayScene(scene);
      return;
    }

    setTranslating(true);
    setDisplayScene(scene); // show English while translating

    translateScene(scene, language).then(translated => {
      setDisplayScene(translated);
      setTranslating(false);
    });
  }, [scene.id, language]); // eslint-disable-line

  const handleVoice = (e) => {
    e.stopPropagation();
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const speechLang = LANG_META[language]?.speech || 'en-IN';
    const text = `${displayScene.title}. ${displayScene.description}`;
    const utter = new SpeechSynthesisUtterance(text);

    // Wait for voices to load (some browsers load async)
    const trySpeak = () => {
      const voice = getVoice(speechLang);
      if (voice) utter.voice = voice;
      utter.lang  = speechLang;
      utter.rate  = 0.88;
      utter.pitch = 1.05;
      utter.onend   = () => setSpeaking(false);
      utter.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utter);
    };

    // Voices may not be loaded yet
    if (window.speechSynthesis.getVoices().length) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
      window.speechSynthesis.getVoices(); // trigger load
    }
  };

  return (
    <div className={`scene-card ${isActive ? 'active' : ''}`} onClick={onClick}>
      {/* Image */}
      <div className="sc-image-area">
        {showPlaceholder ? (
          <div className="sc-placeholder" style={{ background: PLACEHOLDER_COLORS[index % 5] }}>
            <span className="sc-placeholder-icon">{PLACEHOLDER_ICONS[index % 5]}</span>
          </div>
        ) : (
          <img src={scene.image} alt={scene.title} className="sc-img"
            onError={() => setImgError(true)} />
        )}
        <div className="sc-badge">#{scene.sceneNumber}</div>
        {scene.subPlaceName && (
          <div className="sc-location-tag">📍 {scene.subPlaceName}</div>
        )}
      </div>

      {/* Text */}
      <div className="sc-body">
        {translating ? (
          <div className="sc-translating">
            <span className="sc-translate-dots"><span/><span/><span/></span>
            <span className="sc-translate-label">
              {t.translatingMsg}
            </span>
          </div>
        ) : (
          <>
            <div className="sc-title">{displayScene.title}</div>
            <div className="sc-desc">{displayScene.description}</div>
          </>
        )}

        <button
          className={`sc-voice-btn ${speaking ? 'speaking' : ''}`}
          onClick={handleVoice}
          disabled={translating}
        >
          {speaking ? (
            <><span className="sc-voice-wave"><span/><span/><span/><span/></span>
              <span className="sc-voice-label">{t.stopReading}</span></>
          ) : (
            <><span className="sc-voice-icon">🔊</span>
              <span className="sc-voice-label">{t.readAloud}</span></>
          )}
        </button>
      </div>
    </div>
  );
}

export default SceneCard;
