"use client";

import React, { useMemo, useState } from "react";
import GIProductCard from "@/components/GIProductCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useLanguage } from "@/hooks/useLanguage";
import { mapGIProductToCard } from "@/services/gi-products.service";
import type { GIProduct } from "@/lib/api/gi-products.types";

interface GIProductListProps {
  initialItems: GIProduct[];
}

export default function GIProductList({ initialItems }: GIProductListProps) {
  const [search, setSearch] = useState("");
  const lang = useLanguage();
  const isHi = lang === "hi";

  const products = useMemo(
    () => initialItems.map((item) => mapGIProductToCard(item, isHi)),
    [initialItems, isHi]
  );

  const query = search.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!query) return products;
    return products.filter((product) => {
      const haystack = `${product.name} ${product.subtitle}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [products, query]);

  useScrollReveal([filteredProducts.length, query]);

  const headingText = isHi
    ? "भौगोलिक संकेत (जीआई) उत्पाद"
    : "Geographical Indications (GI) Products";

  const searchPlaceholder = isHi ? "जीआई उत्पाद खोजें…" : "Search GI product by name…";
  const searchAriaLabel = isHi ? "जीआई उत्पाद खोजें" : "Search GI product by name";
  const clearSearchAria = isHi ? "खोज साफ़ करें" : "Clear search";
  const submitSearchAria = isHi ? "जीआई उत्पाद खोजें" : "Search GI products";

  const searchMetaText = isHi
    ? `${products.length} में से ${filteredProducts.length} जीआई उत्पाद दिखाए जा रहे हैं`
    : `Showing ${filteredProducts.length} of ${products.length} GI products`;

  const emptyMessage = query
    ? isHi
      ? `"${search.trim()}" के लिए कोई जीआई उत्पाद नहीं मिला।`
      : `No GI products found for "${search.trim()}".`
    : isHi
      ? "कोई जीआई उत्पाद नहीं मिला।"
      : "No GI products found.";

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  return (
    <section className="section" aria-label={headingText}>
      <div className="container">
        <div className="district-products-capsule-heading-wrap">
          <h1 className="resource-heading-common">{headingText}</h1>
        </div>

        <div
          className="district-list-search"
          aria-label={isHi ? "जीआई उत्पाद खोज" : "GI product search"}
        >
          <form className="district-list-search-form" onSubmit={handleSearchSubmit}>
            <div className="district-search-wrap">
              <i className="fas fa-search district-search-icon" aria-hidden="true" />
              <input
                type="search"
                className="district-search-input"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label={searchAriaLabel}
                autoComplete="off"
                enterKeyHint="search"
              />
              {search.length > 0 && (
                <button
                  type="button"
                  className="district-search-clear"
                  onClick={handleClearSearch}
                  aria-label={clearSearchAria}
                >
                  <i className="fas fa-times" aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                className="district-search-submit"
                aria-label={submitSearchAria}
              >
                <i className="fas fa-arrow-right" aria-hidden="true" />
              </button>
            </div>
          </form>
          <p className="district-search-meta" aria-live="polite">
            {searchMetaText}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="district-no-results" style={{ display: "block" }}>
            {emptyMessage}
          </div>
        ) : (
          <div className="gi-products-grid">
            {filteredProducts.map((product, index) => (
              <GIProductCard
                key={`${product.id}-${product.slug}`}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
