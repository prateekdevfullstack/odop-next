"use client";



import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import DistrictProductCard from "@/components/DistrictProductCard";

import { useScrollReveal } from "@/hooks/useScrollReveal";

import { useLanguage } from "@/hooks/useLanguage";

import {

  fetchPublicDistricts,

  mapPublicDistrictToCard,

  parsePublicDistrictListResponse,

} from "@/services/districts.service";

import { ApiError } from "@/lib/api/types";

import type { PublicDistrict, PublicDistrictListMeta } from "@/lib/api/districts.types";



interface DistrictListProps {

  initialItems: PublicDistrict[];

  initialMeta?: PublicDistrictListMeta;

}



export default function DistrictList({

  initialItems,

  initialMeta,

}: DistrictListProps) {

  const [rawDistricts, setRawDistricts] = useState(initialItems);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [total, setTotal] = useState(initialMeta?.total ?? initialItems.length);

  const [gridKey, setGridKey] = useState(0);

  const lang = useLanguage();

  const isHi = lang === "hi";



  const districts = useMemo(

    () => rawDistricts.map((item) => mapPublicDistrictToCard(item, isHi)),

    [rawDistricts, isHi]

  );



  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const requestIdRef = useRef(0);

  const abortRef = useRef<AbortController | null>(null);

  const skipMountRefetchRef = useRef(initialItems.length > 0);



  useScrollReveal([gridKey, districts.length]);



  const applyDistrictResults = useCallback((items: PublicDistrict[], nextTotal: number) => {

    setRawDistricts(items);

    setTotal(nextTotal);

    setGridKey((key) => key + 1);

  }, []);



  const fetchDistricts = useCallback(

    async (query: string) => {

      abortRef.current?.abort();

      const controller = new AbortController();

      abortRef.current = controller;



      const requestId = ++requestIdRef.current;

      setLoading(true);



      try {

        const response = await fetchPublicDistricts(

          {

            page: 1,

            limit: 100,

            search: query || undefined,

            sort_by: "district_name",

            sort_order: "asc",

          },

          { cache: "no-store", signal: controller.signal }

        );

        if (requestId !== requestIdRef.current) return;



        const parsed = parsePublicDistrictListResponse(response.data);

        applyDistrictResults(parsed.items, parsed.meta.total);

      } catch (error) {

        if (requestId !== requestIdRef.current) return;

        if (error instanceof ApiError && error.isAbortError) return;

        console.error("Error fetching districts:", error);

        if (query) {

          applyDistrictResults([], 0);

        }

      } finally {

        if (requestId === requestIdRef.current) {

          setLoading(false);

        }

      }

    },

    [applyDistrictResults]

  );



  useEffect(() => {

    const query = search.trim();



    if (debounceRef.current) clearTimeout(debounceRef.current);



    if (!query && skipMountRefetchRef.current) {

      skipMountRefetchRef.current = false;

      return;

    }



    const delay = query ? 350 : 0;



    debounceRef.current = setTimeout(() => {

      void fetchDistricts(query);

    }, delay);



    return () => {

      if (debounceRef.current) clearTimeout(debounceRef.current);

    };

  }, [search, fetchDistricts]);



  useEffect(() => {

    return () => {

      abortRef.current?.abort();

    };

  }, []);



  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {

    event.preventDefault();

    const query = search.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    void fetchDistricts(query);

  };



  const handleClearSearch = () => {

    setSearch("");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    void fetchDistricts("");

  };



  const headingText = isHi ? "जिलेवार ओडीओपी उत्पाद" : "District-wise ODOP Products";

  const searchPlaceholder = isHi ? "जिले का नाम खोजें…" : "Search district by name…";

  const searchAriaLabel = isHi ? "जिले का नाम खोजें" : "Search district by name";

  const clearSearchAria = isHi ? "खोज साफ़ करें" : "Clear search";

  const submitSearchAria = isHi ? "जिले खोजें" : "Search districts";



  const searchMetaText = loading

    ? isHi

      ? "जिले खोजे जा रहे हैं…"

      : "Searching districts…"

    : isHi

      ? `${total} में से ${districts.length} जिले दिखाए जा रहे हैं`

      : `Showing ${districts.length} of ${total} districts`;



  const emptyMessage = search.trim()

    ? isHi

      ? `"${search.trim()}" के लिए कोई जिला नहीं मिला।`

      : `No districts found for "${search.trim()}".`

    : isHi

      ? "कोई जिला नहीं मिला।"

      : "No districts found.";



  return (

    <section className="section" aria-label={headingText}>

      <div className="container">

        <div className="district-products-capsule-heading-wrap">
          <h1 className="resource-heading-common">{headingText}</h1>
        </div>



        <div

          className="district-list-search"

          aria-label={isHi ? "जिला खोज" : "District search"}

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



        {!loading && districts.length === 0 ? (

          <div className="district-no-results" style={{ display: "block" }}>

            {emptyMessage}

          </div>

        ) : (

          <div key={gridKey} className="districts-grid">

            {districts.map((district, index) => (

              <DistrictProductCard

                key={`${gridKey}-${district.id ?? district.slug}-${index}`}

                district={district}

                index={index}

                productLayout="bullets"

              />

            ))}

          </div>

        )}

      </div>

    </section>

  );

}

