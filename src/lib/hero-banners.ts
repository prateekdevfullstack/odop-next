const HERO_BANNER_DIR = "/assets/img/HeroImageCard";
const HINDI_HERO_BANNER_DIR = "/assets/img/HeroImageCardHindi";

const HERO_BANNER_FILES = [
  "ODOP_Website Banner _1.jpg",
  "ODOP_Website Banner _2.jpg",
  "ODOP_Website Banner _3.jpg",
  "ODOP_Website Banner _4.jpg",
  "ODOP_Website Banner _5.jpg",
  "ODOP_Website Banner _6.jpg",
  "ODOP_Website Banner _7.jpg",
  "ODOP_Website Banner _8.jpg",
  "ODOP_Website Banner _9.jpg",
  "ODOP_Website Banner _10.jpg",
  "ODOP_Website Banner _11.jpg",
  "ODOP_Website Banner _12.jpg",
  "ODOP_Website Banner _13.jpg",
  "ODOP_Website Banner _14.jpg",
  "ODOP_Website Banner _15.jpg",
] as const;

export const HERO_BANNER_SLIDES = HERO_BANNER_FILES.map(
  (file) => `${HERO_BANNER_DIR}/${encodeURIComponent(file)}`,
);

const HINDI_HERO_BANNER_FILES = [
  "odop website banner _Hindi_1.png",
  "odop website banner _Hindi_2.png",
  "odop website banner _Hindi_3.png",
  "odop website banner _Hindi_4.png",
  "odop website banner _Hindi_5.png",
  "odop website banner _Hindi_6.png",
  "odop website banner _Hindi_7.png",
  "odop website banner _Hindi_8.png",
  "odop website banner _Hindi_9.png",
  "odop website banner _Hindi_10.png",
  "odop website banner _Hindi_11.png",
  "odop website banner _Hindi_12.png",
  "odop website banner _Hindi_13.png",
  "odop website banner _Hindi_14.png",
  "odop website banner _Hindi_15.png",
] as const;

export const HINDI_HERO_BANNER_SLIDES = HINDI_HERO_BANNER_FILES.map(
  (file) => `${HINDI_HERO_BANNER_DIR}/${encodeURIComponent(file)}`,
);
