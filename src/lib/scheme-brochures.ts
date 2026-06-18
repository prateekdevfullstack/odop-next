/**
 * Static brochure PDFs in `public/assets/img/schemes/` — keyed by scheme detail slug.
 */
export const SCHEME_BROCHURE_PATH_BY_SLUG: Record<string, string> = {
  "training-and-toolkit-scheme-uttar-pradesh":
    "/assets/img/schemes/ODOP टूलकिट योजना.cdrx20.cdr.pdf",
  "margin-money-scheme-uttar-pradesh":
    "/assets/img/schemes/ODOP मार्जिन मनी योजना.cdrx20.cdr.pdf",
  "marketing-development-assistance-scheme-uttar-pradesh":
    "/assets/img/schemes/ODOP_MDA SCHEME FLYER.pdf",
  "common-facility-centre-cfc-scheme-uttar-pradesh":
    "/assets/img/schemes/सामान्य सुविधा केन्द्र (CFC) प्रोत्साहन योजना.cdrx20.cdr.pdf",
};

export function brochurePublicPathForSlug(slug: string): string | null {
  return SCHEME_BROCHURE_PATH_BY_SLUG[slug] ?? null;
}
