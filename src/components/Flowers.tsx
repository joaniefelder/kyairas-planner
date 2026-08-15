import { useId } from 'react';

/**
 * Decorative botanical SVGs — fuller, layered watercolor-style blooms.
 * Always aria-hidden — purely ornamental, never load-bearing for content.
 * Each exported component mounts its own gradient/petal defs (scoped with
 * useId) so multiple instances on one page never collide.
 */

const PETAL_D = 'M0,0 C-11,-7 -14,-20 -7,-27 C-3,-31 3,-31 7,-27 C14,-20 11,-7 0,0 Z';

function BlossomDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <radialGradient id={`${uid}-petal`} cx="35%" cy="20%" r="85%">
        <stop offset="0%" stopColor="#fff6f7" />
        <stop offset="45%" stopColor="#f9dee2" />
        <stop offset="100%" stopColor="#e5a9b8" />
      </radialGradient>
      <radialGradient id={`${uid}-petalDeep`} cx="35%" cy="20%" r="85%">
        <stop offset="0%" stopColor="#f9dee2" />
        <stop offset="50%" stopColor="#eab0bd" />
        <stop offset="100%" stopColor="#c17188" />
      </radialGradient>
      <radialGradient id={`${uid}-center`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e6a4a4" />
        <stop offset="100%" stopColor="#b3546f" />
      </radialGradient>
      <path id={`${uid}-petalPath`} d={PETAL_D} />
    </defs>
  );
}

function Blossom({
  uid,
  cx,
  cy,
  scale = 1,
  rotate = 0,
  deep = false,
}: {
  uid: string;
  cx: number;
  cy: number;
  scale?: number;
  rotate?: number;
  deep?: boolean;
}) {
  const fill = `url(#${uid}-${deep ? 'petalDeep' : 'petal'})`;
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`} opacity={0.94}>
      {[0, 72, 144, 216, 288].map((a) => (
        <use key={a} href={`#${uid}-petalPath`} fill={fill} stroke="#b3546f" strokeWidth={0.4} strokeOpacity={0.25} transform={`rotate(${a})`} />
      ))}
      <circle r={3.6} fill={`url(#${uid}-center)`} />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={Math.cos((a * Math.PI) / 180) * 4.4}
          cy={Math.sin((a * Math.PI) / 180) * 4.4}
          r={0.8}
          fill="#8f3a54"
          opacity={0.55}
        />
      ))}
    </g>
  );
}

function Bud({ uid, cx, cy, scale = 1, rotate = 0 }: { uid: string; cx: number; cy: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rotate}) scale(${scale})`}>
      <ellipse rx={4.2} ry={6.5} fill={`url(#${uid}-petalDeep)`} opacity={0.9} />
      <path d="M-4,1 C-2,4 2,4 4,1" stroke="#954059" strokeWidth={0.6} fill="none" opacity={0.4} />
    </g>
  );
}

export function CherryBlossomBranch({ className = '' }: { className?: string }) {
  const uid = useId();
  return (
    <svg className={className} viewBox="0 0 240 170" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <BlossomDefs uid={uid} />
      <path
        d="M6 158C48 132 66 118 92 100C118 82 132 68 150 46C164 29 176 20 232 6"
        stroke="#b3546f"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.5"
        fill="none"
      />
      <path d="M100 96C110 86 122 80 136 76" stroke="#b3546f" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M140 60C150 52 160 48 172 46" stroke="#b3546f" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M60 128C68 122 76 120 86 120" stroke="#b3546f" strokeWidth="1.4" strokeLinecap="round" opacity="0.45" fill="none" />

      <Blossom uid={uid} cx={86} cy={122} scale={1.35} rotate={-12} />
      <Blossom uid={uid} cx={136} cy={78} scale={1.15} rotate={18} deep />
      <Blossom uid={uid} cx={172} cy={48} scale={1.3} rotate={-25} />
      <Blossom uid={uid} cx={60} cy={130} scale={0.9} rotate={40} deep />
      <Blossom uid={uid} cx={206} cy={24} scale={1.05} rotate={10} />
      <Blossom uid={uid} cx={30} cy={150} scale={1.1} rotate={-30} deep />
      <Blossom uid={uid} cx={114} cy={92} scale={0.75} rotate={60} />
      <Bud uid={uid} cx={190} cy={34} scale={0.9} rotate={-20} />
      <Bud uid={uid} cx={46} cy={140} scale={0.8} rotate={35} />
      <Bud uid={uid} cx={158} cy={62} scale={0.75} rotate={15} />
    </svg>
  );
}

export function PeonyBloom({ className = '' }: { className?: string }) {
  const uid = useId();
  const outer = [0, 40, 80, 120, 160, 200, 240, 280, 320];
  const middle = [20, 80, 140, 200, 260, 320];
  const inner = [0, 72, 144, 216, 288];
  return (
    <svg className={className} viewBox="0 0 130 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <BlossomDefs uid={uid} />
      <circle cx="65" cy="65" r="58" fill={`url(#${uid}-petal)`} opacity="0.18" />

      <g transform="translate(65 65)">
        {outer.map((a) => (
          <use key={`o${a}`} href={`#${uid}-petalPath`} fill={`url(#${uid}-petal)`} stroke="#c17188" strokeWidth={0.3} strokeOpacity={0.3} transform={`rotate(${a}) scale(1.65) translate(0 4)`} />
        ))}
        {middle.map((a) => (
          <use key={`m${a}`} href={`#${uid}-petalPath`} fill={`url(#${uid}-petalDeep)`} stroke="#954059" strokeWidth={0.3} strokeOpacity={0.3} transform={`rotate(${a}) scale(1.15) translate(0 2)`} />
        ))}
        {inner.map((a) => (
          <use key={`i${a}`} href={`#${uid}-petalPath`} fill={`url(#${uid}-petalDeep)`} stroke="#7a2f47" strokeWidth={0.3} strokeOpacity={0.35} transform={`rotate(${a}) scale(0.7)`} />
        ))}
        <circle r={5.5} fill={`url(#${uid}-center)`} />
        {[0, 51, 102, 153, 204, 255, 306].map((a) => (
          <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 6.5} cy={Math.sin((a * Math.PI) / 180) * 6.5} r={1.1} fill="#7a2f47" opacity={0.6} />
        ))}
      </g>
    </svg>
  );
}

export function WildflowerSprig({ className = '' }: { className?: string }) {
  const uid = useId();
  return (
    <svg className={className} viewBox="0 0 110 180" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <BlossomDefs uid={uid} />
      <path d="M56 176C52 140 58 110 48 80C40 56 52 40 46 14" stroke="#b3546f" strokeWidth="2" strokeLinecap="round" opacity="0.5" fill="none" />
      <path d="M50 104C38 96 28 98 18 90" stroke="#b3546f" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M46 138C58 130 68 130 78 122" stroke="#b3546f" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" fill="none" />
      <path d="M49 68C60 62 68 62 78 56" stroke="#b3546f" strokeWidth="1.3" strokeLinecap="round" opacity="0.45" fill="none" />

      <Blossom uid={uid} cx={46} cy={16} scale={1.1} rotate={0} />
      <Blossom uid={uid} cx={18} cy={92} scale={0.95} rotate={-35} deep />
      <Blossom uid={uid} cx={80} cy={122} scale={1.05} rotate={20} />
      <Blossom uid={uid} cx={78} cy={54} scale={0.7} rotate={45} deep />
      <Bud uid={uid} cx={56} cy={176} scale={0.85} rotate={-10} />
      <Bud uid={uid} cx={30} cy={130} scale={0.7} rotate={25} />
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
