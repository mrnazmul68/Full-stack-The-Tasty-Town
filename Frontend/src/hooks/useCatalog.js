import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { publicApi } from "../services/api";
import { buildFallbackCatalogData, hydrateCatalogData } from "../utils/siteData";

const CATALOG_RETRY_DELAY_MS = 3000;

export const useCatalog = () => {
  const fallbackCatalog = useMemo(() => buildFallbackCatalogData(), []);
  const [catalogData, setCatalogData] = useState(fallbackCatalog);
  const [catalogMessage, setCatalogMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchPersistentResults, setSearchPersistentResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const fetchCatalogData = async (isActive = true) => {
    try {
      const data = await publicApi.getCatalogBootstrap();
      if (!isActive) return;
      const hydratedData = hydrateCatalogData(data);
      setCatalogData(hydratedData);
      setCatalogMessage("");
    } catch (error) {
      if (!isActive) return;
      setCatalogMessage(`${error.message}. Showing local menu.`);
      setTimeout(() => fetchCatalogData(isActive), CATALOG_RETRY_DELAY_MS);
    }
  };

  useEffect(() => {
    let isActive = true;
    fetchCatalogData(isActive);
    return () => { isActive = false; };
  }, []);

  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchPersistentResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(() => {
      try {
        const results = catalogData.items.filter(i => 
          i.name.toLowerCase().includes(query) || 
          i.categorySlug.toLowerCase().includes(query) ||
          i.description?.toLowerCase().includes(query)
        );
        setSearchPersistentResults(results);
        setIsSearching(false);
      } catch (err) {
        setSearchError("Failed to process search. Please try again.");
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, catalogData.items]);

  const handleSubmitReview = async (formData) => {
    try {
      await publicApi.createReview(formData);
      await fetchCatalogData();
      toast.success("Review submitted! Thank you.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return {
    catalogData,
    setCatalogData,
    catalogMessage,
    searchQuery,
    setSearchQuery,
    isSearching,
    searchPersistentResults,
    searchError,
    handleSubmitReview,
    fetchCatalogData
  };
};
