# Aegean Brew – Stress Test Cases

Use these to verify the AI cashier handles edge cases correctly. Test by typing each scenario in the chat and checking the response.

---

## Temperature (MUST reject or redirect)

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 1 | "Small Americano, extra hot" | Redirect: "We have hot or iced - I'll put you down for hot. Would that work?" | No "extra hot" as valid option |
| 2 | "Large Latte, warm" | Redirect to hot or iced | No "warm" |
| 3 | "Iced Mocha, lukewarm" | Redirect: lukewarm isn't iced; clarify | Contradiction |
| 4 | "Hot Frappuccino" | REJECT: "Frappuccinos are blended iced only - would you like a hot Mocha or Latte instead?" | Impossible |
| 5 | "Kids temp latte" | Redirect to hot or iced | No "kids temp" |

---

## Size (MUST clarify – we only have S and L)

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 6 | "Medium Americano" | "We have small (12oz) or large (16oz) - which would you like?" | No medium |
| 7 | "Regular latte" | Clarify size (regular often means medium) | |
| 8 | "Venti Mocha" | "We have small or large - I can do a large for you?" | Starbucks term |
| 9 | "Extra large Cold Brew" | Offer large | No XL |
| 10 | "One coffee" (no size) | Default to L, confirm | |

---

## Milk (ONLY whole, skim, oat, almond)

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 11 | "Latte with soy milk" | "We have oat and almond - would one of those work?" | No soy |
| 12 | "Coconut milk latte" | Offer oat/almond instead | No coconut |
| 13 | "Oat milk Americano" | Accept, add oat milk (+$0.50) | Valid |
| 14 | "Skim latte" | Accept, no charge | Valid |

---

## Menu / drink validity

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 15 | "Espresso" | Not on menu – reject or suggest Americano | No espresso shot alone |
| 16 | "Cappuccino" | Not on menu – suggest Latte | Not on menu |
| 17 | "Chai Latte" | Not on menu – reject | Not on menu |
| 18 | "Iced tea" (generic) | Clarify: Black, Jasmine, Lemon Green, or Matcha Latte? | Need specific tea |
| 19 | "Croissant" | Clarify: Plain or Chocolate? | Two croissant types |

---

## Customization limits

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 20 | "Latte with 10 extra shots" | Reject: max 6 extra shots | Safety |
| 21 | "Vanilla syrup latte" | Reject: we only have caramel and hazelnut | No vanilla |
| 22 | "Lavender syrup" | Reject – offer caramel or hazelnut | No lavender |
| 23 | "No ice" (for hot drink) | Accept; ice N/A for hot | |
| 24 | "Extra ice" (for hot drink) | Clarify: ice only applies to iced drinks | |

---

## Sweetness & ice (ONLY our options)

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 25 | "Half sweet latte" | Map to "Less Sugar" | |
| 26 | "Unsweetened" | Map to "No Sugar" | |
| 27 | "Light ice" | Map to "Less Ice" | |
| 28 | "No ice" (iced drink) | Accept | Valid |

---

## Pastries

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 29 | "Large croissant" | Pastries have no size – accept as single item | |
| 30 | "Hot cookie" | Pastries have no temp – accept | |
| 31 | "3 banana breads" | Accept (≤10 items) | |
| 32 | "15 lattes" | Reject: max 10 items per order | |

---

## Edge cases / ambiguity

| # | Customer says | Expected | Notes |
|---|----------------|----------|-------|
| 33 | "Coffee" | Clarify: Americano, Latte, Cold Brew, Mocha, or Frappuccino? | Too vague |
| 34 | "Tea" | Clarify which tea | Too vague |
| 35 | "Water" | Free – confirm | |
| 36 | "Latte with no espresso" | Clarify: latte needs espresso | |
| 37 | "I'll have a... um... " (incomplete) | Ask what they’d like | |
| 38 | "One of everything" | Reject or clarify (likely >10 items) | |
| 39 | Empty message / space only | Don’t treat as order | |

---

## Valid end-to-end flows

| # | Scenario | Expected |
|---|----------|----------|
| 40 | "Small hot Americano" | Accept, confirm, finalize |
| 41 | "Large iced latte with oat milk, less sugar" | Accept, confirm, finalize |
| 42 | "Cold brew and a chocolate croissant" | Accept both, confirm, finalize |
| 43 | "Matcha latte, large, iced, extra matcha shot" | Accept, add $1.50, confirm |
| 44 | "2 americanos and 1 cookie" | Accept, confirm |

---

## Quick checklist

- [ ] Temperature: only hot/iced; no extra hot, warm, lukewarm
- [ ] Size: only S and L; no medium, venti, XL
- [ ] Milk: only whole, skim, oat, almond
- [ ] Syrups: only caramel, hazelnut
- [ ] Hot Frappuccino: always rejected
- [ ] Off-menu drinks: rejected or redirected
- [ ] Max 10 items per order
- [ ] Max 6 extra shots per drink
