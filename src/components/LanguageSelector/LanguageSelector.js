import React, { useState } from 'react';
import { LANG_META } from '../../data/translations';
import './LanguageSelector.css';

function LanguageSelector({ onSelect }) {
  const [chosen, setChosen] = useState('en');

  return (
    <div className="lang-screen">
      <div className="lang-hero">
        <div className="lang-logo">🗺️</div>
        <h1 className="lang-app-name">StoryMaps</h1>
        <p className="lang-multi">
          <span lang="en">Explore Ancient Scriptures</span>
          <span className="lang-dot">·</span>
          <span lang="hi">प्राचीन ग्रंथ</span>
          <span className="lang-dot">·</span>
          <span lang="te">పురాతన గ్రంథాలు</span>
        </p>
      </div>

      <div className="lang-body">
        <p className="lang-prompt">Choose your language · भाषा चुनें · భాష ఎంచుకోండి</p>

        <div className="lang-options">
          {Object.entries(LANG_META).map(([code, meta]) => (
            <button
              key={code}
              className={`lang-option ${chosen === code ? 'selected' : ''}`}
              onClick={() => setChosen(code)}
            >
              <span className="lang-flag">{meta.flag}</span>
              <span className="lang-native">{meta.native}</span>
              <span className="lang-english">{meta.name}</span>
              {chosen === code && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>

        <button className="lang-continue" onClick={() => onSelect(chosen)}>
          {chosen === 'hi' ? 'आगे बढ़ें →' : chosen === 'te' ? 'కొనసాగించు →' : 'Continue →'}
        </button>
      </div>

      <p className="lang-footer">
        Ramayana · Mahabharata · 18 Puranas
      </p>
    </div>
  );
}

export default LanguageSelector;
