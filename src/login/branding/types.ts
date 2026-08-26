export const LAYOUTS = [
    "centered",
    "split",
    "split-reverse",
    "hero",
    "minimal",
    "stacked"
] as const;

export type Layout = (typeof LAYOUTS)[number];

export const DECORS = [
    "none",
    "shape",
    "waves",
    "aurora",
    "mesh",
    "grid",
    "dots",
    "rings",
    "diagonals",
    "arcs",
    "blobs",
    "topography",
    "hexagons",
    "beams",
    "gradient",
    "glow",
    "columns",
    "scatter"
] as const;

export type Decor = (typeof DECORS)[number];

export type Branding = {
    name: string;
    legalName: string;
    welcomeMessage: string | null;
    logoUrl: string;
    logoDarkUrl: string;
    faviconUrl: string | null;
    primary: string;
    /** Derived from `primary` by contrast, never configured directly. */
    primaryForeground: string;
    radius: string;
    layout: Layout;
    /** A built-in decor name, or an absolute https:// image URL. */
    decor: Decor | string;
};
