// ─── Config ────────────────────────────────────────────────────────────────────
const CONFIG = {
  owner: 'ahhrsya',
  repo: 'gmv-website',
  branch: 'main',
  // PAT loaded from config.js (gitignored) via window.GMV_PAT — never hardcoded here
  pat: (typeof window !== 'undefined' && window.GMV_PAT) || '',
};

function loadTokenFromStorage() {
  try {
    // localStorage override: if a user manually sets a different token via Settings, it takes priority
    const stored = localStorage.getItem('gmv_cms_pat');
    if (stored && stored.length > 10) CONFIG.pat = stored;
  } catch (e) { }
}

function saveTokenToStorage(token) {
  try {
    if (token) localStorage.setItem('gmv_cms_pat', token);
    else localStorage.removeItem('gmv_cms_pat');
  } catch (e) { }
}

loadTokenFromStorage(); // allows Settings override, but falls back to baked-in PAT

// ─── Lucide Icon Helper ────────────────────────────────────────────────────────
function icon(name, size = 14) {
  if (typeof lucide === 'undefined') return document.createTextNode('');
  const def = lucide[name];
  if (!def) return document.createTextNode('');
  const el = lucide.createElement(def, { 'stroke-width': 1 });
  el.setAttribute('width', size);
  el.setAttribute('height', size);
  el.style.cssText = `flex-shrink:0;display:inline-block;vertical-align:middle;width:${size}px;height:${size}px;`;
  return el;
}

// ─── Real Image Upload (GitHub API) ────────────────────────────────────────────
// Upload image and set URL into a specific body block (lang = 'en'|'id', blockIdx = number)
async function uploadImage(lang, blockIdx) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return resolve();
      if (file.size > 2 * 1024 * 1024) {
        alert('File terlalu besar! Maksimal 2MB.');
        return resolve();
      }
      if (!tokenIsValid()) {
        alert('GitHub PAT belum di-set! Buka Settings dan masukkan PAT.');
        return resolve();
      }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(',')[1];
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = `content/assets/articles/${filename}`;
        state.status = 'uploading';
        render();
        try {
          const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `cms: upload image ${filename}`,
              content: base64,
              branch: CONFIG.branch,
            }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
          }
          const publicUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
          // Set URL into the specific block
          const bodyKey = 'body' + lang.charAt(0).toUpperCase() + lang.slice(1);
          if (state.currentArticle && state.currentArticle[bodyKey] && state.currentArticle[bodyKey][blockIdx] != null) {
            state.currentArticle[bodyKey][blockIdx].image = publicUrl;
          }
          recomputeHasChanges();
          updateSaveBtn();
          state.status = 'idle';
        } catch (err) {
          state.status = 'error';
          state.errorMsg = `Upload gagal: ${err.message}`;
        }
        render();
        resolve();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

// Upload cover image for the current article and set fm.cover_image
function uploadCoverImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('File terlalu besar! Maksimal 5MB.'); return; }
    if (!tokenIsValid()) { alert('GitHub PAT belum di-set! Buka Settings.'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = `public/assets/articles/${filename}`;
      state.status = 'uploading'; render();
      try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `cms: upload cover image ${filename}`, content: base64, branch: CONFIG.branch }),
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
        const publicUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
        handleArticleChange('frontmatter', 'cover_image', publicUrl);
        state.status = 'idle';
        state.successMsg = 'Cover image uploaded!';
      } catch (err) {
        state.status = 'error';
        state.errorMsg = `Upload gagal: ${err.message}`;
      }
      render();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// Upload image for a shared (non-article) field and return the public URL via callback
function uploadSharedImage(onSuccess) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File terlalu besar! Maksimal 2MB.');
      return;
    }
    if (!tokenIsValid()) {
      alert('GitHub PAT belum di-set! Buka Settings dan masukkan PAT.');
      return;
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = `content/assets/${filename}`;
      state.status = 'uploading';
      render();
      try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: `cms: upload image ${filename}`,
            content: base64,
            branch: CONFIG.branch,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || `HTTP ${res.status}`);
        }
        const publicUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
        state.status = 'idle';
        render();
        if (onSuccess) onSuccess(publicUrl);
      } catch (err) {
        state.status = 'error';
        state.errorMsg = `Upload gagal: ${err.message}`;
        render();
      }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ─── Page Definitions ───────────────────────────────────────────────────────────
const PAGES = {
  assets: {
    label: 'Assets',
    icon: 'FolderOpen',
    type: 'asset-manager',
  },
  integrations: {
    label: 'Integrations',
    icon: 'Plug',
    type: 'integrations',
  },
  home: {
    label: 'Home',
    icon: 'Home',
    file: 'content/home.md',
    type: 'sections',
    sections: {
      navigation: {
        label: 'Navigation',
        icon: 'Menu',
        fields: [
          { key: 'nav_logo_src', label: 'Logo', type: 'url', block: 'shared' },
          { key: 'nav_0', label: 'Nav 1 Label', type: 'text', block: 'bilingual' },
          { key: 'nav_1', label: 'Nav 2 Label', type: 'text', block: 'bilingual' },
          { key: 'nav_2', label: 'Nav 3 Label', type: 'text', block: 'bilingual' },
        ],
      },
      hero: {
        label: 'Hero',
        icon: 'LayoutDashboard',
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
        icon: 'Target',
        visibleKey: 'section_about_visible',
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
        icon: 'Diamond',
        visibleKey: 'section_vision_visible',
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
        icon: 'TrendingUp',
        visibleKey: 'section_market_visible',
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
        icon: 'Building2',
        visibleKey: 'section_sederhana_visible',
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
        icon: 'Globe',
        visibleKey: 'section_expansion_visible',
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
        icon: 'Star',
        visibleKey: 'section_whygmv_visible',
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
        icon: 'MapPin',
        visibleKey: 'section_footprint_visible',
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
        icon: 'Users',
        visibleKey: 'section_team_visible',
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
        icon: 'Newspaper',
        visibleKey: 'section_press_visible',
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
        icon: 'MessageCircle',
        visibleKey: 'section_contact_visible',
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
        icon: 'AlignJustify',
        fields: [
          { key: 'footer_copyright', label: 'Copyright', type: 'text', block: 'bilingual' },
          { key: 'footer_tagline', label: 'Tagline', type: 'text', block: 'bilingual' },
          { key: 'footer_legal_0', label: 'Legal Link 1', type: 'text', block: 'bilingual' },
          { key: 'footer_legal_1', label: 'Legal Link 2', type: 'text', block: 'bilingual' },
          { key: 'footer_social_linkedin_url', label: 'LinkedIn URL', type: 'url', block: 'shared' },
          { key: 'footer_social_instagram_url', label: 'Instagram URL', type: 'url', block: 'shared' },
          { key: 'footer_social_twitter_url', label: 'Twitter/X URL', type: 'url', block: 'shared' },
        ],
      },
    },
  },
  about: {
    label: 'About',
    icon: 'Info',
    file: 'content/about.md',
    type: 'sections',
    sections: {
      hero: {
        label: 'Hero',
        icon: 'LayoutDashboard',
        fields: [
          { key: 'hero_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea', block: 'bilingual' },
        ],
      },
      about: {
        label: 'About',
        icon: 'Target',
        visibleKey: 'section_about_visible',
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
        icon: 'ArrowRight',
        visibleKey: 'section_cta_visible',
        fields: [
          { key: 'cta_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'cta_body', label: 'Body', type: 'textarea', block: 'bilingual' },
          { key: 'cta_button', label: 'Button', type: 'text', block: 'bilingual' },
        ],
      },
      vision: {
        label: 'Vision',
        icon: 'Eye',
        visibleKey: 'section_vision_visible',
        fields: [
          { key: 'vision_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'vision_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'vision_vision_label', label: 'Vision Label', type: 'text', block: 'bilingual' },
          { key: 'vision_vision_text', label: 'Vision Statement', type: 'textarea', block: 'bilingual' },
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
      whyGmv: {
        label: 'Why GMV',
        icon: 'Star',
        visibleKey: 'section_whygmv_visible',
        fields: [
          { key: 'whygmv_label', label: 'Section Label', type: 'text', block: 'bilingual' },
          { key: 'whygmv_title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_subtitle', label: 'Subtitle', type: 'textarea', block: 'bilingual' },
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
          { key: 'whygmv_point_5_title', label: 'Point 6 Title', type: 'text', block: 'bilingual' },
          { key: 'whygmv_point_5_body', label: 'Point 6 Body', type: 'textarea', block: 'bilingual' },
        ],
      },
    },
  },
  contact: {
    label: 'Contact',
    icon: 'Mail',
    file: 'content/contact.md',
    type: 'sections',
    sections: {
      main: {
        label: 'Main',
        icon: 'Target',
        visibleKey: 'section_main_visible',
        fields: [
          { key: 'label', label: 'Label', type: 'text', block: 'bilingual' },
          { key: 'title', label: 'Title', type: 'text', block: 'bilingual' },
          { key: 'p1', label: 'Description', type: 'textarea', block: 'bilingual' },
          { key: 'cta_button', label: 'CTA Button', type: 'text', block: 'bilingual' },
        ],
      },
      form: {
        label: 'Form Fields',
        icon: 'Settings2',
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
        icon: 'Share2',
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
    icon: 'FileText',
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
  successMsg: '',
  hasChanges: false,
  sidebarOpen: false,
  articles: [],
  currentArticle: null,
  settingsOpen: false,
  pat: null,
  bodyEnText: null,  // raw markdown string for EN body editor
  bodyIdText: null,  // raw markdown string for ID body editor
  newArticleModal: false,
  newArticleSlug: '',
  newArticleTitleEn: '',
  assets: [],
  assetsLoading: false,
  integrations: { gtm_id: '', ga4_id: '', fb_pixel_id: '', custom_scripts: '' },
  integrationsLoading: false,
  integrationsSha: null, // SHA of home.md for GitHub update
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function $(sel, root = document) { return root.querySelector(sel); }
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
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
  return CONFIG.pat && CONFIG.pat.length > 10;
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

// ─── Article body parser/serializer (paragraph block format) ───────────────────
// Format: [BLOCK type=paragraph]content[/BLOCK] or [BLOCK type=heading]content[/BLOCK]
// Optional: [BLOCK type=paragraph image=foo.png]content[/BLOCK]
const BLOCK_TYPES = [
  { value: 'heading', label: 'Heading (H2)' },
  { value: 'subheading', label: 'Subheading (H3)' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'list', label: 'Bullet List' },
  { value: 'quote', label: 'Quote' },
];

function mdToBlocks(md) {
  // Convert legacy markdown body → array of block objects
  const blocks = [];
  const lines = md.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading', text: line.slice(3).trim(), image: '' });
      i++;
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'subheading', text: line.slice(4).trim(), image: '' });
      i++;
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: 'list', text: items.join('\n'), image: '' });
    } else if (line.startsWith('> ')) {
      const quoteLines = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: 'quote', text: quoteLines.join('\n'), image: '' });
    } else if (line.trim() === '') {
      i++;
    } else {
      // Regular paragraph (collect consecutive non-empty lines until break)
      const paraLines = [];
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].startsWith('##') && !lines[i].startsWith('###') && !lines[i].startsWith('- ') && !lines[i].startsWith('* ') && !lines[i].startsWith('> ')) {
        paraLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'paragraph', text: paraLines.join('\n').trim(), image: '' });
    }
  }
  return blocks;
}

function blocksToMd(blocks) {
  return blocks.map(b => {
    let content = b.text || '';
    if (b.type === 'list') {
      content = content.split('\n').filter(l => l.trim()).map(l => '- ' + l.trim()).join('\n');
    } else if (b.type === 'quote') {
      content = content.split('\n').filter(l => l.trim()).map(l => '> ' + l.trim()).join('\n');
    }
    return content;
  }).filter(s => s.trim()).join('\n\n');
}

function parseArticle(md) {
  if (!md.startsWith('---')) return { frontmatter: {}, bodyEn: [], bodyId: [] };
  const end = md.indexOf('\n---', 3);
  if (end === -1) return { frontmatter: {}, bodyEn: [], bodyId: [] };
  const yaml = md.slice(3, end).trim();
  let frontmatter = {};
  try { frontmatter = jsyaml.load(yaml) || {}; } catch (e) { console.error('YAML parse error:', e); }
  const body = md.slice(end + 4).trim();
  const enMatch = body.match(/\[EN_CONTENT\]\n?([\s\S]*?)(?=\n\[ID_CONTENT\]|$)/);
  const idMatch = body.match(/\[ID_CONTENT\]\n?([\s\S]*?)$/);
  const enMd = enMatch ? enMatch[1].trim() : '';
  const idMd = idMatch ? idMatch[1].trim() : '';
  return {
    frontmatter,
    bodyEn: mdToBlocks(enMd),
    bodyId: mdToBlocks(idMd),
    enMd,
    idMd,
  };
}

function serializeArticle(data) {
  const yaml = jsyaml.dump(data.frontmatter, { indent: 2, lineWidth: -1, noRefs: true, quotingType: '"', sortKeys: false });
  // Use raw markdown (from WYSIWYG/direct edit) when available; fall back to block reconstruction
  const enMd = data.bodyEnRaw != null ? data.bodyEnRaw : blocksToMd(data.bodyEn || []);
  const idMd = data.bodyIdRaw != null ? data.bodyIdRaw : blocksToMd(data.bodyId || []);
  return '---\n' + yaml + '---\n\n[EN_CONTENT]\n' + enMd + '\n\n[ID_CONTENT]\n' + idMd;
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

async function saveFile(file, content, sha, message) {
  const body = {
    message: message || `cms: update ${file}`,
    content: btoa(unescape(encodeURIComponent(content))),
    branch: CONFIG.branch,
  };
  if (sha) body.sha = sha;
  const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${file}`, {
    method: 'PUT',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.content.sha;
}

async function deleteFile(file, sha, message) {
  const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${file}`, {
    method: 'DELETE',
    headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: message || `cms: delete ${file}`,
      sha: sha || '',
      branch: CONFIG.branch,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.commit.sha;
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

async function fetchArticlePublished(filePath) {
  try {
    const rawUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
    const res = await fetch(rawUrl, { headers: { 'Authorization': `Bearer ${getToken()}` } });
    if (!res.ok) return null;
    // Only read enough to get past the frontmatter
    const text = await res.text();
    if (!text.startsWith('---')) return null;
    const end = text.indexOf('\n---', 3);
    if (end === -1) return null;
    const yaml = text.slice(3, end);
    const match = yaml.match(/^published:\s*(true|false)\s*$/m);
    if (!match) return null;
    return match[1] === 'true';
  } catch (_) { return null; }
}

async function loadArticles() {
  const page = PAGES.articles;
  try {
    const files = await listFiles(page.dir);
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    // Show list immediately with unknown status, then fill in published state
    state.articles = mdFiles.map(f => ({ name: f.name, file: f.path, sha: f.sha, published: null }));
    render();
    const statuses = await Promise.allSettled(mdFiles.map(f => fetchArticlePublished(f.path)));
    statuses.forEach((r, i) => {
      state.articles[i].published = r.status === 'fulfilled' ? r.value : null;
    });
    render();
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat daftar artikel: ${e.message}`;
  }
}

async function loadAssets() {
  state.assetsLoading = true;
  render();
  try {
    const files = await listFiles('public/assets');
    state.assets = files.map(f => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      size: f.size,
      url: `/${f.path.replace(/^public\//, '')}`,
      rawUrl: `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${f.path}`,
    }));
  } catch (e) {
    state.errorMsg = `Gagal memuat assets: ${e.message}`;
  }
  state.assetsLoading = false;
  render();
}

async function uploadAsset() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.svg,.pdf,.mp4,.webm,.mov';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return resolve(null);
      const MAX = 5 * 1024 * 1024;
      if (file.size > MAX) {
        alert(`File terlalu besar!\nMaksimal 5MB per file.\nFile ini: ${(file.size / 1024 / 1024).toFixed(1)}MB`);
        return resolve(null);
      }
      if (!tokenIsValid()) {
        alert('GitHub PAT belum di-set! Buka Settings.');
        return resolve(null);
      }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(',')[1];
        const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
        const filename = `${Date.now()}-${safeName}`;
        const filePath = `public/assets/${filename}`;
        state.status = 'uploading';
        state.errorMsg = '';
        render();
        try {
          const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
            method: 'PUT',
            headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `cms: upload asset ${filename}`, content: base64, branch: CONFIG.branch }),
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${res.status}`);
          }
          state.status = 'idle';
          state.successMsg = `Asset "${filename}" berhasil diupload.`;
          await loadAssets();
          resolve(`/${filePath.replace(/^public\//, '')}`);
        } catch (err) {
          state.status = 'error';
          state.errorMsg = `Upload gagal: ${err.message}`;
          render();
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

// Known asset registry — maps filenames to pages/sections for organized display
const ASSET_REGISTRY = [
  { name: 'logo.svg', page: 'Home', section: 'Navigation', label: 'Navbar Logo' },
  { name: 'Logo-Footer.svg', page: 'Home', section: 'Footer', label: 'Footer Logo' },
  { name: 'sederhana.png', page: 'Home', section: 'Sederhana', label: 'Sederhana Photo' },
  { name: 'map.png', page: 'Home', section: 'Footprint', label: 'World Map' },
  { name: 'hero-video-gmv.mp4', page: 'Home', section: 'Hero', label: 'Hero Video' },
];

async function replaceAsset(asset) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.svg,.pdf,.mp4,.webm,.mov';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return resolve(null);
      if (file.size > 5 * 1024 * 1024) { alert('File terlalu besar! Maksimal 5MB.'); return resolve(null); }
      if (!tokenIsValid()) { alert('GitHub PAT belum di-set!'); return resolve(null); }
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(',')[1];
        state.status = 'uploading'; state.errorMsg = ''; render();
        try {
          const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${asset.path}`, {
            method: 'PUT',
            headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `cms: replace asset ${asset.name}`, content: base64, sha: asset.sha, branch: CONFIG.branch }),
          });
          if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
          state.status = 'idle';
          state.successMsg = `"${asset.name}" berhasil diganti.`;
          await loadAssets();
          resolve(true);
        } catch (err) {
          state.status = 'error';
          state.errorMsg = `Gagal mengganti: ${err.message}`;
          render();
          resolve(null);
        }
      };
      reader.readAsDataURL(file);
    };
    input.click();
  });
}

async function deleteAsset(asset) {
  if (!confirm(`Hapus "${asset.name}"?\n\nPastikan asset ini tidak sedang dipakai di halaman manapun.`)) return;
  state.status = 'saving';
  render();
  try {
    await deleteFile(asset.path, asset.sha, `cms: delete asset ${asset.name}`);
    state.successMsg = `Asset "${asset.name}" dihapus.`;
    await loadAssets();
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal hapus: ${e.message}`;
    render();
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
    if (art) { art.sha = sha; art.published = parsed.frontmatter.published === true; }
    state.currentArticle = {
      file,
      sha,
      frontmatter: parsed.frontmatter,
      bodyEn: parsed.bodyEn || [],
      bodyId: parsed.bodyId || [],
      bodyEnRaw: parsed.enMd || '',
      bodyIdRaw: parsed.idMd || '',
    };
    state.bodyEnText = parsed.enMd || '';
    state.bodyIdText = parsed.idMd || '';
    const origKey = state.activePage + '_' + file;
    state.original[origKey] = JSON.parse(JSON.stringify(state.currentArticle));
    state.status = 'idle';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal memuat artikel: ${e.message}`;
  }
  render();
}

// ─── Article CRUD ──────────────────────────────────────────────────────────
function createNewArticle() {
  state.newArticleModal = true;
  state.newArticleSlug = 'gmv-';
  state.newArticleTitleEn = '';
  render();
}

async function submitNewArticle() {
  const rawSlug = state.newArticleSlug || '';
  const cleanSlug = rawSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!cleanSlug) {
    alert('Slug tidak valid — hanya huruf kecil, angka, dan dash.');
    return;
  }
  const titleEn = state.newArticleTitleEn || 'New Article';
  const filename = `content/articles/${cleanSlug}.md`;
  if (state.articles.some(a => a.file === filename)) {
    state.errorMsg = `File "${filename}" sudah ada.`;
    state.newArticleModal = false;
    render();
    return;
  }
  state.newArticleModal = false;
  const today = new Date().toISOString().split('T')[0];
  const tmpl = [
    '---',
    `title_en: "${titleEn.replace(/"/g, '\\"')}"`,
    `title_id: ""`,
    `slug: "${cleanSlug}"`,
    `excerpt_en: ""`,
    `excerpt_id: ""`,
    `cover_image: ""`,
    `show_image: true`,
    `author: "GMV Team"`,
    `date: "${today}"`,
    `category: "News"`,
    `tags_en: []`,
    `tags_id: []`,
    `featured: false`,
    `published: false`,
    '---',
    '',
    '[EN_CONTENT]',
    '',
    '[ID_CONTENT]',
    '',
  ].join('\n');
  state.status = 'saving';
  state.newArticleSlug = '';
  state.newArticleTitleEn = '';
  render();
  try {
    await saveFile(filename, tmpl, '', `Create article: ${cleanSlug}`);
    state.status = 'idle';
    state.successMsg = `Artikel "${cleanSlug}.md" berhasil dibuat. Klik untuk edit.`;
    await loadArticles();
    await loadArticle(filename);
    state.activePage = 'articles';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal membuat artikel: ${e.message}`;
  }
  render();
}

async function deleteArticle(file) {
  const name = file.split('/').pop();
  if (!confirm(`Yakin ingin menghapus "${name}"?\n\nTindakan ini tidak dapat dibatalkan!`)) return;
  state.status = 'saving';
  render();
  try {
    const { sha } = await loadFile(file);
    await deleteFile(file, sha, `Delete article: ${name}`);
    state.status = 'idle';
    state.successMsg = `Artikel dihapus: ${name}`;
    if (state.currentArticle && state.currentArticle.file === file) {
      state.currentArticle = null;
    }
    await loadArticles();
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal menghapus artikel: ${e.message}`;
  }
  render();
}

async function renameArticle(file) {
  const oldName = file.split('/').pop();
  const baseName = oldName.replace(/\.md$/, '');
  const newBase = prompt(`Rename "${oldName}" to:\n(Hanya nama file, contoh: ${baseName}-v2)`, baseName);
  if (!newBase || newBase === baseName) return;
  const cleanBase = newBase.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!cleanBase) {
    alert('Nama tidak valid.');
    return;
  }
  const newFile = `content/articles/${cleanBase}.md`;
  if (newFile === file) return;
  if (state.articles.some(a => a.file === newFile)) {
    alert(`File "${newFile}" sudah ada.`);
    return;
  }
  state.status = 'saving';
  render();
  try {
    const { sha, content } = await loadFile(file);
    // Create new file
    await saveFile(newFile, content, '', `Rename article: ${oldName} → ${cleanBase}.md`);
    // Delete old file
    await deleteFile(file, sha, `Delete old name: ${oldName}`);
    state.status = 'idle';
    state.successMsg = `Artikel di-rename: ${oldName} → ${cleanBase}.md`;
    if (state.currentArticle && state.currentArticle.file === file) {
      state.currentArticle = null;
    }
    await loadArticles();
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal me-rename artikel: ${e.message}`;
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
      if (art) { art.sha = newSha; art.published = state.currentArticle.frontmatter.published === true; }
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

// ─── Settings Modal ───────────────────────────────────────────────────────────
function renderSettingsModal() {
  if (!state.settingsOpen) return null;
  return h('div', { class: 'modal-backdrop', onclick: () => { state.settingsOpen = false; render(); } },
    h('div', { class: 'modal', onclick: (e) => e.stopPropagation() },
      h('div', { class: 'modal-header' },
        h('h2', { style: 'display:flex;align-items:center;gap:7px' }, icon('Settings', 12), 'Settings'),
        h('button', { class: 'close-btn', onclick: () => { state.settingsOpen = false; render(); } }, icon('X', 12))
      ),
      h('div', { class: 'modal-body' },
        h('div', { class: 'form-group' },
          h('label', null, 'GitHub Personal Access Token'),
          h('input', {
            type: 'password',
            value: state.pat != null ? state.pat : CONFIG.pat,
            placeholder: 'github_pat_xxxxxxxxxxxxxxxxxxxxxxxx',
            oninput: (e) => { state.pat = e.target.value.trim(); }
          }),
          h('p', { class: 'help-text' }, 'Token disimpan di browser (localStorage). Tidak dikirim ke server manapun selain GitHub API.')
        ),
        h('div', { class: 'form-group' },
          h('label', null, 'Repository'),
          h('input', { type: 'text', value: `${CONFIG.owner}/${CONFIG.repo}`, disabled: true })
        ),
        h('div', { class: 'form-group' },
          h('label', null, 'Branch'),
          h('input', { type: 'text', value: CONFIG.branch, disabled: true })
        )
      ),
      h('div', { class: 'modal-footer' },
        h('button', {
          class: 'save-settings-btn',
          onclick: () => {
            if (!state.pat || state.pat.length < 10) {
              alert('Token tidak valid — pastikan PAT yang dimasukkan benar.');
              return;
            }
            saveTokenToStorage(state.pat);
            CONFIG.pat = state.pat;
            state.settingsOpen = false;
            render();
            loadPage(state.activePage);
          }
        }, icon('Save', 12), ' Simpan Token'),
        h('button', {
          class: 'clear-settings-btn',
          onclick: () => {
            if (confirm('Yakin ingin menghapus token?')) {
              saveTokenToStorage(null);
              CONFIG.pat = '';
              state.pat = '';
              render();
            }
          }
        }, icon('Trash2', 12), ' Hapus Token')
      )
    )
  );
}

function renderNewArticleModal() {
  if (!state.newArticleModal) return null;
  const autoSlug = (title) => 'gmv-' + title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  return h('div', { class: 'modal-backdrop', onclick: () => { state.newArticleModal = false; render(); } },
    h('div', { class: 'modal', onclick: (e) => e.stopPropagation() },
      h('div', { class: 'modal-header' },
        h('h2', { style: 'display:flex;align-items:center;gap:7px' }, icon('FileText', 12), 'New Article'),
        h('button', { class: 'close-btn', onclick: () => { state.newArticleModal = false; render(); } }, icon('X', 12))
      ),
      h('div', { class: 'modal-body' },
        h('div', { class: 'form-group' },
          h('label', null, 'Title (English)'),
          h('input', {
            type: 'text',
            id: 'new-article-title',
            value: state.newArticleTitleEn || '',
            placeholder: 'e.g. GMV Expands to New Market',
            oninput: (e) => {
              state.newArticleTitleEn = e.target.value;
              const slugInput = document.getElementById('new-article-slug');
              if (slugInput && (!state.newArticleSlug || state.newArticleSlug === 'gmv-' || state._autoSlug)) {
                state._autoSlug = true;
                const generated = autoSlug(e.target.value);
                state.newArticleSlug = generated || 'gmv-';
                slugInput.value = state.newArticleSlug;
              }
            }
          })
        ),
        h('div', { class: 'form-group' },
          h('label', null, 'Slug (filename)'),
          h('input', {
            type: 'text',
            id: 'new-article-slug',
            value: state.newArticleSlug || '',
            placeholder: 'gmv-article-slug',
            oninput: (e) => { state._autoSlug = false; state.newArticleSlug = e.target.value.trim(); }
          }),
          h('p', { class: 'help-text' },
            'Saved as: content/articles/' + (state.newArticleSlug || 'slug') + '.md'
          )
        )
      ),
      h('div', { class: 'modal-footer' },
        h('button', { class: 'btn-secondary', onclick: () => { state.newArticleModal = false; state._autoSlug = false; render(); } }, 'Cancel'),
        h('button', { class: 'btn-primary-action', onclick: submitNewArticle }, 'Create Article')
      )
    )
  );
}

// ─── Render ──────────────────────────────────��───────────────────────────────
function render() {
  const root = $('#root');
  root.innerHTML = '';
  const topbar = renderTopbar();
  const sidebar = renderSidebar();
  const main = renderMain();
  root.append(h('div', { class: 'root' }, topbar, sidebar, main));
  const settingsModal = renderSettingsModal();
  if (settingsModal) root.append(settingsModal);
  // Render modals directly to document.body so they're never trapped by any
  // stacking context inside the CMS root div
  const existingModal = document.getElementById('cms-modal-layer');
  if (existingModal) existingModal.remove();
  const newArticleModal = renderNewArticleModal();
  if (newArticleModal) {
    newArticleModal.id = 'cms-modal-layer';
    document.body.appendChild(newArticleModal);
  }
  afterRender();
}

// Initializes WYSIWYG editor innerHTML from state (must run after DOM is built)
function afterRender() {
  if (!state.currentArticle) return;
  for (const lang of ['en', 'id']) {
    const editor = document.getElementById('wysiwyg-' + lang);
    if (!editor) continue;
    const stateKey = lang === 'en' ? 'bodyEnText' : 'bodyIdText';
    const md = state[stateKey] || '';
    editor.innerHTML = mdToHtml(md);
  }
}

function renderTopbar() {
  const page = PAGES[state.activePage];
  const isArticle = page.type === 'article-manager' && state.currentArticle;
  return h('div', { class: 'topbar' },
    h('div', { class: 'brand' },
      h('button', { class: 'hamburger', onclick: () => { state.sidebarOpen = !state.sidebarOpen; render(); } }, icon('Menu', 12)),
      h('div', { class: 'brand-mark' }, 'G'),
      h('span', { class: 'brand-name' }, 'GMV'),
      h('span', { class: 'brand-sub' }, 'CMS')
    ),
    h('div', { class: 'topbar-right' },
      h('button', {
        class: 'settings-btn',
        title: 'Settings',
        onclick: (e) => { e.stopPropagation(); state.settingsOpen = !state.settingsOpen; render(); }
      }, icon('Settings', 12)),
      isArticle ? h('button', { class: 'back-btn', onclick: () => { state.currentArticle = null; state.hasChanges = false; state.bodyEnText = null; state.bodyIdText = null; render(); } }, icon('ArrowLeft', 12), ' Back to Articles') : null,
      state.hasChanges ? h('div', { class: 'changes-dot', title: 'Ada perubahan belum disimpan' }) : null,
      !isArticle ? h('button', {
        class: `save-btn ${state.status === 'saved' ? 'saved' : state.status === 'error' ? 'error' : ''}`,
        onclick: savePage,
        disabled: !state.hasChanges || state.status === 'saving' || state.status === 'loading',
      },
        state.status === 'saving' && 'Menyimpan...',
        state.status === 'saved' && 'Tersimpan',
        state.status === 'error' && 'Gagal',
        (state.status === 'idle' || state.status === 'loading') && [icon('Upload', 12), ' Publish']
      ) : null
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
        h('span', { class: 'nav-icon' }, icon(p.icon, 12)),
        p.label
      )
    ),
    isSections ? h('div', { class: 'sidebar-divider' }) : null,
    isSections ? h('div', { class: 'sidebar-group' }, 'Sections') : null,
    isSections ? Object.entries(page.sections).map(([key, sec]) => {
      return h('div', {
        key, class: `nav-item ${state.activeSection === key ? 'active' : ''}`,
        onclick: (e) => { e.stopPropagation(); state.activeSection = key; state.sidebarOpen = false; render(); }
      },
        h('span', { class: 'nav-icon' }, icon(sec.icon, 12)),
        h('span', { class: 'nav-label' }, sec.label)
      );
    }) : null
  );
}

function setPage(key) {
  state.activePage = key;
  state.currentArticle = null;
  state.sidebarOpen = false;
  state.successMsg = '';
  state.errorMsg = '';
  state.bodyEnText = null;
  state.bodyIdText = null;
  const page = PAGES[key];
  if (page.type === 'sections') {
    state.activeSection = Object.keys(page.sections)[0];
  }
  if (page.type === 'asset-manager') {
    loadAssets();
    return;
  }
  if (page.type === 'integrations') {
    loadIntegrations();
    return;
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
  if (page.type === 'asset-manager') return renderAssetsPage();
  if (page.type === 'integrations') return renderIntegrationsPage();
  return h('main', { class: 'main' }, h('div', { class: 'status-bar error' }, 'Unknown page type'));
}

function renderSectionsPage() {
  const page = PAGES[state.activePage];
  const sec = page.sections[state.activeSection];
  const uniqueBilingualKeys = [...new Set(
    sec.fields.filter(f => f.block === 'bilingual').map(f => f.key)
  )];
  const hasVis = !!sec.visibleKey;
  const isVis = !hasVis || state.data[state.activePage]?.shared?.[sec.visibleKey] !== false;
  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, sec.label),
      h('div', { class: 'sec-actions' },
        hasVis ? h('div', { style: 'display:flex;align-items:center;gap:8px;' },
          h('span', { style: 'font-size:11px;color:var(--text-2);font-weight:600' }, isVis ? 'Visible' : 'Hidden'),
          h('span', {
            class: `vis-switch ${isVis ? 'vis-on' : 'vis-off'}`,
            style: 'opacity:1',
            title: isVis ? 'Section is visible — click to hide' : 'Section is hidden — click to show',
            onclick: () => toggleSectionVisibility(state.activeSection),
          },
            h('span', { class: 'vis-switch-track' }),
            h('span', { class: 'vis-switch-thumb' })
          )
        ) : null,
        h('span', { class: 'file-chip' }, `${page.file} → ${state.activeSection}`)
      )
    ),
    renderStatusBar(),
    state.status === 'loading' ? renderLoading(page.file) : renderFields(sec.fields, uniqueBilingualKeys)
  );
}

function renderFields(fields, uniqueBilingualKeys) {
  return h('div', { class: 'fields' },
    ...fields.filter(f => f.block === 'shared' || f.block === 'info').map(field => {
      // Info / note field
      if (field.type === 'info') {
        const noteEl = h('div', { class: 'info-note' });
        noteEl.innerHTML = field.note || '';
        return h('div', { class: 'field-card info' },
          h('div', { class: 'field-label' },
            h('span', { class: 'field-label-text', style: 'display:flex;align-items:center;gap:5px' }, icon('FileText', 12), field.label)
          ),
          noteEl
        );
      }
      const val = (state.data[state.activePage]?.shared?.[field.key]) ?? '';
      if (field.type === 'url') {
        const isExternalLink = field.key.includes('_url') && !field.key.endsWith('_src');
        const currentUrl = val;
        const isImgUrl = currentUrl && /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(currentUrl);
        const isVideoUrl = currentUrl && /\.(mp4|webm|mov)$/i.test(currentUrl);
        const fileName = currentUrl ? decodeURIComponent(currentUrl.split('/').pop().split('?')[0]) : '';
        const formatHints = {
          nav_logo_src: 'SVG, PNG — maks 1MB. Lebar ideal 120–180px.',
          hero_video_src: 'WebM (direkomendasikan), MP4 — maks 5MB. Atau tempel URL eksternal (Cloudflare Stream / YouTube).',
          sederhana_image_src: 'WebP (direkomendasikan), PNG, JPEG — maks 2MB. Rasio 4:3 disarankan.',
        };
        const hint = isExternalLink ? null : (formatHints[field.key] || 'WebP (direkomendasikan), PNG, SVG — maks 2MB.');
        let previewEl;
        if (currentUrl && isImgUrl) {
          previewEl = h('img', { src: currentUrl, style: 'width:52px;height:52px;object-fit:contain;border-radius:4px;border:1px solid var(--border);background:var(--surface-2);flex-shrink:0' });
        } else if (currentUrl && isVideoUrl) {
          previewEl = h('div', { style: 'width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-2);border:1px solid var(--border);border-radius:4px;background:var(--surface-2)' }, icon('Video', 14));
        } else {
          previewEl = h('div', { style: 'width:52px;height:52px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--dim);border:1px solid var(--border);border-radius:4px;background:var(--surface-2)' }, icon(isExternalLink ? 'Link' : 'Image', 14));
        }
        const urlInput = h('input', {
          class: 'field-input', type: 'text',
          placeholder: isExternalLink ? 'https://...' : 'Tempel URL atau klik Ganti...',
          value: currentUrl,
          oninput: (e) => handleChange('shared', field.key, e.target.value),
        });
        return h('div', { class: 'field-card shared' },
          h('div', { class: 'field-label' },
            h('span', { class: 'field-label-text' }, field.label),
            h('span', { class: 'badge shared' }, 'shared')
          ),
          h('div', { class: 'asset-url-field' },
            h('div', { style: 'display:flex;gap:10px;align-items:flex-start' },
              previewEl,
              h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;gap:6px' },
                fileName ? h('div', { class: 'asset-url-filename' }, fileName) : null,
                urlInput,
                !isExternalLink ? h('button', {
                  class: 'asset-url-upload-btn', type: 'button',
                  onclick: () => uploadSharedImage((url) => { handleChange('shared', field.key, url); urlInput.value = url; })
                }, icon('Upload', 12), ' Ganti File') : null
              )
            ),
            hint ? h('div', { class: 'asset-url-hint' }, icon('Info', 12), ' ', hint) : null
          )
        );
      }
      const inputEl = field.type === 'textarea'
        ? h('textarea', { class: 'field-textarea', rows: 3, placeholder: `Enter ${field.label}...`, oninput: (e) => handleChange('shared', field.key, e.target.value), value: val })
        : h('input', { class: 'field-input', type: 'text', placeholder: `Enter ${field.label}...`, oninput: (e) => handleChange('shared', field.key, e.target.value), value: val });
      return h('div', { class: 'field-card shared' },
        h('div', { class: 'field-label' },
          h('span', { class: 'field-label-text' }, field.label),
          h('span', { class: 'badge shared' }, 'shared')
        ),
        inputEl
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

// ─── Integrations ─────────────────────────────────────────────────────────────
async function loadIntegrations() {
  state.integrationsLoading = true;
  render();
  try {
    const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/content/home.md`, { headers: ghHeaders() });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    state.integrationsSha = json.sha;
    const raw = decodeURIComponent(escape(atob(json.content.replace(/\n/g, ''))));
    // Extract shared block from YAML frontmatter
    const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] || '';
    const get = (key) => {
      const m = fm.match(new RegExp(`(?:^|\\n)  ${key}:\\s*"?(.*?)"?\\s*(?:\\n|$)`));
      return m ? m[1].trim().replace(/^"(.*)"$/, '$1') : '';
    };
    state.integrations = {
      gtm_id: get('gtm_id'),
      ga4_id: get('ga4_id'),
      fb_pixel_id: get('fb_pixel_id'),
      custom_scripts: get('head_scripts_custom').replace(/\\n/g, '\n'),
    };
  } catch (e) {
    state.errorMsg = `Gagal memuat integrations: ${e.message}`;
  }
  state.integrationsLoading = false;
  render();
}

function assembleHeadScripts(ig) {
  const parts = [];
  if (ig.gtm_id) {
    parts.push(`<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${ig.gtm_id}');</script>\n<!-- End Google Tag Manager -->`);
  }
  if (ig.ga4_id) {
    parts.push(`<!-- Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=${ig.ga4_id}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ig.ga4_id}');</script>\n<!-- End Google Analytics -->`);
  }
  if (ig.fb_pixel_id) {
    parts.push(`<!-- Facebook Pixel -->\n<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${ig.fb_pixel_id}');fbq('track','PageView');</script>\n<!-- End Facebook Pixel -->`);
  }
  if (ig.custom_scripts) parts.push(ig.custom_scripts.trim());
  return parts.join('\n');
}

async function saveIntegrations() {
  if (!tokenIsValid()) { alert('GitHub PAT belum di-set!'); return; }
  state.status = 'saving'; state.errorMsg = ''; render();
  try {
    // Load latest home.md
    const getRes = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/content/home.md`, { headers: ghHeaders() });
    if (!getRes.ok) throw new Error(`HTTP ${getRes.status}`);
    const getJson = await getRes.json();
    const sha = getJson.sha;
    let raw = decodeURIComponent(escape(atob(getJson.content.replace(/\n/g, ''))));

    // Update/insert shared fields
    const updateSharedField = (src, key, value) => {
      // Escape for single-line YAML: encode newlines
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, '\\n');
      const re = new RegExp(`(\\n  ${key}:\\s*).*`);
      if (re.test(src)) return src.replace(re, `$1"${escaped}"`);
      // Append before the shared block closes (before next top-level key or ---)
      return src.replace(/(shared:\s*\n)((?:  [^\n]*\n)*)/, (_, header, fields) => `${header}${fields}  ${key}: "${escaped}"\n`);
    };

    const ig = state.integrations;
    const headScripts = assembleHeadScripts(ig);
    const customEsc = ig.custom_scripts || '';

    raw = updateSharedField(raw, 'gtm_id', ig.gtm_id);
    raw = updateSharedField(raw, 'ga4_id', ig.ga4_id);
    raw = updateSharedField(raw, 'fb_pixel_id', ig.fb_pixel_id);
    raw = updateSharedField(raw, 'head_scripts_custom', customEsc);
    raw = updateSharedField(raw, 'head_scripts', headScripts);

    const encoded = btoa(unescape(encodeURIComponent(raw)));
    const putRes = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/content/home.md`, {
      method: 'PUT',
      headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'cms: update integrations/head scripts', content: encoded, sha, branch: CONFIG.branch }),
    });
    if (!putRes.ok) { const e = await putRes.json().catch(() => ({})); throw new Error(e.message || `HTTP ${putRes.status}`); }
    state.status = 'idle';
    state.successMsg = 'Integrations saved! Vercel will rebuild with new scripts.';
  } catch (e) {
    state.status = 'error';
    state.errorMsg = `Gagal menyimpan: ${e.message}`;
  }
  render();
}

function renderIntegrationsPage() {
  const ig = state.integrations;
  const field = (label, key, placeholder, hint) =>
    h('div', { class: 'field-card shared' },
      h('div', { class: 'field-label' }, label),
      h('input', {
        class: 'field-input', type: 'text', value: ig[key] || '', placeholder,
        oninput: (e) => { state.integrations[key] = e.target.value; }
      }),
      hint ? h('div', { style: 'font-size:11px;color:var(--muted);margin-top:4px' }, hint) : null
    );

  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, 'Integrations'),
      h('div', { class: 'sec-actions' },
        h('button', { class: 'btn-primary-action', onclick: saveIntegrations }, icon('Send', 12), ' Save & Deploy')
      )
    ),
    renderStatusBar(),
    state.integrationsLoading ? renderLoading('integrations') :
      h('div', { style: 'max-width:640px;display:flex;flex-direction:column;gap:16px;' },

        h('div', { class: 'field-card shared', style: 'background:var(--gold-bg);border-color:var(--gold-border)' },
          h('div', { style: 'font-size:12px;color:var(--text-2);line-height:1.5;display:flex;align-items:flex-start;gap:7px' },
            icon('Info', 12),
            h('span', null, 'Scripts are injected into ', h('code', { style: 'font-size:11px;background:var(--surface-2);padding:1px 5px;border-radius:3px' }, '<head>'),
              ' on every page. After saving, Vercel will automatically rebuild the site.')
          )
        ),

        field('Google Tag Manager ID', 'gtm_id', 'GTM-XXXXXXX', 'Paste your GTM container ID — the full script tag will be generated automatically.'),
        field('Google Analytics 4 ID', 'ga4_id', 'G-XXXXXXXXXX', 'Measurement ID from GA4. Leave empty if you\'re using GTM to load GA4 instead.'),
        field('Facebook Pixel ID', 'fb_pixel_id', '1234567890123', 'Numeric Pixel ID from Facebook Events Manager.'),

        h('div', { class: 'field-card shared' },
          h('div', { class: 'field-label' }, 'Custom Head Scripts'),
          h('textarea', {
            class: 'field-input',
            style: 'min-height:120px;font-family:monospace;font-size:12px;resize:vertical',
            placeholder: '<!-- Paste any additional <script> or <meta> tags here -->',
            oninput: (e) => { state.integrations.custom_scripts = e.target.value; }
          }, ig.custom_scripts || ''),
          h('div', { style: 'font-size:11px;color:var(--muted);margin-top:4px' }, 'Raw HTML/JS injected as-is. Use for anything not covered above.')
        ),

        // Preview assembled output
        (ig.gtm_id || ig.ga4_id || ig.fb_pixel_id || ig.custom_scripts) ?
          h('div', { class: 'field-card shared' },
            h('div', { class: 'field-label' }, 'Preview — assembled head_scripts'),
            h('pre', {
              style: 'font-size:10px;color:var(--muted);white-space:pre-wrap;word-break:break-all;max-height:160px;overflow-y:auto;margin:0;background:var(--bg);padding:8px;border-radius:4px;border:1px solid var(--border)'
            }, assembleHeadScripts(ig) || '(empty)')
          ) : null
      )
  );
}

function renderAssetsPage() {
  const isImg = (name) => /\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(name);
  const isVideo = (name) => /\.(mp4|webm|mov)$/i.test(name);
  const fmtSize = (b) => b < 1024 ? b + ' B' : b < 1024 * 1024 ? (b / 1024).toFixed(1) + ' KB' : (b / 1024 / 1024).toFixed(1) + ' MB';

  if (state.assetsLoading) {
    return h('main', { class: 'main' },
      h('div', { class: 'sec-header' }, h('h1', { class: 'sec-title' }, 'Assets')),
      renderLoading('assets')
    );
  }

  // Build lookup by name
  const assetMap = {};
  state.assets.forEach(a => { assetMap[a.name] = a; });

  // Group registered assets by page·section
  const groups = {};
  ASSET_REGISTRY.forEach(reg => {
    const key = reg.page + ' · ' + reg.section;
    if (!groups[key]) groups[key] = [];
    groups[key].push(reg);
  });

  // Unregistered assets
  const registeredNames = new Set(ASSET_REGISTRY.map(r => r.name));
  const unregistered = state.assets.filter(a => !registeredNames.has(a.name));

  const renderAssetRow = ({ label, name }) => {
    const asset = assetMap[name];
    const exists = !!asset;
    let preview;
    if (exists && isImg(name)) {
      preview = h('img', { src: asset.rawUrl, style: 'width:48px;height:48px;object-fit:contain;border-radius:4px;border:1px solid var(--border);background:var(--bg);flex-shrink:0' });
    } else if (exists && isVideo(name)) {
      preview = h('div', { style: 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--text-2);border:1px solid var(--border);border-radius:4px;background:var(--surface-2)' }, icon('Video', 14));
    } else {
      preview = h('div', { style: 'width:48px;height:48px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--dim);border:1px solid var(--border);border-radius:4px;background:var(--surface-2)' }, icon('File', 14));
    }
    return h('div', { style: 'display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:6px;background:var(--surface);' },
      preview,
      h('div', { style: 'flex:1;min-width:0;' },
        h('div', { style: 'font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;' }, label),
        h('div', { style: 'font-size:11px;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' },
          exists ? `${name} — ${fmtSize(asset.size)}` : `${name} — tidak ditemukan`
        )
      ),
      exists ? h('button', { class: 'btn-sm', title: 'Ganti file (URL tetap sama)', onclick: () => replaceAsset(asset) }, icon('RefreshCw', 12), ' Ganti') : null
    );
  };

  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' }, h('h1', { class: 'sec-title' }, 'Assets')),
    renderStatusBar(),
    h('div', { style: 'padding:0 var(--space-lg);display:flex;flex-direction:column;gap:var(--space-xl);' },

      // Registered groups
      ...Object.entries(groups).map(([groupKey, items]) =>
        h('div', {},
          h('div', { class: 'sidebar-group', style: 'margin-bottom:8px;' }, groupKey),
          h('div', { style: 'display:flex;flex-direction:column;gap:8px;' },
            ...items.map(item => renderAssetRow(item))
          )
        )
      ),

      // Lainnya — unregistered
      unregistered.length > 0 ? h('div', {},
        h('div', { class: 'sidebar-group', style: 'margin-bottom:8px;' }, `Lainnya — tidak terpakai (${unregistered.length})`),
        h('div', { class: 'field-card info', style: 'margin-bottom:8px;' },
          h('div', { class: 'info-note' }, 'Asset berikut tidak terdaftar di halaman manapun. Pertimbangkan untuk menghapus jika sudah tidak diperlukan.')
        ),
        h('div', { style: 'display:flex;flex-direction:column;gap:8px;' },
          ...unregistered.map(a => {
            const fileIconEl = isImg(a.name) ? icon('Image', 14) : isVideo(a.name) ? icon('Video', 14) : icon('Paperclip', 14);
            return h('div', { style: 'display:flex;align-items:center;gap:12px;padding:12px 16px;border:1px solid var(--border);border-radius:6px;background:var(--surface);opacity:0.8;' },
              h('div', { style: 'width:40px;height:40px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--muted);border:1px solid var(--border);border-radius:4px;background:var(--surface-2)' }, fileIconEl),
              h('div', { style: 'flex:1;min-width:0;' },
                h('div', { style: 'font-size:13px;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;' }, a.name),
                h('div', { style: 'font-size:11px;color:var(--text-muted);' }, fmtSize(a.size) + ' · ' + a.url)
              ),
              h('button', { class: 'btn-sm btn-sm-danger', onclick: () => deleteAsset(a) }, icon('Trash2', 12), ' Hapus')
            );
          })
        )
      ) : null
    )
  );
}

function renderArticleManager() {
  return h('main', { class: 'main' },
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, 'Articles'),
      h('div', { class: 'sec-actions' },
        h('button', { class: 'btn-primary-action', onclick: createNewArticle }, icon('Plus', 12), ' New Article'),
        h('span', { class: 'file-chip' }, 'content/articles/')
      )
    ),
    renderStatusBar(),
    state.status === 'loading' ? renderLoading('articles list') :
      h('div', { class: 'article-list' },
        ...state.articles.map(art =>
          h('div', { class: 'article-card', onclick: () => loadArticle(art.file) },
            h('div', { class: 'article-name-row' },
              h('div', { style: 'display:flex;align-items:center;gap:8px;min-width:0' },
                h('div', { class: 'article-name' }, art.name),
                art.published === null
                  ? h('span', { class: 'article-status-badge loading' }, '·  ·  ·')
                  : h('span', { class: `article-status-badge ${art.published ? 'live' : 'draft'}` },
                    art.published ? icon('Radio', 12) : icon('FileEdit', 12),
                    ' ', art.published ? 'Live' : 'Draft'
                  )
              ),
              h('div', { class: 'article-actions-row' },
                h('button', { class: 'btn-sm btn-sm-danger', onclick: (e) => { e.stopPropagation(); deleteArticle(art.file); } }, 'Delete'),
                h('button', { class: 'btn-sm', onclick: (e) => { e.stopPropagation(); renameArticle(art.file); } }, 'Rename')
              )
            ),
            h('div', { class: 'article-path' }, art.file)
          )
        )
      )
  );
}

// ─── WYSIWYG helpers ──────────────────────────────────────────────────────────

// Walk a DOM node and emit markdown
function domToMd(node) {
  if (node.nodeType === 3) return node.textContent.replace(/ /g, ' ');
  if (node.nodeType !== 1) return '';
  const tag = node.tagName.toLowerCase();
  const inner = () => Array.from(node.childNodes).map(domToMd).join('');
  switch (tag) {
    case 'br': return '\n';
    case 'p': { const c = inner().trim(); return c ? c + '\n\n' : ''; }
    case 'div': { const c = inner().trim(); return c ? c + '\n' : ''; }
    case 'span': return inner();
    case 'b': case 'strong': { const c = inner().trim(); return c ? `**${c}**` : ''; }
    case 'i': case 'em': { const c = inner().trim(); return c ? `*${c}*` : ''; }
    case 's': case 'del': case 'strike': { const c = inner().trim(); return c ? `~~${c}~~` : ''; }
    case 'code': return `\`${inner()}\``;
    case 'pre': return '\n```\n' + node.textContent + '\n```\n\n';
    case 'a': { const href = node.getAttribute('href') || ''; const t = inner().trim(); return href ? `[${t}](${href})` : t; }
    case 'img': { const alt = node.getAttribute('alt') || ''; const src = node.getAttribute('src') || ''; return `![${alt}](${src})`; }
    case 'h1': return `\n# ${inner().trim()}\n\n`;
    case 'h2': return `\n## ${inner().trim()}\n\n`;
    case 'h3': return `\n### ${inner().trim()}\n\n`;
    case 'h4': return `\n#### ${inner().trim()}\n\n`;
    case 'blockquote': {
      const lines = inner().trim().split('\n');
      return '\n' + lines.map(l => `> ${l}`).join('\n') + '\n\n';
    }
    case 'ul': {
      const items = Array.from(node.querySelectorAll(':scope > li'));
      if (!items.length) return inner();
      return '\n' + items.map(li => `- ${domToMd(li).trim()}`).join('\n') + '\n\n';
    }
    case 'ol': {
      const items = Array.from(node.querySelectorAll(':scope > li'));
      if (!items.length) return inner();
      return '\n' + items.map((li, i) => `${i + 1}. ${domToMd(li).trim()}`).join('\n') + '\n\n';
    }
    case 'li': return inner().trim();
    default: return inner();
  }
}

function htmlToMd(html) {
  if (!html || html === '<br>' || !html.trim()) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return domToMd(div).replace(/\n{3,}/g, '\n\n').trim();
}

function mdToHtml(md) {
  if (!md || !md.trim()) return '';
  if (typeof marked !== 'undefined') {
    try {
      marked.setOptions({ breaks: false, gfm: true });
      return marked.parse(md);
    } catch (e) { /* fall through */ }
  }
  // Minimal fallback
  return md.split('\n\n').map(block => {
    if (!block.trim()) return '';
    const b = block.trim();
    if (b.startsWith('### ')) return `<h3>${b.slice(4)}</h3>`;
    if (b.startsWith('## ')) return `<h2>${b.slice(3)}</h2>`;
    if (b.startsWith('# ')) return `<h1>${b.slice(2)}</h1>`;
    if (b.startsWith('> ')) return `<blockquote>${b.slice(2)}</blockquote>`;
    const lines = b.split('\n');
    if (lines.every(l => l.match(/^[-*] /))) {
      return `<ul>${lines.map(l => `<li>${l.slice(2)}</li>`).join('')}</ul>`;
    }
    const inline = b
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/~~(.+?)~~/g, '<del>$1</del>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
    return `<p>${inline}</p>`;
  }).join('');
}

// Sync WYSIWYG editor innerHTML → state (does NOT call render)
function handleWysiwygInput(lang) {
  const editor = document.getElementById('wysiwyg-' + lang);
  if (!editor) return;
  _updateBodyState(lang, htmlToMd(editor.innerHTML));
}

// Apply execCommand formatting to focused WYSIWYG editor
function formatWysiwyg(lang, cmd, val) {
  const editor = document.getElementById('wysiwyg-' + lang);
  if (!editor) return;
  editor.focus();
  try { document.execCommand(cmd, false, val || null); } catch (e) { }
  handleWysiwygInput(lang);
}

function insertWysiwygLink(lang) {
  const url = prompt('URL:');
  if (!url) return;
  formatWysiwyg(lang, 'createLink', url);
}

async function insertWysiwygImage(lang) {
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return; }
    if (!tokenIsValid()) { alert('GitHub PAT belum di-set!'); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = `content/assets/articles/${filename}`;
      const saveBtn = document.querySelector('.save-btn');
      if (saveBtn) { saveBtn.textContent = 'Uploading...'; saveBtn.disabled = true; }
      try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `cms: upload image ${filename}`, content: base64, branch: CONFIG.branch }),
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
        const publicUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
        const editor = document.getElementById('wysiwyg-' + lang);
        if (editor) {
          editor.focus();
          document.execCommand('insertHTML', false, `<img src="${publicUrl}" alt="${file.name}">`);
          handleWysiwygInput(lang);
        }
        if (saveBtn) { saveBtn.textContent = 'Publish'; saveBtn.disabled = !state.hasChanges; }
      } catch (err) {
        if (saveBtn) { saveBtn.textContent = 'Upload gagal'; setTimeout(() => { if (saveBtn) { saveBtn.textContent = 'Publish'; saveBtn.disabled = !state.hasChanges; } }, 3000); }
        alert(`Upload gagal: ${err.message}`);
      }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ─── Section visibility toggle ────────────────────────────────────────────────
function toggleSectionVisibility(sectionKey) {
  const page = PAGES[state.activePage];
  const sec = page?.sections?.[sectionKey];
  if (!sec?.visibleKey) return;
  if (!state.data[state.activePage]) return;
  if (!state.data[state.activePage].shared) state.data[state.activePage].shared = {};
  const current = state.data[state.activePage].shared[sec.visibleKey];
  const isVisible = current === undefined ? true : current !== false;
  state.data[state.activePage].shared[sec.visibleKey] = !isVisible;
  recomputeHasChanges();
  updateSaveBtn();
  updateChangesDot();
  render();
}

// ─── Rich Text Editor ─────────────────────────────────────────────────────────

function makeToolbarBtn(label, onclick, title) {
  return h('button', { class: 'tb-btn', type: 'button', title: title || label, onclick }, label);
}

function _updateBodyState(lang, newVal) {
  const bodyKey = lang === 'en' ? 'bodyEn' : 'bodyId';
  const rawKey = lang === 'en' ? 'bodyEnRaw' : 'bodyIdRaw';
  const stateKey = lang === 'en' ? 'bodyEnText' : 'bodyIdText';
  state[stateKey] = newVal;
  if (state.currentArticle) {
    state.currentArticle[bodyKey] = mdToBlocks(newVal);
    state.currentArticle[rawKey] = newVal;
  }
  recomputeHasChanges();
  updateSaveBtn();
  updateChangesDot();
}

function insertFormatting(lang, before, after) {
  const ta = document.getElementById('body-ta-' + lang);
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e);
  const newVal = ta.value.substring(0, s) + before + sel + after + ta.value.substring(e);
  ta.value = newVal;
  ta.selectionStart = s + before.length;
  ta.selectionEnd = e + before.length;
  ta.focus();
  _updateBodyState(lang, newVal);
}

function insertLinePrefix(lang, prefix) {
  const ta = document.getElementById('body-ta-' + lang);
  if (!ta) return;
  const s = ta.selectionStart;
  const lineStart = ta.value.lastIndexOf('\n', s - 1) + 1;
  const hasPrefix = ta.value.substring(lineStart).startsWith(prefix);
  let newVal, newS;
  if (hasPrefix) {
    newVal = ta.value.substring(0, lineStart) + ta.value.substring(lineStart + prefix.length);
    newS = Math.max(s - prefix.length, lineStart);
  } else {
    newVal = ta.value.substring(0, lineStart) + prefix + ta.value.substring(lineStart);
    newS = s + prefix.length;
  }
  ta.value = newVal;
  ta.selectionStart = ta.selectionEnd = newS;
  ta.focus();
  _updateBodyState(lang, newVal);
}

function insertLink(lang) {
  const ta = document.getElementById('body-ta-' + lang);
  if (!ta) return;
  const s = ta.selectionStart, e = ta.selectionEnd;
  const sel = ta.value.substring(s, e) || 'link text';
  const url = prompt('URL:');
  if (!url) { ta.focus(); return; }
  const insert = `[${sel}](${url})`;
  const newVal = ta.value.substring(0, s) + insert + ta.value.substring(e);
  ta.value = newVal;
  ta.selectionStart = s;
  ta.selectionEnd = s + insert.length;
  ta.focus();
  _updateBodyState(lang, newVal);
}

async function insertImageInEditor(lang) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Max 2MB'); return; }
    if (!tokenIsValid()) { alert('GitHub PAT belum di-set!'); return; }
    // Save cursor pos before file dialog steals focus
    const ta = document.getElementById('body-ta-' + lang);
    const insertPos = ta ? ta.selectionStart : -1;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target.result.split(',')[1];
      const safeName = file.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
      const filename = `${Date.now()}-${safeName}`;
      const filePath = `content/assets/articles/${filename}`;
      // Lightweight status — don't call render() to avoid losing textarea content
      const saveBtn = document.querySelector('.save-btn');
      if (saveBtn) { saveBtn.textContent = 'Uploading...'; saveBtn.disabled = true; }
      try {
        const res = await fetch(`https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents/${filePath}`, {
          method: 'PUT',
          headers: { ...ghHeaders(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `cms: upload image ${filename}`, content: base64, branch: CONFIG.branch }),
        });
        if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
        const publicUrl = `https://raw.githubusercontent.com/${CONFIG.owner}/${CONFIG.repo}/${CONFIG.branch}/${filePath}`;
        const imgMd = `\n![${file.name}](${publicUrl})\n`;
        const ta2 = document.getElementById('body-ta-' + lang);
        if (ta2) {
          const p = insertPos >= 0 ? insertPos : ta2.value.length;
          const newVal = ta2.value.substring(0, p) + imgMd + ta2.value.substring(p);
          ta2.value = newVal;
          ta2.selectionStart = ta2.selectionEnd = p + imgMd.length;
          ta2.focus();
          _updateBodyState(lang, newVal);
        }
        if (saveBtn) { saveBtn.textContent = 'Publish'; saveBtn.disabled = !state.hasChanges; }
      } catch (err) {
        if (saveBtn) { saveBtn.textContent = 'Upload gagal'; }
        alert(`Upload gagal: ${err.message}`);
        setTimeout(() => { if (saveBtn) { saveBtn.textContent = 'Publish'; saveBtn.disabled = !state.hasChanges; } }, 3000);
      }
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function renderBodyEditor(lang) {
  const langClass = lang === 'en' ? 'en' : 'id';
  const placeholder = lang === 'en' ? 'Write English body content here...' : 'Tulis konten Bahasa Indonesia di sini...';
  return h('div', { class: `body-editor ${langClass}` },
    h('div', { class: 'body-editor-header' },
      h('span', { class: `badge ${langClass}` }, lang.toUpperCase()),
      h('span', { class: 'body-editor-hint' }, 'WYSIWYG — select text, then click toolbar')
    ),
    h('div', { class: 'editor-toolbar' },
      makeToolbarBtn('B', () => formatWysiwyg(lang, 'bold'), 'Bold'),
      makeToolbarBtn('I', () => formatWysiwyg(lang, 'italic'), 'Italic'),
      makeToolbarBtn('~~', () => formatWysiwyg(lang, 'strikeThrough'), 'Strikethrough'),
      h('span', { class: 'tb-sep' }),
      makeToolbarBtn('H2', () => formatWysiwyg(lang, 'formatBlock', 'h2'), 'Heading 2'),
      makeToolbarBtn('H3', () => formatWysiwyg(lang, 'formatBlock', 'h3'), 'Heading 3'),
      makeToolbarBtn('❝', () => formatWysiwyg(lang, 'formatBlock', 'blockquote'), 'Blockquote'),
      h('span', { class: 'tb-sep' }),
      makeToolbarBtn('• List', () => formatWysiwyg(lang, 'insertUnorderedList'), 'Bullet list'),
      makeToolbarBtn('1. List', () => formatWysiwyg(lang, 'insertOrderedList'), 'Numbered list'),
      h('span', { class: 'tb-sep' }),
      makeToolbarBtn('Link', () => insertWysiwygLink(lang), 'Insert link'),
      makeToolbarBtn('Image', () => insertWysiwygImage(lang), 'Upload & insert image'),
    ),
    // innerHTML is set by afterRender() after DOM is built
    h('div', {
      id: 'wysiwyg-' + lang,
      class: 'wysiwyg-editor',
      contenteditable: 'true',
      'data-placeholder': placeholder,
      oninput: () => handleWysiwygInput(lang),
      onpaste: (e) => {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        if (text) document.execCommand('insertText', false, text);
        handleWysiwygInput(lang);
      },
    })
  );
}

function renderArticleEditor() {
  const art = state.currentArticle;
  if (!art) return h('main', { class: 'main' }, h('div', { class: 'sec-header' }, h('h1', { class: 'sec-title' }, 'Select an article')));
  const fm = art.frontmatter;
  const isLive = fm.published === true;
  const isSaving = state.status === 'saving' || state.status === 'uploading';

  function fieldHint(text) {
    return h('div', { style: 'font-size:11px;color:var(--muted);margin-top:3px;line-height:1.4' }, text);
  }
  function fieldLabel(text) {
    return h('div', { class: 'field-label' }, h('span', { class: 'field-label-text' }, text));
  }

  return h('main', { class: 'main article-editor-main' },
    // ─── Header ─────────────────────────────────────────────────────────
    h('div', { class: 'sec-header' },
      h('h1', { class: 'sec-title' }, fm.title_en || 'Artikel Tanpa Judul'),
      h('span', { class: 'file-chip' }, art.file)
    ),
    renderStatusBar(),
    h('div', { class: 'fields' },

      // ─── Informasi Artikel ────────────────────────────────────────────
      h('h2', { class: 'field-group-title' }, 'Informasi Artikel'),

      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          fieldLabel('Judul (English)'),
          h('input', { class: 'field-input', value: fm.title_en || '', oninput: (e) => handleArticleChange('frontmatter', 'title_en', e.target.value) })
        ),
        h('div', { class: 'field-card id' },
          fieldLabel('Judul (Indonesia)'),
          h('input', { class: 'field-input', value: fm.title_id || '', oninput: (e) => handleArticleChange('frontmatter', 'title_id', e.target.value) })
        )
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('URL Slug'),
        h('input', { class: 'field-input', value: fm.slug || '', oninput: (e) => handleArticleChange('frontmatter', 'slug', e.target.value) }),
        fieldHint('Bagian URL artikel di website. Contoh: gmv-asia-pacific → website.com/press/gmv-asia-pacific')
      ),

      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          fieldLabel('Ringkasan (English)'),
          h('textarea', { class: 'field-textarea', rows: 2, value: fm.excerpt_en || '', oninput: (e) => handleArticleChange('frontmatter', 'excerpt_en', e.target.value) }),
          fieldHint('Deskripsi singkat artikel, tampil di halaman daftar artikel.')
        ),
        h('div', { class: 'field-card id' },
          fieldLabel('Ringkasan (Indonesia)'),
          h('textarea', { class: 'field-textarea', rows: 2, value: fm.excerpt_id || '', oninput: (e) => handleArticleChange('frontmatter', 'excerpt_id', e.target.value) }),
          fieldHint('Deskripsi singkat versi Bahasa Indonesia.')
        )
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('Penulis'),
        h('input', { class: 'field-input', value: fm.author || '', oninput: (e) => handleArticleChange('frontmatter', 'author', e.target.value) })
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('Tanggal Terbit'),
        h('input', { class: 'field-input', type: 'date', value: fm.date || '', oninput: (e) => handleArticleChange('frontmatter', 'date', e.target.value) })
      ),

      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card shared' },
          fieldLabel('Kategori'),
          h('input', { class: 'field-input', value: fm.category || '', oninput: (e) => handleArticleChange('frontmatter', 'category', e.target.value) })
        ),
        h('div', { class: 'field-card shared' },
          fieldLabel('Estimasi Baca (menit)'),
          h('input', { class: 'field-input', type: 'number', value: fm.read_time || '', oninput: (e) => handleArticleChange('frontmatter', 'read_time', e.target.value) }),
          fieldHint('Contoh: 5 untuk artikel 5 menit baca.')
        )
      ),

      // ─── Gambar Cover ────────────────────────────────────────────────
      h('div', { class: 'field-card shared' },
        h('div', { style: 'display:flex;align-items:center;justify-content:space-between' },
          h('div', {},
            fieldLabel('Gambar Cover'),
            fieldHint('Foto utama artikel yang tampil di halaman daftar & detail.')
          ),
          h('div', { style: 'display:flex;align-items:center;gap:8px;' },
            h('span', { style: 'font-size:11px;color:var(--text-2);font-weight:600' }, fm.show_image !== false ? 'Ditampilkan' : 'Disembunyikan'),
            h('span', {
              class: `vis-switch ${fm.show_image !== false ? 'vis-on' : 'vis-off'}`,
              style: 'opacity:1;cursor:pointer',
              title: fm.show_image !== false ? 'Klik untuk sembunyikan gambar cover' : 'Klik untuk tampilkan gambar cover',
              onclick: () => { handleArticleChange('frontmatter', 'show_image', fm.show_image === false); render(); }
            },
              h('span', { class: 'vis-switch-track' }),
              h('span', { class: 'vis-switch-thumb' })
            )
          )
        ),
        fm.show_image !== false ? h('div', { style: 'margin-top:10px' },
          h('div', { style: 'display:flex;gap:8px;align-items:center' },
            h('input', { class: 'field-input', style: 'flex:1;min-width:0', value: fm.cover_image || '', placeholder: 'Paste URL atau klik Upload →', oninput: (e) => handleArticleChange('frontmatter', 'cover_image', e.target.value) }),
            h('button', { class: 'btn-sm', type: 'button', onclick: uploadCoverImage }, icon('Upload', 12), ' Upload')
          ),
          h('div', { style: 'font-size:11px;color:var(--muted);margin-top:4px' }, 'WebP (direkomendasikan), PNG, JPEG — maks 5MB.'),
          fm.cover_image ? h('img', { src: fm.cover_image, style: 'margin-top:8px;max-width:100%;max-height:120px;border-radius:4px;border:1px solid var(--border);object-fit:cover' }) : null
        ) : null
      ),

      // ─── Konten Artikel ───────────────────────────────────────────────
      h('h2', { class: 'field-group-title' }, 'Konten Artikel'),
      renderBodyEditor('en'),
      renderBodyEditor('id'),

      // ─── SEO & Social Sharing ─────────────────────────────────────────
      h('h2', { class: 'field-group-title' }, 'SEO & Social Sharing'),
      h('div', { class: 'field-card info' },
        h('div', { class: 'info-note' }, 'Bagian ini mengatur tampilan artikel saat dibagikan di Google, WhatsApp, Twitter, dll. Kosongkan untuk otomatis pakai judul & ringkasan di atas.')
      ),

      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          fieldLabel('Judul SEO (English)'),
          h('input', { class: 'field-input', value: fm.og_title_en || '', placeholder: 'Kosongkan → pakai Judul utama', oninput: (e) => handleArticleChange('frontmatter', 'og_title_en', e.target.value) })
        ),
        h('div', { class: 'field-card id' },
          fieldLabel('Judul SEO (Indonesia)'),
          h('input', { class: 'field-input', value: fm.og_title_id || '', placeholder: 'Kosongkan → pakai Judul utama', oninput: (e) => handleArticleChange('frontmatter', 'og_title_id', e.target.value) })
        )
      ),

      h('div', { class: 'bilingual-row' },
        h('div', { class: 'field-card en' },
          fieldLabel('Deskripsi SEO (English)'),
          h('textarea', { class: 'field-textarea', rows: 2, value: fm.og_description_en || '', placeholder: 'Kosongkan → pakai Ringkasan', oninput: (e) => handleArticleChange('frontmatter', 'og_description_en', e.target.value) })
        ),
        h('div', { class: 'field-card id' },
          fieldLabel('Deskripsi SEO (Indonesia)'),
          h('textarea', { class: 'field-textarea', rows: 2, value: fm.og_description_id || '', placeholder: 'Kosongkan → pakai Ringkasan', oninput: (e) => handleArticleChange('frontmatter', 'og_description_id', e.target.value) })
        )
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('Gambar Share (OG Image)'),
        h('input', { class: 'field-input', value: fm.og_image || '', placeholder: 'Kosongkan → pakai Gambar Cover', oninput: (e) => handleArticleChange('frontmatter', 'og_image', e.target.value) }),
        fieldHint('Gambar yang muncul saat artikel dibagikan ke media sosial. Ukuran ideal: 1200×630px.')
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('Kata Kunci (pisah dengan koma)'),
        h('input', { class: 'field-input', value: (fm.keywords || []).join(', '), placeholder: 'minang, padang, indonesia, ekspansi', oninput: (e) => handleArticleChange('frontmatter', 'keywords', e.target.value.split(',').map(s => s.trim()).filter(Boolean)) }),
        fieldHint('Kata kunci untuk mesin pencari.')
      ),

      h('div', { class: 'field-card shared' },
        fieldLabel('Format Twitter Card'),
        h('select', { class: 'field-input', style: 'background:transparent;border:none;color:var(--text);font-family:var(--font);font-size:13px;cursor:pointer;', onchange: (e) => handleArticleChange('frontmatter', 'twitter_card', e.target.value) },
          h('option', { value: 'summary_large_image', selected: (fm.twitter_card || 'summary_large_image') === 'summary_large_image' }, 'Summary Large Image (disarankan)'),
          h('option', { value: 'summary', selected: fm.twitter_card === 'summary' }, 'Summary'),
          h('option', { value: 'app', selected: fm.twitter_card === 'app' }, 'App'),
          h('option', { value: 'player', selected: fm.twitter_card === 'player' }, 'Player')
        )
      )
    ),

    // ─── Sticky Publish Bar ───────────────────────────────────────────────
    h('div', { class: `article-publish-bar ${isLive ? 'is-live' : 'is-draft'}` },
      h('div', { class: 'article-publish-status' },
        h('span', { class: `article-status-badge ${isLive ? 'live' : 'draft'}`, style: 'font-size:12px;padding:3px 10px' },
          isLive ? icon('Radio', 12) : icon('FileEdit', 12),
          ' ', isLive ? 'Live' : 'Draft'
        ),
        h('span', { style: 'font-size:12px;color:var(--text-2)' },
          isLive ? 'Artikel ini sudah tampil di website.' : 'Artikel ini belum dipublikasikan.'
        )
      ),
      h('div', { style: 'display:flex;gap:8px' },
        isLive
          ? h('button', {
            class: 'btn-secondary',
            disabled: isSaving,
            onclick: () => { handleArticleChange('frontmatter', 'published', false); savePage(); }
          }, icon('EyeOff', 12), ' Jadikan Draft')
          : null,
        h('button', {
          class: 'save-btn',
          disabled: isSaving,
          onclick: () => {
            if (!isLive) handleArticleChange('frontmatter', 'published', false);
            savePage();
          }
        }, icon('Save', 12), isLive ? ' Simpan Perubahan' : ' Simpan Draft'),
        !isLive
          ? h('button', {
            class: 'btn-publish',
            disabled: isSaving,
            onclick: () => { handleArticleChange('frontmatter', 'published', true); savePage(); }
          }, icon('Globe', 12), ' Publish ke Website')
          : null
      )
    )
  );
}

function renderBodyBlocks(lang) {
  const langLabel = lang === 'en' ? 'en' : 'id';
  const blocks = state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)] || [];
  return h('div', { class: 'body-blocks' },
    ...blocks.map((block, idx) => renderBodyBlock(lang, block, idx)),
    h('div', { class: 'add-block-btn', onclick: () => addBlock(lang) }, '+ Add Paragraph')
  );
}

function renderBodyBlock(lang, block, idx) {
  const blockIdx = idx;
  const isEn = lang === 'en';
  const langClass = isEn ? 'en' : 'id';
  const typeOpt = BLOCK_TYPES.map(t =>
    h('option', { value: t.value, selected: block.type === t.value }, t.label)
  );

  return h('div', { class: `body-block ${langClass}` },
    // Block toolbar
    h('div', { class: 'block-toolbar' },
      h('select', { class: 'block-type-select', onchange: (e) => handleBlockChange(lang, blockIdx, 'type', e.target.value) },
        ...typeOpt
      ),
      h('div', { class: 'block-actions' },
        h('button', { class: 'block-move-up', onclick: (e) => { e.stopPropagation(); moveBlock(lang, blockIdx, -1); } }, '↑'),
        h('button', { class: 'block-move-down', onclick: (e) => { e.stopPropagation(); moveBlock(lang, blockIdx, 1); } }, '↓'),
        h('button', { class: 'block-delete', onclick: (e) => { e.stopPropagation(); deleteBlock(lang, blockIdx); } }, '🗑')
      )
    ),

    // Text content
    h('div', { class: 'block-text-wrap' },
      h('textarea', {
        class: 'block-textarea', rows: block.type === 'heading' ? 1 : block.type === 'subheading' ? 1 : 4, placeholder: 'Type content...', value: block.text || '',
        oninput: (e) => handleBlockChange(lang, blockIdx, 'text', e.target.value)
      }
      ),
      // Image input
      h('div', { class: 'block-image-row' },
        h('input', {
          class: 'block-image-input', type: 'text', placeholder: 'Image URL (e.g. https://raw.githubusercontent.com/...)', value: block.image || '',
          oninput: (e) => handleBlockChange(lang, blockIdx, 'image', e.target.value)
        }
        ),
        h('button', { class: 'block-image-upload-btn', type: 'button', onclick: () => uploadImage(lang, blockIdx) }, '📷 Upload')
      )
    )
  );
}

// ─── Block operations ─────────────────────────────────────────────────────────

function addBlock(lang) {
  const blocks = state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)] || [];
  blocks.push({ type: 'paragraph', text: '', image: '' });
  state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)] = blocks;
  recomputeHasChanges();
  updateSaveBtn();
  render();
  // Focus new textarea
  setTimeout(() => {
    const allTextareas = document.querySelectorAll('.body-blocks .block-textarea');
    const last = allTextareas[allTextareas.length - 1];
    if (last) last.focus();
  }, 100);
}

function deleteBlock(lang, idx) {
  const blocks = state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)];
  if (!blocks || blocks.length <= 1) return;
  blocks.splice(idx, 1);
  recomputeHasChanges();
  updateSaveBtn();
  render();
}

function moveBlock(lang, idx, dir) {
  const blocks = state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)];
  if (!blocks) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= blocks.length) return;
  [blocks[idx], blocks[newIdx]] = [blocks[newIdx], blocks[idx]];
  recomputeHasChanges();
  render();
}

function handleBlockChange(lang, idx, key, value) {
  const blocks = state.currentArticle['body' + lang.charAt(0).toUpperCase() + lang.slice(1)];
  if (!blocks || !blocks[idx]) return;
  blocks[idx][key] = value;
  recomputeHasChanges();
  updateSaveBtn();
}

function renderStatusBar() {
  if (state.status === 'saved') {
    return h('div', { class: 'status-bar saved' },
      h('div', { class: 's-dot' }),
      'Berhasil dipublish. GitHub Actions akan trigger redeploy (~60 detik).'
    );
  }
  if (state.successMsg) {
    const msg = state.successMsg;
    return h('div', { class: 'status-bar saved' },
      h('div', { class: 's-dot' }),
      msg,
      h('button', {
        class: 'status-dismiss',
        onclick: () => { state.successMsg = ''; render(); }
      }, icon('X', 12))
    );
  }
  if (state.status === 'uploading') {
    return h('div', { class: 'status-bar' },
      h('div', { class: 's-dot' }),
      'Mengupload gambar ke GitHub...'
    );
  }
  if (state.status === 'error' && state.errorMsg) {
    return h('div', { class: 'status-bar error' },
      h('div', { class: 's-dot' }),
      state.errorMsg,
      h('button', {
        class: 'status-dismiss',
        onclick: () => { state.errorMsg = ''; state.status = 'idle'; render(); }
      }, icon('X', 12))
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
