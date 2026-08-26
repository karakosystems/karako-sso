/**
 * Minimal WCAG helpers. Used to pick the foreground colour that sits on top of
 * the brand colour, so a deployment cannot produce an unreadable button by
 * choosing a pale primary.
 */

function toRgb(hex: string): [number, number, number] | null {
    const value = hex.trim().replace(/^#/, "");
    const full =
        value.length === 3
            ? value
                  .split("")
                  .map(c => c + c)
                  .join("")
            : value;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) {
        return null;
    }
    return [
        parseInt(full.slice(0, 2), 16),
        parseInt(full.slice(2, 4), 16),
        parseInt(full.slice(4, 6), 16)
    ];
}

export function isValidHexColor(hex: string): boolean {
    return toRgb(hex) !== null;
}

/** Normalises `#abc` / `ABCDEF` to `#abcdef`. */
export function normalizeHexColor(hex: string): string | null {
    const rgb = toRgb(hex);
    if (rgb === null) {
        return null;
    }
    return `#${rgb.map(c => c.toString(16).padStart(2, "0")).join("")}`;
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
    const channel = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string): number {
    const rgbA = toRgb(a);
    const rgbB = toRgb(b);
    if (rgbA === null || rgbB === null) {
        return 1;
    }
    const lumA = relativeLuminance(rgbA);
    const lumB = relativeLuminance(rgbB);
    const [hi, lo] = lumA > lumB ? [lumA, lumB] : [lumB, lumA];
    return (hi + 0.05) / (lo + 0.05);
}

/** Returns white or near-black, whichever reads better on `background`. */
export function readableForeground(background: string): string {
    const white = "#ffffff";
    const black = "#0a0a0a";
    return contrastRatio(background, white) >= contrastRatio(background, black)
        ? white
        : black;
}
