// Translation cache — avoids repeat API calls within the session
const cache = {};

const LANG_NAMES = { hi: 'Hindi', te: 'Telugu' };

/**
 * Translate a scene's title + description via Anthropic API.
 * Returns the scene with translated fields, or original on error.
 */
export async function translateScene(scene, targetLang) {
  if (!targetLang || targetLang === 'en') return scene;

  const cacheKey = `${scene.id}_${targetLang}`;
  if (cache[cacheKey]) return cache[cacheKey];

  const langName = LANG_NAMES[targetLang] || targetLang;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        messages: [{
          role: 'user',
          content: `Translate the following two texts to ${langName}.
Return ONLY a valid JSON object with keys "title" and "description". 
No markdown, no backticks, no explanation.

Title: ${scene.title}
Description: ${scene.description}`,
        }],
      }),
    });

    const data = await response.json();
    const raw = data.content?.[0]?.text?.trim() || '';

    // Strip any accidental markdown fences
    const clean = raw.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(clean);

    const result = {
      ...scene,
      title: parsed.title || scene.title,
      description: parsed.description || scene.description,
    };
    cache[cacheKey] = result;
    return result;
  } catch {
    // Fallback: return English original
    return scene;
  }
}

/** Pre-translate all scenes of a place in the background */
export async function preFetchTranslations(allScenes, targetLang) {
  if (targetLang === 'en') return;
  // translate first 3 immediately, rest in background
  const priority = allScenes.slice(0, 3);
  const rest = allScenes.slice(3);
  await Promise.all(priority.map(s => translateScene(s, targetLang)));
  rest.forEach(s => translateScene(s, targetLang)); // fire-and-forget
}
