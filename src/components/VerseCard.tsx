import type { Verse } from '../types';
import { useAppData } from '../hooks/AppDataContext';

interface VerseCardProps {
  verse: Verse;
  dateLabel?: string;
  compact?: boolean;
}

export function VerseCard({ verse, dateLabel, compact = false }: VerseCardProps) {
  const { toggleFavoriteVerse, isVerseFavorited } = useAppData();
  const favorited = isVerseFavorited(verse.reference);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-blush-200/70 bg-gradient-to-br from-blush-100 via-blush-50 to-cream shadow-[var(--shadow-soft)] ${
        compact ? 'p-5' : 'p-6 sm:p-7'
      }`}
      style={{ transform: compact ? undefined : 'rotate(-0.4deg)' }}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blush-200/40 blur-2xl" aria-hidden />
      <div className="relative flex items-start justify-between gap-3">
        <p className="font-serif text-xs font-semibold uppercase tracking-widest text-blush-500">
          {dateLabel ?? "Verse of the Day"}
        </p>
        <button
          onClick={() => toggleFavoriteVerse(verse.reference)}
          aria-pressed={favorited}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="shrink-0 rounded-full p-1.5 transition hover:bg-blush-200/50 active:scale-90"
        >
          <HeartIcon filled={favorited} />
        </button>
      </div>
      <p className={`mt-3 font-serif italic text-blush-900 ${compact ? 'text-base' : 'text-lg sm:text-xl'} leading-snug`}>
        “{verse.text}”
      </p>
      <p className="mt-3 text-sm font-semibold text-blush-600">{verse.reference}</p>
    </div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 16.5s-6.5-4-6.5-8.5a3.5 3.5 0 016.5-2 3.5 3.5 0 016.5 2c0 4.5-6.5 8.5-6.5 8.5z"
        stroke="#b3546f"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill={filled ? '#b3546f' : 'none'}
        className={filled ? 'animate-check-pop' : ''}
      />
    </svg>
  );
}
