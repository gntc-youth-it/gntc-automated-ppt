/**
 * Parses the input text into a structured format for PPT generation.
 * 
 * Format assumptions:
 * Line 1: Title
 * Line 2: Source
 * --- : Separator (optional, but marks end of header)
 * // : Slide delimiter
 * 
 * @param {string} text 
 * @returns {Object} { title, source, slides: string[] }
 */
/**
 * Parses the input text into a structured format for PPT generation.
 * Supports multiple songs.
 * 
 * Format assumptions:
 * # Title : Starts a new song
 * ## Source : Sets the source for the current song
 * // : Slide delimiter
 * 
 * @param {string} text 
 * @returns {Array<{ title: string, source: string, slides: string[] }>}
 */
export const parseInput = (text) => {
  if (!text) return [];

  const lines = text.split('\n');
  const songs = [];
  let currentSong = { title: '', source: '', slides: [] };
  let currentLyrics = [];

  const finalizeSong = () => {
    if (currentSong.title || currentSong.source || currentLyrics.length > 0) {
      // Process the last chunk of lyrics into slides
      const joinedLyrics = currentLyrics.join('\n').trim();
      if (joinedLyrics) {
        const slides = joinedLyrics.split('//').map(s => s.trim()).filter(s => s !== '');
        currentSong.slides.push(...slides);
      }

      // Only add if it has content
      if (currentSong.title || currentSong.source || currentSong.slides.length > 0) {
        songs.push(currentSong);
      }
    }
  };

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('# ')) {
      // New Song Title detected -> Finalize previous song
      finalizeSong();

      // Start new song
      currentSong = { title: trimmed.substring(2).trim(), source: '', slides: [] };
      currentLyrics = [];
    } else if (trimmed.startsWith('## ')) {
      // Source detected
      currentSong.source = trimmed.substring(3).trim();
    } else if (trimmed === '//') {
      // Explicit slide break (handled in lyrics processing but good to keep clean buffer)
      currentLyrics.push(trimmed);
    } else {
      // Lyrics or empty lines
      currentLyrics.push(line);
    }
  });

  // Finalize the last song
  finalizeSong();

  return songs;
};
