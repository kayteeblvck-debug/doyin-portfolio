/**
 * The page grid. Every section, the nav, the footer and the background guide
 * lines use these same two class strings, so a text edge that starts on
 * column 4 in one section starts on exactly the same pixel in every other.
 *
 *   mobile   4 columns
 *   md+     12 columns, read as four bays of three (1 · 4 · 7 · 10)
 */
export const CONTAINER = "mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12";
export const GRID = "grid grid-cols-4 gap-x-5 sm:gap-x-6 md:grid-cols-12";

/**
 * Faint column guides fixed behind the page, drawn on the left edge of each
 * bay plus the right edge of the last. Content is set flush to these lines.
 */
export function GridGuides() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className={`${CONTAINER} h-full`}>
        <div className={`${GRID} h-full`}>
          {[0, 1, 2, 3].map((bay) => (
            <div
              key={bay}
              className={`h-full border-l border-[var(--guide)] md:col-span-3 ${
                bay === 3 ? "border-r" : ""
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
