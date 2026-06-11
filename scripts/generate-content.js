// AUTO-RUN via prebuild — reads content/home.md + content/about.md, writes lib/content.ts
const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const HOME_MD  = path.join(process.cwd(), 'content', 'home.md')
const ABOUT_MD = path.join(process.cwd(), 'content', 'about.md')
const OUT_TS   = path.join(process.cwd(), 'lib', 'content.ts')

if (!fs.existsSync(HOME_MD)) {
  console.log('[generate-content] content/home.md not found — skipping')
  process.exit(0)
}

const raw = fs.readFileSync(HOME_MD, 'utf-8')
const parsed = matter(raw)
const d = parsed.data          // { shared, en, id }
const sh = d.shared || {}
const en = d.en || {}
const id = d.id || {}

// ── about.md (about-page-specific fields) ────────────────────────────────────
const aboutRaw    = fs.existsSync(ABOUT_MD) ? fs.readFileSync(ABOUT_MD, 'utf-8') : '---\nen: {}\nid: {}\n---'
const aboutParsed = matter(aboutRaw)
const aEn = aboutParsed.data.en || {}
const aId = aboutParsed.data.id || {}

// ── helpers ──────────────────────────────────────────────────────────────────
function esc(v) {
  if (v == null) return '""'
  return JSON.stringify(String(v))
}
function arr(block, prefix, count, fields) {
  const out = []
  for (let i = 0; i < count; i++) {
    const obj = {}
    fields.forEach(([key, src, fallback]) => {
      obj[key] = src[`${prefix}_${i}_${key}`] ?? fallback ?? ''
    })
    out.push(obj)
  }
  return out
}

// ── nav ──────────────────────────────────────────────────────────────────────
const navCount = sh.nav_count || 9
const navEn = [], navId = []
for (let i = 0; i < navCount; i++) { navEn.push(en[`nav_${i}`] || ''); navId.push(id[`nav_${i}`] || '') }

// ── vision pillars ───────────────────────────────────────────────────────────
const pillarCount = sh.vision_pillar_count || 4
const visionPillarsEn = arr(en, 'vision_pillar', pillarCount, [['title','','']])
const visionPillarsId = arr(id, 'vision_pillar', pillarCount, [['title','','']])
// manual assemble with both fields
const mkPillars = (lang) => {
  const b = lang === 'en' ? en : id
  const out = []
  for (let i = 0; i < pillarCount; i++) {
    out.push({ title: b[`vision_pillar_${i}_title`] || '', body: b[`vision_pillar_${i}_body`] || '' })
  }
  return out
}

// ── market stats ─────────────────────────────────────────────────────────────
const mkMarketStats = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.market_stat_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ number: String(sh[`market_stat_${i}_number`] || b[`market_stat_${i}_number`] || ''), label: b[`market_stat_${i}_label`] || '' })
  }
  return out
}
// market stats — number is in en/id blocks in this md
const mkMarketStatsFixed = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.market_stat_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ number: String(b[`market_stat_${i}_number`] || ''), label: b[`market_stat_${i}_label`] || '' })
  }
  return out
}

// ── sederhana timeline ────────────────────────────────────────────────────────
const mkTimeline = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.sederhana_timeline_count || 6
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ date: String(sh[`sederhana_timeline_${i}_date`] || ''), event: b[`sederhana_timeline_${i}_event`] || '' })
  }
  return out
}

// ── sederhana stats ───────────────────────────────────────────────────────────
const mkSederhanaStats = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.sederhana_stat_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ number: String(sh[`sederhana_stat_${i}_number`] || ''), label: b[`sederhana_stat_${i}_label`] || '' })
  }
  return out
}

// ── expansion steps ───────────────────────────────────────────────────────────
const mkSteps = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.expansion_step_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({
      num: String(sh[`expansion_step_${i}_num`] || `0${i+1}`).padStart(2, '0'),
      title: b[`expansion_step_${i}_title`] || '',
      body: b[`expansion_step_${i}_body`] || ''
    })
  }
  return out
}

// ── why gmv points ────────────────────────────────────────────────────────────
const mkPoints = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.whygmv_point_count || 6
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ title: b[`whygmv_point_${i}_title`] || '', body: b[`whygmv_point_${i}_body`] || '' })
  }
  return out
}

// ── footprint locations ───────────────────────────────────────────────────────
const mkLocations = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.footprint_location_count || 2
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({ country: b[`footprint_location_${i}_country`] || '', city: b[`footprint_location_${i}_city`] || '', status: 'active' })
  }
  return out
}

// ── team members ──────────────────────────────────────────────────────────────
const mkTeam = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.team_member_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({
      name: sh[`team_member_${i}_name`] || '',
      initials: sh[`team_member_${i}_initials`] || '',
      role: b[`team_member_${i}_role`] || '',
      bio: b[`team_member_${i}_bio`] || '',
      photo: sh[`team_member_${i}_photo`] || ''
    })
  }
  return out
}

// ── press items ───────────────────────────────────────────────────────────────
const mkPress = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.press_item_count || 4
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({
      publication: sh[`press_item_${i}_publication`] || '',
      headline: b[`press_item_${i}_headline`] || '',
      date: b[`press_item_${i}_date`] || '',
      url: sh[`press_item_${i}_url`] || '',
      image: sh[`press_item_${i}_image`] || ''
    })
  }
  return out
}

// ── contact offices ───────────────────────────────────────────────────────────
const mkOffices = (lang) => {
  const b = lang === 'en' ? en : id
  const count = sh.contact_office_count || 1
  const out = []
  for (let i = 0; i < count; i++) {
    out.push({
      label: b[`contact_office_${i}_label`] || '',
      city: sh[`contact_office_${i}_city`] || '',
      address: b[`contact_office_${i}_address`] || ''
    })
  }
  return out
}

// ── footer navCols ─────────────────────────────────────────────────────────────
const mkFooterNavCols = (lang) => {
  // These are static — not CMS-editable yet
  if (lang === 'en') return [
    { heading: 'Home', links: ['About','Vision','Market','Sederhana','Expansion','Why GMV'] },
    { heading: 'Pages', links: ['About Us','Articles'] },
    { heading: 'Connect', links: ['Contact','LinkedIn','Instagram','Twitter/X'] }
  ]
  return [
    { heading: 'Beranda', links: ['Tentang','Visi','Pasar','Sederhana','Ekspansi','Mengapa GMV'] },
    { heading: 'Halaman', links: ['Tentang Kami','Artikel'] },
    { heading: 'Terhubung', links: ['Kontak','LinkedIn','Instagram','Twitter/X'] }
  ]
}

// ── sections visibility ────────────────────────────────────────────────────────
const sections = {
  about:     sh.section_about_visible     !== false,
  vision:    sh.section_vision_visible    !== false,
  market:    sh.section_market_visible    !== false,
  sederhana: sh.section_sederhana_visible !== false,
  expansion: sh.section_expansion_visible !== false,
  whyGmv:    sh.section_whygmv_visible    !== false,
  footprint: sh.section_footprint_visible !== false,
  team:      sh.section_team_visible      === true,
  press:     sh.section_press_visible     !== false,
  contact:   sh.section_contact_visible   !== false,
}

// ── assemble content object ───────────────────────────────────────────────────
const content = {
  head_scripts: sh.head_scripts || '',
  nav_logo_src: sh.nav_logo_src || '/assets/logo.svg',
  footer_logo_src: sh.footer_logo_src || '/assets/Logo-Footer.svg',
  nav: { en: navEn, id: navId },
  hero: {
    en: {
      label: en.hero_label || '',
      headline: en.hero_headline || '',
      subheadline: en.hero_subheadline || '',
      ctaPrimary: en.hero_cta_primary || '',
      ctaSecondary: en.hero_cta_secondary || '',
    },
    id: {
      label: id.hero_label || '',
      headline: id.hero_headline || '',
      subheadline: id.hero_subheadline || '',
      ctaPrimary: id.hero_cta_primary || '',
      ctaSecondary: id.hero_cta_secondary || '',
    },
    videoSrc: sh.hero_video_src || '',
  },
  about: {
    en: {
      label: en.about_label || '', title: en.about_title || '', p1: en.about_p1 || '', p2: en.about_p2 || '', badge: en.about_badge || '',
      heroTitle: aEn.hero_title || '', heroSubtitle: aEn.hero_subtitle || '',
      ctaTitle: aEn.cta_title || '', ctaBody: aEn.cta_body || '', ctaButton: aEn.cta_button || '',
      vision: {
        label: aEn.vision_label || '', title: aEn.vision_title || '',
        visionLabel: aEn.vision_vision_label || '', visionText: aEn.vision_vision_text || '',
        missionLabel: aEn.vision_mission_label || '',
        pillars: [0,1,2,3].map(i => ({ title: aEn[`vision_pillar_${i}_title`] || '', body: aEn[`vision_pillar_${i}_body`] || '' })),
      },
      whyGmv: {
        label: aEn.whygmv_label || '', title: aEn.whygmv_title || '', subtitle: aEn.whygmv_subtitle || '',
        points: [0,1,2,3,4,5].map(i => ({ title: aEn[`whygmv_point_${i}_title`] || '', body: aEn[`whygmv_point_${i}_body`] || '' })),
      },
    },
    id: {
      label: id.about_label || '', title: id.about_title || '', p1: id.about_p1 || '', p2: id.about_p2 || '', badge: id.about_badge || '',
      heroTitle: aId.hero_title || '', heroSubtitle: aId.hero_subtitle || '',
      ctaTitle: aId.cta_title || '', ctaBody: aId.cta_body || '', ctaButton: aId.cta_button || '',
      vision: {
        label: aId.vision_label || '', title: aId.vision_title || '',
        visionLabel: aId.vision_vision_label || '', visionText: aId.vision_vision_text || '',
        missionLabel: aId.vision_mission_label || '',
        pillars: [0,1,2,3].map(i => ({ title: aId[`vision_pillar_${i}_title`] || '', body: aId[`vision_pillar_${i}_body`] || '' })),
      },
      whyGmv: {
        label: aId.whygmv_label || '', title: aId.whygmv_title || '', subtitle: aId.whygmv_subtitle || '',
        points: [0,1,2,3,4,5].map(i => ({ title: aId[`whygmv_point_${i}_title`] || '', body: aId[`whygmv_point_${i}_body`] || '' })),
      },
    },
  },
  vision: {
    en: { label: en.vision_label || '', title: en.vision_title || '', visionLabel: en.vision_vision_label || '', visionText: en.vision_vision_text || '', missionLabel: en.vision_mission_label || '', pillars: mkPillars('en') },
    id: { label: id.vision_label || '', title: id.vision_title || '', visionLabel: id.vision_vision_label || '', visionText: id.vision_vision_text || '', missionLabel: id.vision_mission_label || '', pillars: mkPillars('id') },
  },
  market: {
    en: { label: en.market_label || '', title: en.market_title || '', p1: en.market_p1 || '', p2: en.market_p2 || '', closing: en.market_closing || '', stats: mkMarketStatsFixed('en') },
    id: { label: id.market_label || '', title: id.market_title || '', p1: id.market_p1 || '', p2: id.market_p2 || '', closing: id.market_closing || '', stats: mkMarketStatsFixed('id') },
  },
  sederhana: {
    en: { label: en.sederhana_label || '', title: en.sederhana_title || '', subtitle: en.sederhana_subtitle || '', p1: en.sederhana_p1 || '', p2: en.sederhana_p2 || '', p3: en.sederhana_p3 || '', badge: en.sederhana_badge || '', timeline: mkTimeline('en'), stats: mkSederhanaStats('en') },
    id: { label: id.sederhana_label || '', title: id.sederhana_title || '', subtitle: id.sederhana_subtitle || '', p1: id.sederhana_p1 || '', p2: id.sederhana_p2 || '', p3: id.sederhana_p3 || '', badge: id.sederhana_badge || '', timeline: mkTimeline('id'), stats: mkSederhanaStats('id') },
    imageSrc: sh.sederhana_image_src || '',
  },
  expansion: {
    en: { label: en.expansion_label || '', title: en.expansion_title || '', subtitle: en.expansion_subtitle || '', steps: mkSteps('en') },
    id: { label: id.expansion_label || '', title: id.expansion_title || '', subtitle: id.expansion_subtitle || '', steps: mkSteps('id') },
  },
  whyGmv: {
    en: { label: en.whygmv_label || '', title: en.whygmv_title || '', subtitle: en.whygmv_subtitle || '', points: mkPoints('en') },
    id: { label: id.whygmv_label || '', title: id.whygmv_title || '', subtitle: id.whygmv_subtitle || '', points: mkPoints('id') },
  },
  footprint: {
    en: { label: en.footprint_label || '', title: en.footprint_title || '', subtitle: en.footprint_subtitle || '', closing: en.footprint_closing || '', locations: mkLocations('en') },
    id: { label: id.footprint_label || '', title: id.footprint_title || '', subtitle: id.footprint_subtitle || '', closing: id.footprint_closing || '', locations: mkLocations('id') },
  },
  team: {
    en: { label: en.team_label || '', title: en.team_title || '', members: mkTeam('en') },
    id: { label: id.team_label || '', title: id.team_title || '', members: mkTeam('id') },
  },
  press: {
    en: { label: en.press_label || '', title: en.press_title || '', items: mkPress('en') },
    id: { label: id.press_label || '', title: id.press_title || '', items: mkPress('id') },
  },
  contact: {
    en: {
      label: en.contact_label || '', title: en.contact_title || '', p1: en.contact_p1 || '',
      ctaButton: en.contact_cta_button || '', email: sh.contact_email || '',
      phone: sh.contact_phone || '', instagram: sh.contact_instagram || '',
      offices: mkOffices('en'),
      fields: {
        name: en.contact_field_name || '', email: en.contact_field_email || '',
        org: en.contact_field_org || '', market: en.contact_field_market || '',
        message: en.contact_field_message || '', submit: en.contact_field_submit || ''
      }
    },
    id: {
      label: id.contact_label || '', title: id.contact_title || '', p1: id.contact_p1 || '',
      ctaButton: id.contact_cta_button || '', email: sh.contact_email || '',
      phone: sh.contact_phone || '', instagram: sh.contact_instagram || '',
      offices: mkOffices('id'),
      fields: {
        name: id.contact_field_name || '', email: id.contact_field_email || '',
        org: id.contact_field_org || '', market: id.contact_field_market || '',
        message: id.contact_field_message || '', submit: id.contact_field_submit || ''
      }
    },
  },
  footer: {
    en: { copyright: en.footer_copyright || '', tagline: en.footer_tagline || '', navCols: mkFooterNavCols('en'), legal: [en.footer_legal_0 || '', en.footer_legal_1 || ''] },
    id: { copyright: id.footer_copyright || '', tagline: id.footer_tagline || '', navCols: mkFooterNavCols('id'), legal: [id.footer_legal_0 || '', id.footer_legal_1 || ''] },
  },
  sections,
}

// ── write lib/content.ts ──────────────────────────────────────────────────────
const ts = `// AUTO-GENERATED by GMV CMS
export type Lang = 'en' | 'id'
export const content = ${JSON.stringify(content, null, 2)
  // fix status field to add "as const" for TypeScript narrowing
  .replace(/"status": "active"/g, '"status": "active" as const')
  // strip outer quotes from keys (optional — JS is fine too, but cleaner)
} as const
`

fs.writeFileSync(OUT_TS, ts, 'utf-8')
console.log('[generate-content] lib/content.ts regenerated from content/home.md')
