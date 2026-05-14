import React from 'react';
import './BookSelector.css';

const BOOK_META = {
  ramayana: {
    icon: '🏹',
    color: '#EF9F27',
    bgColor: '#FAEEDA',
    tagline: 'The journey of Ram — from Ayodhya to Lanka',
    period: 'Treta Yuga',
  },
  mahabharata: {
    icon: '⚔️',
    color: '#3B6D11',
    bgColor: '#EAF3DE',
    tagline: 'The great war at Kurukshetra — Dharma vs Adharma',
    period: 'Dwapara Yuga',
  },
  bhagavatam: {
    icon: '🪷',
    color: '#7B4EA8',
    bgColor: '#F3EBF9',
    tagline: 'The divine stories of Lord Vishnu and his avatars',
    period: 'Across all Yugas',
  },
};

function BookSelector({ onBookSelect, books }) {
  const availableBooks = Object.keys(books);

  return (
    <div className="book-selector">
      <div className="bs-header">
        <div className="bs-logo">
          <span className="bs-logo-icon">🗺️</span>
          <span className="bs-logo-name">StoryMaps</span>
        </div>
        <p className="bs-subtitle">
          Explore ancient Indian scriptures through the places where history happened
        </p>
      </div>

      <div className="bs-cards-container">
        <h2 className="bs-section-title">Choose a Scripture</h2>
        <div className="bs-cards">
          {availableBooks.map((bookId) => {
            const book = books[bookId];
            const meta = BOOK_META[bookId] || {};
            const majorCount = book.places?.filter(p => p.importance === 1).length || 0;
            const minorCount = book.places?.reduce(
              (acc, p) => acc + (p.subPlaces?.length || 0), 0
            ) || 0;

            return (
              <button
                key={bookId}
                className="bs-card"
                onClick={() => onBookSelect(bookId)}
                style={{ '--card-color': meta.color, '--card-bg': meta.bgColor }}
              >
                <div className="bs-card-icon" style={{ background: meta.bgColor, color: meta.color }}>
                  {meta.icon}
                </div>
                <div className="bs-card-body">
                  <h3 className="bs-card-title">{book.book}</h3>
                  <p className="bs-card-tagline">{meta.tagline}</p>
                  <div className="bs-card-stats">
                    <span className="bs-stat">
                      <span className="bs-stat-dot major" />
                      {majorCount} major places
                    </span>
                    <span className="bs-stat">
                      <span className="bs-stat-dot minor" />
                      {minorCount} sub-places
                    </span>
                  </div>
                  <div className="bs-card-period">{meta.period}</div>
                </div>
                <div className="bs-card-arrow">→</div>
              </button>
            );
          })}

          {/* Coming Soon: Bhagavatam */}
          <div className="bs-card bs-card-disabled">
            <div className="bs-card-icon" style={{ background: '#F3EBF9', color: '#7B4EA8' }}>
              🪷
            </div>
            <div className="bs-card-body">
              <h3 className="bs-card-title">Bhagavatam</h3>
              <p className="bs-card-tagline">{BOOK_META.bhagavatam.tagline}</p>
              <div className="bs-coming-soon">Coming Soon</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bs-footer">
        <p>Navigate the map → Hover for modern names → Click to explore scenes</p>
      </div>
    </div>
  );
}

export default BookSelector;
