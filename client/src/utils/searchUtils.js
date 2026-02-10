/**
 * Shared utilities for search components.
 */

/** Encode query for use in URL path or params (e.g. /search/foo%2Fbar). */
export function encodeSearchQuery(query) {
    return typeof query === 'string' ? query.replace(/\//g, '%2F') : '';
}
