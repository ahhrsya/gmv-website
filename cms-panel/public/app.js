// ─── Config ────────────────────────────────────────────────────────────────────

const CONFIG = {
  owner: 'ahhrsya',
  repo: 'gmv-website',
  branch: 'main',
  file: 'content/home.md',
};

// ─── Section field definitions ───────────────────────────────────────────────

const SECTIONS = {
  hero: {
    label: 'Hero',
    icon: '⬛',
    fields: [
      { key: 'hero_label',         label: 'Label',           type: 'text',     block: 'bilingual' },
      { key: 'hero_headline',      label: 'Headline',        type: 'textarea', block: 'bilingual' },
      { key: 'hero_subheadline',   label: 'Subheadline',     type: 'textarea', block: 'bilingual' },
      { key: 'hero_cta_primary',   label: 'CTA Primary',     type: 'text',     block: 'bilingual' },
      { key: 'hero_cta_secondary', label: 'CTA Secondary',   type: 'text',     block: 'bilingual' },
      { key: 'hero_scroll_label',  label: 'Scroll Label',    type: 'text',     block: 'bilingual' },
      { key: 'hero_video_src',     label: 'Video URL',       type: 'url',      block: 'shared'    },
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
      { key: 'vision_label',         label: 'Section Label',  type: 'text',     block: 'bilingual' },
      { key: 'vision_title',         label: 'Title',          type: 'text',     block: 'bilingual' },
      { key: 'vision_vision_label',  label: 'Vision Label',   type: 'text',     block: 'bilingual' },
      { key: 'vision_vision_text',   label: 'Vision Text',    type: 'textarea', block: 'bilingual' },
      { key: 'vision_mission_label', label: 'Mission Label',  type: 'text',     block: 'bilingual' },
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
      { key: 'sederhana_label',     label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'sederhana_title',     label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'sederhana_subtitle',  label: 'Subtitle',      type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p1',        label: 'Paragraph 1',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p2',        label: 'Paragraph 2',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_p3',        label: 'Paragraph 3',   type: 'textarea', block: 'bilingual' },
      { key: 'sederhana_badge',     label: 'Badge',         type: 'text',     block: 'bilingual' },
      { key: 'sederhana_image_src', label: 'Image URL',     type: 'url',      block: 'shared'    },
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
      { key: 'contact_label',      label: 'Section Label', type: 'text',     block: 'bilingual' },
      { key: 'contact_title',      label: 'Title',         type: 'text',     block: 'bilingual' },
      { key: 'contact_p1',         label: 'Description',   type: 'textarea', block: 'bilingual' },
      { key: 'contact_cta_button', label: 'CTA Button',    type: 'text',     block: 'bilingual' },
      { key: 'contact_email',      label: 'Email',         type: 'text',     block: 'shared' },
      { key: 'contact_phone',      label: 'Phone',         type: 'text',     block: 'shared' },
      { key: 'contact_instagram',  label: 'Instagram',     type: 'text',     block: 'shared' },
    ],
  },
  footer: {
    label: 'Footer',
    icon: '',
    fields: [
      { key: 'footer_copyright', label: 'Copyright', type: 'text', block: 'bilingual' },
      { key: 'footer_tagline',   label: 'Tagline',   type: 'text', block: 'bilingual' },
      { key: 'footer_legal_0',   label: 'Legal Link 1', type: 'text', block: 'bilingual' },
      { key: 'footer_legal_1',   label: 'Legal Link 2', type: 'text', block: 'bilingual' },
    ],
  },
};

const SECTION_KEYS = Object.keys(SECTIONS);

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  activeSection: 'hero',
  data: { en: {}, id: {}, shared: {} },
  original: { en: {}, id: {}, shared: {} },
  status: 'idle',
  errorMsg: '',
  hasChanges: false,
  sidebarOpen: false,
  sha: null, // GitHub file SHA (needed for updates)
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function $(sel, root = document) { return root.querySelector(sel); }
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v != null) el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function recomputeHasChanges() { state.hasChanges = !deepEqual(state.data, state.original); }

// ─── Token management ─────────────────────────────────────────────────────────

function getToken() {
  return localStorage.getItem('gmv_pat') || '';
}
function setToken(t) {
  if (t) localStorage.setItem('gmv_pat', t);
  else localStorage.removeItem('gmv_pat');
}

// ─── GitHub API ──────────────────────────────────────────────────────────────

const ghHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
});

// Parse frontmatter from MD
function parseFrontmatter(md) {
  const result = { en: {}, id: {}, shared: {} };
  if (!md.startsWith('---')) return result;
  const end = md.indexOf('\n---', 3);
  if (end === -1) return result;
  const yaml = md.slice(3, end).trim();
  // very simple parser for nested en/id/shared
  const lines = yaml.split('\n');
  let current = null, currentObj = null;
  for (const line of lines) {
    const top = line.match(/^([a-z_]+):\s*$/);
    if (top) {
      current = top[1];
      if (!result[current]) result[current] = {};
      currentObj = result[current];
      continue;
    }
    const kv = line.match(/^  ([a-z0-9_]+):\s*(.*)$/);
    if (kv && currentObj) {
      let v = kv[2].replace(/^["']|["']$/g, '').trim();
      currentObj[kv[1]] = v;
    }
  }
  return result;
}

// Serialize frontmatter back to MD
function serializeFrontmatter(data) {
  let out = '---\n';
  for (const block of ['shared', 'en', 'id']) {
    out += `${block}:\n`;
    const obj = data[block] || {};
    const keys = Object.keys(obj);
    if (keys.length === 0) {
      out += `  {}\n`;
    } else {
      for (const k of keys) {
        let v = obj[k] ?? '';
        // Quote if contains special chars
        if (v.includes(':') || v.includes('#') || v.includes('"') || v.includes("'") || v.includes('\n')) {
          v = '"' + v.replace(/"/g, '\\"') + '"';
        }
        out += `  ${k}: ${v}\n`;
      }
    }
  }
  out += '---';
  return out;
}

async function loadContent() {
  state.status = 'loading';
  state.hasChanges = false;
  render();
  const token = getToken();
  if (!token) {
    state.status = 'error';
    state.errorMsg = 'Token belum di-set. Isi GitHub PAT di pojok kanan atas.';
    render();
    return;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.file}?ref=${CONFIG.branch}`, {
      headers: ghHeaders(token),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    state.sha = json.sha;
    const md = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
    const parsed = parseFrontmatter(md);
    state.data = {
      en:     parsed.en     ?? {},
      id:     parsed.id     ?? {},
      shared: parsed.shared ?? {},
    };
    state.original = JSON.parse(JSON.stringify(state.data));
    state.status = 'idle';
    state.errorMsg = '';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat: ${e.message}`;
  }
  render();
}

async function saveContent() {
  state.status = 'saving';
  state.errorMsg = '';
  render();
  const token = getToken();
  if (!token) {
    state.status = 'error';
    state.errorMsg = 'Token belum di-set.';
    render();
    return;
  }
  try {
    const md = serializeFrontmatter(state.data);
    const body = {
      message: 'cms: update home.md',
      content: btoa(unescape(encodeURIComponent(md))),
      branch: CONFIG.branch,
      sha: state.sha,
    };
    const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${CONFIG.file}`, {
      method: 'PUT',
      headers: { ...ghHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${res.status}`);
    }
    const json = await res.json();
    state.sha = json.content.sha;
    state.original = JSON.parse(JSON.stringify(state.data));
    state.hasChanges = false;
    state.status = 'saved';
    setTimeout(() => { state.status = 'idle'; render(); }, 5000);
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal publish: ${e.message}`;
    setTimeout(() => { state.status = 'idle'; render(); }, 5000);
  }
  render();
}

// ─── Render ──────────────────────────────────────────────────────────────────

function render() {
  const root = $('#root');
  root.innerHTML = '';

  const def = SECTIONS[state.activeSection];
  const uniqueBilingualKeys = [...new Set(
    def.fields.filter(f => f.block === 'bilingual').map(f => f.key)
  )];

  // Topbar
  const topbar = h('div', { class: 'topbar' },
    h('div', { class: 'brand' },
      h('button', {
        class: 'hamburger',
        onclick: () => { state.sidebarOpen = !state.sidebarOpen; render(); }
      }, '☰'),
      h('div', { class: 'brand-mark' }, 'G'),
      h('span', { class: 'brand-name' }, 'GMV'),
      h('span', { class: 'brand-sub' }, 'CMS')
    ),
    h('div', { class: 'topbar-right' },
      // Token input
      h('div', { class: 'token-wrap' },
        h('input', {
          type: 'password',
          class: 'token-input',
          placeholder: 'GitHub PAT',
          value: getToken(),
          oninput: (e) => setToken(e.target.value),
        })
      ),
      state.hasChanges ? h('div', { class: 'changes-dot', title: 'Ada perubahan belum dipublish' }) : null,
      h('button', {
        class: `save-btn ${state.status === 'saved' ? 'saved' : state.status === 'error' ? 'error' : ''}`,
        onclick: saveContent,
        disabled: !state.hasChanges || state.status === 'saving' || state.status === 'loading' || !getToken(),
      },
        state.status === 'saving' && '⟳ Publishing...',
        state.status === 'saved'  && '✓ Published',
        state.status === 'error'  && '✕ Gagal',
        (state.status === 'idle' || state.status === 'loading') && '↑ Publish'
      )
    )
  );

  // Sidebar
  const sidebar = h('nav', {
    class: `sidebar ${state.sidebarOpen ? 'open' : ''}`,
    onclick: () => { state.sidebarOpen = false; render(); }
  },
    h('div', { class: 'sidebar-group' }, 'Sections'),
    ...SECTION_KEYS.map(key =>
      h('div', {
        key,
        class: `nav-item ${state.activeSection === key ? 'active' : ''}`,
        onclick: (e) => { e.stopPropagation(); state.activeSection = key; state.sidebarOpen = false; render(); }
      },
        h('span', { class: 'nav-icon' }, SECTIONS[key].icon),
        SECTIONS[key].label
      )
    )
  );

  // Main
  const main = h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, def.label),
      h('span', { class: 'file-chip' }, `${CONFIG.file} → ${state.activeSection}`)
    ),
    state.status === 'saved' && h('div', { class: 'status-bar saved' },
      h('div', { class: 's-dot' }),
      'Berhasil dipublish. GitHub webhook akan trigger Vercel redeploy (~60 detik).'
    ),
    state.status === 'error' && state.errorMsg && h('div', { class: 'status-bar error' },
      h('div', { class: 's-dot' }),
      state.errorMsg
    ),
    state.status === 'loading' && h('div', { class: 'status-bar' },
      h('div', { class: 's-dot' }),
      'Memuat konten dari GitHub...'
    ),
    state.status === 'loading'
      ? h('div', { class: 'loading-wrap' },
          h('div', { class: 'spinner' }),
          h('span', { class: 'load-txt' }, `reading ${CONFIG.file}`)
        )
      : h('div', { class: 'fields' },
          // Shared fields
          ...def.fields.filter(f => f.block === 'shared').map(field => {
            const input = field.type === 'textarea'
              ? h('textarea', {
                  class: 'field-textarea',
                  rows: 3,
                  placeholder: `Enter ${field.label}...`,
                  oninput: (e) => handleChange('shared', field.key, e.target.value),
                })
              : h('input', {
                  class: 'field-input',
                  type: field.type,
                  placeholder: `Enter ${field.label}...`,
                  oninput: (e) => handleChange('shared', field.key, e.target.value),
                });
            input.value = state.data.shared[field.key] ?? '';
            return h('div', { class: 'field-card shared' },
              h('div', { class: 'field-label' },
                h('span', { class: 'field-label-text' }, field.label),
                h('span', { class: 'badge shared' }, 'shared')
              ),
              input
            );
          }),
          // Bilingual fields — EN + ID
          ...uniqueBilingualKeys.map(key => {
            const field = def.fields.find(f => f.key === key);
            const isLong = field.type === 'textarea' && (
              key.includes('body') || key.includes('p1') || key.includes('p2') ||
              key.includes('p3') || key.includes('subheadline') || key.includes('closing') ||
              key.includes('subtitle')
            );
            const enInput = field.type === 'textarea'
              ? h('textarea', {
                  class: 'field-textarea',
                  rows: isLong ? 5 : 2,
                  placeholder: 'English...',
                  oninput: (e) => handleChange('en', key, e.target.value),
                })
              : h('input', {
                  class: 'field-input',
                  type: 'text',
                  placeholder: 'English...',
                  oninput: (e) => handleChange('en', key, e.target.value),
                });
            enInput.value = state.data.en[key] ?? '';
            const idInput = field.type === 'textarea'
              ? h('textarea', {
                  class: 'field-textarea',
                  rows: isLong ? 5 : 2,
                  placeholder: 'Bahasa Indonesia...',
                  oninput: (e) => handleChange('id', key, e.target.value),
                })
              : h('input', {
                  class: 'field-input',
                  type: 'text',
                  placeholder: 'Bahasa Indonesia...',
                  oninput: (e) => handleChange('id', key, e.target.value),
                });
            idInput.value = state.data.id[key] ?? '';
            return h('div', { class: 'bilingual-row' },
              h('div', { class: 'field-card en' },
                h('div', { class: 'field-label' },
                  h('span', { class: 'field-label-text' }, field.label),
                  h('span', { class: 'badge en' }, 'EN')
                ),
                enInput
              ),
              h('div', { class: 'field-card id' },
                h('div', { class: 'field-label' },
                  h('span', { class: 'field-label-text' }, field.label),
                  h('span', { class: 'badge id' }, 'ID')
                ),
                idInput
              )
            );
          })
        )
  );

  const rootEl = h('div', { class: 'root' }, topbar, sidebar, main);
  root.append(rootEl);
}

function handleChange(block, key, value) {
  state.data[block][key] = value;
  recomputeHasChanges();
  const btn = document.querySelector('.save-btn');
  if (btn) {
    btn.disabled = !state.hasChanges || state.status === 'saving' || state.status === 'loading' || !getToken();
  }
  const dot = document.querySelector('.changes-dot');
  if (state.hasChanges && !dot) {
    const right = document.querySelector('.topbar-right');
    if (right) right.prepend(h('div', { class: 'changes-dot', title: 'Ada perubahan belum dipublish' }));
  } else if (!state.hasChanges && dot) {
    dot.remove();
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

loadContent();
