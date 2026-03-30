// Minimal stub used only at build time to avoid resolving Deno/test deps
// createYahooFinance expects a default export with a `_once` helper used in dev helpers
const fetchCache = {
  _once: () => {},
};

export default fetchCache;