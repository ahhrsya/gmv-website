import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type Lang = 'en' | 'id'

// ─── Raw file reader ──────────────────────────────────────────────────────────

function readMd(filename: string) {
  const fullPath = path.join(process.cwd(), 'content', `${filename}.md`)
  const raw = fs.readFileSync(fullPath, 'utf8')
  const { data } = matter(raw)
  return {
    en: (data.en ?? {}) as Record<string, string>,
    id: (data.id ?? {}) as Record<string, string>,
    shared: (data.shared ?? {}) as Record<string, string | number>,
  }
}

// ─── Typed helpers ────────────────────────────────────────────────────────────

function str(
  block: Record<string, string>,
  key: string
): string {
  return block[key] ?? ''
}

function num(
  block: Record<string, string | number>,
  key: string
): number {
  return Number(block[key] ?? 0)
}

// ─── Main getter — called once per request with lang ─────────────────────────

export function getHomeContent(lang: Lang) {
  const { en, id, shared } = readMd('home')
  const t = lang === 'en' ? en : id

  return {
    hero: {
      label:         str(t, 'hero_label'),
      headline:      str(t, 'hero_headline'),
      subheadline:   str(t, 'hero_subheadline'),
      ctaPrimary:    str(t, 'hero_cta_primary'),
      ctaSecondary:  str(t, 'hero_cta_secondary'),
      scrollLabel:   str(t, 'hero_scroll_label'),
      videoSrc:      str(shared as Record<string, string>, 'hero_video_src'),
    },

    about: {
      label: str(t, 'about_label'),
      title: str(t, 'about_title'),
      p1:    str(t, 'about_p1'),
      p2:    str(t, 'about_p2'),
      badge: str(t, 'about_badge'),
    },

    vision: {
      label:        str(t, 'vision_label'),
      title:        str(t, 'vision_title'),
      visionLabel:  str(t, 'vision_vision_label'),
      visionText:   str(t, 'vision_vision_text'),
      missionLabel: str(t, 'vision_mission_label'),
      pillars: Array.from(
        { length: num(shared, 'vision_pillar_count') },
        (_, i) => ({
          title: str(t, `vision_pillar_${i}_title`),
          body:  str(t, `vision_pillar_${i}_body`),
        })
      ),
    },

    market: {
      label:   str(t, 'market_label'),
      title:   str(t, 'market_title'),
      p1:      str(t, 'market_p1'),
      p2:      str(t, 'market_p2'),
      closing: str(t, 'market_closing'),
      stats: Array.from(
        { length: num(shared, 'market_stat_count') },
        (_, i) => ({
          number: str(t, `market_stat_${i}_number`),
          label:  str(t, `market_stat_${i}_label`),
        })
      ),
    },

    sederhana: {
      label:    str(t, 'sederhana_label'),
      title:    str(t, 'sederhana_title'),
      subtitle: str(t, 'sederhana_subtitle'),
      p1:       str(t, 'sederhana_p1'),
      p2:       str(t, 'sederhana_p2'),
      p3:       str(t, 'sederhana_p3'),
      badge:    str(t, 'sederhana_badge'),
      imageSrc: str(shared as Record<string, string>, 'sederhana_image_src'),
      timeline: Array.from(
        { length: num(shared, 'sederhana_timeline_count') },
        (_, i) => ({
          date:  str(shared as Record<string, string>, `sederhana_timeline_${i}_date`),
          event: str(t, `sederhana_timeline_${i}_event`),
        })
      ),
      stats: Array.from(
        { length: num(shared, 'sederhana_stat_count') },
        (_, i) => ({
          number: str(shared as Record<string, string>, `sederhana_stat_${i}_number`),
          label:  str(t, `sederhana_stat_${i}_label`),
        })
      ),
    },

    expansion: {
      label:    str(t, 'expansion_label'),
      title:    str(t, 'expansion_title'),
      subtitle: str(t, 'expansion_subtitle'),
      steps: Array.from(
        { length: num(shared, 'expansion_step_count') },
        (_, i) => ({
          num:   str(shared as Record<string, string>, `expansion_step_${i}_num`),
          title: str(t, `expansion_step_${i}_title`),
          body:  str(t, `expansion_step_${i}_body`),
        })
      ),
    },

    whyGmv: {
      label:    str(t, 'whygmv_label'),
      title:    str(t, 'whygmv_title'),
      subtitle: str(t, 'whygmv_subtitle'),
      points: Array.from(
        { length: num(shared, 'whygmv_point_count') },
        (_, i) => ({
          title: str(t, `whygmv_point_${i}_title`),
          body:  str(t, `whygmv_point_${i}_body`),
        })
      ),
    },

    footprint: {
      label:    str(t, 'footprint_label'),
      title:    str(t, 'footprint_title'),
      subtitle: str(t, 'footprint_subtitle'),
      closing:  str(t, 'footprint_closing'),
      locations: Array.from(
        { length: num(shared, 'footprint_location_count') },
        (_, i) => ({
          country: str(t, `footprint_location_${i}_country`),
          city:    str(t, `footprint_location_${i}_city`),
          status:  'active' as const,
        })
      ),
    },

    team: {
      label: str(t, 'team_label'),
      title: str(t, 'team_title'),
      members: Array.from(
        { length: num(shared, 'team_member_count') },
        (_, i) => ({
          name:     str(shared as Record<string, string>, `team_member_${i}_name`),
          initials: str(shared as Record<string, string>, `team_member_${i}_initials`),
          role:     str(t, `team_member_${i}_role`),
          bio:      str(t, `team_member_${i}_bio`),
        })
      ),
    },

    press: {
      label: str(t, 'press_label'),
      title: str(t, 'press_title'),
      items: Array.from(
        { length: num(shared, 'press_item_count') },
        (_, i) => ({
          publication: str(shared as Record<string, string>, `press_item_${i}_publication`),
          url:         str(shared as Record<string, string>, `press_item_${i}_url`),
          headline:    str(t, `press_item_${i}_headline`),
          date:        str(t, `press_item_${i}_date`),
        })
      ),
    },

    contact: {
      label:     str(t, 'contact_label'),
      title:     str(t, 'contact_title'),
      p1:        str(t, 'contact_p1'),
      ctaButton: str(t, 'contact_cta_button'),
      email:     str(shared as Record<string, string>, 'contact_email'),
      phone:     str(shared as Record<string, string>, 'contact_phone'),
      instagram: str(shared as Record<string, string>, 'contact_instagram'),
      offices: Array.from(
        { length: num(shared, 'contact_office_count') },
        (_, i) => ({
          label:   str(t, `contact_office_${i}_label`),
          city:    str(shared as Record<string, string>, `contact_office_${i}_city`),
          address: str(t, `contact_office_${i}_address`),
        })
      ),
      fields: {
        name:    str(t, 'contact_field_name'),
        email:   str(t, 'contact_field_email'),
        org:     str(t, 'contact_field_org'),
        market:  str(t, 'contact_field_market'),
        message: str(t, 'contact_field_message'),
        submit:  str(t, 'contact_field_submit'),
      },
    },

    footer: {
      copyright: str(t, 'footer_copyright'),
      tagline:   str(t, 'footer_tagline'),
      legal: [
        str(t, 'footer_legal_0'),
        str(t, 'footer_legal_1'),
      ],
    },
  }
}

export function getNavContent(lang: Lang) {
  const { en, id, shared } = readMd('nav')
  const t = lang === 'en' ? en : id
  const count = num(shared, 'nav_count')

  return {
    items: Array.from({ length: count }, (_, i) => str(t, `nav_${i}`)),
    langToggle: str(shared as Record<string, string>, 'lang_toggle'),
  }
}
