import type { CSSProperties } from "react";
import type { Decor as DecorName } from "../types";

// Every pattern paints with var(--primary), so a client picks a name, not an image.
type Props = {
    /** A built-in decor name, or an absolute https:// image URL. */
    decor: DecorName | string;
    className?: string;
    /** Overall opacity of the pattern. */
    opacity?: number;
};

const cover: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none"
};

function Svg(props: { children: React.ReactNode; opacity: number; id: string }) {
    return (
        <svg
            aria-hidden="true"
            style={{ ...cover, opacity: props.opacity }}
            preserveAspectRatio="xMidYMid slice"
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
        >
            {props.children}
        </svg>
    );
}

const P = "var(--primary)";

function Waves({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            {[0, 1, 2, 3].map(i => (
                <path
                    key={i}
                    d={`M0 ${420 + i * 90} C 200 ${360 + i * 90}, 320 ${500 + i * 90}, 520 ${430 + i * 90} S 760 ${350 + i * 90}, 800 ${400 + i * 90} L800 800 L0 800 Z`}
                    fill={P}
                    opacity={0.16 + i * 0.08}
                />
            ))}
        </Svg>
    );
}

function Aurora({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <radialGradient id={`${id}-a`}>
                    <stop offset="0%" stopColor={P} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={P} stopOpacity="0" />
                </radialGradient>
                <filter id={`${id}-b`}>
                    <feGaussianBlur stdDeviation="60" />
                </filter>
            </defs>
            <g filter={`url(#${id}-b)`}>
                <circle cx="180" cy="180" r="260" fill={`url(#${id}-a)`} />
                <circle cx="640" cy="300" r="220" fill={`url(#${id}-a)`} opacity="0.7" />
                <circle cx="420" cy="660" r="280" fill={`url(#${id}-a)`} opacity="0.5" />
            </g>
        </Svg>
    );
}

function Mesh({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <radialGradient id={`${id}-g`}>
                    <stop offset="0%" stopColor={P} stopOpacity="0.6" />
                    <stop offset="100%" stopColor={P} stopOpacity="0" />
                </radialGradient>
            </defs>
            {[
                [120, 140, 300],
                [700, 120, 260],
                [80, 640, 280],
                [660, 700, 320],
                [400, 400, 360]
            ].map(([cx, cy, r], i) => (
                <circle key={i} cx={cx} cy={cy} r={r} fill={`url(#${id}-g)`} />
            ))}
        </Svg>
    );
}

function Grid({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <pattern
                    id={`${id}-p`}
                    width="48"
                    height="48"
                    patternUnits="userSpaceOnUse"
                >
                    <path d="M48 0 H0 V48" fill="none" stroke={P} strokeWidth="1" />
                </pattern>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-p)`} />
        </Svg>
    );
}

function Dots({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <pattern
                    id={`${id}-p`}
                    width="32"
                    height="32"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="4" cy="4" r="2.5" fill={P} />
                </pattern>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-p)`} />
        </Svg>
    );
}

function Rings({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            {Array.from({ length: 9 }, (_, i) => (
                <circle
                    key={i}
                    cx="400"
                    cy="400"
                    r={60 + i * 55}
                    fill="none"
                    stroke={P}
                    strokeWidth="1.5"
                    opacity={1 - i * 0.08}
                />
            ))}
        </Svg>
    );
}

function Diagonals({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <pattern
                    id={`${id}-p`}
                    width="28"
                    height="28"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(45)"
                >
                    <rect width="10" height="28" fill={P} />
                </pattern>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-p)`} />
        </Svg>
    );
}

function Arcs({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            {Array.from({ length: 7 }, (_, i) => (
                <path
                    key={i}
                    d={`M0 ${800 - i * 90} A ${420 + i * 40} ${420 + i * 40} 0 0 1 ${800} ${640 - i * 90}`}
                    fill="none"
                    stroke={P}
                    strokeWidth="2"
                    opacity={0.9 - i * 0.1}
                />
            ))}
        </Svg>
    );
}

function Blobs({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <path
                d="M620 120c70 60 90 170 50 260s-140 150-240 150-190-60-230-150 0-200 70-260 140-90 200-70 110 30 150 70Z"
                fill={P}
                opacity="0.35"
            />
            <path
                d="M240 480c60-40 150-30 210 20s90 140 50 200-140 80-220 50-130-110-110-180 30-70 70-90Z"
                fill={P}
                opacity="0.25"
            />
        </Svg>
    );
}

function Topography({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            {Array.from({ length: 11 }, (_, i) => (
                <path
                    key={i}
                    d={`M-40 ${120 + i * 62} C 160 ${60 + i * 62}, 260 ${220 + i * 62}, 440 ${160 + i * 62} S 700 ${60 + i * 62}, 840 ${140 + i * 62}`}
                    fill="none"
                    stroke={P}
                    strokeWidth="1.5"
                />
            ))}
        </Svg>
    );
}

function Hexagons({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <pattern
                    id={`${id}-p`}
                    width="56"
                    height="97"
                    patternUnits="userSpaceOnUse"
                >
                    <path
                        d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z M28 48 L56 64 L56 97 M28 48 L0 64 L0 97"
                        fill="none"
                        stroke={P}
                        strokeWidth="1.2"
                    />
                </pattern>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-p)`} />
        </Svg>
    );
}

function Beams({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <linearGradient id={`${id}-g`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={P} stopOpacity="0.75" />
                    <stop offset="100%" stopColor={P} stopOpacity="0" />
                </linearGradient>
            </defs>
            {Array.from({ length: 6 }, (_, i) => (
                <polygon
                    key={i}
                    points={`${i * 150 - 60},0 ${i * 150 + 40},0 ${i * 150 - 120},800 ${i * 150 - 260},800`}
                    fill={`url(#${id}-g)`}
                />
            ))}
        </Svg>
    );
}

function Gradient({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={P} stopOpacity="0.9" />
                    <stop offset="60%" stopColor={P} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={P} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-g)`} />
        </Svg>
    );
}

function Glow({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <radialGradient id={`${id}-g`} cx="50%" cy="110%" r="80%">
                    <stop offset="0%" stopColor={P} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={P} stopOpacity="0" />
                </radialGradient>
            </defs>
            <rect width="800" height="800" fill={`url(#${id}-g)`} />
        </Svg>
    );
}

function Columns({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            {Array.from({ length: 12 }, (_, i) => (
                <rect
                    key={i}
                    x={i * 68 + 8}
                    y={i % 2 === 0 ? 0 : 140}
                    width="36"
                    height="800"
                    rx="18"
                    fill={P}
                    opacity={0.1 + (i % 4) * 0.07}
                />
            ))}
        </Svg>
    );
}

function Scatter({ o, id }: { o: number; id: string }) {
    // Deterministic placement: stable across renders.
    const items = Array.from({ length: 44 }, (_, i) => {
        const a = (i * 9301 + 49297) % 233280;
        const b = (i * 4111 + 7919) % 233280;
        return {
            cx: (a / 233280) * 800,
            cy: (b / 233280) * 800,
            r: 3 + ((i * 7) % 11)
        };
    });
    return (
        <Svg opacity={o} id={id}>
            {items.map((it, i) => (
                <circle
                    key={i}
                    cx={it.cx}
                    cy={it.cy}
                    r={it.r}
                    fill={P}
                    opacity={0.25 + (i % 5) * 0.12}
                />
            ))}
        </Svg>
    );
}

function Shape({ o, id }: { o: number; id: string }) {
    return (
        <Svg opacity={o} id={id}>
            <defs>
                <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={P} stopOpacity="0.55" />
                    <stop offset="100%" stopColor={P} stopOpacity="0.05" />
                </linearGradient>
            </defs>
            <circle cx="150" cy="120" r="220" fill={`url(#${id}-g)`} />
            <circle cx="660" cy="640" r="260" fill={`url(#${id}-g)`} />
            <circle cx="700" cy="140" r="120" fill={P} opacity="0.12" />
        </Svg>
    );
}

const BUILT_IN: Record<string, (p: { o: number; id: string }) => React.ReactElement> = {
    shape: Shape,
    waves: Waves,
    aurora: Aurora,
    mesh: Mesh,
    grid: Grid,
    dots: Dots,
    rings: Rings,
    diagonals: Diagonals,
    arcs: Arcs,
    blobs: Blobs,
    topography: Topography,
    hexagons: Hexagons,
    beams: Beams,
    gradient: Gradient,
    glow: Glow,
    columns: Columns,
    scatter: Scatter
};

export function Decor(props: Props) {
    const { decor, className, opacity = 0.5 } = props;

    if (decor === "none") {
        return null;
    }

    if (decor.startsWith("https://")) {
        return (
            <div
                aria-hidden="true"
                className={className}
                style={{
                    ...cover,
                    backgroundImage: `url("${decor}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            />
        );
    }

    const Pattern = BUILT_IN[decor];
    if (Pattern === undefined) {
        return null;
    }

    return (
        <div aria-hidden="true" className={className} style={cover}>
            <Pattern o={opacity} id={`decor-${decor}`} />
        </div>
    );
}
