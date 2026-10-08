/**
 * Shared API response codes.
 * Kept in one place so the client and server can never disagree on the
 * string that triggers the reCAPTCHA v2 fallback.
 */

/** Server could not clear the v3 score threshold; client should show v2. */
export const V2_CODE = 'captcha_v2_required';
