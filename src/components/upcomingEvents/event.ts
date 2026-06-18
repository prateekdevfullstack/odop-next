export type EventItem = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  startDate: string;
  endDate: string;
  venueName: string | null;
  city: string | null;
  address: string | null;
  eventTheme: string | null;
  bannerImage: string | null;
  category: { id: number; name: string } | null;
  eventDateType?: string;
};

export const events: EventItem[] = [
  {
    id: 267,
    title: "World Food India 2027",
    slug: "world-food-india-2027",
    shortDescription: null,
    startDate: "2027-09-01",
    endDate: "2027-09-01",
    venueName: "Pragati Maidan, New Delhi",
    city: "New Delhi",
    address: "Pragati Maidan, New Delhi",
    eventTheme: "Food Processing",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 262,
    title: "Gulfood",
    slug: "gulfood",
    shortDescription: null,
    startDate: "2027-03-15",
    endDate: "2027-03-19",
    venueName: "Dubai, UAE",
    city: "UAE",
    address: "Dubai, UAE",
    eventTheme: "Food Processing",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 263,
    title: "Foodex Japan",
    slug: "foodex-japan",
    shortDescription: null,
    startDate: "2027-03-09",
    endDate: "2027-03-12",
    venueName: "Japan",
    city: "Japan",
    address: "Japan",
    eventTheme: "Food Processing",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 389,
    title: "Kids India 2027",
    slug: "kids-india-2027",
    shortDescription:
      "Highlights Indian toy industry's growth potential, quality focus, and government support for exports.",
    startDate: "2027-03-04",
    endDate: "2027-03-06",
    venueName: "JIO CC, Mumbai",
    city: "JIO CC",
    address: "JIO CC, Mumbai",
    eventTheme: "Kids Toys",
    bannerImage: null,
    category: { id: 7, name: "National Exhibitions / Fairs 35" },
  },
  {
    id: 264,
    title: "International Food and Drink Event (IFE)",
    slug: "international-food-and-drink-event-ife",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "UK",
    city: "UK",
    address: "UK",
    eventTheme: "Food Processing",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 265,
    title: "Natural Product Expo West",
    slug: "natural-product-expo-west",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "USA",
    city: "USA",
    address: "USA",
    eventTheme: "Food Processing",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 271,
    title: "Intermoda",
    slug: "intermoda",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "Mexico",
    city: "Mexico",
    address: "Mexico",
    eventTheme: "Apparel",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 319,
    title: "Istanbul Yarn Fair",
    slug: "istanbul-yarn-fair",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "Turkey",
    city: "Turkey",
    address: "Turkey",
    eventTheme: "Textile",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 320,
    title: "PREVIEW IN Daegu",
    slug: "preview-in-daegu",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "South Korea",
    city: "South Korea",
    address: "South Korea",
    eventTheme: "Textile",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
  {
    id: 333,
    title: "Asia Pacific Leather Fair (APLF)",
    slug: "asia-pacific-leather-fair-aplf",
    shortDescription: null,
    startDate: "2027-03-01",
    endDate: "2027-03-01",
    venueName: "Hong Kong",
    city: "Hong Kong",
    address: "Hong Kong",
    eventTheme: "Leather",
    bannerImage: null,
    category: { id: 6, name: "Council Promoted Exhibitions / Fairs" },
  },
];

function startOfToday(): number {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
}

export const upcomingEvents: EventItem[] = events
  .filter((e) => {
    const en = new Date(e.endDate);
    return new Date(en.getFullYear(), en.getMonth(), en.getDate()).getTime() >= startOfToday();
  })
  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

export function upcomingEventsFor(list: EventItem[]): EventItem[] {
  return list
    .filter((e) => {
      const en = new Date(e.endDate);
      return new Date(en.getFullYear(), en.getMonth(), en.getDate()).getTime() >= startOfToday();
    })
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
}

export function eventsOnDate(date: Date, list: EventItem[]): EventItem[] {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const target = new Date(y, m, d).getTime();
  return list.filter((e) => {
    const s = new Date(e.startDate);
    const en = new Date(e.endDate);
    const sd = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
    const ed = new Date(en.getFullYear(), en.getMonth(), en.getDate()).getTime();
    return target >= sd && target <= ed;
  });
}

export function hasEventOnDate(date: Date, list: EventItem[]): boolean {
  return eventsOnDate(date, list).length > 0;
}

