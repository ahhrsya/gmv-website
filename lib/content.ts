import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Lang = 'en' | 'id'

// ─── Read home.md ─────────────────────────────────────────────────────────────

function readHome() {
  const filePath = path.join(process.cwd(), 'content', 'home.md')
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  return {
    en:     (data.en     ?? {}) as Record<string, string>,
    id:     (data.id     ?? {}) as Record<string, string>,
    shared: (data.shared ?? {}) as Record<string, string>,
  }
}

function readNav() {
  const filePath = path.join(process.cwd(), 'content', 'nav.md')
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data } = matter(raw)
  return {
    en:     (data.en     ?? {}) as Record<string, string>,
    id:     (data.id     ?? {}) as Record<string, string>,
    shared: (data.shared ?? {}) as Record<string, string>,
  }
}

function buildContent() {
  const home = readHome()
  const nav  = readNav()

  const e = home.en
  const i = home.id
  const s = home.shared
  const ne = nav.en
  const ni = nav.id
  const ns = nav.shared

  const navCount = Number(ns.nav_count ?? 9)

  return {
    nav: {
      en: Array.from({ length: navCount }, (_, idx) => ne[`nav_${idx}`] ?? ''),
      id: Array.from({ length: navCount }, (_, idx) => ni[`nav_${idx}`] ?? ''),
    },
    langToggle: ns.lang_toggle ?? 'EN | ID',

    hero: {
      en: {
        label:       e.hero_label        ?? '',
        headline:    e.hero_headline     ?? '',
        subheadline: e.hero_subheadline  ?? '',
        ctaPrimary:  e.hero_cta_primary  ?? '',
        ctaSecondary:e.hero_cta_secondary ?? '',
      },
      id: {
        label:       i.hero_label        ?? '',
        headline:    i.hero_headline     ?? '',
        subheadline: i.hero_subheadline  ?? '',
        ctaPrimary:  i.hero_cta_primary  ?? '',
        ctaSecondary:i.hero_cta_secondary ?? '',
      },
    },

    about: {
      en: { label: e.about_label ?? '', title: e.about_title ?? '', p1: e.about_p1 ?? '', p2: e.about_p2 ?? '', badge: e.about_badge ?? '' },
      id: { label: i.about_label ?? '', title: i.about_title ?? '', p1: i.about_p1 ?? '', p2: i.about_p2 ?? '', badge: i.about_badge ?? '' },
    },

    vision: {
      en: {
        label: e.vision_label ?? '', title: e.vision_title ?? '',
        visionLabel: e.vision_vision_label ?? '', visionText: e.vision_vision_text ?? '',
        missionLabel: e.vision_mission_label ?? '',
        pillars: Array.from({ length: Number(s.vision_pillar_count ?? 4) }, (_, idx) => ({
          title: e[`vision_pillar_${idx}_title`] ?? '',
          body:  e[`vision_pillar_${idx}_body`]  ?? '',
        })),
      },
      id: {
        label: i.vision_label ?? '', title: i.vision_title ?? '',
        visionLabel: i.vision_vision_label ?? '', visionText: i.vision_vision_text ?? '',
        missionLabel: i.vision_mission_label ?? '',
        pillars: Array.from({ length: Number(s.vision_pillar_count ?? 4) }, (_, idx) => ({
          title: i[`vision_pillar_${idx}_title`] ?? '',
          body:  i[`vision_pillar_${idx}_body`]  ?? '',
        })),
      },
    },

    market: {
      en: {
        label: e.market_label ?? '', title: e.market_title ?? '',
        p1: e.market_p1 ?? '', p2: e.market_p2 ?? '', closing: e.market_closing ?? '',
        stats: Array.from({ length: Number(s.market_stat_count ?? 4) }, (_, idx) => ({
          number: e[`market_stat_${idx}_number`] ?? '',
          label:  e[`market_stat_${idx}_label`]  ?? '',
        })),
      },
      id: {
        label: i.market_label ?? '', title: i.market_title ?? '',
        p1: i.market_p1 ?? '', p2: i.market_p2 ?? '', closing: i.market_closing ?? '',
        stats: Array.from({ length: Number(s.market_stat_count ?? 4) }, (_, idx) => ({
          number: i[`market_stat_${idx}_number`] ?? '',
          label:  i[`market_stat_${idx}_label`]  ?? '',
        })),
      },
    },

    sederhana: {
      en: {
        label: e.sederhana_label ?? '', title: e.sederhana_title ?? '',
        subtitle: e.sederhana_subtitle ?? '', p1: e.sederhana_p1 ?? '',
        p2: e.sederhana_p2 ?? '', p3: e.sederhana_p3 ?? '', badge: e.sederhana_badge ?? '',
        timeline: Array.from({ length: Number(s.sederhana_timeline_count ?? 6) }, (_, idx) => ({
          date:  s[`sederhana_timeline_${idx}_date`]      ?? '',
          event: e[`sederhana_timeline_${idx}_event`]     ?? '',
        })),
        stats: Array.from({ length: Number(s.sederhana_stat_count ?? 4) }, (_, idx) => ({
          number: s[`sederhana_stat_${idx}_number`] ?? '',
          label:  e[`sederhana_stat_${idx}_label`]  ?? '',
        })),
      },
      id: {
        label: i.sederhana_label ?? '', title: i.sederhana_title ?? '',
        subtitle: i.sederhana_subtitle ?? '', p1: i.sederhana_p1 ?? '',
        p2: i.sederhana_p2 ?? '', p3: i.sederhana_p3 ?? '', badge: i.sederhana_badge ?? '',
        timeline: Array.from({ length: Number(s.sederhana_timeline_count ?? 6) }, (_, idx) => ({
          date:  s[`sederhana_timeline_${idx}_date`]  ?? '',
          event: i[`sederhana_timeline_${idx}_event`] ?? '',
        })),
        stats: Array.from({ length: Number(s.sederhana_stat_count ?? 4) }, (_, idx) => ({
          number: s[`sederhana_stat_${idx}_number`] ?? '',
          label:  i[`sederhana_stat_${idx}_label`]  ?? '',
        })),
      },
    },

    expansion: {
      en: {
        label: e.expansion_label ?? '', title: e.expansion_title ?? '', subtitle: e.expansion_subtitle ?? '',
        steps: Array.from({ length: Number(s.expansion_step_count ?? 4) }, (_, idx) => ({
          num:   s[`expansion_step_${idx}_num`]         ?? '',
          title: e[`expansion_step_${idx}_title`]       ?? '',
          body:  e[`expansion_step_${idx}_body`]        ?? '',
        })),
      },
      id: {
        label: i.expansion_label ?? '', title: i.expansion_title ?? '', subtitle: i.expansion_subtitle ?? '',
        steps: Array.from({ length: Number(s.expansion_step_count ?? 4) }, (_, idx) => ({
          num:   s[`expansion_step_${idx}_num`]   ?? '',
          title: i[`expansion_step_${idx}_title`] ?? '',
          body:  i[`expansion_step_${idx}_body`]  ?? '',
        })),
      },
    },

    whyGmv: {
      en: {
        label: e.whygmv_label ?? '', title: e.whygmv_title ?? '', subtitle: e.whygmv_subtitle ?? '',
        points: Array.from({ length: Number(s.whygmv_point_count ?? 5) }, (_, idx) => ({
          title: e[`whygmv_point_${idx}_title`] ?? '',
          body:  e[`whygmv_point_${idx}_body`]  ?? '',
        })),
      },
      id: {
        label: i.whygmv_label ?? '', title: i.whygmv_title ?? '', subtitle: i.whygmv_subtitle ?? '',
        points: Array.from({ length: Number(s.whygmv_point_count ?? 5) }, (_, idx) => ({
          title: i[`whygmv_point_${idx}_title`] ?? '',
          body:  i[`whygmv_point_${idx}_body`]  ?? '',
        })),
      },
    },

    footprint: {
      en: {
        label: e.footprint_label ?? '', title: e.footprint_title ?? '',
        subtitle: e.footprint_subtitle ?? '', closing: e.footprint_closing ?? '',
        locations: Array.from({ length: Number(s.footprint_location_count ?? 2) }, (_, idx) => ({
          country: e[`footprint_location_${idx}_country`] ?? '',
          city:    e[`footprint_location_${idx}_city`]    ?? '',
          status: 'active' as const,
        })),
      },
      id: {
        label: i.footprint_label ?? '', title: i.footprint_title ?? '',
        subtitle: i.footprint_subtitle ?? '', closing: i.footprint_closing ?? '',
        locations: Array.from({ length: Number(s.footprint_location_count ?? 2) }, (_, idx) => ({
          country: i[`footprint_location_${idx}_country`] ?? '',
          city:    i[`footprint_location_${idx}_city`]    ?? '',
          status: 'active' as const,
        })),
      },
    },

    team: {
      en: {
        label: e.team_label ?? '', title: e.team_title ?? '',
        members: Array.from({ length: Number(s.team_member_count ?? 4) }, (_, idx) => ({
          name:     s[`team_member_${idx}_name`]     ?? '',
          initials: s[`team_member_${idx}_initials`] ?? '',
          role:     e[`team_member_${idx}_role`]     ?? '',
          bio:      e[`team_member_${idx}_bio`]      ?? '',
        })),
      },
      id: {
        label: i.team_label ?? '', title: i.team_title ?? '',
        members: Array.from({ length: Number(s.team_member_count ?? 4) }, (_, idx) => ({
          name:     s[`team_member_${idx}_name`]     ?? '',
          initials: s[`team_member_${idx}_initials`] ?? '',
          role:     i[`team_member_${idx}_role`]     ?? '',
          bio:      i[`team_member_${idx}_bio`]      ?? '',
        })),
      },
    },

    press: {
      en: {
        label: e.press_label ?? '', title: e.press_title ?? '',
        items: Array.from({ length: Number(s.press_item_count ?? 4) }, (_, idx) => ({
          publication: s[`press_item_${idx}_publication`] ?? '',
          headline:    e[`press_item_${idx}_headline`]    ?? '',
          date:        e[`press_item_${idx}_date`]        ?? '',
        })),
      },
      id: {
        label: i.press_label ?? '', title: i.press_title ?? '',
        items: Array.from({ length: Number(s.press_item_count ?? 4) }, (_, idx) => ({
          publication: s[`press_item_${idx}_publication`] ?? '',
          headline:    i[`press_item_${idx}_headline`]    ?? '',
          date:        i[`press_item_${idx}_date`]        ?? '',
        })),
      },
    },

    contact: {
      en: {
        label: e.contact_label ?? '', title: e.contact_title ?? '',
        p1: e.contact_p1 ?? '', ctaButton: e.contact_cta_button ?? '',
        email: s.contact_email ?? '', phone: s.contact_phone ?? '',
        instagram: s.contact_instagram ?? '',
        offices: Array.from({ length: Number(s.contact_office_count ?? 1) }, (_, idx) => ({
          label:   e[`contact_office_${idx}_label`]   ?? '',
          city:    s[`contact_office_${idx}_city`]    ?? '',
          address: e[`contact_office_${idx}_address`] ?? '',
        })),
        fields: {
          name:    e.contact_field_name    ?? '',
          email:   e.contact_field_email   ?? '',
          org:     e.contact_field_org     ?? '',
          market:  e.contact_field_market  ?? '',
          message: e.contact_field_message ?? '',
          submit:  e.contact_field_submit  ?? '',
        },
      },
      id: {
        label: i.contact_label ?? '', title: i.contact_title ?? '',
        p1: i.contact_p1 ?? '', ctaButton: i.contact_cta_button ?? '',
        email: s.contact_email ?? '', phone: s.contact_phone ?? '',
        instagram: s.contact_instagram ?? '',
        offices: Array.from({ length: Number(s.contact_office_count ?? 1) }, (_, idx) => ({
          label:   i[`contact_office_${idx}_label`]   ?? '',
          city:    s[`contact_office_${idx}_city`]    ?? '',
          address: i[`contact_office_${idx}_address`] ?? '',
        })),
        fields: {
          name:    i.contact_field_name    ?? '',
          email:   i.contact_field_email   ?? '',
          org:     i.contact_field_org     ?? '',
          market:  i.contact_field_market  ?? '',
          message: i.contact_field_message ?? '',
          submit:  i.contact_field_submit  ?? '',
        },
      },
    },

    footer: {
      en: {
        copyright: e.footer_copyright ?? '',
        tagline:   e.footer_tagline   ?? '',
        navCols: [
          { heading: 'Navigate', links: ['About','Vision','Market','Sederhana','Expansion','Why GMV'] },
          { heading: 'Presence', links: ['Footprint','Press'] },
          { heading: 'Connect',  links: ['Contact','LinkedIn','Instagram','Twitter/X'] },
        ],
        legal: [e.footer_legal_0 ?? '', e.footer_legal_1 ?? ''],
      },
      id: {
        copyright: i.footer_copyright ?? '',
        tagline:   i.footer_tagline   ?? '',
        navCols: [
          { heading: 'Navigasi', links: ['Tentang','Visi','Pasar','Sederhana','Ekspansi','Mengapa GMV'] },
          { heading: 'Kehadiran', links: ['Jejak Global','Media'] },
          { heading: 'Terhubung', links: ['Kontak','LinkedIn','Instagram','Twitter/X'] },
        ],
        legal: [i.footer_legal_0 ?? '', i.footer_legal_1 ?? ''],
      },
    },
  }
}

// Build once at module load (server-side, build time)
export const content = buildContent()
