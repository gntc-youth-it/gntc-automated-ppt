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
export const parseInput = (text) => {
  if (!text) return { title: '', source: '', slides: [] };

  const lines = text.split('\n');
  let title = '';
  let source = '';
  let remainingArgs = [];

  // Extract Title (Line 1)
  if (lines.length > 0) {
    title = lines[0].trim();
  }

  // Extract Source (Line 2)
  if (lines.length > 1) {
    source = lines[1].trim();
  }

  // Find where the lyrics start.
  // We look for "---" or just start from line 3.
  let startIndex = 2;
  
  // Checking if there is a specific separator "---" in the first few lines?
  // User prompt said:
  // 첫번째줄: 제목
  // 두번째줄: 출처
  // ---: 가사시작
  // So likely the 3rd line is "---".
  
  const separatorIndex = lines.findIndex(line => line.trim().startsWith('---'));
  if (separatorIndex !== -1) {
      // If we found a separator, lyrics start after it.
      // But we should also be careful if the separator is line 1 or 2 (unlikely based on prompt).
      startIndex = separatorIndex + 1;
  }

  // Join the remaining lines to process the // separator
  const remainingText = lines.slice(startIndex).join('\n');

  // Split by "//" for slides
  // We should also handle the case where "---" might not exist or the user just starts typing.
  // But strict adherence to the prompt implies line 3 is separator.
  
  const slides = remainingText.split('//').map(slide => slide.trim()).filter(slide => slide !== '');

  return {
    title,
    source,
    slides
  };
};
