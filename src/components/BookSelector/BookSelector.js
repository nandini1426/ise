import React, { useState } from 'react';
import { CATEGORIES, BOOK_META } from '../../data/catalog';
import { T, BOOK_TITLES } from '../../data/translations';
import './BookSelector.css';

function BookCard({ bookId, meta, isAvailable, onSelect, language }) {
  const t = T[language] || T.en;
  const bt = (BOOK_TITLES[language] || BOOK_TITLES.en)[bookId];
  const title   = bt?.title   || meta.title;
  const tagline = bt?.tagline || meta.tagline;

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
        <div className="bs-card-title">{title}</div>
        {meta.author && <div className="bs-card-author">{t.byAuthor} {meta.author}</div>}
        <div className="bs-card-tagline">{tagline}</div>
        {meta.yuga && <div className="bs-card-yuga">{meta.yuga}</div>}
      </div>
      <div className="bs-card-end">
        {isAvailable
          ? <span className="bs-arrow">→</span>
          : <span className="bs-coming-soon">{t.comingSoon}</span>
        }
      </div>
    </button>
  );
}

function BookSelector({ booksData, onBookSelect, language = 'en' }) {
  const [expandedCategory, setExpandedCategory] = useState('itihasas');
  const t = T[language] || T.en;

  const CATEGORY_LABELS = {
    itihasas: { label: t.itihasasLabel, subtitle: t.itihasasSub },
    puranas:  { label: t.puranasLabel,  subtitle: t.puranasSub  },
  };

  const RELIGION_KEYS = ['religion_buddhism','religion_jainism','religion_bible','religion_quran','religion_torah','religion_vedas'];

  return (
    <div className="book-selector">
      <div className="bs-header">
        <span className="bs-logo-icon">🗺️</span>
        <h1 className="bs-logo-name">{t.appName}</h1>
        <p className="bs-subtitle">{t.tagline}</p>
      </div>

      <div className="bs-body">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategory === cat.id;
          const availableCount = cat.books.filter(id => BOOK_META[id]?.available).length;
          const cl = CATEGORY_LABELS[cat.id] || { label: cat.label, subtitle: cat.subtitle };

          return (
            <div key={cat.id} className="bs-category">
              <button
                className={`bs-cat-header ${isExpanded ? 'open' : ''}`}
                onClick={() => setExpandedCategory(isExpanded ? null : cat.id)}
              >
                <div className="bs-cat-info">
                  <span className="bs-cat-label">{cl.label}</span>
                  <span className="bs-cat-subtitle">{cl.subtitle}</span>
                </div>
                <div className="bs-cat-meta">
                  <span className="bs-cat-count">{availableCount} {t.available}</span>
                  <span className="bs-cat-chevron">{isExpanded ? '▲' : '▼'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="bs-book-list">
                  {cat.books.map(bookId => {
                    const meta = BOOK_META[bookId];
                    if (!meta) return null;
                    return (
                      <BookCard key={bookId} bookId={bookId} meta={meta}
                        isAvailable={!!booksData[bookId]}
                        onSelect={onBookSelect} language={language} />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        <div className="bs-future">
          <div className="bs-future-title">{t.comingLater}</div>
          <div className="bs-future-chips">
            {RELIGION_KEYS.map(k => <span key={k}>{t[k]}</span>)}
          </div>
        </div>
      </div>

      <div className="bs-footer">{t.navHint}</div>
    </div>
  );
}

export default BookSelector;
