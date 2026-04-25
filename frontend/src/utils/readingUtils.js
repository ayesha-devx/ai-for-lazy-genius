/**
 * Calculates reading time based on word count.
 * Average reading speed is 200 words per minute.
 */
export const calculateReadingTime = (content) => {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

/**
 * Extracts headings from Markdown content for Table of Contents.
 * Matches # (h1), ## (h2), and ### (h3).
 */
export const extractHeadings = (content) => {
  if (!content) return [];
  
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
      
    headings.push({ level, text, id });
  }

  return headings;
};
