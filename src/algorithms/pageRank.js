/**
 * New Algorithm – PageRank / Link Analysis Based Ranking
 *
 * Implements the iterative PageRank algorithm:
 *   PR(A) = (1 - d) / N + d × Σ(PR(T) / L(T))
 *
 * Where:
 *   PR(A) = PageRank of page A
 *   d     = Damping factor (0.85)
 *   N     = Total number of pages
 *   T     = Pages linking to A
 *   L(T)  = Number of outgoing links from page T
 */

const DAMPING_FACTOR = 0.85;
const MAX_ITERATIONS = 100;
const CONVERGENCE_THRESHOLD = 1e-6;

/**
 * Calculate incoming links for each page from the link graph.
 */
function buildIncomingLinks(pages) {
  const incoming = {};
  pages.forEach((page) => {
    incoming[page.id] = [];
  });
  pages.forEach((page) => {
    page.outgoingLinks.forEach((targetId) => {
      if (incoming[targetId]) {
        incoming[targetId].push(page.id);
      }
    });
  });
  return incoming;
}

/**
 * Calculate PageRank scores for all pages using iterative algorithm.
 * Returns { scores: { [pageId]: score }, iterations: number }
 */
export function calculatePageRank(pages) {
  const N = pages.length;
  if (N === 0) return { scores: {}, iterations: 0, dampingFactor: DAMPING_FACTOR };

  const incomingLinks = buildIncomingLinks(pages);

  // Build a map of page id -> outgoing link count
  const outgoingCount = {};
  pages.forEach((page) => {
    outgoingCount[page.id] = page.outgoingLinks.length;
  });

  // Identify dangling nodes (pages with no outgoing links)
  const danglingNodes = pages.filter((p) => p.outgoingLinks.length === 0).map((p) => p.id);

  // Initialize all pages with equal PageRank
  let scores = {};
  pages.forEach((page) => {
    scores[page.id] = 1 / N;
  });

  let iterations = 0;

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const newScores = {};
    iterations = i + 1;

    // Calculate the dangling node contribution (distributed equally)
    let danglingSum = 0;
    danglingNodes.forEach((id) => {
      danglingSum += scores[id];
    });
    const danglingContribution = (DAMPING_FACTOR * danglingSum) / N;

    pages.forEach((page) => {
      let linkSum = 0;

      // Sum contributions from all pages linking to this page
      incomingLinks[page.id].forEach((sourceId) => {
        linkSum += scores[sourceId] / outgoingCount[sourceId];
      });

      newScores[page.id] =
        (1 - DAMPING_FACTOR) / N + DAMPING_FACTOR * linkSum + danglingContribution;
    });

    // Check for convergence
    let maxDiff = 0;
    pages.forEach((page) => {
      maxDiff = Math.max(maxDiff, Math.abs(newScores[page.id] - scores[page.id]));
    });

    scores = newScores;

    if (maxDiff < CONVERGENCE_THRESHOLD) {
      break;
    }
  }

  // Normalize so total equals 1
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
  if (total > 0) {
    Object.keys(scores).forEach((id) => {
      scores[id] = scores[id] / total;
    });
  }

  return { scores, iterations, dampingFactor: DAMPING_FACTOR };
}

/**
 * Search pages by keyword and rank by PageRank score.
 * First filters pages containing the keyword, then sorts by PageRank.
 */
export function pageRankSearch(pages, query, pageRankData) {
  if (!query || !query.trim()) return [];

  const keyword = query.trim().toLowerCase();
  const { scores } = pageRankData;

  const results = pages
    .filter((page) => {
      const content = page.content.toLowerCase();
      const words = content.split(/\s+/);
      return words.some((word) => word === keyword);
    })
    .map((page) => ({
      ...page,
      pageRankScore: scores[page.id] || 0,
    }))
    .sort((a, b) => b.pageRankScore - a.pageRankScore);

  return results;
}

/**
 * Get link statistics for a specific page.
 */
export function getPageLinkStats(pages, pageId) {
  const page = pages.find((p) => p.id === pageId);
  if (!page) return { incoming: 0, outgoing: 0 };

  const incoming = pages.filter((p) => p.outgoingLinks.includes(pageId)).length;
  const outgoing = page.outgoingLinks.length;

  return { incoming, outgoing };
}

