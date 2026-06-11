// ─── Config ────────────────────────────────────────────────────────────────────
const CONFIG = {
  owner: 'ahhrsya',
  repo: 'gmv-website',
  branch: 'main',
  pat: 'ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE', // ← Replace with your actual GitHub PAT
};

// ─── Page Definitions ───────────────────────────────────────────────────────────
const PAGES = {
  home: {
    label: 'Home',
    icon: '🏠',
    file: 'content/home.md',
    type: 'sections',
    sections: {
      hero: {
        label: 'Hero',
        icon: '⬛',
        fields: [
          { key: 'hero_label', label: 'Label', type: 'text', block: 'bilingual' },
          { key: 'hero_headline', label: 'Headline', type: 'textarea', block: 'bilingual' },
          { key: 'hero_subheadline', label: 'Subheadline', type: 'textarea', block: 'bilingual' },
          { key: 'hero_cta_primary', label: 'CTA Primary', type: 'text', block: 'bilingual' },
          { key: 'hero_cta_secondary', label: 'CTA Secondary', type: 'text', block: 'bilingual' },
          { key: 'hero_scroll_label', label: 'Scroll Label', type: 'text', block: 'bilingual' },
          { key: 'hero_video_src', label: 'Video URL', type: 'url', block: 'shared' },
        ],
      },
      about: {
        label: 'About',
        icon: '◉',
        fields: [
          { key: 'about_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'about_title', label: 'Title', type: 'textarea', block: 'bilingual' },
          { key: 'about_p1', label: 'Paragraph 1', type: 'textarea', block: 'bilingual' },
          { key: 'about_p2', label: 'Paragraph 2', type: 'textarea', block: 'bilingual' },
          { key: 'about_badge', label: 'Badge', type: 'text', block: 'bilingual' },
        ],
      },
      vision: {
        label: 'Vision',
        icon: '◈',
        fields: [
          { key: 'vision_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'vision_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'vision_vision_label', label: 'Vision Label', type: 'text', block: 'bilingual' },
          { key: 'vision_vision_text', label: 'Vision Text', type: 'textarea', block: 'bilingual' },
          { key: 'vision_mission_label', label: 'Mission Label', type: 'text', block: 'bilingual' },
          { key: 'vision_pillar_0_title', label: 'Pillar 1 Title', type: 'text', block: 'bilingual' },
          { key: 'vision_pillar_0_body', label: 'Pillar 1 Body', type: 'textarea', block: 'bilingual' },
          { key: 'vision_pillar_1_title', label: 'Pillar 2 Title', type: 'text', block: 'bilingual' },
          { key: 'vision_pillar_1_body', label: 'Pillar 2 Body', type: 'textarea', block: 'bilingual' },
          { key: 'vision_pillar_2_title', label: 'Pillar 3 Title', type: 'text', block: 'bilingual' },
          { key: 'vision_pillar_2_body', label: 'Pillar 3 Body', type: 'textarea', block: 'bilingual' },
          { key: 'vision_pillar_3_title', label: 'Pillar 4 Title', type: 'text', block: 'bilingual' },
          { key: 'vision_pillar_3_body', label: 'Pillar 4 Body', type: 'textarea', block: 'bilingual' },
        ],
      },
      market: {
        label: 'Market',
        icon: '◎',
        fields: [
          { key: 'market_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'market_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'market_p1', label: 'Paragraph 1', type: 'textarea', block: 'bilingual' },
          { key: 'market_p2', label: 'Paragraph 2', type: 'textarea', block: 'bilingual' },
          { key: 'market_closing', label: 'Closing', type: 'textarea', block: 'bilingual' },
          { key: 'market_stat_0_number', label: 'Stat 1 Number', type: 'text', block: 'bilingual' },
          { key: 'market_stat_0_label', label: 'Stat 1 Label', type: 'text', block: 'bilingual' },
          { key: 'market_stat_1_number', label: 'Stat 2 Number', type: 'text', block: 'bilingual' },
          { key: 'market_stat_1_label', label: 'Stat 2 Label', type: 'text', block: 'bilingual' },
          { key: 'market_stat_2_number', label: 'Stat 3 Number', type: 'text', block: 'bilingual' },
          { key: 'market_stat_2_label', label: 'Stat 3 Label', type: 'text', block: 'bilingual' },
          { key: 'market_stat_3_number', label: 'Stat 4 Number', type: 'text', block: 'bilingual' },
          { key: 'market_stat_3_label', label: 'Stat 4 Label', type: 'text', block: 'bilingual' },
        ],
      },
      sederhana: {
        label: 'Sederhana',
        icon: '⬡',
        fields: [
          { key: 'sederhana_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'sederhana_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'sederhana_subtitle', label: 'Subtitle', type: 'textarea', block: 'bilingual' },
          { key: 'sederhana_p1', label: 'Paragraph 1', type: 'textarea', block: 'bilingual' },
          { key: 'sederhana_p2', label: 'Paragraph 2', type: 'textarea', block: 'bilingual' },
          { key: 'sederhana_p3', label: 'Paragraph 3', type: 'textarea', block: 'bilingual' },
          { key: 'sederhana_badge', label: 'Badge', type: 'text', block: 'bilingual' },
          { key: 'sederhana_image_src', label: 'Image URL', type: 'url', block: 'shared' },
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
          { key: 'expansion_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'expansion_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'expansion_subtitle', label: 'Subtitle', type: 'textarea', block: 'bilingual' },
          { key: 'expansion_step_0_title', label: 'Step 1 Title', type: 'text', block: 'bilingual' },
          { key: 'expansion_step_0_body', label: 'Step 1 Body', type: 'textarea', block: 'bilingual' },
          { key: 'expansion_step_1_title', label: 'Step 2 Title', type: 'text', block: 'bilingual' },
          { key: 'expansion_step_1_body', label: 'Step 2 Body', type: 'textarea', block: 'bilingual' },
          { key: 'expansion_step_2_title', label: 'Step 3 Title', type: 'text', block: 'bilingual' },
          { key: 'expansion_step_2_body', label: 'Step 3 Body', type: 'textarea', block: 'bilingual' },
          { key: 'expansion_step_3_title', label: 'Step 4 Title', type: 'text', block: 'bilingual' },
          { key: 'expansion_step_3_body', label: 'Step 4 Body', type: 'textarea', block: 'bilingual' },
        ],
      },
      whygmv: {
        label: 'Why GMV',
        icon: '★',
        fields: [
          { key: 'whygmv_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'whygmv_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_subtitle', label: 'Subtitle', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_0_title', label: 'Point 1 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_0_body', label: 'Point 1 Body', type: 'textarea', block: 'bilingual' },
          { key: 'whygmv_point_1_title', label: 'Point 2 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_1_body', label: 'Point 2 Body', type: 'textarea', block: 'bilingual' },
          { key: 'whygmv_point_2_title', label: 'Point 3 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_2_body', label: 'Point 3 Body', type: 'textarea', block: 'bilingual' },
          { key: 'whygmv_point_3_title', label: 'Point 4 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_3_body', label: 'Point 4 Body', type: 'textarea', block: 'bilingual' },
          { key: 'whygmv_point_4_title', label: 'Point 5 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_4_body', label: 'Point 5 Body', type: 'textarea', block: 'bilingual' },
        ],
      },
      footprint: {
        label: 'Footprint',
        icon: '⊕',
        fields: [
          { key: 'footprint_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'footprint_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'footprint_subtitle', label: 'Subtitle', type: 'text', block: 'bilingual' },
          { key: 'footprint_closing', label: 'Closing', type: 'textarea', block: 'bilingual' },
          { key: 'footprint_location_0_country', label: 'Location 1 Country', type: 'text', block: 'bilingual' },
          { key: 'footprint_location_0_city', label: 'Location 1 Status', type: 'text', block: 'bilingual' },
          { key: 'footprint_location_1_country', label: 'Location 2 Country', type: 'text', block: 'bilingual' },
          { key: 'footprint_location_1_city', label: 'Location 2 Status', type: 'text', block: 'bilingual' },
        ],
      },
      team: {
        label: 'Team',
        icon: '◐',
        fields: [
          { key: 'team_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'team_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'team_member_0_name', label: 'Member 1 Name', type: 'text', block: 'shared' },
          { key: 'team_member_0_role', label: 'Member 1 Role', type: 'text', block: 'bilingual' },
          { key: 'team_member_0_bio', label: 'Member 1 Bio', type: 'textarea', block: 'bilingual' },
          { key: 'team_member_1_name', label: 'Member 2 Name', type: 'text', block: 'shared' },
          { key: 'team_member_1_role', label: 'Member 2 Role', type: 'text', block: 'bilingual' },
          { key: 'team_member_1_bio', label: 'Member 2 Bio', type: 'textarea', block: 'bilingual' },
          { key: 'team_member_2_name', label: 'Member 3 Name', type: 'text', block: 'shared' },
          { key: 'team_member_2_role', label: 'Member 3 Role', type: 'text', block: 'bilingual' },
          { key: 'team_member_2_bio', label: 'Member 3 Bio', type: 'textarea', block: 'bilingual' },
          { key: 'team_member_3_name', label: 'Member 4 Name', type: 'text', block: 'shared' },
          { key: 'team_member_3_role', label: 'Member 4 Role', type: 'text', block: 'bilingual' },
          { key: 'team_member_3_bio', label: 'Member 4 Bio', type: 'textarea', block: 'bilingual' },
        ],
      },
      press: {
        label: 'Press',
        icon: '⬤',
        fields: [
          { key: 'press_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'press_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'press_item_0_publication', label: 'Article 1 Publication', type: 'text', block: 'shared' },
          { key: 'press_item_0_headline', label: 'Article 1 Headline', type: 'textarea', block: 'bilingual' },
          { key: 'press_item_0_date', label: 'Article 1 Date', type: 'text', block: 'bilingual' },
          { key: 'press_item_0_url', label: 'Article 1 URL', type: 'url', block: 'shared' },
          { key: 'press_item_1_publication', label: 'Article 2 Publication', type: 'text', block: 'shared' },
          { key: 'press_item_1_headline', label: 'Article 2 Headline', type: 'textarea', block: 'bilingual' },
          { key: 'press_item_1_date', label: 'Article 2 Date', type: 'text', block: 'bilingual' },
          { key: 'press_item_1_url', label: 'Article 2 URL', type: 'url', block: 'shared' },
          { key: 'press_item_2_publication', label: 'Article 3 Publication', type: 'text', block: 'shared' },
          { key: 'press_item_2_headline', label: 'Article 3 Headline', type: 'textarea', block: 'bilingual' },
          { key: 'press_item_2_date', label: 'Article 3 Date', type: 'text', block: 'bilingual' },
          { key: 'press_item_2_url', label: 'Article 3 URL', type: 'url', block: 'shared' },
          { key: 'press_item_3_publication', label: 'Article 4 Publication', type: 'text', block: 'shared' },
          { key: 'press_item_3_headline', label: 'Article 4 Headline', type: 'textarea', block: 'bilingual' },
          { key: 'press_item_3_date', label: 'Article 4 Date', type: 'text', block: 'bilingual' },
          { key: 'press_item_3_url', label: 'Article 4 URL', type: 'url', block: 'shared' },
        ],
      },
      contact: {
        label: 'Contact',
        icon: '✉',
        fields: [
          { key: 'contact_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'contact_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'contact_p1', label: 'Description', type: 'textarea', block: 'bilingual' },
          { key: 'contact_cta_button', label: 'CTA Button', type: 'text', block: 'bilingual' },
          { key: 'contact_email', label: 'Email', type: 'text', block: 'shared' },
          { key: 'contact_phone', label: 'Phone', type: 'text', block: 'shared' },
          { key: 'contact_instagram', label: 'Instagram', type: 'text', block: 'shared' },
        ],
      },
      footer: {
        label: 'Footer',
        icon: '',
        fields: [
          { key: 'footer_copyright', label: 'Copyright', type: 'text', block: 'bilingual' },
          { key: 'footer_tagline', label: 'Tagline', type: 'text', block: 'bilingual' },
          { key: 'footer_legal_0', label: 'Legal Link 1', type: 'text', block: 'bilingual' },
          { key: 'footer_legal_1', label: 'Legal Link 2', type: 'text', block: 'bilingual' },
        ],
      },
    },
  },
  about: {
    label: 'About',
    icon: 'ℹ',
    file: 'content/about.md',
    type: 'sections',
    sections: {
      hero: {
        label: 'Hero',
        icon: '⬛',
        fields: [
          { key: 'hero_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea', block: 'bilingual' },
        ],
      },
      about: {
        label: 'About',
        icon: '◉',
        fields: [
          { key: 'about_label', label: 'Label', type: 'text', block: 'bilingual' },
          { key: 'about_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'about_p1', label: 'Paragraph 1', type: 'textarea', block: 'bilingual' },
          { key: 'about_p2', label: 'Paragraph 2', type: 'textarea', block: 'bilingual' },
          { key: 'about_badge', label: 'Badge', type: 'text', block: 'bilingual' },
        ],
      },
      cta: {
        label: 'CTA',
        icon: '▶',
        fields: [
          { key: 'cta_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'cta_body', label: 'Body', type: 'textarea', block: 'bilingual' },
          { key: 'cta_button', label: 'Button', type: 'text', block: 'bilingual' },
        ],
      },
    },
  },
  contact: {
    label: 'Contact',
    icon: '✉',
    file: 'content/contact.md',
    type: 'sections',
    sections: {
      main: {
        label: 'Main',
        icon: '◉',
        fields: [
          { key: 'label', label: 'Label', type: 'text', block: 'bilingual' },
          { key: 'title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'p1', label: 'Description', type: 'textarea', block: 'bilingual' },
          { key: 'cta_button', label: 'CTA Button', type: 'text', block: 'bilingual' },
        ],
      },
      form: {
        label: 'Form Fields',
        icon: '⚙',
        fields: [
          { key: 'field_name', label: 'Name Field', type: 'text', block: 'bilingual' },
          { key: 'field_email', label: 'Email Field', type: 'text', block: 'bilingual' },
          { key: 'field_org', label: 'Org Field', type: 'text', block: 'bilingual' },
          { key: 'field_market', label: 'Market Field', type: 'text', block: 'bilingual' },
          { key: 'field_message', label: 'Message Field', type: 'textarea', block: 'bilingual' },
          { key: 'field_submit', label: 'Submit Button', type: 'text', block: 'bilingual' },
        ],
      },
      shared: {
        label: 'Shared Info',
        icon: '⊕',
        fields: [
          { key: 'email', label: 'Email', type: 'text', block: 'shared' },
          { key: 'phone', label: 'Phone', type: 'text', block: 'shared' },
          { key: 'instagram', label: 'Instagram', type: 'text', block: 'shared' },
        ],
      },
    },
  },
  articles: {
    label: 'Articles',
    icon: '📰',
    type: 'article-manager',
    dir: 'content/articles',
  },
};

// ─── State ────────────────────────────────────────────────────────────────────
const state = {
  activePage: 'home',
  activeSection: 'hero',
  data: {},
  original: {},
  shas: {},
  status: 'idle',
  errorMsg: '',
  hasChanges: false,
  sidebarOpen: false,
  articles: [],
  currentArticle: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function $(sel, root = document) { return root.querySelector(sel); }
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'value') {
      if (tag === 'textarea') el.textContent = v;
      else el.value = v;
    }
    else if (v != null) el.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c == null || c === false) continue;
    el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return el;
}

function deepEqual(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function recomputeHasChanges() {
  const page = PAGES[state.activePage];
  if (page.type === 'sections') {
    state.hasChanges = !deepEqual(state.data[state.activePage], state.original[state.activePage]);
  } else if (page.type === 'article-manager' && state.currentArticle) {
    const origKey = state.activePage + '_' + state.currentArticle.file;
    state.hasChanges = !deepEqual(state.currentArticle, state.original[origKey]);
  } else {
    state.hasChanges = false;
  }
}

function getToken() { return CONFIG.pat; }
function tokenIsValid() {
  return CONFIG.pat && CONFIG.pat !== 'ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE';
}

// ─── YAML (via js-yaml CDN) ───────────────────────────────────────────────────
function parseFrontmatter(md, type = 'nested') {
  if (!md.startsWith('---')) return type === 'nested' ? { en: {}, id: {}, shared: {} } : {};
  const end = md.indexOf('\n---', 3);
  if (end === -1) return type === 'nested' ? { en: {}, id: {}, shared: {} } : {};
  const yaml = md.slice(3, end).trim();
  try {
    const parsed = jsyaml.load(yaml);
    if (type === 'nested') {
      return { en: parsed.en || {}, id: parsed.id || {}, shared: parsed.shared || {} };
    }
    return parsed || {};
  } catch (e) {
    console.error('YAML parse error:', e);
    return type === 'nested' ? { en: {}, id: {}, shared: {} } : {};
  }
}

function serializeFrontmatter(data, type = 'nested') {
  let obj;
  if (type === 'nested') {
    obj = { shared: data.shared || {}, en: data.en || {}, id: data.id || {} };
  } else {
    obj = data;
  }
  const yaml = jsyaml.dump(obj, { indent: 2, lineWidth: -1, noRefs: true, quotingType: '"', sortKeys: false });
  return '---\n' + yaml + '---';
}

function parseArticle(md) {
  if (!md.startsWith('---')) return { frontmatter: {}, bodyEn: '', bodyId: '' };
  const end = md.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: {}, bodyEn: '', bodyId: '' };
  const yaml = md.slice(3, end).trim();
  let frontmatter = {};
  try { frontmatter = jsyaml.load(yaml) || {}; } catch (e) { console.error('YAML parse error:', e); }
  const body = md.slice(end + 4).trim();
  const enMatch = body.match(/\[EN_CONTENT\]\n?([\s\S]*?)(?=\n\[ID_CONTENT\]|$)/);
  const idMatch = body.match(/\[ID_CONTENT\]\n?([\s\S]*?)$/);
  return {
    frontmatter,
    bodyEn: enMatch ? enMatch[1].trim() : '',
    bodyId: idMatch ? idMatch[1].trim() : '',
  };
}

function serializeArticle(data) {
  const yaml = jsyaml.dump(data.frontmatter, { indent: 2, lineWidth: -1, noRefs: true, quotingType: '"', sortKeys: false });
  return '---\n' + yaml + '---\n\n[EN_CONTENT]\n' + data.bodyEn + '\n\n[ID_CONTENT]\n' + data.bodyId;
}

// ─── GitHub API ───────────────────────────────────────────────────────────────
function ghHeaders() {
  return {
    'Authorization': `Bearer ${getToken()}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function loadFile(file) {
  const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${file}?ref=${CONFIG.branch}`, {
    headers: ghHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  const md = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
  return { sha: json.sha, content: md };
}

async function saveFile(file, content, sha) {
  const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${file}`, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `cms: update ${file}`,
      content: btoa(unescape(encodeURIComponent(content))),
      branch: CONFIG.branch,
      sha,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.content.sha;
}

async function listFiles(dir) {
  const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${dir}?ref=${CONFIG.branch}`, {
    headers: ghHeaders(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return await res.json();
}

// ─── Loaders ──────────────────────────────────────────────────────────────────
async function loadPage(pageKey) {
  const page = PAGES[pageKey];
  if (!page) return;
  state.status = 'loading';
  state.errorMsg = '';
  state.hasChanges = false;
  render();
  if (!tokenIsValid()) {
    state.status = 'error';
    state.errorMsg = 'GitHub PAT belum di-set. Ganti `ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE` di file app.js dengan PAT yang valid.';
    render();
    return;
  }
  try {
    if (page.type === 'sections') {
      const { sha, content } = await loadFile(page.file);
      state.shas[pageKey] = sha;
      const parsed = parseFrontmatter(content, 'nested');
      state.data[pageKey] = { en: parsed.en || {}, id: parsed.id || {}, shared: parsed.shared || {} };
      state.original[pageKey] = JSON.parse(JSON.stringify(state.data[pageKey]));
    } else if (page.type === 'article-manager') {
      await loadArticles();
    }
    state.status = 'idle';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat ${page.label}: ${e.message}`;
  }
  render();
}

async function loadArticles() {
  const page = PAGES.articles;
  try {
    const files = await listFiles(page.dir);
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    state.articles = mdFiles.map(f => ({ name: f.name, file: f.path, sha: f.sha }));
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat daftar artikel: ${e.message}`;
  }
}

async function loadArticle(file) {
  state.status = 'loading';
  state.errorMsg = '';
  state.hasChanges = false;
  render();
  try {
    const { sha, content } = await loadFile(file);
    const parsed = parseArticle(content);
    const art = state.articles.find(a => a.file === file);
    if (art) art.sha = sha;
    state.currentArticle = {
      file,
      sha,
      frontmatter: parsed.frontmatter,
      bodyEn: parsed.bodyEn,
      bodyId: parsed.bodyId,
    };
    const origKey = state.activePage + '_' + file;
    state.original[origKey] = JSON.parse(JSON.stringify(state.currentArticle));
    state.status = 'idle';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat artikel: ${e.message}`;
  }
  render();
}

// ─── Savers ───────────────────────────────────────────────────────────────────
async function savePage() {
  const page = PAGES[state.activePage];
  if (!page) return;
  state.status = 'saving';
  state.errorMsg = '';
  render();
  try {
    let content, newSha;
    if (page.type === 'sections') {
      content = serializeFrontmatter(state.data[state.activePage], 'nested');
      newSha = await saveFile(page.file, content, state.shas[state.activePage]);
      state.shas[state.activePage] = newSha;
      state.original[state.activePage] = JSON.parse(JSON.stringify(state.data[state.activePage]));
    } else if (page.type === 'article-manager' && state.currentArticle) {
      content = serializeArticle(state.currentArticle);
      newSha = await saveFile(state.currentArticle.file, content, state.currentArticle.sha);
      state.currentArticle.sha = newSha;
      const art = state.articles.find(a => a.file === state.currentArticle.file);
      if (art) art.sha = newSha;
      const origKey = state.activePage + '_' + state.currentArticle.file;
      state.original[origKey] = JSON.parse(JSON.stringify(state.currentArticle));
    }
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
  const topbar = renderTopbar();
  const sidebar = renderSidebar();
  const main = renderMain();
  root.append(h('div', { class: 'root' }, topbar, sidebar, main));
}

function renderTopbar() {
  const page = PAGES[state.activePage];
  const isArticle = page.type === 'article-manager' && state.currentArticle;
  return h('div', { class: 'topbar' },
    h('div', { class: 'brand' },
      h('button', { class: 'hamburger', onclick: () => { state.sidebarOpen = !state.sidebarOpen; render(); } }, '☰'),
      h('div', { class: 'brand-mark' }, 'G'),
      h('span', { class: 'brand-name' }, 'GMV'),
      h('span', { class: 'brand-sub' }, 'CMS')
    ),
    h('div', { class: 'topbar-right' },
      isArticle ? h('button', { class: 'back-btn', onclick: () => { state.currentArticle = null; state.hasChanges = false; render(); } }, '← Back to Articles') : null,
      state.hasChanges ? h('div', { class: 'changes-dot', title: 'Ada perubahan belum dipublish' }) : null,
      h('button', {
        class: `save-btn ${state.status === 'saved' ? 'saved' : state.status === 'error' ? 'error' : ''}`,
        onclick: savePage,
        disabled: !state.hasChanges || state.status === 'saving' || state.status === 'loading',
      },
        state.status === 'saving' && '⟳ Publishing...',
        state.status === 'saved'  && '✓ Published',
        state.status === 'error'  && '✕ Gagal',
        (state.status === 'idle' || state.status === 'loading') && '↑ Publish'
      )
    )
  );
}

function renderSidebar() {
  const page = PAGES[state.activePage];
  const isSections = page && page.type === 'sections';
  return h('nav', { class: `sidebar ${state.sidebarOpen ? 'open' : ''}`, onclick: () => { state.sidebarOpen = false; render(); } },
    h('div', { class: 'sidebar-group' }, 'Pages'),
    ...Object.entries(PAGES).map(([key, p]) =>
      h('div', { key, class: `nav-item ${state.activePage === key ? 'active' : ''}`, onclick: (e) => { e.stopPropagation(); setPage(key); } },
        h('span', { class: 'nav-icon' }, p.icon),
        p.label
      )
    ),
    isSections ? h('div', { class: 'sidebar-divider' }) : null,
    isSections ? h('div', { class: 'sidebar-group' }, 'Sections') : null,
    isSections ? Object.entries(page.sections).map(([key, sec]) =>
      h('div', { key, class: `nav-item ${state.activeSection === key ? 'active' : ''}`, onclick: (e) => { e.stopPropagation(); state.activeSection = key; state.sidebarOpen = false; render(); } },
        h('span', { class: 'nav-icon' }, sec.icon),
        sec.label
      )
    ) : null
  );
}

function setPage(key) {
  state.activePage = key;
  state.currentArticle = null;
  state.sidebarOpen = false;
  const page = PAGES[key];
  if (page.type === 'sections') {
    state.activeSection = Object.keys(page.sections)[0];
  }
  if (!state.data[key] && page.type !== 'article-manager') {
    loadPage(key);
  } else if (page.type === 'article-manager' && state.articles.length === 0) {
    loadPage(key);
  } else {
    render();
  }
}

function renderMain() {
  const page = PAGES[state.activePage];
  if (page.type === 'sections') return renderSectionsPage();
  if (page.type === 'article-manager') {
    if (state.currentArticle) return renderArticleEditor();
    return renderArticleManager();
  }
  return h('main', { class: 'main' }, h('div', { class: 'status-bar error' }, 'Unknown page type'));
}

function renderSectionsPage() {
  const page = PAGES[state.activePage];
  const sec = page.sections[state.activeSection];
  const uniqueBilingualKeys = [...new Set(sec.fields.filter(f => f.block === 'bilingual').map(f => f.key))];
  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, sec.label),
      h('span', { class: 'file-chip' }, `${page.file} → ${state.activeSection}`)
    ),
    renderStatusBar(),
    state.status === 'loading' ? renderLoading(page.file) : renderFields(sec.fields, uniqueBilingualKeys)
  );
}

function renderFields(fields, uniqueBilingualKeys) {
  return h('div', { class: 'fields' },
    ...fields.filter(f => f.block === 'shared').map(field => {
      const val = (state.data[state.activePage]?.shared?.[field.key]) ?? '';
      const input = field.type === 'textarea'
        ? h('textarea', { class: 'field-textarea', rows: 3, placeholder: `Enter ${field.label}...`, oninput: (e) => handleChange('shared', field.key, e.target.value), value: val })
        : h('input', { class: 'field-input', type: field.type === 'url' ? 'url' : 'text', placeholder: `Enter ${field.label}...`, oninput: (e) => handleChange('shared', field.key, e.target.value), value: val });
      return h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' },
          h('span', { class: 'field-label-text' }, field.label),
          h('span', { class: 'badge shared' }, 'shared')
        ),
        input
      );
    }),
    ...uniqueBilingualKeys.map(key => {
      const field = fields.find(f => f.key === key);
      const isLong = field.type === 'textarea' && (key.includes('body') || key.includes('p1') || key.includes('p2') || key.includes('p3') || key.includes('subheadline') || key.includes('closing') || key.includes('subtitle') || key.includes('paragraph'));
      const enVal = (state.data[state.activePage]?.en?.[key]) ?? '';
      const idVal = (state.data[state.activePage]?.id?.[key]) ?? '';
      const enInput = field.type === 'textarea'
        ? h('textarea', { class: 'field-textarea', rows: isLong ? 5 : 2, placeholder: 'English...', oninput: (e) => handleChange('en', key, e.target.value), value: enVal })
        : h('input', { class: 'field-input', type: 'text', placeholder: 'English...', oninput: (e) => handleChange('en', key, e.target.value), value: enVal });
      const idInput = field.type === 'textarea'
        ? h('textarea', { class: 'field-textarea', rows: isLong ? 5 : 2, placeholder: 'Bahasa Indonesia...', oninput: (e) => handleChange('id', key, e.target.value), value: idVal })
        : h('input', { class: 'field-input', type: 'text', placeholder: 'Bahasa Indonesia...', oninput: (e) => handleChange('id', key, e.target.value), value: idVal });
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
  );
}

function renderArticleManager() {
  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, 'Articles'),
      h('span', { class: 'file-chip' }, 'content/articles/')
    ),
    renderStatusBar(),
    state.status === 'loading' ? renderLoading('articles list') :
    h('div', { class: 'article-list' },
      ...state.articles.map(art =>
        h('div', { class: 'article-card', onclick: () => loadArticle(art.file) },
          h('div', { class: 'article-name' }, art.name),
          h('div', { class: 'article-path' }, art.file)
        )
      )
    )
  );
}

function renderArticleEditor() {
  const art = state.currentArticle;
  const fm = art.frontmatter;
  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, fm.title_en || 'Untitled Article'),
      h('span', { class: 'file-chip' }, art.file)
    ),
    renderStatusBar(),
    h('div', { class: 'fields' },
      h('h2', { class: 'field-group-title' }, 'Frontmatter'),
      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          h('div', { class: 'field-label' }, 'Title EN'),
          h('input', { class: 'field-input', value: fm.title_en || '', oninput: (e) => handleArticleChange('frontmatter', 'title_en', e.target.value) })
        ),
        h('div', { class: 'field-card id' },
          h('div', { class: 'field-label' }, 'Title ID'),
          h('input', { class: 'field-input', value: fm.title_id || '', oninput: (e) => handleArticleChange('frontmatter', 'title_id', e.target.value) })
        )
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Slug'),
        h('input', { class: 'field-input', value: fm.slug || '', oninput: (e) => handleArticleChange('frontmatter', 'slug', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Date'),
        h('input', { class: 'field-input', type: 'date', value: fm.date || '', oninput: (e) => handleArticleChange('frontmatter', 'date', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Category'),
        h('input', { class: 'field-input', value: fm.category || '', oninput: (e) => handleArticleChange('frontmatter', 'category', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Cover Image'),
        h('input', { class: 'field-input', value: fm.cover_image || '', oninput: (e) => handleArticleChange('frontmatter', 'cover_image', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Author'),
        h('input', { class: 'field-input', value: fm.author || '', oninput: (e) => handleArticleChange('frontmatter', 'author', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Read Time (minutes)'),
        h('input', { class: 'field-input', type: 'number', value: fm.read_time || '', oninput: (e) => handleArticleChange('frontmatter', 'read_time', e.target.value) })
      ),
      h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' }, 'Published'),
        h('select', { class: 'field-input', style: 'background:transparent;border:none;color:var(--text);font-family:var(--font);font-size:13px;cursor:pointer;', onchange: (e) => handleArticleChange('frontmatter', 'published', e.target.value === 'true') },
          h('option', { value: 'true', selected: fm.published === true }, 'Yes'),
          h('option', { value: 'false', selected: fm.published !== true }, 'No')
        )
      ),
      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          h('div', { class: 'field-label' }, 'Excerpt EN'),
          h('textarea', { class: 'field-textarea', rows: 3, value: fm.excerpt_en || '', oninput: (e) => handleArticleChange('frontmatter', 'excerpt_en', e.target.value) })
        ),
        h('div', { class: 'field-card id' },
          h('div', { class: 'field-label' }, 'Excerpt ID'),
          h('textarea', { class: 'field-textarea', rows: 3, value: fm.excerpt_id || '', oninput: (e) => handleArticleChange('frontmatter', 'excerpt_id', e.target.value) })
        )
      ),
      h('h2', { class: 'field-group-title' }, 'Body Content'),
      h('div', { class: 'field-card en' },
        h('div', { class: 'field-label' }, 'English Body'),
        h('textarea', { class: 'field-textarea', rows: 15, value: art.bodyEn || '', oninput: (e) => handleArticleChange('body', 'en', e.target.value) })
      ),
      h('div', { class: 'field-card id' },
        h('div', { class: 'field-label' }, 'Indonesian Body'),
        h('textarea', { class: 'field-textarea', rows: 15, value: art.bodyId || '', oninput: (e) => handleArticleChange('body', 'id', e.target.value) })
      )
    )
  );
}

function renderStatusBar() {
  if (state.status === 'saved') {
    return h('div', { class: 'status-bar saved' },
      h('div', { class: 's-dot' }),
      'Berhasil dipublish. GitHub webhook akan trigger Vercel redeploy (~60 detik).'
    );
  }
  if (state.status === 'error' && state.errorMsg) {
    return h('div', { class: 'status-bar error' },
      h('div', { class: 's-dot' }),
      state.errorMsg
    );
  }
  if (state.status === 'loading') {
    return h('div', { class: 'status-bar' },
      h('div', { class: 's-dot' }),
      'Memuat konten dari GitHub...'
    );
  }
  return null;
}

function renderLoading(file) {
  return h('div', { class: 'loading-wrap' },
    h('div', { class: 'spinner' }),
    h('span', { class: 'load-txt' }, `reading ${file}`)
  );
}

function handleChange(block, key, value) {
  if (!state.data[state.activePage]) state.data[state.activePage] = { en: {}, id: {}, shared: {} };
  state.data[state.activePage][block][key] = value;
  recomputeHasChanges();
  updateSaveBtn();
  updateChangesDot();
}

function handleArticleChange(section, key, value) {
  if (!state.currentArticle) return;
  if (section === 'frontmatter') {
    state.currentArticle.frontmatter[key] = value;
  } else if (section === 'body') {
    if (key === 'en') state.currentArticle.bodyEn = value;
    if (key === 'id') state.currentArticle.bodyId = value;
  }
  recomputeHasChanges();
  updateSaveBtn();
  updateChangesDot();
}

function updateSaveBtn() {
  const btn = document.querySelector('.save-btn');
  if (btn) {
    btn.disabled = !state.hasChanges || state.status === 'saving' || state.status === 'loading';
  }
}

function updateChangesDot() {
  const dot = document.querySelector('.changes-dot');
  if (state.hasChanges && !dot) {
    const right = document.querySelector('.topbar-right');
    if (right) right.prepend(h('div', { class: 'changes-dot', title: 'Ada perubahan belum dipublish' }));
  } else if (!state.hasChanges && dot) {
    dot.remove();
  }
}

// ─── Boot ─────────────────────────────────────────────────────────────────────
function init() {
  render();
  if (tokenIsValid()) {
    loadPage(state.activePage);
  } else {
    state.status = 'error';
    state.errorMsg = 'GitHub PAT belum di-set. Ganti `ghp_YOUR_PERSONAL_ACCESS_TOKEN_HERE` di file app.js dengan PAT yang valid.';
    render();
  }
}

init();
