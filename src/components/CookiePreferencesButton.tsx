'use client';

/**
 * Re-opens the consent modal from the footer, satisfying the DPA 2019
 * requirement that consent be withdrawable as easily as it was given.
 */
export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="footer__cookie-btn"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('canaan-harvest:cookie-preferences'));
      }}
    >
      Cookie preferences
    </button>
  );
}
