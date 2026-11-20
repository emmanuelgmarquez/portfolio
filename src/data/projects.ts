import { imageSizes } from "./assets.generated";
import { bofaArchive, bofaFeatured } from "./bofa.generated";

export type ProjectImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  caption?: string;
};

export type Detail = {
  image: ProjectImage;
  title: string;
  body: string;
};

export type CodeExcerpt = { title: string; body: string; code: string };

export type Project = {
  slug: string;
  number: string;
  title: string;
  client: string;
  clientLabel: "Client" | "Brand";
  industry: string;
  category: string;
  discipline: string;
  scope: string;
  related?: string;
  summary: string;
  intro: string;
  tags: string[];
  overview: string[];
  technicalScope: { title: string; body: string }[];
  /** Sequence matters (a lifecycle or program) — show step numbers in the gallery. */
  sequential: boolean;
  galleryTitle: string;
  galleryIntro: string;
  gallery: ProjectImage[];
  /** Full-length email shown beside annotations. Omitted where a device comparison does that job. */
  featured?: { image: ProjectImage; title: string; notes: { title: string; body: string }[] };
  details: Detail[];
  considerations: { title: string; body: string }[];
  /** Annotated excerpts from the production HTML. */
  code?: CodeExcerpt[];
  /** Show the awards list on this case study. */
  showAwards?: boolean;
  technologies: string[];
  theme: { panel: string; panelInk: "light" | "dark" };
  seoDescription: string;
  /** Self-initiated concept work for a fictional brand. Adds the concept sections and the "Concept piece" badge. */
  concept?: ConceptStudy;
};

export type ClientTest = {
  /** Screenshot file name: assets-source/<slug>/client-<id>.png */
  id: string;
  name: string;
  group: "Email on Acid (Mailgun Inspect)" | "Seed send";
  /** Present only when the owner has added a real screenshot. Without it the client shows as PENDING. */
  image?: ProjectImage;
};

export type ConceptStudy = {
  badge: string;
  /** Section headings for the reused Overview and code-excerpt sections. */
  overviewTitle: string;
  codeTitle: string;
  codeIntro: string;
  liveUrl: string;
  plainTextUrl: string;
  screens: { desktopLight: ProjectImage; desktopDark: ProjectImage; mobileLight: ProjectImage; mobileDark: ProjectImage };
  build: { title: string; points: string[] }[];
  states: { image: ProjectImage; title: string; body: string }[];
  review: { intro: string; rows: { issue: string; before: string; after: string }[] };
  clientTests: ClientTest[];
};

function img(src: string, title: string, alt: string, caption?: string): ProjectImage {
  const size = imageSizes[src];
  if (!size) throw new Error(`Missing image in manifest: ${src}. Run npm run assets.`);
  return { src, title, alt, caption, ...size };
}

/** An image the owner may add later (client test screenshots). Undefined until it is in the manifest. */
function optionalImg(src: string, title: string, alt: string): ProjectImage | undefined {
  return imageSizes[src] ? img(src, title, alt) : undefined;
}

/* ---------------------------------------------------------------- CAR-T TALK */

const cart = {
  registration: img(
    "/projects/car-t-talk/01-registration-scheduling.webp",
    "Registration and scheduling",
    "CAR-T TALK email introducing the Mentor Program Specialist, proposing a call time with an Ambassador, offering Add to Outlook/iCal and Add to Google Calendar links, conference-line instructions and program guidelines.",
    "Introduces the Mentor Program Specialist, proposes a call slot and asks the registrant to confirm. Calendar links, conference-line instructions and the program guidelines all live in one message.",
  ),
  reminder: img(
    "/projects/car-t-talk/02-call-reminder.webp",
    "Call reminder",
    "CAR-T TALK reminder email with the scheduled day, date, time and time zone, followed by an orange conference-line callout with dial-in instructions.",
    "Restates the scheduled day, date and time zone, then repeats the dial-in steps in the orange conference-line callout.",
  ),
  reminderMerge: img(
    "/projects/car-t-talk/03-call-reminder-merge-fields.webp",
    "Call reminder, Salesforce merge-field build",
    "The CAR-T TALK reminder built with Salesforce merge fields such as {!Call_Schedule__c.Preferred_Name__c}, {!Call_Schedule__c.Ambassador_Time__c} and {!Call_Schedule__c.Patient_Call_Code__c}.",
    "The same reminder with the placeholders replaced by Salesforce merge fields that read from a call-schedule record: preferred name, Ambassador time and the patient's conference code.",
  ),
  missed: img(
    "/projects/car-t-talk/04-missed-call-reschedule.webp",
    "Missed call",
    "CAR-T TALK email sent when a registrant was unable to join a scheduled call, asking them to reply with three dates and times or call to reschedule.",
    "Sent when a registrant misses a scheduled call. Offers two ways back in: reply with three dates and times, or call.",
  ),
  final: img(
    "/projects/car-t-talk/05-final-outreach.webp",
    "Final outreach",
    "CAR-T TALK email explaining the team could not connect and that this is the last time CAR-T TALK will reach out to confirm interest.",
    "The last attempt to reach someone who registered but never connected. It says plainly that no further emails will follow.",
  ),
  followUp: img(
    "/projects/car-t-talk/06-post-call-follow-up.webp",
    "Post-call follow-up",
    "CAR-T TALK follow-up email after a completed call, inviting the registrant to schedule another call and to give feedback with a Take Survey button.",
    "Closes the loop after a completed call with an invitation to book another and a survey button.",
  ),
};

/* ------------------------------------------------------------------ THREE */

const three = {
  quote: img(
    "/projects/three-insurance/01-quote-ready.webp",
    "Quote ready",
    "THREE email titled Congratulations! Your quote from THREE is ready, with an Access Your Quote button, Why THREE benefits, a star satisfaction rating and phone support.",
    "Quote-ready template with the quote ID personalization string in the header strip, benefits list and a one-tap satisfaction rating.",
  ),
  quoteTest: img(
    "/projects/three-insurance/02-quote-ready-test-send.webp",
    "Quote ready, rendered test send",
    "Rendered version of the THREE quote-ready email with a sample quote ID populated in the header strip.",
    "The same template rendered with sample data, the kind of proof used to confirm fields resolve before a template goes live.",
  ),
  change: img(
    "/projects/three-insurance/03-policy-change-confirmation.webp",
    "Policy change confirmation",
    "THREE email titled Recent changes to your THREE policy, confirming revised policy documents are available, with a Log In to Account Space button.",
    "Confirms a policy change and sends the customer to their account space for the revised documents.",
  ),
  access: img(
    "/projects/three-insurance/04-policy-access-link.webp",
    "Policy access link",
    "THREE email titled Access your policy information, noting a one-time link that expires in 30 minutes, with a Review Policy and Documents button.",
    "A one-time, 30-minute link to policy documents. Short copy, one action.",
  ),
  invoice: img(
    "/projects/three-insurance/05-invoice-due.webp",
    "Invoice due",
    "THREE email marked Urgent: Payment Due with the policy number in the header strip, titled Your THREE Insurance Invoice is due today.",
    "Payment-due notice. The header strip changes to an urgent label while the rest of the system stays the same.",
  ),
  receipt: img(
    "/projects/three-insurance/06-payment-receipt.webp",
    "Payment receipt",
    "THREE payment receipt email with the payment amount written as an AMPscript FormatNumber expression.",
    "Receipt template. The amount is formatted inline with AMPscript rather than pre-formatted in the data.",
  ),
  renewal: img(
    "/projects/three-insurance/07-policy-renewal.webp",
    "Policy renewal",
    "THREE email titled Your business insurance policy from THREE is set to renew, listing named insured, policy number, renewal and prior policy periods and renewal premium as AMPscript expressions.",
    "Renewal notice with named insured, both policy periods and the renewal premium all resolved at send time.",
  ),
  expiration: img(
    "/projects/three-insurance/08-policy-expiration.webp",
    "Policy expiration",
    "THREE email titled Your business insurance policy from THREE will expire, with policy details and the expiration date as AMPscript expressions.",
    "Non-renewal notice. The expiration date is called out on its own line so it cannot be missed.",
  ),
  audit: img(
    "/projects/three-insurance/09-cancellation-premium-audit.webp",
    "Cancellation with premium audit",
    "THREE email titled Your policy has been cancelled, including the cancellation date and reason fields and a paragraph about the final premium audit.",
    "Cancellation variant that adds the premium-audit explanation for policies that need a final balance settled.",
  ),
  flat: img(
    "/projects/three-insurance/10-flat-cancellation.webp",
    "Flat cancellation",
    "THREE email stating the policy has been cancelled back to inception, with policy number, full name, cancellation date and reason fields.",
    "Cancellation back to inception, sharing every module with the audit variant except the closing paragraph.",
  ),
};

/* ------------------------------------------------------------------ APOKYN */

const apokyn = {
  onTime: img(
    "/projects/apokyn/01-maximizing-on-time.webp",
    "Maximizing your ON time",
    "Full-length APOKYN email titled Maximizing your ON time, with hero photography, statistic modules, important safety information, a patient quote, a Real Patients. Real Stories. video module, Circle of Care program details and the full safety information.",
    "Long-form education email: stat modules, an early safety block, a patient story, video, program support and the complete safety information.",
  ),
  offEpisodes: img(
    "/projects/apokyn/02-off-episodes.webp",
    "Here's what you need to know about OFF episodes",
    "Full-length APOKYN email titled Here's What You Need to Know About OFF Episodes, with illustrated symptom lists, a call-to-action button, safety information, a patient quote, a video module and full safety information.",
    "Explains OFF episodes with illustrated lists before handing off to the same safety, story and support modules.",
  ),
  consider: img(
    "/projects/apokyn/03-consider-apokyn.webp",
    "Consider APOKYN",
    "Full-length APOKYN email titled Consider APOKYN, with three icon benefit modules, bullet points, safety information, a product image, a video module and full safety information.",
    "Product-consideration email built from icon benefit modules, a product shot and the shared safety and video modules.",
  ),
  confirm: img(
    "/projects/apokyn/04-beyond-mentor-confirmation.webp",
    "Beyond Mentor Program confirmation",
    "APOKYN and Beyond Mentor Program confirmation email with a row of mentor portraits, a personalized greeting placeholder and next steps for scheduling a mentor call.",
    "Transactional confirmation for the Beyond Mentor Program: a short, personalized message with next steps.",
  ),
};

/* ------------------------------------------------------------------ RIALTO */

const rialto = {
  desktop: img(
    "/projects/rialto/01-desktop-build.webp",
    "Desktop build",
    "Rialto email at desktop width: logo, the live-text headline Join One of the Fastest Growing Timeshare Rental Marketplaces, a resort pool hero photo, three feature columns, a Why owners choose us panel, a List Your Timeshare button and social footer.",
    "The final build at desktop width, rendered from the HTML at 2x.",
  ),
  mobile: img(
    "/projects/rialto/02-mobile-build.webp",
    "Mobile build",
    "Rialto email at mobile width: logo, live-text headline and intro, the resort hero photo, stacked feature blocks, the Why owners choose us panel, a full-width List Your Timeshare button and footer.",
    "The same HTML under 768px: larger live text, a full-width hero and single-column features.",
  ),
  photo: img(
    "/projects/rialto/hero-photo.webp",
    "Hero photography",
    "Resort pool lined with palm trees and lounge chairs overlooking the ocean, used as the Rialto hero image.",
  ),
};


/* ------------------------------------------------ ATELIER & OAK (concept) */
// Fictional brand. Chromium renders from email-samples/atelier-oak/scripts/screenshot.mjs.

const atelier = {
  desktopLight: img(
    "/projects/atelier-oak-concept/01-desktop-light.webp",
    "Desktop, light",
    "Atelier & Oak concept email at 600px in light mode: wordmark, a hero photograph of a leather sofa in low sun with the live-text headline The Hearth Collection on a cream card, intro copy, a two-by-two product grid, an Explore the collection button, a workshop story block and the footer.",
    "600px, light. Chromium render of the built HTML.",
  ),
  desktopDark: img(
    "/projects/atelier-oak-concept/02-desktop-dark.webp",
    "Desktop, dark",
    "The same Atelier & Oak concept email at 600px in dark mode: light wordmark on an off-black ground, a dark hero card with off-white headline, off-white body text and a light button.",
    "600px, prefers-color-scheme: dark. The logo and hero card are swapped for their dark versions.",
  ),
  mobileLight: img(
    "/projects/atelier-oak-concept/03-mobile-light.webp",
    "Mobile, light",
    "Atelier & Oak concept email at 375px in light mode, with the product grid stacked into a single column and a full-width button.",
    "375px, light. The grid stacks to one column.",
  ),
  mobileDark: img(
    "/projects/atelier-oak-concept/04-mobile-dark.webp",
    "Mobile, dark",
    "Atelier & Oak concept email at 375px in dark mode, single column, with the dark logo and dark hero card.",
    "375px, prefers-color-scheme: dark.",
  ),
  stateFull: img(
    "/projects/atelier-oak-concept/05-state-full.webp",
    "Data state: full",
    "Product grid rendered with full data: greeting Hi Maya, four products with photographs, one showing a Now and Was sale price.",
  ),
  statePartial: img(
    "/projects/atelier-oak-concept/06-state-partial.webp",
    "Data state: partial",
    "Product grid rendered with partial data: greeting Hi there, and the third product showing a monogram fallback tile in place of a missing photograph.",
  ),
  stateEmpty: img(
    "/projects/atelier-oak-concept/07-state-empty.webp",
    "Data state: empty",
    "The email rendered with an empty product list: the intro copy is followed directly by the button, with no grid heading and no gap.",
  ),
};

const atelierClients: [string, string, ClientTest["group"]][] = [
  ["outlook-2016-windows", "Outlook 2016, Windows", "Email on Acid (Mailgun Inspect)"],
  ["outlook-2016-windows-125", "Outlook 2016, Windows, 125% scaling", "Email on Acid (Mailgun Inspect)"],
  ["outlook-2019-windows", "Outlook 2019, Windows", "Email on Acid (Mailgun Inspect)"],
  ["outlook-365-windows", "Outlook 365, Windows", "Email on Acid (Mailgun Inspect)"],
  ["outlook-2024-windows-dark", "Outlook 2024, Windows, dark", "Email on Acid (Mailgun Inspect)"],
  ["outlook-new-windows", "New Outlook, Windows", "Email on Acid (Mailgun Inspect)"],
  ["outlook-com-light", "Outlook.com, light", "Email on Acid (Mailgun Inspect)"],
  ["outlook-com-dark", "Outlook.com, dark", "Email on Acid (Mailgun Inspect)"],
  ["gmail-web", "Gmail, web", "Email on Acid (Mailgun Inspect)"],
  ["gmail-ios", "Gmail app, iOS", "Email on Acid (Mailgun Inspect)"],
  ["gmail-android", "Gmail app, Android", "Email on Acid (Mailgun Inspect)"],
  ["apple-mail-macos-light", "Apple Mail, macOS, light", "Email on Acid (Mailgun Inspect)"],
  ["apple-mail-macos-dark", "Apple Mail, macOS, dark", "Email on Acid (Mailgun Inspect)"],
  ["apple-mail-ios-light", "Apple Mail, iOS, light", "Email on Acid (Mailgun Inspect)"],
  ["apple-mail-ios-dark", "Apple Mail, iOS, dark", "Email on Acid (Mailgun Inspect)"],
  ["yahoo-mail", "Yahoo Mail", "Email on Acid (Mailgun Inspect)"],
];

/** A client leaves PENDING only when its screenshot exists (see email-samples/atelier-oak/TESTING.md). */
const atelierClientTests: ClientTest[] = atelierClients.map(([id, name, group]) => ({
  id,
  name,
  group,
  image: optionalImg(
    `/projects/atelier-oak-concept/client-${id}.webp`,
    `${name} test`,
    `Screenshot of the Atelier & Oak concept email in ${name}.`,
  ),
}));

/* --------------------------------------------------------- BANK OF AMERICA */
// Renders come from bofa-render/render.sh and are processed by scripts/process_bofa.py.

export type BofaItem = ProjectImage & { slug: string; group: string; mobile?: ProjectImage; code: string };

export const bofaItems: BofaItem[] = bofaFeatured.map((f) => ({
  slug: f.slug,
  group: f.group,
  code: f.code,
  src: f.src,
  width: f.width,
  height: f.height,
  title: f.title,
  caption: f.caption,
  alt: `Bank of America email: ${f.title}. ${f.caption}`,
  mobile:
    "mobile" in f && f.mobile
      ? {
          src: f.mobile.src,
          width: f.mobile.width,
          height: f.mobile.height,
          title: `${f.title}, mobile`,
          alt: `Mobile version of the Bank of America email ${f.title}.`,
        }
      : undefined,
}));

export const bofaArchiveItems: (ProjectImage & { code: string; lob: string; month: string; builds: number; spanish: boolean; thumb: string })[] =
  bofaArchive.map((a) => ({
    ...a,
    title: a.title || a.code,
    caption: `${a.code}${a.month ? `, ${a.month}` : ""}. ${a.builds} ${a.builds === 1 ? "build" : "builds"}${a.spanish ? ", including Spanish" : ""}.`,
    alt: `Bank of America email ${a.code}: ${a.title}`,
  }));

const bofaBySlug = (slug: string) => bofaItems.find((i) => i.slug === slug);
const bofa = {
  merrill: bofaBySlug("merrill-guided-investing"),
  travel: bofaBySlug("preferred-rewards-travel"),
  vehicles: bofaBySlug("preferred-rewards-vehicles"),
  shopping: bofaBySlug("preferred-rewards-shopping"),
  homeEn: bofaBySlug("homebuyer-english"),
  homeEs: bofaBySlug("homebuyer-spanish"),
  security: bofaBySlug("merrill-security"),
  helocA: bofaBySlug("heloc-renovation"),
  auto: bofaBySlug("auto-loan"),
};
const bofaGallery: ProjectImage[] = bofaItems;

/* -------------------------------------------------------- PATIENT PROGRAMS */

const pp = {
  ofevRegistrant: img(
    "/projects/patient-programs/01-ofev-registrant-confirmation.webp",
    "OFEV: registrant confirmation",
    "OFEV Mentor Connections confirmation email to a registrant with the call date and time, an amber call-instructions panel and the program footer.",
    "Confirms a registrant's call with a mentor: date, time and time zone fields, then dial-in steps in the amber instructions panel.",
  ),
  ofevMentor: img(
    "/projects/patient-programs/02-ofev-mentor-confirmation.webp",
    "OFEV: mentor confirmation",
    "OFEV Mentor Connections confirmation email to a mentor with call date and time and call instructions, including pressing star zero to play the Important Safety Information.",
    "The mentor's side of the same call, with an extra step: playing the Important Safety Information at the end.",
  ),
  ofevReminder: img(
    "/projects/patient-programs/03-ofev-call-reminder.webp",
    "OFEV: call reminder",
    "OFEV Mentor Connections reminder email with the call date and time and call instructions.",
    "Reminder before the call, reusing the date block and instructions panel.",
  ),
  ofevMissed: img(
    "/projects/patient-programs/04-ofev-missed-call.webp",
    "OFEV: missed call",
    "OFEV Mentor Connections missed call email asking the registrant to reply with dates and times or call to reschedule.",
    "Rescheduling path when a registrant misses the call.",
  ),
  ofevFollowUp: img(
    "/projects/patient-programs/05-ofev-registrant-follow-up.webp",
    "OFEV: registrant follow-up",
    "OFEV Mentor Connections follow-up email thanking the registrant and linking to a feedback survey.",
    "Post-call thank-you with a survey link.",
  ),
  ofevMentorFollowUp: img(
    "/projects/patient-programs/06-ofev-mentor-follow-up.webp",
    "OFEV: mentor follow-up",
    "OFEV Mentor Connections email asking the mentor to complete a survey and report any adverse events mentioned during the call.",
    "Asks the mentor to complete a survey and report any adverse events raised on the call.",
  ),
  lemsInvite: img(
    "/projects/patient-programs/07-lems-connection-invitation.webp",
    "LEMS Connection: program invitation",
    "LEMS Connection Mentor Program email with a video thumbnail, a personal story from a person living with LEMS and a register here call to action.",
    "Invitation to the LEMS Connection mentor program, led by a video and a first-person story.",
  ),
  lemsA: img(
    "/projects/patient-programs/08-lems-event-ambassador-a.webp",
    "FIRDAPSE: event invitation, version A",
    "FIRDAPSE event invitation email titled Join Me at the Next Lambert-Eaton myasthenic syndrome (LEMS) Event, with an ambassador video, personal note, event details and full safety information.",
    "Ambassador-led event invitation. The video, note and signature change per ambassador; the event panel and safety information do not.",
  ),
  lemsB: img("/projects/patient-programs/09-lems-event-ambassador-b.webp", "FIRDAPSE: event invitation, version B", "FIRDAPSE event invitation, a second ambassador version with a different video and personal note."),
  lemsC: img("/projects/patient-programs/10-lems-event-ambassador-c.webp", "FIRDAPSE: event invitation, version C", "FIRDAPSE event invitation, a third ambassador version with a different video and personal note."),
  lemsD: img("/projects/patient-programs/11-lems-event-ambassador-d.webp", "FIRDAPSE: event invitation, version D", "FIRDAPSE event invitation, a fourth ambassador version with a different video and personal note."),
  lemsE: img("/projects/patient-programs/12-lems-event-ambassador-e.webp", "FIRDAPSE: event invitation, version E", "FIRDAPSE event invitation, a fifth ambassador version with a placeholder video frame marked FPO."),
  lemsF: img("/projects/patient-programs/13-lems-event-ambassador-f.webp", "FIRDAPSE: event invitation, version F", "FIRDAPSE event invitation, a sixth ambassador version with a different video and personal note."),
  lemsG: img("/projects/patient-programs/14-lems-event-ambassador-g.webp", "FIRDAPSE: event invitation, version G", "FIRDAPSE event invitation, a seventh ambassador version with a different video and personal note."),
  alunbrig: img(
    "/projects/patient-programs/15-alunbrig-registration.webp",
    "ALUNBRIG: webinar registration",
    "ALUNBRIG Ask. Learn. Know. Patient Empowerment Series registration email with program date, time and time zone merge fields, a Join Program button and full safety information.",
    "Registration confirmation for a live virtual program. Date, start, end and time zone all come from the registration record.",
  ),
  dupixent: img(
    "/projects/patient-programs/16-dupixent-prescribing-information.webp",
    "DUPIXENT: prescribing information",
    "DUPIXENT email greeting the registrant with a Salesforce merge field and linking to the full Prescribing Information and Patient Information.",
    "A short service email delivering Prescribing Information and Patient Information links, personalized with Salesforce merge fields.",
  ),
};

const projectList: Project[] = [
  {
    slug: "bank-of-america",
    number: "01",
    title: "Bank of America",
    client: "Bank of America and Merrill",
    clientLabel: "Client",
    industry: "Banking / Financial Services",
    category: "Enterprise email development",
    discipline: "Email development",
    scope: "Acquisition, servicing and lifecycle email",
    related: "Email Developer, Tamman Inc.",
    summary:
      "Enterprise email for Bank of America and Merrill, from Preferred Rewards and investing to mortgages, auto loans and small business, for a team whose email work has won Gold, Silver and Bronze at the FCS Portfolio Awards.",
    intro:
      "Regulated financial email leaves no room for error. Every offer carries its disclosures, every footnote has to be reachable, and every message has to hold up in Outlook, Gmail and Apple Mail on desktop and phone.",
    tags: ["Salesforce Marketing Cloud", "AMPscript", "Accessibility", "Award-winning"],
    overview: [
      "This is the production archive from Bank of America's Enterprise Creative Solutions email work: Preferred Rewards lifestyle benefits, Merrill investing and outlook events, mortgages and home equity, auto loans, Business Advantage and Merchant Services, Workplace Benefits, and everyday banking and security. Every build runs on the bank's email framework: a 550px desktop layout, a 320px mobile layout, shared content blocks and per-link campaign tracking.",
      "Most campaigns ship as several builds, not one. Tier, audience, offer and language each get their own version, up to twelve for a single job, and every version has to match its approved copy and disclosures exactly.",
      "The craft is in what the reader never notices. Disclosures that are long but navigable, desktop and mobile artwork that swap cleanly, Outlook-specific code that keeps backgrounds and layout intact, and Spanish builds that are translated all the way down to the screen-reader labels.",
    ],
    technicalScope: [
      {
        title: "Separate desktop and mobile artwork",
        body: "Mastheads, offer graphics and dividers ship in 550px and 320px versions, swapped with hide and mobile-only classes and hidden from Outlook with conditional comments.",
      },
      {
        title: "Outlook-specific code",
        body: "VML rectangles keep header background images in Outlook for Windows, MSO line-height overrides keep type metrics stable, and Office XML settings fix image scaling at 96 DPI.",
      },
      {
        title: "Accessible legal content",
        body: "Superscript footnotes link down to their disclosures and back up again, with aria-labels on both ends. Layout tables are marked presentational, the message is wrapped in role=article, and a visually hidden heading introduces the disclosures.",
      },
      {
        title: "Marketing Cloud integration",
        body: "AMPscript variables populate campaign codes in every link, shared logos come from Content Builder blocks via ContentBlockByKey, and each link carries a unique tracking name.",
      },
      {
        title: "Bilingual builds",
        body: "Spanish versions set lang to es and translate copy, alt text, footnote labels and back-to-content links, not just the visible text.",
      },
      {
        title: "Versioned builds",
        body: "The HELOC email ships as versions A and B from one build. One leads with a special rate offer; the other leaves it out and points to the HELOC details instead.",
      },
    ],
    sequential: false,
    galleryTitle: "Featured campaigns",
    galleryIntro: "Selected builds, grouped by line of business. Select any email to read it at full length, disclosures included.",
    gallery: bofaGallery,
    featured: bofa.merrill
      ? {
          image: bofa.merrill,
          title: "An offer, and everything legal needs",
          notes: [
            { title: "Brand header", body: "Bank of America and Merrill lockup with separate desktop and mobile sizing." },
            { title: "Animated offer", body: "A 470px animated GIF on desktop and a square 320px version on mobile, linked to the offer terms footnote." },
            { title: "Benefits and steps", body: "Three benefits in a bordered panel and three steps to open an account, with footnote markers where claims need support." },
            { title: "Disclosures", body: "Offer terms, a reward tier table, tax and rollover language and the investment products box, each footnote linked back to its marker." },
          ],
        }
      : undefined,
    details: [],
    code: [
      {
        title: "Footnotes you can navigate",
        body: "Every superscript is a link to its disclosure, and every disclosure links back. Screen readers announce both directions.",
        code: `<!-- In the copy -->
set up recurring deposits<a href="#footnote_num2" name="footnote_num2b"
  aria-label="footnote 2"><strong>&#178;</strong></a>

<!-- In the disclosures -->
<a name="footnote_num2" aria-label="footnote 2"><strong>2</strong></a>
No investment plan is risk free, and a systematic investment plan
does not ensure profits or protect against losses.
<a href="#footnote_num2b" aria-label="back to content">&nbsp;</a>`,
      },
      {
        title: "Desktop and mobile artwork, Outlook-safe",
        body: "Desktop gets the 550px masthead. Phones get a 320px crop. Outlook for Windows never sees the mobile block.",
        code: `<img src="…/Masthead_DT_550x395_2x.jpg" width="550" height="395"
     alt="" class="hide" style="display:block; width:550px;">
<!--[if !mso]><!-->
<div class="mobile-only" style="display:none; overflow:hidden;
     font-size:0; line-height:0; max-height:0; max-width:0; width:0;">
  <img src="…/Masthead_m_320x230_2x.jpg" width="320" height="230" alt="">
</div>
<!--<![endif]-->`,
      },
      {
        title: "Background images in Outlook",
        body: "Outlook for Windows ignores CSS backgrounds, so the header draws its background with VML and places the logo in a text box on top.",
        code: `<td background="…/00000_550x76_BG_D.jpg"
    style="background:url(…/00000_550x76_BG_D.jpg) center/cover;">
  <!--[if gte mso 9]>
  <v:rect fill="true" stroke="false" style="width:550px; height:76px;">
  <v:fill color="#FFFFFF" opacity="0%"/>
  <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
  <![endif]-->
    <!-- logo table -->
  <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
</td>`,
      },
      {
        title: "Marketing Cloud, built in",
        body: "Campaign variables resolve in every URL and the shared logo comes from a Content Builder block, so one change updates every email.",
        code: `<a name="bofa_logo_H" target="_blank"
   href="https://www.bankofamerica.com/mortgage/?subCampCode=%%=v(@subcampaign_num)=%%
        &FlightNum=%%=v(@flight_num)=%%&cm_mmc=…-_-%%=v(@creative_code)=%%">
  %%= ContentBlockByKey("Logo_BofA") =%%
</a>`,
      },
      {
        title: "Translated to the last label",
        body: "The Spanish build changes the document language and the accessibility labels along with the copy.",
        code: `<html lang="es" xml:lang="es">
…
<a name="footnote_num1" aria-label="nota al pie 1">1</a>
…
<a href="#footnote_num1b" aria-label="volver al contenido">&nbsp;</a>`,
      },
    ],
    showAwards: true,
    considerations: [
      { title: "Compliance and disclosures", body: "Offer terms, tables, tax language and FDIC boxes are part of the build, structured so they read clearly and survive every client." },
      { title: "Accessibility", body: "Semantic headings, presentational tables, meaningful alt text and two-way footnote links make long legal content usable with a screen reader." },
      { title: "Cross-client compatibility", body: "Fixed-width desktop and mobile layouts, VML for Outlook backgrounds, Apple data-detector resets and conditional comments keep rendering consistent." },
    ],
    technologies: [
      "Salesforce Marketing Cloud",
      "AMPscript",
      "Content Builder blocks",
      "Responsive HTML/CSS",
      "VML and MSO conditionals",
      "Accessibility (ARIA)",
      "Bilingual EN/ES",
      "Versioned builds",
    ],
    theme: { panel: "#0E1B3D", panelInk: "light" },
    seoDescription:
      "Award-winning Bank of America and Merrill email: investment offers, bilingual homebuyer programs, HELOC A/B variants and account security, built with Salesforce Marketing Cloud, AMPscript and accessible disclosures.",
  },
  {
    slug: "car-t-talk",
    number: "01",
    title: "CAR-T TALK",
    client: "Bristol Myers Squibb",
    clientLabel: "Client",
    industry: "Healthcare / Pharmaceutical",
    category: "Email campaign development",
    discipline: "Email development",
    scope: "Six-message program",
    summary:
      "A coordinated set of emails that carries a patient or caregiver from registration to a call with a CAR-T Ambassador, and back again for feedback.",
    intro:
      "CAR-T TALK connects people considering CAR T cell therapy with Ambassadors who have been through it. The emails handle the logistics around that conversation: scheduling, reminders, missed calls and follow-up.",
    tags: ["Responsive HTML email", "Salesforce merge fields", "Dynamic content", "Cross-client QA"],
    overview: [
      "CAR-T TALK is a peer program. Patients and caregivers register, then speak by phone with an Ambassador who has their own experience with CAR T cell therapy. Every email in the program exists to get that call scheduled, attended or rescheduled.",
      "That makes the program a sequence rather than a campaign. Each message lands at a different moment, from the first scheduling note to the survey after a completed call, and a registrant may see four or five of them. They need to read as one voice and one layout so the person on the other end always knows who is writing and what to do next.",
    ],
    technicalScope: [
      {
        title: "Shared module system",
        body: "Every message is assembled from the same parts: the orange CAR-T TALK header with photography, the conference-line callout with its speech-bubble notch, and the grey Bristol Myers Squibb compliance footer with its job code.",
      },
      {
        title: "Personalization",
        body: "Registrant, Ambassador, specialist, date, time, time zone and phone values are flagged as fields throughout. The production reminder shows them wired to Salesforce merge fields on a call-schedule record.",
      },
      {
        title: "Calendar and reply actions",
        body: "The scheduling email carries Add to Outlook/iCal and Add to Google Calendar links alongside a reply-to-confirm instruction, so a registrant can act from any inbox.",
      },
      {
        title: "Regulated footers",
        body: "Each message ends with sponsor attribution, the opt-out route, a mailing address, legal links and a document code that has to match the approved version.",
      },
    ],
    sequential: true,
    galleryTitle: "The program, message by message",
    galleryIntro:
      "In the order a registrant would meet them. Select any email to read it at full length.",
    gallery: [cart.registration, cart.reminder, cart.reminderMerge, cart.missed, cart.final, cart.followUp],
    featured: {
      image: cart.registration,
      title: "One message, every moving part",
      notes: [
        { title: "Personal introduction", body: "Names the specialist and the Ambassador, and states the proposed call slot with date, time and time zone fields." },
        { title: "Two calendar actions", body: "Outlook/iCal and Google Calendar links sit side by side so the call lands on whichever calendar the registrant uses." },
        { title: "Conference-line callout", body: "The orange module with a nested list for dial-in, code entry and hold steps. Nested lists are among the least consistent structures across email clients." },
        { title: "Program guidelines", body: "A plain bulleted list sets expectations about confidentiality, call limits and side-effect reporting before the call happens." },
      ],
    },
    details: [
      {
        image: img(
          "/projects/car-t-talk/details/merge-fields.webp",
          "Salesforce merge fields",
          "Close-up of the reminder email showing {!Call_Schedule__c.Preferred_Name__c}, {!Call_Schedule__c.Patient_First_Name__c}, {!Call_Schedule__c.Ambassador_Time__c} and {!Call_Schedule__c.Patient_Call_Code__c} merge fields.",
        ),
        title: "Data, not copy",
        body: "In the production reminder the bracketed placeholders become Salesforce merge fields on a custom call-schedule object: preferred name, the patient's first name, the Ambassador's time and a per-call conference code. The layout has to survive short and long values alike.",
      },
      {
        image: img(
          "/projects/car-t-talk/details/scheduling-module.webp",
          "Scheduling and conference modules",
          "Close-up of the scheduling email showing the reply instruction, Add to Outlook/iCal and Add to Google Calendar links, and the orange conference-line callout.",
        ),
        title: "Actions people can take from any inbox",
        body: "The reply instruction, calendar links and dial-in steps are stacked in the order someone needs them. The callout's notch and icon carry over into every other message that mentions the call.",
      },
    ],
    considerations: [
      { title: "Responsive email development", body: "Single-column layouts that hold at desktop widths and reflow cleanly on phones, with the header photography and callout notch kept intact." },
      { title: "Dynamic content and personalization", body: "Up to a dozen fields in a single message. Copy and spacing have to work whether a name is four characters or twenty." },
      { title: "QA across related communications", body: "Six messages share modules, so a change to one has to be checked against all of them: header, callout, footer, job codes and legal links." },
    ],
    technologies: [
      "Responsive HTML/CSS email",
      "Salesforce merge fields",
      "Dynamic content",
      "Calendar links",
      "Modular templates",
      "Cross-client QA",
      "Compliance footers",
    ],
    theme: { panel: "#E9DDD3", panelInk: "dark" },
    seoDescription:
      "CAR-T TALK for Bristol Myers Squibb: a six-message patient program covering scheduling, reminders, missed calls and follow-up, with Salesforce merge-field personalization.",
  },
  {
    slug: "three-insurance",
    number: "02",
    title: "THREE Insurance",
    client: "THREE by Berkshire Hathaway",
    clientLabel: "Client",
    industry: "Insurance / Financial Services",
    category: "Transactional email & marketing automation",
    discipline: "Salesforce Marketing Cloud",
    scope: "Ten transactional templates",
    related: "Salesforce Marketing Engineer, Next Level Solutions",
    summary:
      "Transactional templates that follow a small-business policy from first quote through billing, renewal and cancellation, personalized with AMPscript in Salesforce Marketing Cloud.",
    intro:
      "Quotes, policy changes, invoices, receipts, renewals and cancellations. Every one of them is a message a business owner needs to trust, and every one is built from live policy data.",
    tags: ["Salesforce Marketing Cloud", "AMPscript", "Transactional email", "Lifecycle"],
    overview: [
      "THREE sells small-business insurance directly, so email is a primary service channel. The templates here cover the policy lifecycle: a quote is ready, a policy changed, a payment is due or received, a policy renews, expires or is cancelled.",
      "Transactional email carries less room for error than marketing email. A policy number, a premium or a cancellation date that renders wrong is a customer-service call at best. The work is as much about data and structure as it is about layout.",
    ],
    technicalScope: [
      {
        title: "Personalization strings and AMPscript",
        body: "Names, policy numbers and quote IDs use personalization strings. Dates and currency are formatted inline with AMPscript, for example FormatDate on effective and expiration dates and FormatNumber on payment amounts.",
      },
      {
        title: "One system, many triggers",
        body: "All ten templates share a header, a document-type strip, a headline with a rule, a support module and a dark footer. Only the body changes between a receipt and a cancellation.",
      },
      {
        title: "Lifecycle coverage",
        body: "Quote, policy service, billing, renewal and expiration, and two cancellation paths, each with its own data requirements.",
      },
      {
        title: "Proofing with real values",
        body: "Rendered test sends with sample data confirm that every field resolves and that long values do not break the layout before a template goes live.",
      },
    ],
    sequential: true,
    galleryTitle: "From quote to cancellation",
    galleryIntro: "Ordered by where they fall in a policy's life. Select any template to inspect it at full resolution.",
    gallery: [
      three.quote,
      three.quoteTest,
      three.change,
      three.access,
      three.invoice,
      three.receipt,
      three.renewal,
      three.expiration,
      three.audit,
      three.flat,
    ],
    featured: {
      image: three.renewal,
      title: "Anatomy of a renewal notice",
      notes: [
        { title: "Header and document strip", body: "View in browser, the support number and a strip naming the document type next to the policy number." },
        { title: "Policy detail block", body: "Named insured, policy number, renewal period, prior period and renewal premium. Each value comes from data, with dates and currency formatted by AMPscript." },
        { title: "Account action", body: "A single link into the customer's account space for renewal documents." },
        { title: "Support and footer", body: "The same licensed-advisor module and dark legal footer that close every template in the system." },
      ],
    },
    details: [
      {
        image: img(
          "/projects/three-insurance/details/ampscript-renewal.webp",
          "AMPscript in the renewal notice",
          "Close-up of the THREE renewal email showing %%FullName%%, %%PolicyNumber%% and AMPscript FormatDate and FormatNumber expressions for policy periods and renewal premium.",
        ),
        title: "Formatting at send time",
        body: "Policy periods and the renewal premium are written as AMPscript expressions, so the data can stay raw and every template formats dates as MM/dd/YYYY and currency with grouping in the same way.",
      },
      {
        image: img(
          "/projects/three-insurance/details/ampscript-receipt.webp",
          "Payment receipt header",
          "Close-up of the THREE payment receipt showing the Payment Receipt strip, policy number personalization string and the payment amount formatted with AMPscript FormatNumber.",
        ),
        title: "The strip that tells you what this is",
        body: "Every template opens with a document-type label beside the policy number. In a crowded inbox, that strip is what separates a receipt from a cancellation at a glance.",
      },
    ],
    considerations: [
      { title: "Data-driven personalization", body: "Every template depends on fields resolving correctly. Test sends with sample data are part of the build, not an afterthought." },
      { title: "Responsive engineering", body: "Detail blocks with long AMPscript-generated values need to wrap gracefully on narrow screens without breaking labels from their values." },
      { title: "A consistent design system", body: "Shared header, strip, support module and footer keep ten templates maintainable and recognizably from the same company." },
    ],
    technologies: [
      "Salesforce Marketing Cloud",
      "AMPscript",
      "Personalization strings",
      "Transactional email",
      "Customer lifecycle messaging",
      "Responsive HTML/CSS",
      "Modular templates",
      "Campaign QA",
    ],
    theme: { panel: "#24221F", panelInk: "light" },
    seoDescription:
      "THREE by Berkshire Hathaway: ten transactional email templates for quotes, billing, renewals and cancellations, personalized with AMPscript in Salesforce Marketing Cloud.",
  },
  {
    slug: "apokyn",
    number: "03",
    title: "APOKYN",
    client: "APOKYN",
    clientLabel: "Brand",
    industry: "Pharmaceutical / Healthcare",
    category: "Responsive healthcare email development",
    discipline: "Email development",
    scope: "Long-form education and program emails",
    summary:
      "Long-form patient emails where education, real patient stories and full safety information share the same scroll.",
    intro:
      "Healthcare email asks a lot of a single message. These APOKYN emails carry education, patient stories, video, program support and complete safety information, in that order, without losing the reader.",
    tags: ["Long-form email", "Safety information", "Accessibility", "Content hierarchy"],
    overview: [
      "These emails speak to people living with Parkinson's disease and their care partners. Each one leads with a single topic, such as ON time, OFF episodes or whether APOKYN might be right for them, then moves through supporting modules to the full safety information at the end.",
      "The challenge is hierarchy. The reader needs a clear headline and next step near the top, safety information that is visible early rather than buried, and pages of required copy that stay legible all the way down.",
    ],
    technicalScope: [
      {
        title: "Complex content hierarchy",
        body: "Hero, topic modules, an early safety block, a patient quote, a video module, the Circle of Care program, resource tiles and the full safety information, stacked in a fixed order across every email.",
      },
      {
        title: "Medical and legal content",
        body: "Approved copy, trademarks and safety language are carried through exactly as written. Layout changes never alter wording, order or emphasis.",
      },
      {
        title: "Mixed media",
        body: "Photography, icon-led stat modules, a linked video thumbnail and a product shot sit alongside long passages of live text.",
      },
      {
        title: "Program messaging",
        body: "The Beyond Mentor Program confirmation is a short transactional email that shares brand cues with the long-form education series.",
      },
    ],
    sequential: false,
    galleryTitle: "The emails",
    galleryIntro: "Shown complete, safety information included. Select any email to read it at full length and zoom in.",
    gallery: [apokyn.onTime, apokyn.offEpisodes, apokyn.consider, apokyn.confirm],
    featured: {
      image: apokyn.onTime,
      title: "Reading a long-form email from top to bottom",
      notes: [
        { title: "Topic and hero", body: "One headline, one photograph and a short introduction set the subject before anything else." },
        { title: "Early safety block", body: "Important safety information appears high in the email, with a pointer to the complete version below." },
        { title: "Story and support", body: "A patient quote, the Real Patients. Real Stories. video module and the Circle of Care program give the reader somewhere to go next." },
        { title: "Complete safety information", body: "The full text runs at the end in a consistent, readable style, followed by the support phone number and legal footer." },
      ],
    },
    details: [
      {
        image: img(
          "/projects/apokyn/details/on-time-stats.webp",
          "Topic and stat modules",
          "Close-up of the top of the Maximizing your ON time email showing the headline, introduction and icon-led statistic modules.",
        ),
        title: "Lead with one idea",
        body: "The opening screen is a headline, a short introduction and a bordered module of icon-led points. Everything below supports this one topic.",
      },
      {
        image: img(
          "/projects/apokyn/details/safety-information.webp",
          "Safety information and patient story",
          "Close-up showing the important safety information block followed by a patient quote and the Real Patients. Real Stories. video module.",
        ),
        title: "Safety before story",
        body: "Required safety information sits above the patient quote and video, with a pointer to the full text further down. It is styled to be read, not hidden.",
      },
      {
        image: img(
          "/projects/apokyn/details/consider-modules.webp",
          "Benefit modules",
          "Close-up of the Consider APOKYN email showing three icon benefit modules and supporting bullet points.",
        ),
        title: "Icons that carry structure",
        body: "Three icon modules break the benefits into scannable units that stack predictably on small screens.",
      },
    ],
    considerations: [
      { title: "Email compatibility", body: "Long emails with many modules are where client quirks compound, so spacing and module order have to hold in clients with limited CSS support." },
      { title: "Accessibility", body: "Pages of required copy have to stay readable for every audience, which comes down to type size, line length, spacing and contrast in the safety information." },
      { title: "Consistent branding", body: "Shared colors, button styles and module patterns make three different topics feel like one series." },
    ],
    technologies: [
      "Responsive HTML/CSS email",
      "Long-form content hierarchy",
      "Safety information handling",
      "Accessibility",
      "Cross-client QA",
      "Modular templates",
    ],
    theme: { panel: "#D7E9EE", panelInk: "dark" },
    seoDescription:
      "APOKYN: long-form healthcare emails combining patient education, patient stories, video and complete safety information, plus a Beyond Mentor Program confirmation.",
  },
  {
    slug: "rialto",
    number: "04",
    title: "Rialto",
    client: "Rialto",
    clientLabel: "Brand",
    industry: "Travel / Hospitality",
    category: "Responsive email design & development",
    discipline: "Design and HTML development",
    scope: "Acquisition email, desktop and mobile",
    summary:
      "An owner-acquisition email for a timeshare rental marketplace, designed for two screens and hand-coded to switch between them.",
    intro:
      "Rialto asks timeshare owners to list their properties for rent. The email has one job, getting owners to the List Your Timeshare button, and it has to do that job equally well on a laptop and a phone.",
    tags: ["Email design", "Hand-coded HTML", "Mobile optimization", "Responsive design"],
    overview: [
      "Rialto is a rental marketplace built for timeshare resorts. This email speaks to owners: a resort hero, three reasons to list, a short proof panel and a single call to action.",
      "The headline and intro are live HTML above a text-free resort photograph, so the message stays sharp, readable and accessible in every client, even with images off. At the mobile breakpoint the build swaps in a stacked version of the feature row and enlarges type and spacing for a thumb, rather than shrinking the desktop layout.",
    ],
    technicalScope: [
      {
        title: "Two layouts, one file",
        body: "Desktop and mobile versions of the hero image and feature row live in the same HTML, toggled with hide and mobile-only classes inside a 767px media query.",
      },
      {
        title: "Outlook-safe structure",
        body: "Table-based layout with MSO conditional comments, and mobile-only blocks wrapped so Outlook on Windows never renders them.",
      },
      {
        title: "Utility-class framework",
        body: "Mobile spacing and type adjustments come from a small set of utility classes, such as pl20 and fsz14, applied inside the media query so overrides stay predictable.",
      },
      {
        title: "Live text and retina assets",
        body: "Headline and copy are real text in the brand's geometric sans with system fallbacks. The hero photo and button are supplied at 2x and sized with width attributes, and every content image carries alt text.",
      },
    ],
    sequential: false,
    galleryTitle: "Desktop and mobile",
    galleryIntro: "Both renders come from the same HTML file. Scroll inside each frame, or open either at full size.",
    gallery: [rialto.desktop, rialto.mobile, rialto.photo],
    details: [
      {
        image: img(
          "/projects/rialto/details/desktop-hero.webp",
          "Desktop hero",
          "Close-up of the Rialto desktop opening: logo, the live-text headline Join One of the Fastest Growing Timeshare Rental Marketplaces, supporting copy and a symmetrical resort pool photo.",
        ),
        title: "Message first, photo second",
        body: "The promise is set as live text above the photograph rather than baked into it, so it renders crisply, survives images-off views and is read by screen readers.",
      },
      {
        image: img(
          "/projects/rialto/details/mobile-hero.webp",
          "Mobile hero",
          "Close-up of the Rialto mobile build: logo, the headline and supporting copy as large live text, then the resort photo at full width.",
        ),
        title: "Sized for a phone",
        body: "Below 768px the headline steps up in size, the copy reflows to a comfortable measure and the hero runs full width, with no pinch-zooming required.",
      },
      {
        image: img(
          "/projects/rialto/details/proof-panel.webp",
          "Why owners choose us panel",
          "Close-up of the Why owners choose us panel with three checkmarked statements on a pale blue background.",
        ),
        title: "Answer the next question",
        body: "A soft blue panel with three checkmarked points sits between the features and the button, handling the owner's doubts before the ask.",
      },
    ],
    considerations: [
      { title: "Responsive design", body: "Separate desktop and mobile compositions instead of one layout squeezed to fit, so each screen gets the hierarchy it needs." },
      { title: "Mobile optimization", body: "Larger live type, stacked features and a full-width button sized for touch." },
      { title: "Visual consistency", body: "One palette of navy, bright blue and pale sky, and one icon style, across hero, features, panel and footer." },
    ],
    technologies: [
      "Email design",
      "Hand-coded HTML/CSS",
      "Media queries",
      "MSO conditional comments",
      "Utility-class framework",
      "Web fonts with fallbacks",
      "Accessible alt text",
    ],
    theme: { panel: "#CFE3EE", panelInk: "dark" },
    seoDescription:
      "Rialto: a responsive owner-acquisition email for a timeshare rental marketplace, designed and hand-coded with separate desktop and mobile compositions.",
  },
  {
    slug: "patient-programs",
    number: "05",
    title: "Patient Mentor Programs",
    client: "Boehringer Ingelheim, Catalyst, Takeda, Sanofi and Regeneron",
    clientLabel: "Client",
    industry: "Pharmaceutical / Healthcare",
    category: "Program email development",
    discipline: "Email development",
    scope: "Four brands, sixteen emails",
    related: "Lead Email Developer, Snow Companies",
    summary:
      "Scheduling, reminder, event and follow-up emails for patient mentor and education programs across four pharmaceutical brands.",
    intro:
      "Peer mentor programs connect patients with people who have lived with the same condition. These emails run the logistics: confirmations, reminders, missed calls, event invitations, surveys and safety reporting.",
    tags: ["Healthcare email", "Salesforce merge fields", "Templated variants", "Safety information"],
    overview: [
      "Each program has two audiences: the patient or caregiver who registered, and the mentor or ambassador who speaks with them. Many messages exist in both versions, with different instructions for each side of the same call.",
      "The work spans four brands with their own identities and compliance requirements: OFEV Mentor Connections, the LEMS Connection and FIRDAPSE events, ALUNBRIG's Ask. Learn. Know. series and DUPIXENT. They share one requirement: every message has to be accurate, on brand and approved before it sends.",
    ],
    technicalScope: [
      {
        title: "Two-sided messaging",
        body: "Registrant and mentor versions of confirmations and follow-ups share modules but carry different instructions. Mentors are asked to play the safety information and to report adverse events.",
      },
      {
        title: "One template, many ambassadors",
        body: "The FIRDAPSE event invitation exists in seven versions. Video, personal note and signature change per ambassador while the event panel and full safety information stay identical.",
      },
      {
        title: "Data-driven fields",
        body: "Program dates, times, time zones and contact names are pulled from registration records with Salesforce merge-field syntax, such as {!Patient_Registration__c.Contact_First_Name__c}.",
      },
      {
        title: "Brand and compliance",
        body: "Each brand keeps its own logo lockups, colors and footers, with job codes, sponsor attribution and opt-out language specific to the program.",
      },
    ],
    sequential: false,
    galleryTitle: "Across four programs",
    galleryIntro: "Grouped by brand. Select any email to read it at full length, safety information included.",
    gallery: [
      pp.ofevRegistrant,
      pp.ofevMentor,
      pp.ofevReminder,
      pp.ofevMissed,
      pp.ofevFollowUp,
      pp.ofevMentorFollowUp,
      pp.lemsInvite,
      pp.lemsA,
      pp.lemsB,
      pp.lemsC,
      pp.lemsD,
      pp.lemsE,
      pp.lemsF,
      pp.lemsG,
      pp.alunbrig,
      pp.dupixent,
    ],
    featured: {
      image: pp.ofevMentor,
      title: "Instructions for the other side of the call",
      notes: [
        { title: "Program lockup", body: "The product logo beside the Mentor Connections program mark, so recipients know which program is writing." },
        { title: "Date block", body: "Day, date, time and time zone in a tinted band with a calendar icon, the one detail a mentor must not miss." },
        { title: "Call instructions", body: "A nested list for dial-in, code entry and the mentor-only step of playing the Important Safety Information at the end of the call." },
        { title: "Program footer", body: "Support, motivation and resources icons, sponsor attribution, opt-out instructions, mailing address and job code." },
      ],
    },
    details: [
      {
        image: img(
          "/projects/patient-programs/details/lems-ambassador-variants.webp",
          "Seven ambassador versions",
          "The top of seven FIRDAPSE event invitation emails side by side, each with a different ambassador video and note in the same layout.",
        ),
        title: "Seven versions, one build",
        body: "Each ambassador gets an invitation in their own voice and video. The shared layout means one QA pass covers the structure, and only the variable content changes between sends.",
      },
      {
        image: img(
          "/projects/patient-programs/details/ofev-call-instructions.webp",
          "OFEV call instructions",
          "Close-up of the OFEV mentor confirmation showing the date and time block and the amber call instructions panel.",
        ),
        title: "A panel that does one job",
        body: "The amber instructions panel is the most important part of the message, so it gets the strongest color and the clearest list structure.",
      },
      {
        image: img(
          "/projects/patient-programs/details/alunbrig-merge-fields.webp",
          "ALUNBRIG registration fields",
          "Close-up of the ALUNBRIG registration email showing merge fields for program day, date, campaign start and end time and time zone.",
        ),
        title: "Every time from the record",
        body: "Program day, date, start, end and time zone are separate fields on the registration record, so one template serves every session in the series.",
      },
      {
        image: img(
          "/projects/patient-programs/details/dupixent-merge-fields.webp",
          "DUPIXENT merge fields",
          "Close-up of the DUPIXENT email greeting with {!Patient_Registration__c.Contact_First_Name__c} and linking to Prescribing Information and Patient Information.",
        ),
        title: "Short, personal, compliant",
        body: "A three-line service email: a personalized greeting, the two required document links and a sign-off from the program specialist.",
      },
    ],
    considerations: [
      { title: "Regulated content", body: "Safety information, job codes and sponsor language are carried exactly as approved, in every version of every message." },
      { title: "Variant management", body: "Shared modules keep dozens of near-identical emails consistent, and make it obvious when something differs that shouldn't." },
      { title: "Cross-client QA", body: "Nested instruction lists, icon rows and long safety sections are tested across clients before each program goes live." },
    ],
    technologies: [
      "Responsive HTML/CSS email",
      "Salesforce merge fields",
      "Templated variants",
      "Modular templates",
      "Safety information handling",
      "Cross-client QA",
    ],
    theme: { panel: "#D9E4EE", panelInk: "dark" },
    seoDescription:
      "Patient mentor program emails for OFEV, FIRDAPSE/LEMS Connection, ALUNBRIG and DUPIXENT: confirmations, reminders, event invitations and follow-ups built from shared, compliant modules.",
  },
  {
    slug: "atelier-oak-concept",
    number: "07",
    title: "Atelier & Oak",
    client: "Atelier & Oak (fictional)",
    clientLabel: "Brand",
    industry: "Furniture / Retail",
    category: "Concept email: design, development & testing",
    discipline: "Design, HTML development and QA",
    scope: "Concept piece: one collection-launch email",
    summary:
      "A concept piece for a fictional furniture brand: one collection-launch email, hand-coded for Outlook, dark mode and dynamic content, with its checks and test plan in the open.",
    intro:
      "Concept piece. Atelier & Oak is a fictional brand I invented to show, in one email, how I build for the hard parts of the inbox: Outlook on Windows, dark mode and data that does not always arrive.",
    tags: ["Concept piece", "Hand-coded HTML", "Dark mode", "Outlook / VML", "Liquid"],
    overview: [
      "There is no client here, no send and no results to report. Atelier & Oak does not exist. I set myself a brief a premium furniture retailer might give, a seasonal collection launch with a hero, a dynamic product grid, a designer story and one call to action, then hand-coded it with no framework and wrote down how I would prove it works. The photography is free-licence stock, credited in the repository. Everything on this page is the built HTML, a Chromium render of it, a check anyone can re-run, or a real email-client render from Email on Acid.",
    ],
    technicalScope: [],
    sequential: false,
    galleryTitle: "",
    galleryIntro: "",
    gallery: [],
    details: [],
    considerations: [
      {
        title: "Accessibility",
        body: "A lang attribute, one h1 with h2 and h3 below it inside the layout tables, role=\"presentation\" on every table, 14px minimum text and alt text on every image. Contrast is computed, not eyeballed: the lowest text pair is 5.55:1 in light mode and 8.05:1 in dark, against the 4.5:1 AA threshold.",
      },
      {
        title: "Weight",
        body: "The full-data HTML is 27.1 KB, about a quarter of the 102 KB point where Gmail clips a message. Photographs are JPEGs exported at 2x, the largest 118 KB.",
      },
      {
        title: "Automated checks",
        body: "One script runs doiuse-email against Outlook, Gmail and Apple Mail, verifies that every table is closed in both the Outlook and the standard view, checks every image for width, height and alt, and measures size and contrast. Each caniemail flag that remains is listed with the fallback that covers it.",
      },
      {
        title: "Real-client testing",
        body: "Static checks and a Chromium screenshot are not an inbox, so the email was also rendered in real clients on Email on Acid (Mailgun Inspect). That run found two Outlook bugs the static checks missed; both were fixed and re-tested before the screenshots below were taken.",
      },
    ],
    code: [
      {
        title: "A grid that stacks without a media query",
        body: "Each product is an inline-block column with a max-width, so two fit at 600px and one fits on a phone. Outlook gets a ghost table that pins each column at 288px. Liquid supplies the defaults, the image fallback and the empty-state guard.",
        code: `{% if products and products.size > 0 %}
<td align="center" style="font-size:0; text-align:center;">
  <!--[if mso]>
  <table role="presentation" width="576"><tr>
  <![endif]-->
  {% for product in products limit:4 %}
  <!--[if mso]><td width="288" valign="top"><![endif]-->
  <div class="col" style="display:inline-block; width:100%;
       max-width:288px; vertical-align:top;">
    <img src="{{ product.image_url | default: fallback_image }}"
         width="264" height="323"
         alt="{{ product.image_alt | default: product_name }}"
         style="display:block; width:264px; height:323px; border:0;">
    {% if product.sale_price %}
      Now {{ product.sale_price }} <span>Was {{ product.price }}</span>
    {% else %}
      {{ product.price | default: "Price on request" }}
    {% endif %}
  </div>
  <!--[if mso]></td><![endif]-->
  {% endfor %}
  <!--[if mso]></tr></table><![endif]-->
</td>
{% endif %}`,
      },
      {
        title: "A hero photograph Outlook can draw",
        body: "Everyone else reads the CSS background. Outlook on Windows ignores it, so a VML rectangle paints the same photograph, with a solid colour behind it for when images are off. The headline stays live text in both.",
        code: `<td background="hero-autumn-light.jpg" bgcolor="#2A2118" height="480"
    style="background-image:url('hero-autumn-light.jpg');
           background-size:cover; background-color:#2A2118;">
  <!--[if mso]>
  <v:rect fill="true" stroke="false" style="width:600px; height:480px;">
  <v:fill type="frame" src="hero-autumn-light.jpg" color="#2A2118" />
  <v:textbox inset="0,0,0,0">
  <![endif]-->

  <h1 style="font-family:'Cormorant Garamond', Georgia, serif;">
    The Hearth Collection
  </h1>

  <!--[if mso]></v:textbox></v:rect><![endif]-->
</td>`,
      },
      {
        title: "Container swapping for dark mode",
        body: "Recolouring is not enough for a logo or a card over a photograph, so there are two builds of each. The light one shows by default. The dark one is hidden, kept away from Outlook on Windows entirely, and swapped in by the dark-mode rules.",
        code: `<img class="swap-light" src="logo-light.png" width="208" height="32"
     alt="Atelier &amp; Oak" style="display:block;">
<!--[if !mso]><!-->
<img class="swap-dark" src="logo-dark.png" width="208" height="32"
     alt="Atelier &amp; Oak"
     style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
<!--<![endif]-->

<!-- In the head -->
@media (prefers-color-scheme: dark) {
  .swap-light { display: none !important; }
  .swap-dark  { display: block !important; max-height: none !important; }
}
[data-ogsc] .swap-light { display: none !important; }
[data-ogsc] .swap-dark  { display: block !important; max-height: none !important; }`,
      },
    ],
    technologies: [
      "Hand-coded HTML/CSS",
      "Hybrid fluid layout",
      "MSO ghost tables",
      "VML backgrounds and buttons",
      "Dark mode (prefers-color-scheme, data-ogsc)",
      "Container swapping",
      "Liquid (liquidjs)",
      "CSS inlining (juice)",
      "doiuse-email",
      "Playwright",
      "Nodemailer",
      "WCAG AA contrast",
    ],
    theme: { panel: "#DDD5C8", panelInk: "dark" },
    seoDescription:
      "Concept piece: a hand-coded collection-launch email for the fictional furniture brand Atelier & Oak, built for Outlook, dark mode and dynamic Liquid content, with automated checks and a client test plan.",
    concept: {
      badge: "Concept piece",
      overviewTitle: "Concept piece",
      codeTitle: "From the email source",
      codeIntro: "Short excerpts from the hand-coded template, with image paths shortened.",
      liveUrl: "/email-samples/atelier-oak/index.html",
      plainTextUrl: "/email-samples/atelier-oak/plain.txt",
      screens: {
        desktopLight: atelier.desktopLight,
        desktopDark: atelier.desktopDark,
        mobileLight: atelier.mobileLight,
        mobileDark: atelier.mobileDark,
      },
      build: [
        {
          title: "Outlook on Windows",
          points: [
            "Ghost tables inside MSO conditional comments pin the 600px container and each 288px product column, because Word's rendering engine ignores max-width and inline-block.",
            "VML draws what CSS cannot there: the hero photograph (v:rect and v:fill, with a solid fallback colour) and the button (v:roundrect).",
            "The OfficeDocumentSettings block sets PixelsPerInch to 96, so Windows display scaling at 120 DPI does not enlarge the images out of their cells.",
          ],
        },
        {
          title: "Dark mode",
          points: [
            "Clients behave in three ways: some leave the email alone, some partially invert (light backgrounds go dark, dark ones stay), and some fully invert everything. The build is written for all three.",
            "Apple Mail gets its own palette through prefers-color-scheme; Outlook.com gets the same through [data-ogsc] and [data-ogsb] selectors. Colours are off-white and off-black, never pure white or black.",
            "Container swapping: the logo and the hero card each exist in a light and a dark build. Light shows by default, dark swaps in, and Outlook on Windows never receives the dark ones. The wordmark is a transparent PNG with a faint stroke so it stays legible if a client inverts around it.",
          ],
        },
        {
          title: "Fonts and fallbacks",
          points: [
            "Cormorant Garamond loads through both @import and @font-face for the clients that support web fonts.",
            "Every text element carries a full stack, Georgia for headings and Arial for body, and an MSO-only style block forces those in Outlook so nothing falls back to Times New Roman.",
            "Line heights are in pixels with mso-line-height-rule: exactly. Headline, prices and button are live text, not images.",
          ],
        },
        {
          title: "Dynamic product grid",
          points: [
            "Generic Liquid, rendered locally with liquidjs: a loop limited to four products, with sale and regular price logic.",
            "Every variable has a default, down to the greeting: {{ first_name | default: \"there\" }}.",
            "A product with no image gets a fallback tile, and an empty product list removes the whole module, heading included. The three rendered data states are below.",
          ],
        },
      ],
      states: [
        {
          image: atelier.stateFull,
          title: "Full data",
          body: "First name, four products, one on sale. The sale item reads Now and Was in words, not just colour.",
        },
        {
          image: atelier.statePartial,
          title: "Partial data",
          body: "No first name, so the greeting falls back to “Hi there”. The third product has no image, so it gets the fallback tile and its name as alt text.",
        },
        {
          image: atelier.stateEmpty,
          title: "Empty products",
          body: "The product list is empty, so the grid and its heading are not rendered at all. The intro runs straight into the button.",
        },
      ],
      review: {
        intro:
          "I asked an AI assistant for a quick first draft of the product grid and saved it untouched. It looks right in a browser and would break in an inbox. I audited it against my email standards checklist and rebuilt it. These are some of the issues that were in that draft; the full audit and the draft itself are in the repository.",
        rows: [
          {
            issue: "Layout",
            before: "display: flex, gap and calc() for the 2x2 grid.",
            after: "Inline-block columns with a max-width that stack without a media query.",
          },
          {
            issue: "Outlook",
            before: "No MSO conditional comments anywhere.",
            after: "A ghost table with a 288px cell around each column.",
          },
          {
            issue: "Tables",
            before: "No role=\"presentation\"; a <tr> and a <td> left unclosed in the price table.",
            after: "Role and resets on every table; nesting verified by script in both the Outlook and standard views.",
          },
          {
            issue: "Images",
            before: "<img> with no alt, width, height, display:block or border:0.",
            after: "Width and height as attributes and in CSS, display:block, border:0, alt text with a fallback.",
          },
          {
            issue: "CSS",
            before: "font shorthand in rem, margins for spacing, everything in a <style> block.",
            after: "Longhand px values with mso-line-height-rule, padding on cells, base styles inlined at build.",
          },
          {
            issue: "Colour",
            before: "Pure #fff and #000; 12px #999 text at 2.85:1; no dark mode.",
            after: "Off-white and off-black; 14px text at 6.84:1; prefers-color-scheme and [data-ogsc] rules.",
          },
          {
            issue: "Data",
            before: "No defaults, no limit, no image fallback, no empty state.",
            after: "Defaults on every variable, limit:4, fallback image, module removed when the list is empty.",
          },
        ],
      },
      clientTests: atelierClientTests,
    },
  },
];

/** Display order is the array order; numbering follows it automatically. */
const order = ["bank-of-america", "three-insurance", "car-t-talk", "apokyn", "rialto", "patient-programs", "atelier-oak-concept"];
export const projects: Project[] = [...projectList]
  .sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug))
  .map((p, i) => ({ ...p, number: String(i + 1).padStart(2, "0") }));

export const rialtoAssets = rialto;
export const cartAssets = cart;
export const threeAssets = three;
export const apokynAssets = apokyn;
export const patientAssets = pp;
export const bofaAssets = bofa;
export const atelierAssets = atelier;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getNextProject(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
}
