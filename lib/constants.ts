import type { LucideIcon } from "lucide-react";
import {
  CameraIcon,
  ImagePlusIcon,
  PaletteIcon,
  SparklesIcon,
  Wand2Icon,
  ZapIcon,
} from "lucide-react";


/** MIME types accepted for user source images (upload + generation API). */
export const ACCEPTED_SOURCE_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export const HIGHLIGHTS: { label: string; icon: LucideIcon }[] = [
  { label: "AI Magic", icon: Wand2Icon },
  { label: "Art Styles", icon: SparklesIcon },
  { label: "Instant", icon: ZapIcon },
  { label: "Creative", icon: CameraIcon },
];

export const GALLERY_STATS = [
  { value: "50K+", label: "Images created" },
  { value: "10K+", label: "Happy users" },
  { value: "4.9/5", label: "User rating" },
] as const;

export const GALLERY_IMAGES = [
  { src: "/gallery-1.png", alt: "Stylized rainy character portrait" },
  { src: "/gallery-2.png", alt: "Stylized family gardening scene" },
  { src: "/gallery-3.png", alt: "Stylized fantasy mushroom scene" },
  { src: "/gallery-4.png", alt: "Stylized coffee making scene" },
] as const;

export const HERO_VIDEO_SRC = "https://ik.imagekit.io/sgoy4jbu5/hero.mp4?updatedAt=1774920272407";

export const SHOWCASE_BG_VIDEO_SRC =
  "https://ik.imagekit.io/sgoy4jbu5/showcase.mp4";

export const CENTER_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "#pricing" },
  { label: "Styles", href: "#styles", chevron: true },
  { label: "How it works", href: "#how-it-works" },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: "Pricing", href: "#pricing" },
  { label: "Styles", href: "#styles" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Studio", href: "/studio" },
] as const;

export const FEATURED_STYLES = ["Storybook 3D", "Anime Cel", "Clay Render", "Pixart"] as const;

export const WORKFLOW_STYLE_PREVIEW = [
  FEATURED_STYLES[0],
  FEATURED_STYLES[1],
  FEATURED_STYLES[2],
] as const;

export type MarketingTestimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TESTIMONIALS: MarketingTestimonial[] = [
  {
    text: "This workflow completely changed how quickly we can turn original photos into polished campaign-ready visuals.",
    image: "/test1.avif",
    name: "Briana Patton",
    role: "Operations Manager",
  },
  {
    text: "The interface is clear, the outputs are consistent, and the rollout across our team was surprisingly effortless.",
    image:
      "/test2.avif",
    name: "Bilal Ahmed",
    role: "IT Manager",
  },
  {
    text: "Support has been thoughtful from the start, and the product already feels much more refined than most creative AI tools.",
    image:
      "/test3.avif",
    name: "Saman Malik",
    role: "Customer Support Lead",
  },
  {
    text: "It preserves the essence of our source images while still giving every result a more elevated and art-directed finish.",
    image:
      "/test4.avif",
    name: "Omar Raza",
    role: "CEO",
  },
  {
    text: "We saw immediate time savings once it became part of our content pipeline, especially for rapid visual explorations.",
    image:
      "/test5.avif",
    name: "Zainab Hussain",
    role: "Project Manager",
  },
  {
    text: "The outputs are premium enough for client reviews, which has helped us move from concept to approval much faster.",
    image:
      "/test6.avif",
    name: "Aliza Khan",
    role: "Business Analyst",
  },
  {
    text: "It gave our team a cleaner way to experiment with multiple directions without compromising subject fidelity.",
    image:
      "/test7.avif",
    name: "Farhan Siddiqui",
    role: "Marketing Director",
  },
  {
    text: "The experience feels premium end to end, and our customers noticed the jump in quality immediately.",
    image:
      "/test8.avif",
    name: "Sana Sheikh",
    role: "Sales Manager",
  },
  {
    text: "The product helped us improve output quality and consistency while still giving the team room to move quickly.",
    image:
      "/test9.avif",
    name: "Hassan Ali",
    role: "E-commerce Manager",
  },
];

export const TESTIMONIAL_COLUMNS = [
  TESTIMONIALS.slice(0, 3),
  TESTIMONIALS.slice(3, 6),
  TESTIMONIALS.slice(6, 9),
];

export type HowItWorksStep = {
  step: string;
  title: string;
  body: string;
  icon: LucideIcon;
  featured?: boolean;
};

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    step: "Step 1",
    title: "Upload your image",
    body: "Start with a portrait, pet photo, or scene you already love. Clear subjects and good lighting work best.",
    icon: ImagePlusIcon,
  },
  {
    step: "Step 2",
    title: "Choose a style",
    body: "Pick a curated look like Storybook 3D, Anime Cel, or Clay Render without writing prompts or adjusting settings.",
    icon: PaletteIcon,
  },
  {
    step: "Step 3",
    title: "Generate the transformation",
    body: "PixelForge restyles the image while protecting composition, identity cues, and the small details that matter.",
    icon: SparklesIcon,
    featured: true,
  },
];