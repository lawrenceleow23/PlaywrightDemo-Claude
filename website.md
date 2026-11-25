# Website Analysis Request

Target URL: https://websparks-stg.sitefinity.cloud/

---

## Objective

This document defines the in-scope website analysis requirements for the NUHS+ Pages functional specification (Header & Footer, and Homepage), on desktop and mobile.

Analysis must identify:

- Website functionality
- User journeys
- Content relationships
- Validation scenarios
- Destination page types
- Reusable workflow opportunities
- Coverage gaps

---

## Test Plan Management

- Document findings consistently and maintain them as analysis progresses.
- If observed behaviour differs from the source document:
  - Record the observed behaviour.
  - Record the specified behaviour.
  - Record the discrepancy.
  - Do not silently choose one interpretation.

---

## Analysis Guidance

- Requirement sections define functionality, business rules, validation expectations and analysis requirements.
- This document describes:
  - What functionality exists.
  - What behaviour should occur.
  - What should be analyzed.
  - What should be validated.
- This is a requirements and analysis document. It does not define automation implementation, automation organization, code, repository structures or spec files.
- Where the source document does not specify behaviour, mark it as "to be discovered". Do not invent expected outcomes.
- Items are referred to by the numbers used in the source document layouts where the source gives them.

---

## Analysis Scope

- Scope: the entire functional specification, "NUHS+ Pages", covering:
  - Header & Footer (default header desktop and mobile, footer desktop and mobile, general elements and functions)
  - Homepage (template layout desktop and mobile, page elements and functions)
- Desktop and mobile behaviour are both in scope, as the source document defines both.
- No scope exclusions apply.
- The source states NUHS+ has 2 different sets of header information and 1 set of footer information. Only the default header is described. The second header set is to be discovered.
- Destination pages referenced by the source (pillar pages, About Us pages, search results, mailing list, article pages and so on) are in scope only as navigation destinations: confirm that navigation reaches them and identify the page type. Their internal content is defined elsewhere in the source suite and is to be discovered.

---

## Website Structure

Functional structure as defined by the source document:

- NUHS+ Pages
  - Header & Footer
    - Default Header Layout (Desktop)
    - Default Header Layout (Mobile)
    - Footer Layout (Desktop)
    - Footer Layout (Mobile)
    - General Elements and Functions
      - Header: Logo, NUHS pillar, About Us Pillar, Font size changer, Social Media icons, General Search (Button and Textbox), Mailing List - Subscribe Now
      - Footer: NUHS Entities Name, About NUHS, Privacy Policy, Social Sharing button
  - Homepage
    - Template Layout (Desktop)
    - Template Layout (Mobile)
    - Page Elements and Functions
      - Featured Stories (Module), with Featured Stories Arrow button
      - Highlight story (Module)
      - Image & standfirst (Module), with Load More
      - Podcast, with Podcast - Title, Podcast - Arrow Buttons, Podcast - Image & standfirst
      - Back to top

Destination relationships stated by the source:

- Logo → NUHS+ Home page
- NUHS pillar → respective individual Pillar page
- About Us Pillar → NUHS (Section 6.11 About Us) and NUHS+ (static page)
- General Search → search results (Section 6.12)
- Mailing List - Subscribe Now → NUHS Mailing List page
- Social Media icons → NUHS social media pages (new tab)
- NUHS Entities Name → respective entity links (new tab)
- About NUHS → About NUHS page
- Privacy Policy → Privacy Policy page
- Social Sharing button → social sharing pop-up (new tab)
- Featured Stories, Highlight story, Image & standfirst, Podcast - Image & standfirst → individual article page
- Podcast - Title → Search page (new tab) with keyword "podcast" pre-filled

---

## Content Expansion Behavior

Applies to Homepage: Image & standfirst and its Load More button.

- Initial state: 3 "Image & standfirst" articles are shown.
- Updated state: after Load More, 6 more articles appear in the same format as the first 3. Total 9.
- Expansion behaviour: each Load More click adds 6 articles. Load More is not placeholder configurable.
- Repeated-use behaviour: to be discovered (the source describes one expansion).
- End-of-results behaviour: the Load More button disappears after all the articles are shown.
- Behaviour when fewer than 9 articles are available: to be discovered.

See Load More Requirements under Homepage for validation scenarios.

---

## Content Detail Pages

Click-through destinations described by the source:

- Individual article page: from Featured Stories, Highlight story, Image & standfirst and Podcast - Image & standfirst.
- Individual Pillar page: from the NUHS pillar (desktop).
- Static page for NUHS+: hero image plus short write-up; no share functions; no tag; no related articles.
- NUHS About Us page (source reference: Section 6.11).
- Search results page (source reference: Section 6.12), including the Search page opened from Podcast - Title.
- NUHS Mailing List page.
- About NUHS page.
- Privacy Policy page (source gives https://www.nuhs.edu.sg/Pages/terms-of-use.aspx).

For each, analyze:

- That the stated click-through reaches a destination.
- The destination page type.
- Whether it opens in the same tab or a new tab, where the source does not say: to be discovered.

---

## Header & Footer

Parent functional area for shared header and footer functionality. Source statement: the sticky navigation menu (whole header) remains visible and in the same position as the user scrolls down.

### Default Header Layout (Desktop)

Analyze:

- Presence of the header elements in the order given by the source: Logo, NUHS pillars, About Us pillar, Font size changer, Social Media icons, General Search, Mailing List - Subscribe Now.
- Sticky behaviour: the whole header stays visible and in the same position on scroll.
- Expanded Search state (textbox displayed).

Validation Scenarios

- Scroll down the page and confirm the whole header stays in position.
- Click General Search and confirm the expanded search layout displays.

### Default Header Layout (Mobile)

Analyze:

- Header elements shown on mobile.
- Sticky behaviour: Logo, Font size changer, Search function and Hamburger Menu stay visible.
- Expanded Search state.
- Mobile pillars layout (hamburger menu expanded).

Validation Scenarios

- Scroll down and confirm Logo, Font size changer, Search function and Hamburger Menu remain visible.
- Open the hamburger menu and confirm pillars, search function and social links are shown.

### Footer Layout (Desktop)

Analyze:

- Presence of the footer elements: NUHS Entities Name, About NUHS, Privacy Policy, Social Sharing button.
- NUHS Entities information displayed in 3 columns.

### Footer Layout (Mobile)

Analyze:

- Presence of the footer elements on mobile.
- NUHS Entities information displayed in 1 column (confirmed by the reviewer comment).

### Logo Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- OnClick: redirect the user to the NUHS+ Home page.

Validation Scenarios

- From a non-Home page, click the Logo and confirm the NUHS+ Home page opens.

### NUHS Pillar Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- Desktop:
  - OnClick: redirect the user to the respective individual Pillar page.
  - OnActive: the current pillar name is bold and its font colour changes to blue (#0071bb).
  - Sticky menu: the whole header stays.
- Mobile:
  - OnClick Hamburger Menu: expanded menu with pillars, search function and social links.
  - Sticky menu: Logo, Font size changer, Search function and Hamburger Menu.
- Pillar names and number of pillars: to be discovered.

Validation Scenarios

- Desktop: click each pillar and confirm the respective Pillar page opens.
- Desktop: confirm the current pillar is bold and #0071bb, and other pillars are not.
- Mobile: open the Hamburger Menu and confirm its contents.

Evidence Requirements

- Record the computed font weight and colour of the active pillar.

### About Us Pillar Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- Desktop: OnMouseOver shows a dropdown with "NUHS" and "NUHS+".
- Mobile: OnClick "About Us" shows a dropdown with "NUHS" and "NUHS+" options.
- NUHS links to the About Us NUHS page (source reference: Section 6.11).
- NUHS+ links to a static page: hero image plus short write-up, no share functions, no tag, no related articles.
- Whether the mobile dropdown expands upward or collapses back to the pillars: to be discovered (open reviewer question).

Validation Scenarios

- Desktop: hover About Us and confirm both options display.
- Mobile: tap About Us and confirm both options display.
- Click each option and confirm its destination.
- On the NUHS+ static page, confirm there are no share functions, tags or related articles.

### Font Size Changer Requirements

Expected Behaviour (per spec)

- Attribute: Button.
- OnClick: decrease or increase the font size by 1 step from normal fonts.
- Total 3 options: small, default, big.
- Whether the selection persists across pages: to be discovered.

Validation Scenarios

- Cycle through all 3 options and confirm the visible font size changes for each.
- Confirm the default option matches the initial page state.

### Social Media Icons Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- OnClick: open a new window tab and redirect to the respective social media link.
- Icons: Facebook, Instagram, LinkedIn, linking to the NUHS social media pages.

Validation Scenarios

- Click each icon and confirm a new tab opens at the matching NUHS social media page.

### General Search Requirements

Expected Behaviour (per spec)

- Search button (Attribute: Button):
  - OnClick: expands with a textbox (item 7).
  - The search results are displayed on the search results page (Section 6.12).
- Search textbox (Attribute: Textbox):
  - Displays once the search button (item 6) is clicked.
  - Placeholder: "Search keyword or topic".
  - OnEnter: the search results are displayed on the search results page (Section 6.12).
- Result content and ordering: to be discovered (defined in Section 6.12 of the source suite).

Validation Scenarios

- Click the search button and confirm the textbox appears with the stated placeholder.
- Enter a keyword, press Enter and confirm the search results page opens.
- Repeat on mobile through the expanded Search function.

### Mailing List - Subscribe Now Requirements

Expected Behaviour (per spec)

- Attribute: Button.
- OnClick: redirect the user to the NUHS Mailing List page.

Validation Scenarios

- Click Subscribe Now and confirm the NUHS Mailing List page opens.

### NUHS Entities Name Requirements

Expected Behaviour (per spec)

- Attribute: Hyperlink.
- OnClick: open a new window tab and redirect to the respective entity link.
- Desktop: entities information in 3 columns.
- Mobile: entities information in 1 column.
- List of entities: to be discovered.

Validation Scenarios

- Confirm column count on desktop (3) and mobile (1).
- Click each entity and confirm a new tab opens at the respective link.

### About NUHS Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- OnClick: redirect the user to the About NUHS page.

### Privacy Policy Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- OnClick: redirect the user to the Privacy Policy page (https://www.nuhs.edu.sg/Pages/terms-of-use.aspx).

Validation Scenarios

- Click Privacy Policy and confirm the stated destination opens.

### Social Sharing Button Requirements

Expected Behaviour (per spec)

- Attribute: Link.
- OnClick: open a new window tab; allow a social media link to share the Homepage in a pop-up.
- Channels: Facebook, Instagram, LinkedIn, Twitter, WhatsApp, Telegram, Email, SMS.
- Sharing uses the user's personal account for the NUHS+ page.
- Shared content: Meta Title, Meta description, Image (default takes the organisation logo), current page link.
- Which source supplies the title, description and image when not defaulted: to be discovered (open reviewer question).

Validation Scenarios

- Click each sharing channel and confirm the pop-up or new tab opens.
- Confirm the shared title, description, image and page link, and the logo default when no image is set.

---

## Homepage

Parent functional area for Homepage modules and controls.

### Template Layout (Desktop)

Analyze:

- Presence and order of the 9 elements in the source layout: Featured Stories, Featured Stories Arrow button, Highlight story, Image & standfirst, Load More, Podcast (Title, Arrow Buttons, Image & standfirst), Back to top.

### Template Layout (Mobile)

Analyze:

- Presence and order of the elements in the mobile layout.
- Mobile-specific behaviour listed below under Featured Stories and Highlight story.

### Featured Stories Requirements

Expected Behaviour (per spec)

- Module; not placeholder configurable.
- 5 articles are featured in a carousel.
- Each article has: Featured Image, Pillar Category, Title.
- OnClick: redirect the user to the individual article page. The whole image is clickable.
- Max items in view: 1.
- Order by: published date, descending.
- Slider: auto rotates every 3 seconds.
- If more than 1 tag, display side by side. Maximum 2 tags.
- Mobile: Featured Image is auto centre-cropped (squarish).
- Behaviour at the last slide (loop or stop): to be discovered.

Validation Scenarios

- Confirm 5 articles in the carousel with 1 in view.
- Confirm each slide shows image, Pillar Category and Title.
- Confirm auto rotation about every 3 seconds.
- Confirm order is published date descending.
- Confirm tags show side by side and never exceed 2.
- Click the image and confirm the article page opens.
- Mobile: confirm the image is squarish and centre-cropped.

#### Featured Stories Arrow Button Requirements

Expected Behaviour (per spec)

- Button; not placeholder configurable.
- OnClick: show the next or previous Featured Story.
- Interaction with auto rotation (pause, reset): to be discovered.

Validation Scenarios

- Click next and previous and confirm the story in view changes accordingly.

### Highlight Story Requirements

Expected Behaviour (per spec)

- Module; placeholder configurable.
- Displays 2 highlight articles.
- Each article has: Highlights Image, Pillar Category, Title.
- OnClick: redirect the user to the individual article page. The whole image is clickable.
- Mobile: Highlight story shows as Standfirst layout.

Validation Scenarios

- Confirm 2 highlight articles with image, Pillar Category and Title.
- Click the image and confirm the article page opens.
- Mobile: confirm the Standfirst layout.

### Image & Standfirst Requirements

Expected Behaviour (per spec)

- Module; placeholder configurable.
- Displays 3 individual articles initially.
- Each article has: General Image, Pillar Category, Title.
- OnClick: redirect the user to the individual article page. The whole image is clickable.
- Article ordering: to be discovered.

Validation Scenarios

- Confirm 3 articles with image, Pillar Category and Title in the initial state.
- Click the image and confirm the article page opens.

#### Load More Requirements

Expected Behaviour (per spec)

- Button; not placeholder configurable.
- OnClick: 6 more "Image & standfirst" articles appear, in the same format as the first 3.
- The Load More button disappears after all the articles are shown.
- Total 9 Image & Standfirst articles.

Validation Scenarios

- Confirm Load More is visible with 3 articles shown.
- Click Load More and confirm 6 more articles appear, totalling 9.
- Confirm the new articles match the format of the first 3.
- Confirm the Load More button is no longer shown after all articles are displayed.

Evidence Requirements

- Record article counts before and after Load More.

### Podcast Requirements

Parent for the Podcast title, arrows and article module. All three are placeholder configurable.

#### Podcast - Title Requirements

Expected Behaviour (per spec)

- Button.
- OnClick: open the Search page in a new tab with the keyword "podcast" pre-filled.

Validation Scenarios

- Click the Podcast title and confirm a new tab opens on the Search page with "podcast" pre-filled.

#### Podcast - Arrow Buttons Requirements

Expected Behaviour (per spec)

- Button.
- OnClick: show the next or previous Podcast articles.
- Number of articles moved per click: to be discovered.

Validation Scenarios

- Click next and previous and confirm the visible Podcast articles change.

#### Podcast - Image & Standfirst Requirements

Expected Behaviour (per spec)

- Module.
- Displays up to 6 individual articles.
- Each article has: General Image (can be empty), Title.
- OnClick: redirect the user to the individual article page. The whole image is clickable.
- If the image is absent, the Title is vertically aligned top.
- Number visible at once on desktop and mobile: to be discovered.

Validation Scenarios

- Confirm up to 6 articles are available across the carousel.
- Confirm an article without an image aligns its Title to the top.
- Click an article and confirm the article page opens.

### Back to Top Requirements

Expected Behaviour (per spec)

- Button; not placeholder configurable.
- Appears once the user has started scrolling.
- OnClick: return to the top of the page.

Validation Scenarios

- Confirm the button is not shown at the top of the page.
- Scroll down and confirm it appears.
- Click it and confirm the page returns to the top.

---

## Coverage Verification

- Coverage Scope: Header & Footer and Homepage, desktop and mobile.
- User Journeys:
  - Navigate from the header (Logo, pillars, About Us, Search, Subscribe Now).
  - Search from the header and reach the results page.
  - Change font size.
  - Open an article from Featured Stories, Highlight, Image & standfirst or Podcast.
  - Expand Image & standfirst with Load More.
  - Reach the Podcast search results from the Podcast title.
  - Use footer links and Social Sharing.
  - Scroll and use Back to top.
- Major Functionality: as listed in Website Structure.
- Validation Scenarios: as listed in each requirement section.
- Destination Page Types: as listed in Content Detail Pages.
- Related Behaviour: sticky header, desktop and mobile layout differences, new-tab behaviour, placeholder-configurable modules.
- Reusable Workflow Opportunities: open-and-verify click-through destinations, new-tab link verification, carousel navigation (Featured Stories and Podcast), and the desktop versus mobile comparison of the same element.
- Coverage Status (Fully Analyzed / Partially Analyzed / Not Analyzed):

| Area | Status |
| --- | --- |
| Header (desktop) | Not Analyzed |
| Header (mobile) | Not Analyzed |
| Footer (desktop) | Not Analyzed |
| Footer (mobile) | Not Analyzed |
| Featured Stories and arrows | Not Analyzed |
| Highlight story | Not Analyzed |
| Image & standfirst and Load More | Not Analyzed |
| Podcast | Not Analyzed |
| Back to top | Not Analyzed |
| Destination page types | Not Analyzed |

---

## Discovery Limitations

If an in-scope interaction cannot be completed, document:

- Limitation
- Affected functionality
- Resulting coverage gap
- Recovery attempts

Continue analysis whenever practical.

---

## Completion Criteria

Analysis is complete only when:

- In-scope functionality has been analyzed.
- User journeys have been identified.
- Validation scenarios have been identified.
- Destination page types have been identified.
- Coverage opportunities have been documented.
- No significant in-scope functionality remains unexplored.
