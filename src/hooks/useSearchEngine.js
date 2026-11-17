import { useState, useMemo, useCallback } from 'react';
import { initialPages } from '../data/initialData';
import { keywordFrequencySearch } from '../algorithms/keywordFrequency';
import { calculatePageRank, pageRankSearch, getPageLinkStats } from '../algorithms/pageRank';

let nextId = 7; // Initial pages use IDs 1-6

export function useSearchEngine() {
  const [pages, setPages] = useState(() => initialPages.map((p) => ({ ...p })));
  const [query, setQuery] = useState('');

  // Calculate PageRank whenever pages change
  const pageRankData = useMemo(() => calculatePageRank(pages), [pages]);

  // Calculate search results whenever query or pages change
  const oldResults = useMemo(() => keywordFrequencySearch(pages, query), [pages, query]);

  const newResults = useMemo(
    () => pageRankSearch(pages, query, pageRankData),
    [pages, query, pageRankData]
  );

  // Get link stats for all pages
  const linkStats = useMemo(() => {
    const stats = {};
    pages.forEach((page) => {
      stats[page.id] = getPageLinkStats(pages, page.id);
    });
    return stats;
  }, [pages]);

  const addPage = useCallback((url, content, outgoingLinks) => {
    const newPage = {
      id: nextId++,
      url,
      content,
      outgoingLinks: outgoingLinks || [],
    };
    setPages((prev) => [...prev, newPage]);
    return newPage;
  }, []);

  const updatePage = useCallback((id, url, content, outgoingLinks) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, url, content, outgoingLinks } : page
      )
    );
  }, []);

  const deletePage = useCallback((id) => {
    setPages((prev) => {
      // Remove the page and also remove any references to it in other pages' outgoing links
      return prev
        .filter((page) => page.id !== id)
        .map((page) => ({
          ...page,
          outgoingLinks: page.outgoingLinks.filter((linkId) => linkId !== id),
        }));
    });
  }, []);

  const resetDataset = useCallback(() => {
    nextId = 7;
    setPages(initialPages.map((p) => ({ ...p })));
    setQuery('');
  }, []);

  const search = useCallback((q) => {
    setQuery(q);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    pages,
    query,
    oldResults,
    newResults,
    pageRankData,
    linkStats,
    addPage,
    updatePage,
    deletePage,
    resetDataset,
    search,
    clearSearch,
  };
}

