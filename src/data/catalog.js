// Master catalog — all Hindu scriptures
// available: true = JSON data exists | false = Coming Soon

export const CATEGORIES = [
  {
    id: 'itihasas',
    label: 'Itihasas',
    subtitle: 'The Great Epics',
    books: ['ramayana', 'mahabharata'],
  },
  {
    id: 'puranas',
    label: '18 Mahapuranas',
    subtitle: 'The Ancient Chronicles',
    books: [
      'bhagavatam', 'shiva_purana', 'devi_bhagavata',
      'vishnu_purana', 'brahma_purana', 'padma_purana',
      'narada_purana', 'markandeya_purana', 'agni_purana',
      'bhavishya_purana', 'brahmavaivarta_purana', 'linga_purana',
      'varaha_purana', 'skanda_purana', 'vamana_purana',
      'kurma_purana', 'matsya_purana', 'garuda_purana',
    ],
  },
];

export const BOOK_META = {
  // ── Itihasas ──
  ramayana: {
    title: 'Ramayana',
    author: 'Valmiki',
    icon: '🏹',
    color: '#EF9F27',
    bgColor: '#FAEEDA',
    tagline: 'The divine journey of Ram — from Ayodhya to Lanka',
    yuga: 'Treta Yuga',
    available: true,
    dataKey: 'ramayana',
  },
  mahabharata: {
    title: 'Mahabharata',
    author: 'Vyasa',
    icon: '⚔️',
    color: '#3B6D11',
    bgColor: '#EAF3DE',
    tagline: 'The great war of Kurukshetra — Dharma vs Adharma',
    yuga: 'Dwapara Yuga',
    available: true,
    dataKey: 'mahabharata',
  },

  // ── Puranas — available ──
  bhagavatam: {
    title: 'Bhagavata Purana',
    author: 'Vyasa',
    icon: '🪷',
    color: '#7B4EA8',
    bgColor: '#F3EBF9',
    tagline: "Krishna's divine leelas — from Mathura to Dwarka",
    yuga: 'Dwapara Yuga',
    available: true,
    dataKey: 'bhagavatam',
  },
  shiva_purana: {
    title: 'Shiva Purana',
    author: 'Vyasa',
    icon: '🔱',
    color: '#4A7BB5',
    bgColor: '#E8F0FA',
    tagline: '12 Jyotirlinga shrines — the sacred geography of Shiva',
    yuga: 'Timeless',
    available: true,
    dataKey: 'shiva_purana',
  },
  devi_bhagavata: {
    title: 'Devi Bhagavata',
    author: 'Vyasa',
    icon: '🌺',
    color: '#C0392B',
    bgColor: '#FDEDEC',
    tagline: '51 Shakti Peethas — the divine feminine across India',
    yuga: 'Timeless',
    available: true,
    dataKey: 'devi_bhagavata',
  },

  // ── Puranas — coming soon ──
  vishnu_purana:        { title: 'Vishnu Purana',        icon: '🐚', color: '#2E86AB', available: false, tagline: 'The cosmic cycles and Vishnu\'s avatars' },
  brahma_purana:        { title: 'Brahma Purana',         icon: '🪷', color: '#F39C12', available: false, tagline: 'Creation of the universe by Brahma' },
  padma_purana:         { title: 'Padma Purana',          icon: '🌸', color: '#E91E63', available: false, tagline: 'Stories of the lotus-born world' },
  narada_purana:        { title: 'Narada Purana',         icon: '🎵', color: '#9C27B0', available: false, tagline: 'Divine music and the path of devotion' },
  markandeya_purana:    { title: 'Markandeya Purana',     icon: '🦁', color: '#FF5722', available: false, tagline: 'Devi Mahatmya — the glory of the Goddess' },
  agni_purana:          { title: 'Agni Purana',           icon: '🔥', color: '#FF6F00', available: false, tagline: 'Rituals, weapons and sacred knowledge' },
  bhavishya_purana:     { title: 'Bhavishya Purana',      icon: '🔮', color: '#607D8B', available: false, tagline: 'Prophecies and future events' },
  brahmavaivarta_purana:{ title: 'Brahmavaivarta Purana', icon: '☀️', color: '#FFC107', available: false, tagline: 'Krishna and Radha — the divine romance' },
  linga_purana:         { title: 'Linga Purana',          icon: '🪨', color: '#78909C', available: false, tagline: 'The cosmic form and worship of Shiva' },
  varaha_purana:        { title: 'Varaha Purana',         icon: '🐗', color: '#795548', available: false, tagline: 'The boar avatar rescues Earth' },
  skanda_purana:        { title: 'Skanda Purana',         icon: '🌿', color: '#388E3C', available: false, tagline: 'The largest Purana — pilgrimage sites of India' },
  vamana_purana:        { title: 'Vamana Purana',         icon: '👣', color: '#0097A7', available: false, tagline: 'The dwarf avatar defeats King Bali' },
  kurma_purana:         { title: 'Kurma Purana',          icon: '🐢', color: '#5D4037', available: false, tagline: 'The tortoise avatar and the churning of the ocean' },
  matsya_purana:        { title: 'Matsya Purana',         icon: '🐟', color: '#1565C0', available: false, tagline: 'The fish avatar saves the world from floods' },
  garuda_purana:        { title: 'Garuda Purana',         icon: '🦅', color: '#F57F17', available: false, tagline: 'The sacred eagle — life, death and afterlife' },
  brahmanda_purana:     { title: 'Brahmanda Purana',      icon: '🌌', color: '#311B92', available: false, tagline: 'The cosmic egg and origin of the universe' },
};
