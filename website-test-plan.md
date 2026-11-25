# Website Test Plan

## Website and Analysis Basis

- **Website:** NUHS+ — https://websparks-stg.sitefinity.cloud/
- **Planning source:** `website.md` (NUHS+ Pages functional specification)
- **Instructions:** `copilot-instructions.md`
- **Analysis date:** 2026-11-12
- **Observed profiles:** Desktop viewport 1365 × 900; mobile viewport 390 × 844.
- **Analysis basis:** Source requirements plus representative, read-only browser discovery. Findings below distinguish observed behavior from specified behavior and unresolved behavior.
- **Analysis status:** Discovery findings, source comparisons, workflow evidence, and unresolved validation opportunities are recorded below. This document describes website coverage decisions, not automation implementation status.

## Scope

### In Scope

- The NUHS+ Pages functional specification:
  - Shared Header & Footer: the default desktop and mobile layouts and the controls and links specified for them.
  - Homepage: desktop and mobile template layouts, Featured Stories, Highlight Story, Image & Standfirst, Load More, Podcast, and Back to Top.
- The interactions directly attached to those areas, including navigation, search submission, responsive states, content changes, and outbound links.
- Navigation destinations named in `website.md`, generally to confirm navigation outcome and identify destination type. The NUHS+ static About Us page has explicit content checks that conflict with this general depth limit; keep those checks blocked pending clarification.
- The mobile and desktop differences specified in the source.

### Out of Scope

- None of the source-defined Header & Footer or Homepage functional requirements are excluded.
- Destination-page content is generally outside the stated analysis depth, apart from the unresolved NUHS+ static About Us requirements noted below. Incidental behavior not described by `website.md`, such as the observed “Stay informed” dialog, is not a validation target; this does not exclude any requirement defined by the source.

### Scope Boundaries and Handling Rules

- The source states that no scope exclusions apply to the NUHS+ Pages functional specification. All functionality defined for Header & Footer and Homepage on desktop and mobile is in scope.
- Destination pages named by the source are generally in scope only to confirm that navigation reaches them and to identify their page type and navigation outcome. Their internal content and workflows are not defined by this source, except for the explicit NUHS+ static About Us constraints identified below.
- The NUHS+ static About Us page is a specific scope ambiguity: the general destination boundary limits review to navigation, while the About Us requirement explicitly names its hero image, short write-up, and absence of sharing, tags, and related articles. Preserve these as specified checks, but keep their execution blocked until the intended destination-page depth is reconciled.
- Desktop and mobile are the only responsive profiles specified. Tablet-specific behavior is not described; do not infer it from the desktop or mobile requirements.
- CMS/editor configuration and authoring are not described by this user-facing functional specification.
- A second header-information set is mentioned but not described. Its existence is a discovery gap, not an assumed layout or an exclusion.
- If an incidental overlay blocks an in-scope interaction, dismiss it with its observed close control and verify that it is dismissed so discovery can continue. The observed “Stay informed” dialog is not described as a functional requirement; its appearance, persistence, and storage are not validation objectives.

### Scope Notes

- The source says NUHS+ has two header-information sets but describes only the default header. The second set remains to be discovered; do not infer its layout.
- The source describes a static NUHS+ About Us page, a NUHS About Us page, search results, a mailing-list destination, Pillar destinations, and article destinations. Treat each only as a navigation destination and record its page type and navigation outcome.
- The NUHS+ static About Us page also has explicit content constraints in its source requirement. These conflict with the general destination-only boundary; retain the discrepancy and seek clarification rather than silently broadening or narrowing scope.
- A “Stay informed” newsletter dialog appeared after scrolling during discovery and was dismissed so discovery could continue. Its behavior and persistence are not source-defined validation objectives.
- For content-changing interactions, determine whether relevant requests occur and record relevant request/response evidence with the originating workflow. For client-side changes with no relevant request, compare the observed UI state before and after the action. For expandable content, record counts before and after each activation through the end state.
- Lighthouse assessment applies to a representative Homepage on the specified desktop and mobile profiles when available; do not extend it to destination-page content.

### Scoped Element Types and Required Checks

- **Navigating links:** confirm navigation outcome and destination page type.
- **Search textbox and submission:** observe the request and response for content-changing search; identify empty, partial, invalid, and no-result states.
- **Load More / expandable content:** record counts before and after each activation, the increase, and the final control state.
- **Carousel arrows and auto-rotation:** determine whether interaction-triggered requests occur; use before/after UI state for client-side movement and observe automatic changes without assuming a fixed timing.
- **Font-size choices:** validate available states and relative user-visible changes.
- **Responsive/sticky navigation and layouts:** compare behavior on the specified desktop and mobile profiles.
- **Incidental overlay:** apply only the blocking-dismissal precondition above; do not create coverage for behavior not specified in `website.md`.
- **Lighthouse:** assess a representative in-scope Homepage for each specified device profile if the tooling is available.

## Conceptual Coverage Ownership

| Ownership area | Coverage boundary | Rationale |
|---|---|---|
| Header & Footer | The default desktop and mobile header and footer, including navigation, search, text-size control, subscription and social links, entity links, legal links, and shared-shell behavior | This is a source-defined top-level functional area. Ownership follows that hierarchy rather than introducing a generated “site shell” label or a separate owner for each control. |
| Homepage | The desktop and mobile Homepage template, Featured Stories, Highlight Story, Image & Standfirst with Load More, Podcast, Back to Top, and Homepage-only exploratory review | This is the other source-defined top-level functional area. Its modules and journeys remain grouped under Homepage; module, requirement, validation, and workflow headings do not independently create owners. |

These are conceptual coverage boundaries, not automation or file boundaries. The observed NEWS, LIFESTYLE, SCIENCE, PEOPLE, MULTIMEDIA, MEDIPEDIA, and ABOUT US navigation entries remain documented as navigation areas and destinations; the source limits destination-page review to navigation confirmation except where it explicitly states additional destination requirements. They are not independent ownership areas merely because they appear in navigation. No separate business-area ownership is inferred because the source defines a functional hierarchy, not a business-domain model. Shared functionality is captured within the source-defined Header & Footer area; no additional cross-area owner is warranted by the current discovery.

## Navigation Areas and Page Types

### Observed Navigation Areas

The primary navigation observed on desktop contains:

- **NEWS** → `/home#news` (Homepage section anchor)
- **LIFESTYLE** → `/home#lifestyle` (Homepage section anchor)
- **SCIENCE** → `/home#science` (Homepage section anchor)
- **PEOPLE** → `/home#people` (Homepage section anchor)
- **MULTIMEDIA** → `/home#multimedia` (Homepage section anchor)
- **MEDIPEDIA** → `/medipedia` (separate destination; destination page not inspected)
- **ABOUT US** → submenu with **NUHS** (`/about-us/nuhs`) and **NUHS+** (`/about-us/nuhsplus`)

On the observed mobile viewport, the menu additionally included **HOME** (`/home#`) and a menu toggle. The search textbox remained visible while the menu was open, but the specified Facebook, Instagram, and LinkedIn links were not visible in the expanded mobile state. The mobile About Us submenu displayed the same two choices when expanded. Desktop About Us displayed those choices on hover.

These are observed labels and routes, not a hardcoded assumption about future or unobserved navigation.

### Destination Page Types

| Destination | Observed or specified type | Discovery status |
|---|---|---|
| `/home` or `/` | NUHS+ Homepage | Observed; the logo navigated from search results to `/home`. |
| `/home#news`, `/home#lifestyle`, `/home#science`, `/home#people`, `/home#multimedia` | Homepage section anchors | Link routes and representative click outcomes were exercised. This differs from the specification’s description of each NUHS pillar linking to an individual Pillar page. |
| Individual Pillar page | Individual Pillar destination (route and count to be discovered) | No individual Pillar destination was confirmed; observed editorial links are Homepage section anchors, contrary to the described destination model. |
| `/medipedia` | Navigation destination / Medipedia page | Link observed; destination page type and outcome remain unverified. |
| `/about-us/nuhs` | NUHS About Us page | Link observed in the About Us submenu and footer; destination content not inspected. |
| `/about-us/nuhsplus` | NUHS+ static/informational About Us page | Opened in the current tab and identified as an informational destination; internal content was not assessed under this scope. |
| `/generalSearch/?keyword=rehabilitation` | Search results page | Opened from header search with the submitted query in the route; internal result content and behavior were not assessed under this scope. |
| `/generalSearch/?keyword=podcast` | Search results page | Podcast title link uses this route and a new tab target; prefilled keyword is in the URL. |
| NUHS Mailing List page | Mailing-list destination | Destination route was not identified; the observed external form.gov.sg form has not been confirmed as equivalent. |
| `https://form.gov.sg/691ae87bae12f9acde66373a` | External newsletter subscription form | Link opened in a new tab. This differs from the source’s description of a NUHS Mailing List page. |
| `/article/{slug}` | Individual article page | Article links observed. Prior discovery recorded representative Image & Standfirst image and title clicks opening an `/article/` destination in the same tab. |
| `/stories/{slug}` | Story/article-like destination | Links observed in Homepage modules; its page type has not been confirmed and may differ from `/article/`. |
| `https://www.nuhs.edu.sg/Pages/terms-of-use.aspx` → `https://www.nuhs.edu.sg/terms-of-use` | External NUHS Terms of Use page | Footer link opens a new tab and redirects to the shorter `/terms-of-use` route. Its label is “Terms of Use,” not “Privacy Policy.” |
| Privacy Policy | Privacy Policy destination (source URL is `https://www.nuhs.edu.sg/Pages/terms-of-use.aspx`) | The observed footer link is labeled Terms of Use and redirects to the NUHS Terms of Use route; confirm whether it is intended to fulfill the Privacy Policy requirement. |
| Social sharing destination | Social-sharing pop-up or new-tab destination | The specified sharing control was not located; destination and shared-content behavior remain blocked pending confirmation of the control and its location. |
| Facebook, Instagram, LinkedIn destinations | External social pages | Header and footer links observed with new-tab targets; the footer LinkedIn destination was exercised. Footer additionally includes TikTok and Telegram. |
| NUHS entity destinations | External organization or institution pages | Fourteen named links observed in the footer; links use new-tab targets. National University Hospital was confirmed to open its external destination in a new tab. |

## Shared Functionality

### Header and Navigation

- The header was fixed at the top on both observed desktop and mobile profiles; its top position remained zero after scrolling.
- Desktop header elements included the NUHS logo, text-size controls, Facebook/Instagram/LinkedIn links, Subscribe now, a search toggle, and the primary navigation.
- The logo points to `/home`.
- Desktop primary navigation uses section anchors for five editorial areas, a separate Medipedia link, and an About Us submenu.
- Mobile displays a menu toggle and HOME entry in addition to the observed primary items. The search textbox remains visible in the header and expanded menu, but header social links are not visible in the expanded menu. The font-size control is hidden in the mobile sticky header after scrolling.
- The mobile menu opened and exposed its destinations. The visible header toggle was intercepted while the menu was open. The in-menu close icon removed the menu's open state, but the overlay and links remained visible after the transition; the expected close behavior is not stated in the source and needs confirmation.
- The About Us submenu was observed on desktop hover and after a mobile tap. It contains NUHS and NUHS+ links.
- The NUHS+ About Us link opened in the current tab; the NUHS submenu link opened a new tab. The footer About NUHS link opened its observed route in the current tab.
- The header search textbox placeholder observed is “I want to know about...”; the source specifies “Search keyword or topic.”
- The header search toggle exposes/activates the search workflow. Entering “rehabilitation” and pressing Enter navigated to `/generalSearch/?keyword=rehabilitation`; the action triggered `POST /api/GeneralSearchApi/GeneralSearch` with status 200.
- A search-results page showed a retained query, “Showing 24 results,” and Alphabetical / Published Date sorting choices. Empty, partial, invalid, and no-results search outcomes have not been explored.

### Text-Size Controls

- Three choices were observed: small (`0.92`), default (`1`), and large (`1.18`); default was initially active.
- Small and large settings changed the visible main-content font size relative to default. Returning to the Homepage after selecting small on the search-results page restored the default state; selection did not persist across that full-page navigation.
- This observed reset behavior fills the source’s persistence question for the tested navigation path. Persistence across other navigation types or sessions remains unknown.

### Footer

- The footer contains NUHS branding, three groups of entity links, About NUHS, Terms of Use, and social links.
- Desktop rendered the three entity groups horizontally (5, 5, and 4 entries). At the observed mobile viewport the groups stacked vertically, consistent with one-column presentation.
- Representative footer entity and LinkedIn links opened their external destinations in new tabs. The Terms of Use link opened a new tab and redirected from `/Pages/terms-of-use.aspx` to `/terms-of-use`.
- The source’s “Social Sharing button” was not found in the footer. The visible footer button is Back to Top; the social links are outbound links, not sharing controls.
- The current footer has more social destinations than specified (TikTok and Telegram in addition to Facebook, Instagram, and LinkedIn). The Telegram destination’s accessible label appears to say “facebook”; confirm the user-facing label.

## Homepage Modules

### Featured Stories

- Five carousel slide items were present in the Homepage content, with one active item at a time.
- Cards expose an image, category label(s), and title. Observed category count varies; the source’s maximum of two side-by-side tags needs validation against all slides.
- Both `/article/` and `/stories/` destinations appear among Homepage content links. The `/stories/` destination type is unresolved.
- The active story changed on automatic rotation and with both arrows when each CSS track transition completed. The active marker updated before the transition settled; issuing Previous immediately after observing that marker could be ignored during the transition. Hovering paused automatic rotation during the arrow check.
- Published-date ordering and loop/stop behavior at the last slide remain unverified. The mobile image crop was checked at the planned viewport and met the approximate-square assertion.

### Highlight Story

- Two highlighted article cards were observed. Content includes images, category labels, and titles.
- Mobile’s specified Standfirst layout and click-through behavior have not been fully verified.

### Image & Standfirst and Load More

- Three initial cards were recorded in the existing discovery. Cards show image, category label(s), title, and visible standfirst.
- A representative initial card’s image and title were separately confirmed to navigate to the same `/article/` destination in the same tab.
- One Load More activation appended six cards, taking the total from three to nine; original cards remained. The action triggered `POST /api/ArticlesApi/LoadMoreArticles`, status 200.
- The Load More control was absent after the nine-card state. A newly loaded card’s image was confirmed to open an `/article/` destination.
- A later observation reproduced the 3 → 9 transition, retained the original cards, and opened an article from newly loaded content. Category and ordering rules remain unspecified.
- Module content includes visible standfirsts although the source’s explicit card-field list names only image, category, and title.

### Podcast

- The Podcast heading links to `/generalSearch/?keyword=podcast` with a new-tab target.
- The Homepage rendered eight individual Podcast links in the observed content, while the specification says up to six individual articles. This is a material count discrepancy to resolve.
- Three cards were visible on desktop. Activating Next moved the carousel from index 0 to index 3; after the track transition completed, Previous restored the initial visible set. The active marker updated before the visual transition settled.
- The Podcast heading opened its search results in a new tab with the `podcast` query. A representative Podcast card opened an `/article/` destination. Mobile count/shift behavior and image-absent title alignment remain unverified.

### Back to Top

- The control was hidden at the top, displayed after scrolling, and returned the Homepage to scroll position zero when activated; it was hidden again at the top.
- It is rendered in the footer area despite being described under Homepage in the source.

### Homepage SEO and Lighthouse (Exploratory Review)

- The Homepage has a document title, canonical URL, populated Open Graph metadata, and `alt` attributes on its images.
- No meta description, H1 heading, or Twitter metadata was present. The first heading was H2; the heading-rank sequence otherwise had no skipped levels.
- Lighthouse scores (0–100), compared with the assessment thresholds retained from the existing evaluation criteria (these are not specified in `website.md`): Performance ≥80, Accessibility ≥90, Best Practices ≥90, and SEO ≥90:

| Profile | Performance | Accessibility | Best Practices | SEO | Result |
|---|---:|---:|---:|---:|---|
| Desktop | 42 | 82 | 96 | 61 | Threshold failures: Performance, Accessibility, SEO |
| Mobile | 69 | 89 | 96 | 61 | Threshold failures: Performance, Accessibility, SEO |

- Before the repeat audits, the intended Homepage content was visible at both viewports, rendered images and fonts were ready, and no blocking popup remained. The reports identified desktop and mobile profiles.
- A prior post-readiness run scored desktop 42 / 78 / 96 / 61 and mobile 44 / 89 / 96 / 61. The repeat results above varied in Performance and desktop Accessibility, but both runs failed Performance, Accessibility, and SEO on both profiles; Best Practices met its threshold. Thresholds were unchanged.
- Repeat-report findings include slow First Contentful Paint, Largest Contentful Paint, and Speed Index; desktop additionally failed Cumulative Layout Shift. Accessibility findings include unnamed buttons, color contrast, and list semantics on both profiles, plus target size on desktop. SEO findings include crawlability and the missing meta description. A console error was also reported under Best Practices, although that category remained above threshold.

## Workflows and User Journeys

### Header & Footer Journeys

1. From a non-Homepage destination, activate the NUHS logo and confirm the Homepage is reached.
2. On desktop, navigate the primary links and About Us submenu; confirm section-anchor versus destination-page outcomes.
3. On mobile, open the menu, follow its primary links, and expand About Us to select NUHS or NUHS+. Explore the close interaction only after its expected behavior is confirmed.
4. Change text size through small, default, and large; observe the visible relative change and state reset/persistence on navigation.
5. Expand header search, enter a keyword, submit, and confirm the results destination and preserved query.
6. Activate Subscribe now and confirm the external subscription form destination and new-tab outcome.
7. Reach the specified footer destinations and confirm the observed entity, social, About NUHS, and Terms of Use outcomes.
8. Compare the footer sharing behavior with the source requirement; no sharing control was located during discovery.

### Homepage Journeys

1. Review the initial Featured Stories slide and move among slides using arrows; observe automatic rotation and the end state.
2. Open a representative Featured Story or Highlight Story and record the destination type and navigation outcome.
3. Review the initial Image & Standfirst cards, open one article, return, then expand with Load More and record counts, card format, network response, and end state.
4. Open an article from newly loaded content and confirm its destination type.
5. Open Podcast search from its title; confirm the new tab, query, and search page type.
6. Move through Podcast items with both arrows and open a representative article.
7. Scroll to Back to Top, activate it, and confirm the page returns to its initial scroll position.

## Findings and Source Comparison

| Area | Specified behavior | Observed behavior | Status / discrepancy |
|---|---|---|---|
| Scope | The full Header & Footer and Homepage specification on desktop and mobile; destinations are generally navigation-only | Discovery covers the defined Header & Footer and Homepage areas; the second header set is not described | No explicit exclusions in the source; destination depth and unspecified responsive behavior remain bounded by the source. |
| Navigation structure | NUHS pillars link to individual Pillar pages | Five editorial links use Homepage section anchors; Medipedia links to `/medipedia`; About Us opens a two-link submenu | Discrepancy. Confirm expected Pillar destination model and active-state behavior. |
| Mobile HOME item | Not listed in the source’s mobile header description | HOME appears in the mobile menu and points to `/home#` | Additional observed navigation item. |
| Mobile header and menu controls | Logo, font-size changer, search, and hamburger menu remain visible while scrolling; the expanded menu includes search and social links | The logo, search, and hamburger menu are visible after scrolling; the font-size changer is hidden. In the expanded menu, the search textbox is visible, but Facebook, Instagram, and LinkedIn are not visible. | Discrepancy for the hidden font-size changer and mobile social links; preserve as website findings. |
| Header search placeholder | “Search keyword or topic” | “I want to know about...” | Discrepancy. Search submission works for a representative keyword. |
| Search action | Expand textbox; Enter opens search results | Search opened `/generalSearch/?keyword=rehabilitation`; GeneralSearch API returned 200 | Representative happy path observed; empty/no-result/error behavior remains open. |
| Search results | Search results destination (internal content and ordering are outside this scope) | Search results page opened with the submitted query in the route | Destination type and navigation outcome confirmed; result content was not assessed. |
| Text-size control | Small/default/large; persistence unknown | Three states observed; relative size changes occurred; default returned after full-page navigation | Persistence does not occur for the tested full-page navigation. |
| Sticky header | Whole desktop header remains visible; mobile Logo, Font size changer, Search function, and Hamburger Menu remain visible | Header remains fixed at top on desktop and mobile. After mobile scrolling, the logo, search, and menu toggle are visible, but the font-size changer is hidden. | Mobile font-size control visibility discrepancy. |
| About Us submenu | Desktop hover and mobile tap show NUHS and NUHS+ | Both options appeared in both observed interaction modes | Match for submenu presence; individual link outcomes and mobile collapse behavior need further validation. |
| Subscription | NUHS Mailing List page | “Subscribe now” points to a `form.gov.sg` external form and uses a new-tab target | Destination differs; confirm whether the external form is the intended Mailing List destination. |
| Footer entities | Three desktop columns; one mobile column | Three horizontal entity groups on desktop; groups stack vertically on mobile; 14 links observed | Match for the observed layout. |
| Footer legal link | Privacy Policy | Link is labeled “Terms of Use”; it opens a new tab and redirects from the specified NUHS terms-of-use URL to `/terms-of-use` | Label mismatch; destination page is confirmed. |
| Social links | Facebook, Instagram, LinkedIn are specified for desktop and expected in the expanded mobile navigation | Desktop header links point to the corresponding social hosts. In the expanded mobile state, the three header links are hidden. The footer additionally includes TikTok and Telegram; Telegram is exposed with a Facebook-like label. | Mobile visibility discrepancy; additional footer links and the Telegram label also need confirmation. |
| Footer sharing | Social Sharing button with eight channels and specified shared content | No share control was located; footer control is Back to Top | Major unresolved discrepancy. Locate the intended control or confirm it is absent/removed before planning channel-specific coverage. |
| NUHS+ static page | Confirm navigation reaches the source-described static/informational destination and identify its page type | `/about-us/nuhsplus` opened in the current tab and was identified as an informational destination | Navigation outcome and destination type confirmed. The content constraints are covered by the scope-ambiguity row below. |
| NUHS+ static page depth | General scope limits destination-page review to navigation, while the About Us requirement also specifies a hero image, short write-up, and no share functions, tag, or related articles | The destination was identified; those content constraints were not reviewed | Scope ambiguity. Clarify whether the explicit static-page checks are included despite the general destination-only boundary. |
| Featured Stories | Five items; one visible; rotate every ~3 seconds; newest first | Five slide items and one active item; automatic rotation and both arrows changed the active item. The active marker updated before the track transition completed. | Transition-completion synchronization is needed when checking consecutive arrow actions; order, tags, and end behavior remain unverified. Mobile image crop met the approximate-square check. |
| Highlight Story | Two items | Two cards observed; a representative destination opened | Desktop count and click-through confirmed; mobile Standfirst readability was checked at the planned viewport. |
| Image & Standfirst card fields | Image, category, title | Those fields plus a visible standfirst appeared | Standfirst is an extra observed field not explicitly listed in the source. |
| Load More | Add six to initial three, total nine; disappear at end | 3 → 9 recorded; action POST returned 200; control absent after expansion | Match for the observed dataset. Repeated activations and fewer-than-nine boundary remain unknown. |
| Article route variants | Individual article page | Both `/article/{slug}` and `/stories/{slug}` links occur; prior representative clicks opened `/article/` pages | `/stories/` page type remains unconfirmed. |
| Podcast item count | Up to six individual articles | Eight individual Podcast links were rendered | Discrepancy requiring product/content confirmation. |
| Podcast title | New tab, Search page with “podcast” prefilled | Link opened a new tab with `/generalSearch/?keyword=podcast` | Match for route and prefilled query. |
| Podcast arrows | Previous/next change visible items | Three cards were visible on desktop; Next changed the active index from 0 to 3, and after the track transition completed, Previous restored the initial visible set. | Compare the full visible set after each settled transition; mobile count/shift behavior remains unverified. |
| Back to Top | Hidden at top, appears after scroll, returns to top | Hidden at top, shown after scrolling, click returned to scroll position zero and hid it | Match for observed Homepage behavior. |
| Homepage SEO metadata | No SEO metadata requirement is stated in `website.md`; exploratory review recorded title, description, canonical, heading order, social metadata, and image alt attributes without inventing expected values | Title “Home \| NUHS+” and a canonical URL are present. No meta description, H1, or Twitter metadata was found; Open Graph title, URL, type, and site name are present. All 27 observed images have an alt attribute. The latest audit scored Desktop 44/82/96/61 and Mobile 44/89/96/61 for Performance/Accessibility/Best Practices/SEO; both before-audit screenshots show the page undimmed after the incidental overlay cleared. | Metadata gaps remain exploratory, not source-established requirement failures. Both profiles remain below the configured thresholds for Performance, Accessibility, and SEO. Performance varied across repeat runs, so retain the audit evidence and do not infer a stable value. |
| Popup | Not specified for the functional scope | “Stay informed” dialog appeared after scrolling; dismissed and verified hidden | Discovery precondition only; popup coverage remains out of scope. |
| Browser console | No source requirement | A `bootstrap-select.min.js` error reading `Constructor` appeared on Homepage load and again on navigation | Incidental diagnostic note; relevance to in-scope behavior is unestablished. Do not treat as a functional finding without triage. |

## Validation Opportunities

Each opportunity belongs to a conceptual owner. Its planning disposition explicitly distinguishes planned coverage from remaining discovery gaps and behavior blocked on clarification:

- **Planned Coverage:** retain as an in-scope validation opportunity; observed mismatches remain findings, not changed expectations.
- **Coverage Gap:** additional observation or evidence is needed to complete the planned coverage.
- **Blocked Coverage:** an expected outcome or requirement must be clarified before it can be validated without guessing.
- **Out of Scope:** discovered behavior is not a validation objective under this specification.

| Opportunity | What to validate | Owner | Planning disposition and discovery state |
|---|---|---|---|
| Header presence and order | Compare desktop and mobile header controls against the specified layouts; record additional or missing elements | Header & Footer | **Planned Coverage** — structure was observed; differences from the specified navigation model remain findings. |
| Second header-information set | Discover whether the separately mentioned second header set exists and, if accessible, identify its elements and behavior without inferring a layout | Header & Footer | **Coverage Gap** — the source mentions two sets but describes only the default; the second set was not identified. |
| Sticky header | Confirm specified header elements remain in position while scrolling on desktop and mobile | Header & Footer | **Planned Coverage** — the header remains fixed at the top. On mobile, the specified font-size changer is hidden after scrolling, while the logo, search, and menu toggle remain visible; preserve this as a website discrepancy. |
| Desktop navigation destinations | Follow each displayed item and distinguish section anchors from page destinations; confirm active Pillar appearance where applicable | Header & Footer | **Blocked Coverage** — five editorial links were observed as Homepage anchors, not individual Pillar pages; Medipedia and active styling remain unverified. |
| Mobile menu and destinations | Open the menu, review entries and sticky controls, and follow specified navigation links | Header & Footer | **Planned Coverage** — the menu opened and exposed destinations; the search textbox remained visible. |
| Mobile menu close behavior | Establish whether and how the menu is expected to close | Header & Footer | **Blocked Coverage** — the source does not define closing behavior. The visible header toggle was intercepted while open; the in-menu close icon removed the open state, but the overlay and links remained visible after the transition. |
| About Us submenu | On desktop and mobile, reveal NUHS and NUHS+, follow each option, and establish mobile expand/collapse behavior | Header & Footer | **Coverage Gap** — both options appeared in both interaction modes; desktop destination outcomes were observed, but mobile selection/collapse remains open. |
| Logo navigation | From a non-Homepage destination, activate the logo and confirm the Homepage is reached | Header & Footer | **Planned Coverage** — confirmed from search results to `/home`. |
| Text-size states | Compare small, default, and large states and determine persistence across navigation | Header & Footer | **Planned Coverage** — three relative states were observed; default returned after full-page navigation. Other navigation paths remain unexamined. |
| Social links | Confirm desktop new-tab destinations and verify specified Facebook, Instagram, and LinkedIn links are visible in the expanded mobile navigation | Header & Footer | **Planned Coverage** — desktop destination checks and mobile visibility checks are included; mobile inspection and functional coverage confirm the three links are hidden while the menu is open. |
| Header search expansion | Confirm textbox visibility and placeholder on desktop and mobile | Header & Footer | **Planned Coverage** — both profiles were exercised; observed placeholder differs from the source. |
| Search submission | Submit a representative keyword, retain the query, identify the results page type, and record relevant request/response evidence | Header & Footer | **Planned Coverage** — representative route and successful API response observed. |
| Search validation boundaries | Explore empty, partial, invalid, and no-result queries and identify user-visible outcomes | Header & Footer | **Blocked Coverage** — these states are unexamined and the source does not define their expected validation or result behavior. |
| Subscribe navigation | Confirm destination, page type, and tab behavior | Header & Footer | **Blocked Coverage** — the external `form.gov.sg` form opened in a new tab, differing from the named NUHS Mailing List destination; intended equivalence needs confirmation. |
| Footer entities layout | Confirm three columns on desktop and one column on mobile | Header & Footer | **Planned Coverage** — three horizontal groups on desktop and vertically stacked groups on mobile were observed. |
| Entity links | Confirm the 14 link destinations and new-tab behavior | Header & Footer | **Coverage Gap** — new-tab targets were observed; only a representative external destination was opened. |
| Footer About/legal links | Confirm About NUHS and legal-link destinations and tab behavior; reconcile “Privacy Policy” versus “Terms of Use” | Header & Footer | **Blocked Coverage** — About NUHS opened in the current tab; the legal link is labeled Terms of Use and redirects from the specified route. The source label and observed label differ. |
| Footer social sharing | Locate the specified control and establish its channels, outcome, and shared content | Header & Footer | **Blocked Coverage** — no sharing control was located in the observed footer; confirm its presence and location before validating channel behavior. |
| Featured Stories count and cards | Confirm five unique stories, one visible at a time, and image/category/title for each | Homepage | **Coverage Gap** — five slides and one active item were observed; uniqueness and all card fields need complete review. |
| Featured Stories rotation | Observe whether the active story changes automatically and compare behavior with the stated interval | Homepage | **Planned Coverage** — automatic change was observed; timing has not been measured. |
| Featured Stories ordering and tags | Verify published-date-descending order and the maximum of two side-by-side tags | Homepage | **Coverage Gap** — ordering and all-slide tag constraints remain unverified. |
| Featured Stories arrows and end state | Confirm Previous and Next change the story and establish whether the carousel stops or loops at the end | Homepage | **Planned Coverage** — both arrows changed the active story when checked after the CSS transition settled. End behavior remains open. |
| Featured Stories destinations | Confirm representative click-through outcomes and classify observed destination types | Homepage | **Blocked Coverage** — both `/article/` and `/stories/` routes were observed; the `/stories/` page type is unconfirmed. |
| Mobile Featured Stories presentation | Confirm squarish, center-cropped image presentation | Homepage | **Planned Coverage** — approximate-square aspect was observed; crop centering remains to be confirmed. |
| Highlight Story count and content | Confirm two cards, required image/category/title fields, and a representative destination | Homepage | **Planned Coverage** — two cards and a representative destination were observed. |
| Mobile Highlight Story | Confirm Standfirst presentation and click-through behavior | Homepage | **Coverage Gap** — visible Standfirst content was observed; mobile navigation was not separately exercised. |
| Initial Image & Standfirst | Confirm three initial cards, specified fields, and observed ordering without inventing an order requirement | Homepage | **Planned Coverage** — three cards were recorded; order is unspecified and an additional visible standfirst needs source clarification. |
| Standfirst field expectation | Determine whether the visible standfirst is required card content | Homepage | **Blocked Coverage** — the source lists image, category, and title but does not state whether standfirst text is required. |
| Load More transition and end state | Record counts before and after each activation, retained cards, added content, and the final control state | Homepage | **Planned Coverage** — one 3 → 9 transition appended six cards and the control disappeared at nine. |
| Load More request evidence | Determine and record the relevant action-triggered request/response | Homepage | **Planned Coverage** — `POST /api/ArticlesApi/LoadMoreArticles` returned 200 for the observed transition. |
| Load More boundary behavior | Establish repeated-use behavior, fewer-than-nine behavior, and relevant loading/error outcomes | Homepage | **Blocked Coverage** — those data conditions and expected outcomes are not specified or yet observed. |
| Image & Standfirst click-through | Confirm image and title outcomes from initial and newly loaded cards | Homepage | **Planned Coverage** — representative initial and newly loaded cards opened `/article/` destinations. |
| Podcast inventory | Reconcile the eight observed links with the specified maximum of six | Homepage | **Blocked Coverage** — the observed count conflicts with the source limit; clarify the expected inventory before setting a pass condition. |
| Podcast title navigation | Confirm new tab, Search page type, and prefilled `podcast` query | Homepage | **Planned Coverage** — the new-tab route and query were confirmed. |
| Podcast arrow behavior | Confirm both arrows change the visible Podcast articles and determine items moved per action | Homepage | **Planned Coverage** — desktop Next shifted the active index by three; after the transition settled, Previous restored the initial visible set. |
| Podcast responsive count | Determine how many Podcast cards are visible at once on desktop and mobile | Homepage | **Coverage Gap** — three desktop cards were observed; mobile count remains unverified. |
| Podcast cards and destinations | Confirm missing-image title alignment and representative article destination type | Homepage | **Coverage Gap** — a representative `/article/` destination opened; missing-image alignment and `/stories/` page type remain unresolved. |
| Back to Top | Confirm initial hidden state, appearance after scrolling, and return-to-top outcome | Homepage | **Planned Coverage** — all three behaviors were observed on the Homepage. |
| Homepage metadata and Lighthouse | Record rendered title, description, canonical, heading structure, social metadata, image alt attributes, and Lighthouse results for the specified profiles | Homepage | **Planned Coverage** — exploratory findings include missing description, H1, and Twitter metadata; Lighthouse scores were below the configured thresholds in Performance, Accessibility, and SEO. These metadata observations are not source-stated copy/value requirements. |
| Destination page classification | Confirm stated destinations open and record only page type and navigation outcome | Originating owner (Header & Footer or Homepage) | **Coverage Gap** — several destinations were sampled; Medipedia and `/stories/` page types remain unverified. |
| NUHS+ static page content constraints | Confirm the hero image, short write-up, and absence of share functions, tags, and related articles, if destination content is confirmed in scope | Header & Footer | **Blocked Coverage** — these checks are stated specifically for the NUHS+ About Us destination, but the general destination-only scope boundary conflicts with that depth. |
| Newsletter popup behavior and persistence | Do not validate appearance, timing, persistence, or storage; dismiss only if it blocks an in-scope interaction | Not assigned; incidental behavior is not source-defined | **Out of Scope** — a “Stay informed” dialog appeared during discovery and was dismissed to continue. |

## Analysis Evidence Summary

- Discovery was performed at the observed desktop viewport (1365 × 900) and mobile viewport (390 × 844). Findings describe those observations and should not be generalized to unspecified viewport sizes.
- Representative search and Load More interactions had relevant requests and successful responses. Captures around Featured Stories and Podcast Next/Previous clicks recorded no document, fetch, or XHR requests; carousel movement is therefore evidenced through visible state changes and slide indices.
- Lighthouse observations and repeat-score variation are recorded under Homepage SEO and Lighthouse. Performance varied between runs; scores are evidence from the observed runs, not stable expected values. The latest pre-audit screenshots were not obscured by the incidental overlay; popup behavior and persistence remain out of scope.
- The source and observed behavior remain separate throughout this plan. A mismatch is not silently converted into a new requirement.

## Findings Classification and Coverage Gaps

- **Planned Coverage:** the in-scope Header & Footer and Homepage opportunities identified in the table above. This records coverage intent, not test or automation status.
- **Observed source mismatches:** pillar links lead to section anchors rather than individual Pillar pages; the search placeholder differs; Subscribe now opens an external form rather than the named NUHS Mailing List destination; the legal link is labeled Terms of Use rather than Privacy Policy; eight Podcast links were rendered despite the specified maximum of six; and the mobile font-size changer is hidden after scrolling although the source requires it to remain visible. No Social Sharing control was located. Preserve each discrepancy until the requirement or product behavior is clarified.
- **Scope ambiguity:** the NUHS+ static About Us requirement gives specific content checks, while the general scope section limits destination-page review to navigation. Keep these checks blocked pending clarification of intended scope.
- **Exploratory SEO observations:** missing meta description, H1, and Twitter metadata were found, but `website.md` does not define these as requirements or specify expected values. Do not treat them as confirmed requirement failures without an authoritative requirement. The Lighthouse scores below the documented evaluation thresholds are retained as exploratory assessment findings.
- **Coverage Gaps:** remaining link destinations, Medipedia and `/stories/` page types, full desktop/mobile layout comparisons, mobile Podcast behavior, carousel ordering and end behavior, tag limits, unvisited card details, and applicable search/Load More boundary conditions.
- **Blocked Coverage:** the individual-Pillar versus section-anchor model; the subscription destination's equivalence to the named Mailing List page; the expected Podcast inventory; the absent Social Sharing control; `/stories/` destination type; the Image & Standfirst card's standfirst field; and search or Load More outcomes not specified by the source.
- **Mobile menu close:** the source requires opening the hamburger menu but does not state a close outcome. The close interaction is therefore blocked pending clarification; the observed close-icon behavior is documented without classifying it as a website defect.
- **Out of Scope:** validating newsletter-popup behavior or persistence. Dismissal is only a discovery precondition when the overlay blocks an in-scope interaction.
- **Incidental note:** the observed JavaScript console error is not assigned coverage ownership because its relationship to the scoped features is unknown.

## Discovery Limitations

- The second header-information set mentioned in the source was not identified.
- Individual Pillar links were not found in the same form described by the source; five actual links are Homepage anchors and Medipedia is a separate route.
- Search discovery covered one representative query only. Empty/no-result validation is still required, but result-page internals are not part of this destination-only scope.
- Individual entity, social, subscription, legal, NUHS About Us, Medipedia, and article destinations were not all opened. Record their type/outcome when confirming the in-scope links; do not inspect their internal content.
- Popup appearance was encountered and dismissed only to continue discovery. Timing, persistence, and behavior remain intentionally unexamined.
- Mobile observations use a 390 × 844 viewport; other mobile dimensions and tablet behavior were not assessed.
- The close icon and its resulting visual state were observed; expected close behavior is not defined by the source and requires clarification.
- Live mobile inspection and functional coverage confirmed the header social links are not visible while the navigation menu is expanded, although their presence is specified in `website.md`.
- Mobile sticky-header coverage confirmed that the logo, search textbox, and menu toggle remain visible after scrolling, but the specified font-size changer is hidden.
- No sharing control was located in the observed footer. Confirm the intended control and location before validating channel-level behavior.

## Planning Recommendations

- Resolve the navigation model, subscription destination, Podcast item limit, and Social Sharing control before treating those requirements as stable expected behavior.
- Reconcile the NUHS+ static About Us content checks with the destination-only scope boundary, and identify the second header-information set mentioned by the source.
- Keep the discrepancy record intact until a product owner or authoritative source resolves it; do not silently make observed behavior the new specification.
- Preserve ownership at the Header & Footer and Homepage level. Treat destinations as endpoints of their originating workflows, not as separate content owners for this scope.
- Confirm the Previous-arrow behavior and resolve the item-count, destination, label, and placeholder discrepancies with the requirements owner before treating the observed behavior as expected.
- Clarify whether the mobile menu is expected to close, and how, before treating the observed close-icon state as a defect.
- Treat the missing SEO metadata as exploratory until an authoritative source defines the requirement and expected values.
- Complete the remaining carousel ordering/end-state, mobile Podcast behavior, search-boundary, and unvisited destination checks as focused validation opportunities.
- For each content-changing interaction, observe and retain every relevant action-triggered request and response. For Load More, record the count and increase after each activation through the final state.
- Observe automatic carousel changes separately from user-triggered movement so the cause of each state transition is clear.
- Continue investigating the below-threshold Performance, Accessibility, and SEO scores from the retained desktop and mobile Lighthouse reports; keep SEO checks to the Homepage template and retain the stated destination-page depth boundary pending clarification.
- Keep popup discovery to the defined blocking-dismissal precondition; do not add popup persistence coverage unless scope changes.
