'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Section field definitions ────────────────────────────────────────────────

type FieldDef = {
  key: string
  label: string
  type: 'text' | 'textarea' | 'url'
  block: 'en' | 'id' | 'shared' | 'bilingual'
}

type SectionDef = {
  label: string
  icon: string
  fields: FieldDef[]
}

const SECTIONS: Record<string, SectionDef> = {
  hero: {
    label: 'Hero',
    icon: '⬛',
    fields: [
      { key: 'hero_label',        label: 'Label',          type: 'text',     block: 'bilingual' },
      { key: 'hero_headline',     label: 'Headline',       type: 'textarea', block: 'bilingual' },
      { key: 'hero_subheadline',  label: 'Subheadline',    type: 'textarea', block: 'bilingual' },
      { key: 'hero_cta_primary',  label: 'CTA Primary',    type: 'text',     block: 'bilingual' },
      { key: 'hero_cta_secondary',label: 'CTA Secondary',  type: 'text',     block: 'bilingual' },
      { key: 'hero_scroll_label', label: 'Scroll Label',   type: 'text',     block: 'bilingual' },
      { key: 'hero_video_src',    label: 'Video URL',      type: 'url',      block: 'shared'    },
    ],
  },
  about: {
    label: 'About',
    icon: '◉',
    fields: [
      { key: 'about_label', label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'about_title', label: 'Title',         type: 'textarea', block: 'bilingual' },
      { key: 'about_p1',    label: 'Paragraph 1',   type: 'textarea', block: 'bilingual' },
      { key: 'about_p2',    label: 'Paragraph 2',   type: 'textarea', block: 'bilingual' },
      { key: 'about_badge', label: 'Badge',         type: 'text',     block: 'bilingual' },
    ],
  },
  vision: {
    label: 'Vision',
    icon: '◈',
    fields: [
      { key: 'vision_label',        label: 'Section Label',  type: 'text',     block: 'bilingual' },
      { key: 'vision_title',        label: 'Title',          type: 'text',     block: 'bilingual' },
      { key: 'vision_vision_label', label: 'Vision Label',   type: 'text',     block: 'bilingual' },
      { key: 'vision_vision_text',  label: 'Vision Text',    type: 'textarea', block: 'bilingual' },
      { key: 'vision_mission_label',label: 'Mission Label',  type: 'text',     block: 'bilingual' },
      { key: 'vision_pillar_0_title', label: 'Pillar 1 Title', type: 'text',     block: 'bilingual' },
      { key: 'vision_pillar_0_body',  label: 'Pillar 1 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'vision_pillar_1_title', label: 'Pillar 2 Title', type: 'text',     block: 'bilingual' },
      { key: 'vision_pillar_1_body',  label: 'Pillar 2 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'vision_pillar_2_title', label: 'Pillar 3 Title', type: 'text',     block: 'bilingual' },
      { key: 'vision_pillar_2_body',  label: 'Pillar 3 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'vision_pillar_3_title', label: 'Pillar 4 Title', type: 'text',     block: 'bilingual' },
      { key: 'vision_pillar_3_body',  label: 'Pillar 4 Body',  type: 'textarea', block: 'bilingual' },
    ],
  },
  market: {
    label: 'Market',
    icon: '◎',
    fields: [
      { key: 'market_label',   label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'market_title',   label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'market_p1',      label: 'Paragraph 1',   type: 'textarea', block: 'bilingual' },
      { key: 'market_p2',      label: 'Paragraph 2',   type: 'textarea', block: 'bilingual' },
      { key: 'market_closing', label: 'Closing',       type: 'textarea', block: 'bilingual' },
      { key: 'market_stat_0_number', label: 'Stat 1 Number', type: 'text', block: 'bilingual' },
      { key: 'market_stat_0_label',  label: 'Stat 1 Label',  type: 'text', block: 'bilingual' },
      { key: 'market_stat_1_number', label: 'Stat 2 Number', type: 'text', block: 'bilingual' },
      { key: 'market_stat_1_label',  label: 'Stat 2 Label',  type: 'text', block: 'bilingual' },
      { key: 'market_stat_2_number', label: 'Stat 3 Number', type: 'text', block: 'bilingual' },
      { key: 'market_stat_2_label',  label: 'Stat 3 Label',  type: 'text', block: 'bilingual' },
      { key: 'market_stat_3_number', label: 'Stat 4 Number', type: 'text', block: 'bilingual' },
      { key: 'market_stat_3_label',  label: 'Stat 4 Label',  type: 'text', block: 'bilingual' },
    ],
  },
  sederhana: {
    label: 'Sederhana',
    icon: '⬡',
    fields: [
      { key: 'sederhana_label',    label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'sederhana_title',    label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'sederhana_subtitle', label: 'Subtitle',      type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p1',       label: 'Paragraph 1',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p2',       label: 'Paragraph 2',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p3',       label: 'Paragraph 3',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_badge',    label: 'Badge',         type: 'text',     block: 'bilingual' },
      { key: 'sederhana_image_src',label: 'Image URL',     type: 'url',      block: 'shared'    },
      { key: 'sederhana_timeline_0_event', label: 'Timeline 1972', type: 'text', block: 'bilingual' },
      { key: 'sederhana_timeline_1_event', label: 'Timeline 1975', type: 'text', block: 'bilingual' },
      { key: 'sederhana_timeline_2_event', label: 'Timeline 1998', type: 'text', block: 'bilingual' },
      { key: 'sederhana_timeline_3_event', label: 'Timeline 2000', type: 'text', block: 'bilingual' },
      { key: 'sederhana_timeline_4_event', label: 'Timeline 2017', type: 'text', block: 'bilingual' },
      { key: 'sederhana_timeline_5_event', label: 'Timeline 2026', type: 'text', block: 'bilingual' },
    ],
  },
  expansion: {
    label: 'Expansion',
    icon: '◆',
    fields: [
      { key: 'expansion_label',    label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'expansion_title',    label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'expansion_subtitle', label: 'Subtitle',      type: 'textarea', block: 'bilingual' },
      { key: 'expansion_step_0_title', label: 'Step 1 Title', type: 'text',     block: 'bilingual' },
      { key: 'expansion_step_0_body',  label: 'Step 1 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'expansion_step_1_title', label: 'Step 2 Title', type: 'text',     block: 'bilingual' },
      { key: 'expansion_step_1_body',  label: 'Step 2 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'expansion_step_2_title', label: 'Step 3 Title', type: 'text',     block: 'bilingual' },
      { key: 'expansion_step_2_body',  label: 'Step 3 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'expansion_step_3_title', label: 'Step 4 Title', type: 'text',     block: 'bilingual' },
      { key: 'expansion_step_3_body',  label: 'Step 4 Body',  type: 'textarea', block: 'bilingual' },
    ],
  },
  whygmv: {
    label: 'Why GMV',
    icon: '★',
    fields: [
      { key: 'whygmv_label',    label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_title',    label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'whygmv_subtitle', label: 'Subtitle',      type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_0_title', label: 'Point 1 Title', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_0_body',  label: 'Point 1 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'whygmv_point_1_title', label: 'Point 2 Title', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_1_body',  label: 'Point 2 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'whygmv_point_2_title', label: 'Point 3 Title', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_2_body',  label: 'Point 3 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'whygmv_point_3_title', label: 'Point 4 Title', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_3_body',  label: 'Point 4 Body',  type: 'textarea', block: 'bilingual' },
      { key: 'whygmv_point_4_title', label: 'Point 5 Title', type: 'text',     block: 'bilingual' },
      { key: 'whygmv_point_4_body',  label: 'Point 5 Body',  type: 'textarea', block: 'bilingual' },
    ],
  },
  footprint: {
    label: 'Footprint',
    icon: '⊕',
    fields: [
      { key: 'footprint_label',    label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'footprint_title',    label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'footprint_subtitle', label: 'Subtitle',      type: 'text',     block: 'bilingual' },
      { key: 'footprint_closing',  label: 'Closing',       type: 'textarea', block: 'bilingual' },
      { key: 'footprint_location_0_country', label: 'Location 1 Country', type: 'text', block: 'bilingual' },
      { key: 'footprint_location_0_city',    label: 'Location 1 Status',  type: 'text', block: 'bilingual' },
      { key: 'footprint_location_1_country', label: 'Location 2 Country', type: 'text', block: 'bilingual' },
      { key: 'footprint_location_1_city',    label: 'Location 2 Status',  type: 'text', block: 'bilingual' },
    ],
  },
  team: {
    label: 'Team',
    icon: '◐',
    fields: [
      { key: 'team_label', label: 'Section Label', type: 'text', block: 'bilingual' },
      { key: 'team_title', label: 'Title',         type: 'text', block: 'bilingual' },
      { key: 'team_member_0_name', label: 'Member 1 Name', type: 'text', block: 'shared' },
      { key: 'team_member_0_role', label: 'Member 1 Role', type: 'text', block: 'bilingual' },
      { key: 'team_member_0_bio',  label: 'Member 1 Bio',  type: 'textarea', block: 'bilingual' },
      { key: 'team_member_1_name', label: 'Member 2 Name', type: 'text', block: 'shared' },
      { key: 'team_member_1_role', label: 'Member 2 Role', type: 'text', block: 'bilingual' },
      { key: 'team_member_1_bio',  label: 'Member 2 Bio',  type: 'textarea', block: 'bilingual' },
      { key: 'team_member_2_name', label: 'Member 3 Name', type: 'text', block: 'shared' },
      { key: 'team_member_2_role', label: 'Member 3 Role', type: 'text', block: 'bilingual' },
      { key: 'team_member_2_bio',  label: 'Member 3 Bio',  type: 'textarea', block: 'bilingual' },
      { key: 'team_member_3_name', label: 'Member 4 Name', type: 'text', block: 'shared' },
      { key: 'team_member_3_role', label: 'Member 4 Role', type: 'text', block: 'bilingual' },
      { key: 'team_member_3_bio',  label: 'Member 4 Bio',  type: 'textarea', block: 'bilingual' },
    ],
  },
  press: {
    label: 'Press',
    icon: '⬤',
    fields: [
      { key: 'press_label', label: 'Section Label', type: 'text', block: 'bilingual' },
      { key: 'press_title', label: 'Title',         type: 'text', block: 'bilingual' },
      { key: 'press_item_0_publication', label: 'Article 1 Publication', type: 'text',     block: 'shared' },
      { key: 'press_item_0_headline',    label: 'Article 1 Headline',    type: 'textarea', block: 'bilingual' },
      { key: 'press_item_0_date',        label: 'Article 1 Date',        type: 'text',     block: 'bilingual' },
      { key: 'press_item_0_url',         label: 'Article 1 URL',         type: 'url',      block: 'shared' },
      { key: 'press_item_1_publication', label: 'Article 2 Publication', type: 'text',     block: 'shared' },
      { key: 'press_item_1_headline',    label: 'Article 2 Headline',    type: 'textarea', block: 'bilingual' },
      { key: 'press_item_1_date',        label: 'Article 2 Date',        type: 'text',     block: 'bilingual' },
      { key: 'press_item_1_url',         label: 'Article 2 URL',         type: 'url',      block: 'shared' },
      { key: 'press_item_2_publication', label: 'Article 3 Publication', type: 'text',     block: 'shared' },
      { key: 'press_item_2_headline',    label: 'Article 3 Headline',    type: 'textarea', block: 'bilingual' },
      { key: 'press_item_2_date',        label: 'Article 3 Date',        type: 'text',     block: 'bilingual' },
      { key: 'press_item_2_url',         label: 'Article 3 URL',         type: 'url',      block: 'shared' },
      { key: 'press_item_3_publication', label: 'Article 4 Publication', type: 'text',     block: 'shared' },
      { key: 'press_item_3_headline',    label: 'Article 4 Headline',    type: 'textarea', block: 'bilingual' },
      { key: 'press_item_3_date',        label: 'Article 4 Date',        type: 'text',     block: 'bilingual' },
      { key: 'press_item_3_url',         label: 'Article 4 URL',         type: 'url',      block: 'shared' },
    ],
  },
  contact: {
    label: 'Contact',
    icon: '✉',
    fields: [
      { key: 'contact_label',     label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'contact_title',     label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'contact_p1',        label: 'Description',   type: 'textarea', block: 'bilingual' },
      { key: 'contact_cta_button',label: 'CTA Button',    type: 'text',     block: 'bilingual' },
      { key: 'contact_email',     label: 'Email',         type: 'text',     block: 'shared' },
      { key: 'contact_phone',     label: 'Phone',         type: 'text',     block: 'shared' },
      { key: 'contact_instagram', label: 'Instagram',     type: 'text',     block: 'shared' },
    ],
  },
  footer: {
    label: 'Footer',
    icon: '▬',
    fields: [
      { key: 'footer_copyright', label: 'Copyright', type: 'text', block: 'bilingual' },
      { key: 'footer_tagline',   label: 'Tagline',   type: 'text', block: 'bilingual' },
      { key: 'footer_legal_0',   label: 'Legal Link 1', type: 'text', block: 'bilingual' },
      { key: 'footer_legal_1',   label: 'Legal Link 2', type: 'text', block: 'bilingual' },
    ],
  },
}

const SECTION_KEYS = Object.keys(SECTIONS)

type BlockData = {
  en: Record<string, string>
  id: Record<string, string>
  shared: Record<string, string>
}

export default function AdminPanel() {
  const [activeSection, setActiveSection] = useState('hero')
  const [data, setData] = useState<BlockData>({ en: {}, id: {}, shared: {} })
  const [original, setOriginal] = useState<BlockData>({ en: {}, id: {}, shared: {} })
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [hasChanges, setHasChanges] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const loadData = useCallback(async () => {
    setStatus('loading')
    setHasChanges(false)
    try {
      const res = await fetch('/api/get-content?file=home')
      if (!res.ok) throw new Error('Failed to load')
      const json = await res.json()
      const loaded = {
        en:     json.en     ?? {},
        id:     json.id     ?? {},
        shared: json.shared ?? {},
      }
      setData(loaded)
      setOriginal(JSON.parse(JSON.stringify(loaded)))
      setStatus('idle')
    } catch {
      setStatus('error')
      setErrorMsg('Gagal memuat konten.')
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleChange = (block: 'en' | 'id' | 'shared', key: string, value: string) => {
    setData(prev => {
      const next = { ...prev, [block]: { ...prev[block], [key]: value } }
      const changed = JSON.stringify(next) !== JSON.stringify(original)
      setHasChanges(changed)
      return next
    })
  }

  const handleSave = async () => {
    setStatus('saving')
    setErrorMsg('')
    try {
      const res = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_CMS_SECRET ?? ''}`,
        },
        body: JSON.stringify({ file: 'home', ...data }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Save failed')
      }
      setOriginal(JSON.parse(JSON.stringify(data)))
      setHasChanges(false)
      setStatus('saved')
      setTimeout(() => setStatus('idle'), 4000)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e instanceof Error ? e.message : 'Unknown error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const def = SECTIONS[activeSection]
  const uniqueBilingualKeys = [...new Set(
    def.fields.filter(f => f.block === 'bilingual').map(f => f.key)
  )]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0c0c0c;
          --surface: #141414;
          --surface-2: #1a1a1a;
          --border: rgba(255,255,255,0.07);
          --border-hi: rgba(255,255,255,0.16);
          --text: #efefef;
          --muted: rgba(255,255,255,0.38);
          --dim: rgba(255,255,255,0.18);
          --gold: #c9a96e;
          --gold-bg: rgba(201,169,110,0.1);
          --gold-border: rgba(201,169,110,0.28);
          --en: #6eafc9;
          --en-bg: rgba(110,175,201,0.08);
          --en-border: rgba(110,175,201,0.22);
          --id: #c96ea0;
          --id-bg: rgba(201,110,160,0.08);
          --id-border: rgba(201,110,160,0.22);
          --green: #6ec98c;
          --red: #c96e6e;
          --sidebar: 216px;
          --topbar: 54px;
          --r: 5px;
          --font: 'Syne', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }
        html, body { height: 100%; background: var(--bg); color: var(--text); font-family: var(--font); }
        .root { display: grid; grid-template-columns: var(--sidebar) 1fr; grid-template-rows: var(--topbar) 1fr; height: 100vh; overflow: hidden; }

        /* topbar */
        .topbar { grid-column: 1/-1; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--border); background: var(--surface); gap: 12px; }
        .brand { display: flex; align-items: center; gap: 9px; }
        .brand-mark { width: 26px; height: 26px; background: var(--gold); border-radius: 4px; display: grid; place-items: center; font-size: 12px; font-weight: 800; color: #000; }
        .brand-name { font-size: 13px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; }
        .brand-sub { font-size: 10px; color: var(--dim); font-family: var(--mono); }
        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .changes-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: pulse 1.8s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.25} }
        .save-btn { display: flex; align-items: center; gap: 6px; padding: 6px 16px; background: var(--gold); color: #000; border: none; border-radius: var(--r); font-family: var(--font); font-size: 12px; font-weight: 700; letter-spacing: .05em; cursor: pointer; transition: .15s; white-space: nowrap; }
        .save-btn:hover:not(:disabled) { opacity: .88; transform: translateY(-1px); }
        .save-btn:disabled { opacity: .4; cursor: not-allowed; }
        .save-btn.saved { background: var(--green); }
        .save-btn.error { background: var(--red); color: #fff; }
        .hamburger { display: none; background: none; border: 1px solid var(--border); border-radius: var(--r); padding: 5px 8px; color: var(--muted); cursor: pointer; font-size: 14px; }

        /* sidebar */
        .sidebar { border-right: 1px solid var(--border); background: var(--surface); overflow-y: auto; padding: 6px 0; }
        .sidebar::-webkit-scrollbar { width: 3px; }
        .sidebar::-webkit-scrollbar-thumb { background: var(--border); }
        .sidebar-group { font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); font-family: var(--mono); padding: 14px 14px 5px; }
        .nav-item { display: flex; align-items: center; gap: 9px; padding: 8px 14px; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--muted); border-left: 2px solid transparent; transition: .12s; letter-spacing: .02em; }
        .nav-item:hover { background: var(--surface-2); color: var(--text); }
        .nav-item.active { background: var(--gold-bg); border-left-color: var(--gold); color: var(--gold); }
        .nav-icon { font-size: 11px; width: 16px; text-align: center; opacity: .7; flex-shrink: 0; }

        /* main */
        .main { overflow-y: auto; padding: 24px 28px 48px; background: var(--bg); }
        .main::-webkit-scrollbar { width: 5px; }
        .main::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .sec-header { display: flex; align-items: baseline; gap: 10px; margin-bottom: 22px; padding-bottom: 18px; border-bottom: 1px solid var(--border); flex-wrap: wrap; }
        .sec-title { font-size: 20px; font-weight: 800; letter-spacing: -.02em; }
        .file-chip { font-size: 10px; font-family: var(--mono); color: var(--dim); background: var(--surface-2); padding: 2px 7px; border-radius: 3px; border: 1px solid var(--border); }

        .status-bar { display: flex; align-items: center; gap: 7px; padding: 9px 13px; border-radius: var(--r); font-size: 11px; font-family: var(--mono); margin-bottom: 20px; border: 1px solid var(--border); color: var(--muted); }
        .status-bar.saved { background: rgba(110,201,140,.08); border-color: rgba(110,201,140,.2); color: var(--green); }
        .status-bar.error { background: rgba(201,110,110,.08); border-color: rgba(201,110,110,.2); color: var(--red); }
        .s-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; flex-shrink: 0; }

        /* loading */
        .loading-wrap { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; gap: 14px; color: var(--muted); }
        .spinner { width: 22px; height: 22px; border: 2px solid var(--border); border-top-color: var(--gold); border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .load-txt { font-size: 11px; font-family: var(--mono); letter-spacing: .06em; }

        /* fields */
        .fields { display: flex; flex-direction: column; gap: 16px; }
        .bilingual-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .field-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 14px; transition: border-color .15s; }
        .field-card:focus-within { border-color: var(--border-hi); }
        .field-card.en:focus-within { border-color: var(--en-border); }
        .field-card.id:focus-within { border-color: var(--id-border); }
        .field-card.shared:focus-within { border-color: var(--gold-border); }
        .field-label { display: flex; align-items: center; gap: 6px; margin-bottom: 7px; }
        .field-label-text { font-size: 10px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
        .badge { font-size: 8px; font-weight: 700; font-family: var(--mono); letter-spacing: .08em; padding: 1px 5px; border-radius: 3px; text-transform: uppercase; }
        .badge.en { background: var(--en-bg); color: var(--en); border: 1px solid var(--en-border); }
        .badge.id { background: var(--id-bg); color: var(--id); border: 1px solid var(--id-border); }
        .badge.shared { background: var(--gold-bg); color: var(--gold); border: 1px solid var(--gold-border); }
        .field-input, .field-textarea { width: 100%; background: transparent; border: none; outline: none; color: var(--text); font-family: var(--font); font-size: 13px; line-height: 1.6; resize: vertical; }
        .field-input::placeholder, .field-textarea::placeholder { color: var(--dim); }
        .field-textarea { min-height: 72px; }

        .array-divider { font-size: 9px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); font-family: var(--mono); margin-top: 24px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
        .array-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* mobile */
        @media (max-width: 700px) {
          .root { grid-template-columns: 1fr; }
          .sidebar { display: none; position: fixed; top: var(--topbar); left: 0; width: var(--sidebar); height: calc(100vh - var(--topbar)); z-index: 100; border-right: 1px solid var(--border-hi); box-shadow: 4px 0 24px rgba(0,0,0,.5); }
          .sidebar.open { display: block; }
          .hamburger { display: block; }
          .bilingual-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="root">
        {/* Topbar */}
        <div className="topbar">
          <div className="brand">
            <button className="hamburger" onClick={() => setSidebarOpen(o => !o)}>☰</button>
            <div className="brand-mark">G</div>
            <span className="brand-name">GMV</span>
            <span className="brand-sub">CMS</span>
          </div>
          <div className="topbar-right">
            {hasChanges && <div className="changes-dot" title="Ada perubahan belum dipublish" />}
            <button
              className={`save-btn ${status === 'saved' ? 'saved' : status === 'error' ? 'error' : ''}`}
              onClick={handleSave}
              disabled={!hasChanges || status === 'saving' || status === 'loading'}
            >
              {status === 'saving' && '⟳ Menyimpan...'}
              {status === 'saved'  && '✓ Published'}
              {status === 'error'  && '✕ Gagal'}
              {(status === 'idle' || status === 'loading') && '↑ Publish'}
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)}>
          <div className="sidebar-group">Sections</div>
          {SECTION_KEYS.map(key => (
            <div
              key={key}
              className={`nav-item ${activeSection === key ? 'active' : ''}`}
              onClick={e => { e.stopPropagation(); setActiveSection(key); setSidebarOpen(false); }}
            >
              <span className="nav-icon">{SECTIONS[key].icon}</span>
              {SECTIONS[key].label}
            </div>
          ))}
        </nav>

        {/* Main */}
        <main className="main">
          <div className="sec-header">
            <h1 className="sec-title">{def.label}</h1>
            <span className="file-chip">home.md → {activeSection}</span>
          </div>

          {status === 'saved' && (
            <div className="status-bar saved"><div className="s-dot"/>Berhasil dipublish. Vercel rebuild otomatis (~60 detik).</div>
          )}
          {status === 'error' && errorMsg && (
            <div className="status-bar error"><div className="s-dot"/>{errorMsg}</div>
          )}
          {status === 'loading' && (
            <div className="status-bar"><div className="s-dot"/>Memuat konten dari home.md...</div>
          )}

          {status === 'loading' ? (
            <div className="loading-wrap">
              <div className="spinner"/>
              <span className="load-txt">reading home.md</span>
            </div>
          ) : (
            <div className="fields">
              {/* Shared fields */}
              {def.fields.filter(f => f.block === 'shared').map(field => (
                <div key={field.key} className="field-card shared">
                  <div className="field-label">
                    <span className="field-label-text">{field.label}</span>
                    <span className="badge shared">shared</span>
                  </div>
                  {field.type === 'textarea' ? (
                    <textarea className="field-textarea" value={data.shared[field.key] ?? ''} onChange={e => handleChange('shared', field.key, e.target.value)} placeholder={`Enter ${field.label}...`} rows={3}/>
                  ) : (
                    <input className="field-input" type={field.type} value={data.shared[field.key] ?? ''} onChange={e => handleChange('shared', field.key, e.target.value)} placeholder={`Enter ${field.label}...`}/>
                  )}
                </div>
              ))}

              {/* Bilingual fields — EN + ID side by side */}
              {uniqueBilingualKeys.map(key => {
                const field = def.fields.find(f => f.key === key)!
                const isLong = field.type === 'textarea' && (key.includes('body') || key.includes('p1') || key.includes('p2') || key.includes('p3') || key.includes('subheadline') || key.includes('closing') || key.includes('subtitle'))
                return (
                  <div key={key} className="bilingual-row">
                    <div className="field-card en">
                      <div className="field-label">
                        <span className="field-label-text">{field.label}</span>
                        <span className="badge en">EN</span>
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea className="field-textarea" value={data.en[key] ?? ''} onChange={e => handleChange('en', key, e.target.value)} placeholder="English..." rows={isLong ? 5 : 2}/>
                      ) : (
                        <input className="field-input" type="text" value={data.en[key] ?? ''} onChange={e => handleChange('en', key, e.target.value)} placeholder="English..."/>
                      )}
                    </div>
                    <div className="field-card id">
                      <div className="field-label">
                        <span className="field-label-text">{field.label}</span>
                        <span className="badge id">ID</span>
                      </div>
                      {field.type === 'textarea' ? (
                        <textarea className="field-textarea" value={data.id[key] ?? ''} onChange={e => handleChange('id', key, e.target.value)} placeholder="Bahasa Indonesia..." rows={isLong ? 5 : 2}/>
                      ) : (
                        <input className="field-input" type="text" value={data.id[key] ?? ''} onChange={e => handleChange('id', key, e.target.value)} placeholder="Bahasa Indonesia..."/>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}
