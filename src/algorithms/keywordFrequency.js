/**
 * Old Algorithm – Keyword Frequency Based Ranking
 *
 * Counts how many times the search keyword appears in each page's content
 * and ranks pages by frequency in descending order.
 */

export function keywordFrequencySearch(pages, query) {
  if (!query || !query.trim()) return [];

  const keyword = query.trim().toLowerCase();

  const results = pages
    .map((page) => {
      const content = page.content.toLowerCase();
      // Split content into words and count exact matches
      const words = content.split(/\s+/);
      const frequency = words.filter((word) => word === keyword).length;
      return { ...page, frequency };
    })
    .filter((page) => page.frequency > 0)
    .sort((a, b) => b.frequency - a.frequency);

  return results;
}

