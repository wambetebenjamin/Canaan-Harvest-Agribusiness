# Photo shot list

Every image slot in the site, what it needs to show, and the brief's approved
search terms. Use this to replace the temporary template placeholders — see
`docs/image-credits.md` for why the current set does not meet the brief.

**Sources permitted by the brief:** Pexels and Unsplash only.
**Subject requirement:** East African farmers and produce settings.
**No AI-generated images.**

## Approved search terms

These are the exact terms specified in the build brief:

1. `Kenyan farmer fresh produce farm`
2. `East African vegetables market harvest`
3. `African woman farm vegetables Kenya`
4. `Kenyan farm field aerial`
5. `East African fresh fruit produce`
6. `African chef restaurant fresh ingredients`

---

## Slots

### Farm imagery — `public/photos/farm/`

| Slot | Must show | Ratio | Suggested term |
| --- | --- | --- | --- |
| `farm-field-aerial.webp` | Aerial/Drone view of cultivated Kenyan farmland, field rows visible | 16:9 | `Kenyan farm field aerial` |
| `field-rows.jpg` | Rows of vegetables or grains on a working farm | 4:3 | `Kenyan farmer fresh produce farm` |
| `farmer-harvest-kale.jpg` | A Kenyan farmer holding a leafy-green harvest, ideally smiling, looking at camera | 3:4 | `African woman farm vegetables Kenya` |
| `harvest-greens.jpg` | Hands holding freshly cut greens | 4:3 | `East African vegetables market harvest` |
| `packhouse-grading.jpg` | Produce being sorted or graded, crates or tables visible | 4:3 | `East African vegetables market harvest` |
| `seedling-nursery.jpg` | Seedlings in a nursery bed or trays | 4:3 | `Kenyan farmer fresh produce farm` |
| `soil-cultivation.jpg` | Hands, tools or feet working Kenyan soil | 4:3 | `Kenyan farmer fresh produce farm` |
| `harvest-basket.jpg` | A basket or crate of mixed produce held or set down | 4:3 | `East African fresh fruit produce` |
| `seedlings-planted.jpg` | Young plants in the ground, ideally with a person tending them | 4:3 | `African woman farm vegetables Kenya` |
| `field-weeding.jpg` | A farmer working a vegetable bed | 4:3 | `Kenyan farmer fresh produce farm` |

### Produce close-ups — `public/photos/produce/`

| Slot | Must show | Ratio | Suggested term |
| --- | --- | --- | --- |
| `chard-beetroot.jpg` | Leafy greens with visible roots, fresh | 4:3 | `East African vegetables market harvest` |
| `fresh-leaves.jpg` | Close-up of fresh leafy greens | 4:3 | `East African vegetables market harvest` |
| `vegetable-basket.jpg` | Mixed Kenyan vegetables in a basket — **this is the hero 3D fallback poster** | 1:1 | `East African vegetables market harvest` |

> The produce detail cards reuse these three close-ups across 28 catalogue
> lines. For a stronger catalogue, source **one image per produce item** and
> point the `image` field in `src/data/produce.ts` at it. Distinct images per
> line would remove the visible repetition in the grid.

### Testimonial avatars — `public/photos/people/`

| Slot | Must show | Ratio |
| --- | --- | --- |
| `testimonial-1.jpg` | East African chef — **must match the persona** (Chef Alice Wanjiru, procurement lead) | 1:1 |
| `testimonial-2.jpg` | East African executive chef (Samuel Otieno) | 1:1 |
| `testimonial-3.jpg` | East African procurement manager (Grace Nyambura) | 1:1 |
| `testimonial-4.jpg` | Kenyan male farmer (Peter Kilonzo) | 1:1 |

Suggested search term: `African chef restaurant fresh ingredients`

> **Highest priority.** The current placeholders show European subjects paired
> with East African names. That is inaccurate and should be fixed first.

### Blog imagery — `public/photos/blog/`

| Slot | Article | Must show |
| --- | --- | --- |
| `blog-1.jpg` | What is actually in season in Kenya right now | Kenyan produce market stall |
| `blog-2.jpg` | The cold chain that actually works | Packhouse or produce handling |
| `blog-3.jpg` | Cooking indigenous greens | Prepared African leafy greens |
| `blog-4.jpg` | What an off-take agreement commits you to | Farmer inspecting a crop |
| `blog-5.jpg` | Water-smart irrigation | Irrigation on a field |
| `blog-6.jpg` | Supplying a Nairobi restaurant | Chef working with fresh produce |

### Brand assets — replace these too

| Slot | Current state | Needed |
| --- | --- | --- |
| `public/favicon.png` | Generic template favicon | Canaan Harvest mark at 32×32 and 512×512 |
| `public/apple-touch-icon.png` | Generic template icon | Canaan Harvest mark at 180×180 |

---

## Technical requirements

- **Formats:** `.jpg` or `.webp`. `next.config.mjs` produces AVIF and WebP
  variants automatically.
- **Aspect ratios:** match the table. The CSS uses `aspect-ratio`, so a
  mismatched image is cropped rather than distorted — but a wrong ratio crops
  the subject.
- **Resolution:** source at 2× the largest rendered size. The hero poster
  renders up to 560 px, so source at 1200 px minimum. Card imagery renders up
  to ~400 px, so 800 px is ample.
- **File size:** keep under ~250 KB each for the card images, under ~500 KB for
  the aerial and hero poster.
- **Alt text:** every slot has authored alt text in `src/data/produce.ts` and
  `src/data/content.ts`. Update it when you replace an image so it still
  describes what is actually shown — alt text describing a placeholder is worse
  than none.
- **Attribution:** add the photographer and source URL to
  `docs/image-credits.md` for each replacement.

## Verification after swapping

```bash
npm run build          # catches any bad import path
# then check the catalogue grid and the hero poster at 320px and 1440px
```
