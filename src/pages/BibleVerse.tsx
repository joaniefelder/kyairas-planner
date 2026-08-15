import { useAppData } from '../hooks/AppDataContext';
import { verseOfTheDay, recentVerseHistory } from '../utils/verseUtils';
import { verses } from '../data/verses';
import { VerseCard } from '../components/VerseCard';
import { formatDateFriendly } from '../utils/dateUtils';
import { toISODate } from '../utils/dateUtils';
import { WildflowerSprig } from '../components/Flowers';

export function BibleVerse() {
  const { data } = useAppData();
  const today = verseOfTheDay();
  const history = recentVerseHistory(7);
  const favorites = data.favoriteVerses
    .map((f) => verses.find((v) => v.reference === f.reference))
    .filter((v): v is NonNullable<typeof v> => !!v);

  return (
    <div className="relative">
      <WildflowerSprig className="pointer-events-none absolute -right-4 top-0 h-40 w-24 opacity-60 sm:h-52 sm:w-32" />

      <header>
        <h1 className="font-serif text-3xl font-semibold text-blush-900">Bible Verse</h1>
        <p className="mt-1 text-blush-600">A little encouragement, every day.</p>
      </header>

      <section className="mt-7 max-w-xl">
        <VerseCard verse={today} dateLabel={formatDateFriendly(toISODate(new Date()))} />
      </section>

      {favorites.length > 0 && (
        <section className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-blush-900">Favorites</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {favorites.map((v) => (
              <VerseCard key={v.reference} verse={v} dateLabel="Favorited" compact />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-serif text-xl font-semibold text-blush-900">Recently Shown</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {history.map((entry) => (
            <VerseCard key={entry.date} verse={entry.verse} dateLabel={formatDateFriendly(entry.date)} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
