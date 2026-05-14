import React, { useState } from 'react';
import BookSelector from './components/BookSelector/BookSelector';
import MapView from './components/MapView/MapView';
import StoryMap from './components/StoryMap/StoryMap';
import ramayanaData from './data/ramayana.json';
import mahabharataData from './data/mahabharata.json';
import './App.css';

const BOOKS = {
  ramayana: ramayanaData,
  mahabharata: mahabharataData,
};

function App() {
  const [screen, setScreen] = useState('selector'); // 'selector' | 'map' | 'storymap'
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleBookSelect = (bookId) => {
    setSelectedBook(BOOKS[bookId]);
    setScreen('map');
  };

  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setScreen('storymap');
  };

  const handleBackToSelector = () => {
    setSelectedBook(null);
    setSelectedPlace(null);
    setScreen('selector');
  };

  const handleBackToMap = () => {
    setSelectedPlace(null);
    setScreen('map');
  };

  return (
    <div className="app">
      {screen === 'selector' && (
        <BookSelector onBookSelect={handleBookSelect} books={BOOKS} />
      )}
      {screen === 'map' && selectedBook && (
        <MapView
          book={selectedBook}
          onPlaceClick={handlePlaceClick}
          onBack={handleBackToSelector}
        />
      )}
      {screen === 'storymap' && selectedPlace && (
        <StoryMap
          place={selectedPlace}
          bookName={selectedBook?.book}
          onBack={handleBackToMap}
        />
      )}
    </div>
  );
}

export default App;
