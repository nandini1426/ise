import React, { useState } from 'react';
import LanguageSelector from './components/LanguageSelector/LanguageSelector';
import BookSelector from './components/BookSelector/BookSelector';
import MapView from './components/MapView/MapView';
import StoryMap from './components/StoryMap/StoryMap';

import ramayanaData          from './data/ramayana.json';
import mahabharataData       from './data/mahabharata.json';
import bhagavatamData        from './data/bhagavatam.json';
import shivaPuranaData       from './data/shiva_purana.json';
import deviBhagavataData     from './data/devi_bhagavata.json';
import vishnuPuranaData      from './data/vishnu_purana.json';
import brahmaPuranaData      from './data/brahma_purana.json';
import padmaPuranaData       from './data/padma_purana.json';
import naradaPuranaData      from './data/narada_purana.json';
import markandeyaPuranaData  from './data/markandeya_purana.json';
import agniPuranaData        from './data/agni_purana.json';
import brahmavaivartaData    from './data/brahmavaivarta_purana.json';
import lingaPuranaData       from './data/linga_purana.json';
import varahaPuranaData      from './data/varaha_purana.json';
import skandaPuranaData      from './data/skanda_purana.json';
import vamanaPuranaData      from './data/vamana_purana.json';
import kurmaPuranaData       from './data/kurma_purana.json';
import matsyaPuranaData      from './data/matsya_purana.json';
import garudaPuranaData      from './data/garuda_purana.json';
import brahmandaPuranaData   from './data/brahmanda_purana.json';
import bhavishyaPuranaData   from './data/bhavishya_purana.json';
import './App.css';

export const BOOKS_DATA = {
  ramayana: ramayanaData, mahabharata: mahabharataData,
  bhagavatam: bhagavatamData, shiva_purana: shivaPuranaData,
  devi_bhagavata: deviBhagavataData, vishnu_purana: vishnuPuranaData,
  brahma_purana: brahmaPuranaData, padma_purana: padmaPuranaData,
  narada_purana: naradaPuranaData, markandeya_purana: markandeyaPuranaData,
  agni_purana: agniPuranaData, brahmavaivarta_purana: brahmavaivartaData,
  linga_purana: lingaPuranaData, varaha_purana: varahaPuranaData,
  skanda_purana: skandaPuranaData, vamana_purana: vamanaPuranaData,
  kurma_purana: kurmaPuranaData, matsya_purana: matsyaPuranaData,
  garuda_purana: garudaPuranaData, brahmanda_purana: brahmandaPuranaData,
  bhavishya_purana: bhavishyaPuranaData,
};

function App() {
  const [screen, setScreen]               = useState('language');
  const [language, setLanguage]           = useState('en');
  const [selectedBook, setSelectedBook]   = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div className="app">
      {screen === 'language' && (
        <LanguageSelector onSelect={(lang) => { setLanguage(lang); setScreen('selector'); }} />
      )}
      {screen === 'selector' && (
        <BookSelector booksData={BOOKS_DATA} language={language}
          onBookSelect={(id) => { setSelectedBook(BOOKS_DATA[id]); setScreen('map'); }} />
      )}
      {screen === 'map' && selectedBook && (
        <MapView book={selectedBook} language={language}
          onPlaceClick={(place) => { setSelectedPlace(place); setScreen('storymap'); }}
          onBack={() => { setSelectedBook(null); setScreen('selector'); }} />
      )}
      {screen === 'storymap' && selectedPlace && (
        <StoryMap place={selectedPlace} bookName={selectedBook?.book}
          language={language}
          onBack={() => { setSelectedPlace(null); setScreen('map'); }} />
      )}
    </div>
  );
}

export default App;
