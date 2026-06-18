/** Matches `odop/event-detail.html` inline stall layout script. */

export const industryCategories = [
  { layoutNo: 1, name: "Food & Agro Processing Industry", count: 20, prefix: "FAP" },
  { layoutNo: 2, name: "Textile, Apparel & Handloom Industry", count: 20, prefix: "TAH" },
  { layoutNo: 3, name: "Wood, Furniture & Carpentry Industry", count: 10, prefix: "WFC" },
  { layoutNo: 4, name: "Handicrafts & Traditional Crafts Industry", count: 13, prefix: "HTC" },
  { layoutNo: 5, name: "Carpet, Weaving & Floor Covering Industry", count: 5, prefix: "CWF" },
  { layoutNo: 6, name: "Metal, Engineering & Hardware Industry", count: 5, prefix: "MEH" },
  { layoutNo: 7, name: "Brass, Metal Craft & Decorative Industry", count: 13, prefix: "BMD" },
  { layoutNo: 8, name: "Jewelry & Decorative Accessories Industry", count: 12, prefix: "JDA" },
  { layoutNo: 9, name: "Stone, Marble & Mineral Craft Industry", count: 8, prefix: "SMM" },
  { layoutNo: 10, name: "Chemical, Perfume & Related Industry", count: 5, prefix: "CPR" },
  { layoutNo: 11, name: "Toys & Misc Small Goods Industry", count: 10, prefix: "TMG" },
  { layoutNo: 12, name: "Musical Instruments Industry", count: 2, prefix: "MUS" },
  { layoutNo: 13, name: "Leather & Footwear Industry", count: 25, prefix: "LFI" },
  { layoutNo: 14, name: "Sports & Specialized Goods Industry", count: 2, prefix: "SSG" },
] as const;

export const stallLayoutPattern = [
  { row: 1, colStart: 1, count: 10, layoutNo: 1 },
  { row: 1, colStart: 13, count: 10, layoutNo: 1 },
  { row: 3, colStart: 1, count: 10, layoutNo: 3 },
  { row: 4, colStart: 1, count: 10, layoutNo: 4 },
  { row: 3, colStart: 13, count: 10, layoutNo: 2 },
  { row: 4, colStart: 13, count: 10, layoutNo: 2 },
  { row: 6, colStart: 1, count: 5, layoutNo: 6 },
  { row: 6, colStart: 6, count: 2, layoutNo: 14 },
  { row: 6, colStart: 8, count: 3, layoutNo: 4 },
  { row: 7, colStart: 1, count: 10, layoutNo: 11 },
  { row: 6, colStart: 13, count: 2, layoutNo: 8 },
  { row: 6, colStart: 15, count: 8, layoutNo: 9 },
  { row: 7, colStart: 13, count: 10, layoutNo: 8 },
  { row: 9, colStart: 1, count: 2, layoutNo: 12 },
  { row: 9, colStart: 3, count: 5, layoutNo: 5 },
  { row: 9, colStart: 8, count: 3, layoutNo: 7 },
  { row: 10, colStart: 1, count: 10, layoutNo: 7 },
  { row: 9, colStart: 13, count: 10, layoutNo: 13 },
  { row: 10, colStart: 13, count: 10, layoutNo: 13 },
  { row: 12, colStart: 6, count: 5, layoutNo: 10 },
  { row: 12, colStart: 13, count: 5, layoutNo: 13 },
] as const;

export const bookedStalls = [
  "FAP02",
  "FAP11",
  "TAH05",
  "WFC03",
  "HTC04",
  "CWF01",
  "MEH02",
  "BMD06",
  "JDA07",
  "SMM03",
  "CPR02",
  "TMG04",
  "MUS01",
  "LFI09",
  "SSG02",
] as const;

export type StallSlot = {
  stall: string;
  layoutNo: number;
  row: number;
  col: number;
};

export function buildStallLayout(): { stallSlots: StallSlot[]; stallTypeMap: Record<string, string> } {
  const stallTypes: Record<
    string,
    { count: number; prefix: string; layoutNo: number; stalls: string[] }
  > = {};

  for (const category of industryCategories) {
    stallTypes[category.name] = {
      count: category.count,
      prefix: category.prefix,
      layoutNo: category.layoutNo,
      stalls: Array.from({ length: category.count }, (_, index) => `${category.prefix}${String(index + 1).padStart(2, "0")}`),
    };
  }

  const stallTypeMap: Record<string, string> = {};
  const stallLayoutMap: Record<number, string[]> = {};

  for (const [type, details] of Object.entries(stallTypes)) {
    for (const stall of details.stalls) {
      stallTypeMap[stall] = type;
    }
    stallLayoutMap[details.layoutNo] = details.stalls.slice();
  }

  /** One mutable queue per layout block — must persist across segments (same as legacy script). */
  const queuesByLayout = new Map<number, string[]>();
  for (const layoutNo of Object.keys(stallLayoutMap).map(Number)) {
    queuesByLayout.set(layoutNo, [...(stallLayoutMap[layoutNo] ?? [])]);
  }

  const stallSlots: StallSlot[] = [];

  for (const segment of stallLayoutPattern) {
    const queue = queuesByLayout.get(segment.layoutNo);
    if (!queue) continue;
    for (let index = 0; index < segment.count; index += 1) {
      const stall = queue.shift();
      if (!stall) continue;
      stallSlots.push({
        stall,
        layoutNo: segment.layoutNo,
        row: segment.row,
        col: segment.colStart + index,
      });
    }
  }

  return { stallSlots, stallTypeMap };
}
