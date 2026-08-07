// Returns the couple's custom song URL if they placed one in src/assets/music,
// otherwise null (the app then falls back to the gentle generated melody).
export function getCustomTrack() {
  try {
    const ctx = require.context("../assets/music", false, /\.(mp3|wav|ogg|m4a|aac)$/i);
    const keys = ctx.keys().sort();
    if (keys.length) {
      const mod = ctx(keys[0]);
      return mod.default || mod;
    }
  } catch (e) {
    // folder empty / not found -> use generated melody
  }
  return null;
}
