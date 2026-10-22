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
    mesh: Mesh,
    glow: Glow
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
