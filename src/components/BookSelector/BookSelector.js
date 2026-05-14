import React, { useState } from 'react';
import { CATEGORIES, BOOK_META } from '../../data/catalog';
import './BookSelector.css';

function BookCard({ bookId, meta, isAvailable, onSelect }) {
  return (
    <button
      className={`bs-card ${!isAvailable ? 'bs-card-locked' : ''}`}
      style={{ '--card-color': meta.color }}
      onClick={() => isAvailable && onSelect(bookId)}
      disabled={!isAvailable}
    >
      <div className="bs-card-icon" style={{ background: meta.bgColor || 'rgba(255,255,255,0.08)', color: meta.color }}>
        {meta.icon}
      </div>
      <div className="bs-card-body">
        <div className="bs-card-title">{meta.title}</div>
        {meta.author && <div className="bs-card-author">by {meta.author}</div>}
        <div className="bs-card-tagline">{meta.tagline}</div>
        {meta.yuga && <div className="bs-card-yuga">{meta.yuga}</div>}
      </div>
      <div className="bs-card-end">
        {isAvailable
          ? <span className="bs-arrow">→</span>
          : <span className="bs-coming-soon">Soon</span>
        }
      </div>
    </button>
  );
}

function BookSelector({ booksData, onBookSelect }) {
  const [expandedCategory, setExpandedCategory] = useState('itihasas');

  return (
    <div className="book-selector">
      {/* Header */}
      <div className="bs-header">
        <span className="bs-logo-icon">🗺️</span>
        <h1 className="bs-logo-name">StoryMaps</h1>
        <p className="bs-subtitle">Explore ancient scriptures through the places where they happened</p>
      </div>

      {/* Categories */}
      <div className="bs-body">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategory === cat.id;
          const availableCount = cat.books.filter(id => BOOK_META[id]?.available).length;

          return (
            <div key={cat.id} className="bs-category">
              <button
                className={`bs-cat-header ${isExpanded ? 'open' : ''}`}
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              >
                <div className="bs-cat-info">
                  <span className="bs-cat-label">{cat.label}</span>
                  <span className="bs-cat-subtitle">{cat.subtitle}</span>
                </div>
                <div className="bs-cat-meta">
                  <span className="bs-cat-count">{availableCount} available</span>
                  <span className="bs-cat-chevron">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="bs-book-list">
                  {cat.books.map(bookId => {
                    const meta = BOOK_META[bookId];
                    if (!meta) return null;
                    return (
                      <BookCard
                        key={bookId}
                        bookId={bookId}
                        meta={meta}
                        isAvailable={!!booksData[bookId]}
                        onSelect={onBookSelect}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Future religions teaser */}
        <div className="bs-future">
          <div className="bs-future-title">Coming Later</div>
          <div className="bs-future-chips">
            <span>☸️ Buddhism</span>
            <span>🕉️ Jainism</span>
            <span>✝️ Bible</span>
            <span>☪️ Quran</span>
            <span>✡️ Torah</span>
            <span>🌿 Vedas</span>
          </div>
        </div>
      </div>

      <div className="bs-footer">
        Navigate the map → Tap a node → Explore the story
      </div>
    </div>
  );
}

export default BookSelector;
