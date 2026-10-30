import gizy from "./assets/projects/web/gizy.png";
import cbt from "./assets/projects/web/cbt.png";
import sanubari from "./assets/projects/web/sanubari.png";
import tapas from "./assets/projects/web/tapas.png";
import urbankicks from "./assets/projects/web/urbankicks.png";
import poster1 from "./assets/projects/posters/1.png";
import poster2 from "./assets/projects/posters/2.png";
import poster3 from "./assets/projects/posters/3.png";
import poster4 from "./assets/projects/posters/4.png";
import poster5 from "./assets/projects/posters/5.png";
import poster6 from "./assets/projects/posters/6.png";
import poster7 from "./assets/projects/posters/7.png";

// TODO: replace every `description` and `href` with your real project copy and links.
// `color` is the accent used for the category pill (your theme: coral / mint / amber).
export const projects = [
  {
    id: "gizy",
    title: "Gizy",
    category: "Web design",
    description:
      "A bright, responsive website with bold layouts and smooth interactions.",
    image: gizy,
    href: "https://example.com/gizy",
    color: "#DE7272",
  },
  {
    id: "cbt",
    title: "CBT",
    category: "Web app",
    description:
      "A clean computer-based test interface that keeps questions and timers easy to follow.",
    image: cbt,
    href: "https://example.com/cbt",
    color: "#B4E4D6",
  },
  {
    id: "sanubari",
    title: "Sanubari",
    category: "Front-end",
    description:
      "A warm, mobile-first site built with a calm layout and careful typography.",
    image: sanubari,
    href: "https://example.com/sanubari",
    color: "#FFCA88",
  },
  {
    id: "tapas",
    title: "Tapas",
    category: "Web design",
    description:
      "A playful menu and ordering experience with vivid colour and quick navigation.",
    image: tapas,
    href: "https://example.com/tapas",
    color: "#DE7272",
  },
  {
    id: "urbankicks",
    title: "Urban Kicks",
    category: "E-commerce",
    description:
      "A sneaker storefront with large product imagery and a simple path to checkout.",
    image: urbankicks,
    href: "https://example.com/urbankicks",
    color: "#B4E4D6",
  },
  {
    id: "posters",
    title: "Posters",
    category: "Graphic design",
    description:
      "A collection of competition posters, from loud type experiments to quiet layouts.",
    posters: [poster1, poster2, poster3, poster4, poster5, poster6, poster7],
    href: "https://example.com/posters",
    color: "#FFCA88",
    bg: "#FFCA88",
  },
];
