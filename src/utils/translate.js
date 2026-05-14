const cache = {};

export async function translateScene(scene, targetLang) {
  if (!targetLang || targetLang === 'en') return scene;
  const cacheKey = `${scene.id}_${targetLang}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const langName = targetLang === 'hi' ? 'Hindi' : 'Telugu';
  const encode = encodeURIComponent;

  // Try LibreTranslate (free, open-source, CORS-enabled)
  const libreUrl = 'https://libretranslate.com/translate';
  // Fallback: MyMemory
  const mmUrl = (text) =>
    `https://api.mymemory.translated.net/get?q=${encode(text)}&langpair=en|${targetLang}`;

  const tryTranslate = async (text) => {
    // Method 1: MyMemory GET (most reliable from browser)
    try {
      const r = await fetch(mmUrl(text), { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const d = await r.json();
        const t = d?.responseData?.translatedText;
        if (t && t !== text && d?.responseStatus === 200) return t;
      }
    } catch {}

    // Method 2: Google unofficial (no key needed)
    try {
      const r = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encode(text)}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        const t = d?.[0]?.map(x => x?.[0]).filter(Boolean).join('');
        if (t && t !== text) return t;
      }
    } catch {}

    return text; // fallback to English
  };

  try {
    const [title, description] = await Promise.all([
      tryTranslate(scene.title),
      tryTranslate(scene.description),
    ]);
    const result = { ...scene, title, description };
    cache[cacheKey] = result;
    return result;
  } catch {
    return scene;
  }
}
