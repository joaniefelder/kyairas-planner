/**
 * Decorative botanical SVGs. Soft layered blobs (not sharp vector shapes)
 * to approximate a watercolor feel while staying lightweight and inline.
 * Always aria-hidden — purely ornamental, never load-bearing for content.
 */

export function CherryBlossomBranch({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M4 130C40 100 70 90 120 60C150 42 170 30 196 8" stroke="#c98a9c" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M60 92C68 84 78 80 88 78" stroke="#c98a9c" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <path d="M110 66C118 58 128 54 138 52" stroke="#c98a9c" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {[
        { cx: 88, cy: 76, r: 15, fill: '#f4ccd4' },
        { cx: 138, cy: 50, r: 13, fill: '#eab0bd' },
        { cx: 60, cy: 90, r: 11, fill: '#f9dee2' },
        { cx: 170, cy: 26, r: 12, fill: '#f4ccd4' },
        { cx: 30, cy: 116, r: 10, fill: '#f9dee2' },
      ].map((b, i) => (
        <g key={i} opacity="0.85">
          {[0, 72, 144, 216, 288].map((angle) => (
            <ellipse
              key={angle}
              cx={b.cx + Math.cos((angle * Math.PI) / 180) * b.r * 0.7}
              cy={b.cy + Math.sin((angle * Math.PI) / 180) * b.r * 0.7}
              rx={b.r * 0.62}
              ry={b.r * 0.45}
              fill={b.fill}
              transform={`rotate(${angle} ${b.cx + Math.cos((angle * Math.PI) / 180) * b.r * 0.7} ${
                b.cy + Math.sin((angle * Math.PI) / 180) * b.r * 0.7
              })`}
            />
          ))}
          <circle cx={b.cx} cy={b.cy} r={b.r * 0.32} fill="#b3546f" opacity="0.55" />
        </g>
      ))}
    </svg>
  );
}

export function PeonyBloom({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="60" cy="60" r="46" fill="#f9dee2" opacity="0.5" />
      <circle cx="60" cy="60" r="34" fill="#f4ccd4" opacity="0.6" />
      <circle cx="60" cy="60" r="22" fill="#eab0bd" opacity="0.7" />
      <circle cx="60" cy="60" r="11" fill="#cc6f88" opacity="0.75" />
      <circle cx="46" cy="48" r="6" fill="#b3546f" opacity="0.4" />
      <circle cx="76" cy="52" r="5" fill="#b3546f" opacity="0.4" />
      <circle cx="60" cy="74" r="5" fill="#b3546f" opacity="0.4" />
    </svg>
  );
}

export function WildflowerSprig({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M50 158C48 120 52 80 46 40" stroke="#c98a9c" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M46 100C36 94 28 96 20 90" stroke="#c98a9c" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <path d="M48 70C58 64 66 66 74 60" stroke="#c98a9c" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="20" cy="88" rx="10" ry="6" fill="#f4ccd4" opacity="0.7" transform="rotate(-20 20 88)" />
      <circle cx="46" cy="38" r="10" fill="#eab0bd" opacity="0.7" />
      <circle cx="46" cy="38" r="4" fill="#b3546f" opacity="0.6" />
      <ellipse cx="76" cy="58" rx="9" ry="5.5" fill="#f9dee2" opacity="0.75" transform="rotate(15 76 58)" />
    </svg>
  );
}

export function CornerFlowers({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <div
      className={`pointer-events-none select-none ${className}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden="true"
    >
      <CherryBlossomBranch className="h-full w-full" />
    </div>
  );
}
