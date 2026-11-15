/** 文字列で描くドット絵。'.' は透明、それ以外は palette の色。 */
export function Sprite({
  rows,
  palette,
  px = 6,
  className,
}: {
  rows: readonly string[];
  palette: Record<string, string>;
  px?: number;
  className?: string;
}) {
  const w = Math.max(...rows.map((r) => r.length));
  const cells: React.ReactNode[] = [];
  rows.forEach((row, y) =>
    row.split("").forEach((ch, x) => {
      const fill = palette[ch];
      if (ch !== "." && fill) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    }),
  );
  return (
    <svg
      className={className}
      width={w * px}
      height={rows.length * px}
      viewBox={`0 0 ${w} ${rows.length}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      {cells}
    </svg>
  );
}

export const RUNNER_PALETTE = { h: "#1b1b2f", s: "#ffcf9a", k: "#1b1b2f", o: "#ff9a2e", p: "#2a3b8f", w: "#ffffff" };
const RUNNER_TOP = [
  "....hhhhhh....",
  "...hhhhhhhh...",
  "...ssssssss...",
  "...skssssks...",
  "...ssssssss...",
  "....ssssss....",
  "..oooooooooo..",
  ".sooooooooooo.",
  "s.oooooooooo.s",
  "..oooooooooo..",
];
export const RUNNER_A = [...RUNNER_TOP, "..pppp..pppp..", ".pppp....pppp.", ".pppp....pppp.", "wwww......wwww"];
export const RUNNER_B = [...RUNNER_TOP, "...pppppppp...", "...pppppppp...", "..pppp..pppp..", "..wwww..wwww.."];

export const ATOM_PALETTE = { c: "#c9a4ff", y: "#ffd23f" };
export const ATOM = [
  ".....cccccc.....",
  "...cc......cc...",
  "..c..........c..",
  ".c............c.",
  ".c.....yy.....c.",
  "c.....yyyy.....c",
  "c.....yyyy.....c",
  ".c.....yy.....c.",
  ".c............c.",
  "..c..........c..",
  "...cc......cc...",
  ".....cccccc.....",
];

export const BLOCK_PALETTE = { b: "#7a3b00", y: "#ffd23f" };
export const BLOCK = [
  "bbbbbbbbbbbbbbbb",
  "byyyyyyyyyyyyyyb",
  "byyybbbbbbyyyyyb",
  "byybbyyyybbyyyyb",
  "byyyyyyyybbyyyyb",
  "byyyyyybbbyyyyyb",
  "byyyyybbyyyyyyyb",
  "byyyyybbyyyyyyyb",
  "byyyyyyyyyyyyyyb",
  "byyyyybbyyyyyyyb",
  "byyyyybbyyyyyyyb",
  "byyyyyyyyyyyyyyb",
  "bbbbbbbbbbbbbbbb",
];
