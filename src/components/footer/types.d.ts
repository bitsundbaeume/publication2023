import type { ImageMetadata } from "astro";

export interface Logo {
  name: string;
  logo: string | ImageMetadata;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}
