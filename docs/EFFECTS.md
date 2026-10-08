# The effects — implementation and reduced-motion matrix

**28 effects are implemented: 01–19, 21, 23–29 and 31.**

Numbers **20, 22 and 30 are not defined anywhere in the build brief** and have
deliberately been left unclaimed rather than invented. Nothing in the site is
missing as a result: all 15 page-structure sections carry at least one of the
28 implemented effects, and every section that the brief names an effect for
has one.

Every implemented effect has a reduced-motion fallback that preserves the
*content*, not just a shortened animation. Nothing is merely "made faster" —
motion is removed and the information it carried is preserved.

| # | Effect | Component / CSS | Reduced-motion fallback |
| --- | --- | --- | --- |
| 01 | WebGL produce basket | `Basket3D.tsx` + `hero.css` | Three.js never loads; poster image renders. Also falls back if WebGL is unavailable or a context cannot be created. |
| 02 | Scrollytelling journey | `Journey.tsx`, `JourneyScenes.tsx` + `journey.css` | Pinning removed; four beats become a plain stacked article with all four scenes as static figures. |
| 03 | AR farm tour | `ARFarmTour.tsx` + `chrome.css` | Panorama drag remains (user-driven); blob/auto animations stop. Session still requires an explicit click. |
| 04 | Per-letter stagger + glitch | `HeroTitle.tsx` + `hero.css` | All glyphs render complete, no transform, no `text-shadow`, no `clip-path`. |
| 05 | Buyer presence + cursors | `PresenceBoard.tsx`, `usePresence.ts` + `produce.css` | Pulse dot stops; cursor dots lose their transition. Live count still updates. |
| 06 | Drifting leaf particles | `LeafField.tsx` + `hero.css` | Component does not mount at all — no DOM, no animation. |
| 07 | Farm field line-art | `FieldLineArt` in `FarmEffects.tsx` + `effects.css` | Growth lines hold their drawn state as a static frame. |
| 08 | Self-drawing wordmark | `WordmarkDraw.tsx` + `wordmark.css` | Strokes render fully drawn and held; no animation. |
| 09 | Seed → sprout → leaf morph | `MorphCycle` in `FarmEffects.tsx` | rAF interpolation is skipped entirely; the three shapes crossfade via a 320ms opacity transition. |
| 10 | Logo draw on load / replay | `Header.tsx` + `nav.css` | Strokes render complete; click-to-replay becomes a no-op visually. |
| 11 | Nav icon animation | `nav.css` | Icon transform transitions suppressed; colour change on hover/focus remains. |
| 12 | Form field states | `forms.css` | State changes remain (border, colour, error text) — only the timing is collapsed. Nothing is lost. |
| 13 | Farmer mascot wave | `FarmerMascot` in `FarmEffects.tsx` + `effects.css` | Static pose held on hover and focus. |
| 14 | Faux-3D crate tilt | `Faux3DCrate` in `FarmEffects.tsx` + `effects.css` | Perspective removed, tilt pinned to 0; a single flat layer renders instead of the stacked layers. |
| 15 | Scroll-snap category rail | `ProduceCatalogue.tsx` + `rail` in `reduced-motion.css` | Becomes a plain wrapped grid; `scroll-snap-type: none`; rail nav buttons hidden; chips wrap instead of truncating. |
| 16 | Mixed-media collage | `MixedMediaCollage` in `FarmEffects.tsx` | Photo rotation removed; soil texture and grain overlay held static. |
| 17 | Liquid gooey blob | `LiquidBlob` + `GooFilterDefs` + `effects.css` | Blob morph loop stops; the shape is still shown. Filter region stays bounded. |
| 18 | Animated gradient backdrop | `hero.css` | `animation: none`, gradient pinned at `background-position: 50% 50%`. |
| 19 | Isometric farm assembly | `IsometricFarm` in `FarmEffects.tsx` | Scene renders **fully assembled** — every `iso-part` at `opacity: 1`, no transform, no transition. |
| 20 | — **not defined in the brief; left unclaimed** | — | — |
| 21 | Hand-drawn doodle | `HandDrawnDoodle` + mobile toggle doodle in `nav.css` | Doodle renders drawn; the `aria-expanded` state change still occurs, just without the draw transition. |
| 22 | — **not defined in the brief; left unclaimed** | — | — |
| 23 | Sequenced entrance | `Hero.tsx` + `hero.css` | The whole sequence is skipped; all content is immediately in its final position. Content is SSR'd regardless. |
| 24 | Shimmer skeleton | `SkeletonGrid.tsx` + `produce.css` | Shimmer replaced by **flat, non-shimmering grey**; dimensions unchanged, so zero CLS either way. |
| 25 | Seedling preloader | `Preloader.tsx` + `preloader.css` | Ring stops spinning; seedling and wordmark render complete; **plain percentage text becomes the visible progress signal**. |
| 26 | Hover price/origin reveal | `ProduceCard.tsx` + `produce.css` + `reduced-motion.css` | Reveal panel becomes **permanently visible** (static position) — no information is locked behind a hover. |
| 27 | Neumorphic freshness widget | `FreshnessWidget.tsx` + `produce.css` | Controls remain fully operable; pressed states still flip raised→inset; only timing collapses. |
| 28 | Glassmorphic nav | `Header.tsx` + `nav.css` | Glass stays (it is a visual treatment, not motion); the header's size/padding transition is removed. |
| 29 | Claymorphic submit + clay writing | `forms.css`, `ClayTitle.tsx` | Clay press is instant (no transform); title renders in its settled state with no per-character animation. |
| 30 | — **not defined in the brief; left unclaimed** | — | — |
| 31 | Stop-motion sprite | `StopMotionSprite` + `effects.css` + generated sheet | Sprite **holds its first frame**; playback halts off-screen regardless via IntersectionObserver. |

> **Gap note.** 20, 22 and 30 have no definition in the brief. They are
> documented as gaps rather than filled with guessed work, so that if the
> original numbers are recovered the three slots can be built to spec without
> anything having to be unwound first. See `docs/DECISIONS.md` §20.

## Global guarantees

`src/styles/reduced-motion.css` applies a blanket rule that forces
`animation-duration: 0.001ms`, `animation-iteration-count: 1` and
`transition-duration: 0.001ms`, plus `scroll-behavior: auto`. This is a safety
net: if a new animation is ever added without its own fallback, it cannot
escape the policy. The per-effect rules above then restore the *content* that
the animation was carrying.

## Tab-hidden behaviour

EFFECT-06 (leaves) pauses via `data-paused` when `document.hidden` is true.
EFFECT-01 pauses its render loop when the tab is hidden **or** the canvas is
scrolled out of view. EFFECT-31 halts off-screen.

## Effect ownership map

| File | Effects |
| --- | --- |
| `src/components/Hero.tsx` | 23 |
| `src/components/HeroTitle.tsx` | 04 |
| `src/components/Basket3D.tsx` | 01 |
| `src/components/LeafField.tsx` | 06 |
| `src/components/Journey.tsx` | 02 |
| `src/components/ProduceCatalogue.tsx` | 15, 24 |
| `src/components/ProduceCard.tsx` | 26 |
| `src/components/FreshnessWidget.tsx` | 27 |
| `src/components/PresenceBoard.tsx` | 05 |
| `src/components/FarmGallery.tsx` / `FarmEffects.tsx` | 07, 08, 09, 13, 14, 16, 17, 19, 21, 31 |
| `src/components/WordmarkDraw.tsx` | 08 |
| `src/components/Preloader.tsx` | 25, 08 |
| `src/components/Header.tsx` | 10, 11, 28, 21 |
| `src/components/ARFarmTour.tsx` | 03 |
| `src/components/BulkOrderForm.tsx` / `ClayTitle.tsx` | 12, 29 |
| `src/app/not-found.tsx` | 17 |
