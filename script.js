/* ============================================================
   Noy's 21st — script.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Cake SVG (shared, parameterized by id suffix) ---------------- */

  function cakeSVG(suffix) {
    return `
    <svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="188" rx="72" ry="10" fill="#1E1B16" opacity="0.06"/>
      <!-- plate -->
      <ellipse cx="110" cy="176" rx="66" ry="9" fill="#FBF4E3" stroke="#1E1B16" stroke-width="1.6"/>
      <!-- bottom tier -->
      <rect x="52" y="128" width="116" height="48" rx="10" fill="#F3E8D2" stroke="#1E1B16" stroke-width="1.6"/>
      <rect x="52" y="128" width="116" height="14" rx="7" fill="#FBF4E3" stroke="#1E1B16" stroke-width="1.2"/>
      <!-- top tier -->
      <rect x="72" y="92" width="76" height="42" rx="9" fill="#F3E8D2" stroke="#1E1B16" stroke-width="1.6"/>
      <rect x="72" y="92" width="76" height="12" rx="6" fill="#FBF4E3" stroke="#1E1B16" stroke-width="1.2"/>
      <!-- drip dots -->
      <circle cx="86" cy="106" r="3.5" fill="none" stroke="#1E1B16" stroke-width="1.3"/>
      <circle cx="110" cy="104" r="3.5" fill="none" stroke="#1E1B16" stroke-width="1.3"/>
      <circle cx="134" cy="106" r="3.5" fill="none" stroke="#1E1B16" stroke-width="1.3"/>
      <!-- candle -->
      <rect x="104" y="66" width="10" height="28" rx="2" fill="#FBF4E3" stroke="#1E1B16" stroke-width="1.4"/>
      <rect x="104" y="66" width="10" height="6" fill="none" stroke="#1E1B16" stroke-width="1.2"/>
      <!-- flame -->
      <g id="flame-${suffix}" class="flame">
        <path d="M109 44c6 7 9 12 9 17a9 9 0 1 1-18 0c0-5 3-10 9-17z" fill="#D98C86"/>
        <path d="M109 52c3 4 4.5 7 4.5 9.5a4.5 4.5 0 1 1-9 0c0-2.5 1.5-5.5 4.5-9.5z" fill="#E9C6C2"/>
      </g>
      <!-- smoke (hidden until blown) -->
      <g id="smoke-${suffix}" class="smoke">
        <path d="M109 40c-4-4-4-9 0-13" stroke="#6E6759" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  document.getElementById("landing-cake").innerHTML = cakeSVG("landing");
  document.getElementById("finale-cake").innerHTML = cakeSVG("finale");

  /* ---------------- Page navigation ---------------- */

  const pages = Array.from(document.querySelectorAll(".page"));
  function getPage(name) { return document.getElementById("page-" + name); }

  function goTo(name) {
    const current = document.querySelector(".page.is-active");
    const next = getPage(name);
    if (!next || next === current) return;

    if (current) {
      current.classList.add("is-leaving");
      current.classList.remove("is-active");
    }
    // allow layout to settle, then activate next
    requestAnimationFrame(() => {
      next.classList.add("is-active");
      requestAnimationFrame(() => {
        if (current) current.classList.remove("is-leaving");
      });
    });

    // lazy-init per-page content the first time it's visited
    initPage(name);
  }

  document.getElementById("landing-cake-btn").addEventListener("click", () => goTo("menu"));

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => goTo(btn.getAttribute("data-goto")));
  });

  document.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => goTo("menu"));
  });

  /* ---------------- Per-page lazy init ---------------- */

  const initialized = new Set();

  function initPage(name) {
    if (initialized.has(name)) return;
    initialized.add(name);

    if (name === "photos") initPhotos();
    if (name === "music") initMusic();
    if (name === "flowers") initFlowers();
  }

  /* ---------------- Photos: lazy-loaded scattered gallery + lightbox ---------------- */

  function initPhotos() {
    const grid = document.getElementById("photo-grid");
    const photos = (window.MEDIA && MEDIA.photos) || [];

    if (photos.length === 0) {
      grid.innerHTML = `<p class="empty-note">photos will show up here once they're added — check that assets/media.js on the live site actually has your photos array filled in.</p>`;
      return;
    }

    photos.forEach((photo, i) => {
      const card = document.createElement("button");
      card.className = "photo-card";
      card.setAttribute("aria-label", photo.caption || `Photo ${i + 1}`);

      const img = document.createElement("img");
      img.dataset.src = photo.src;
      img.alt = photo.caption || `Photo ${i + 1}`;
      img.loading = "lazy"; // native lazy-load as a baseline
      img.width = 400;
      img.height = 500;
      img.addEventListener("error", () => {
        card.classList.add("photo-card-broken");
        card.innerHTML = `<div class="photo-fallback">photo didn't load</div>`;
      });

      card.appendChild(img);
      card.addEventListener("click", () => openLightbox(photo.src, img.alt));
      grid.appendChild(card);
    });

    // IntersectionObserver: only fetch full src when a card nears viewport
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            io.unobserve(img);
          }
        });
      },
      { root: document.querySelector(".subpage-body"), rootMargin: "300px 0px" }
    );

    grid.querySelectorAll("img[data-src]").forEach((img) => io.observe(img));
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
  }
  document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightboxImg.src = "";
  }

  /* ---------------- Music ---------------- */

  function initMusic() {
    const m = (window.MEDIA && MEDIA.music) || {};
    const featured = m.featured || {};
    document.getElementById("featured-title").textContent = featured.title || "Untitled";
    document.getElementById("featured-artist").textContent = featured.artist || "";

    const slot = document.getElementById("featured-embed-slot");
    if (featured.embedUrl) {
      const iframe = document.createElement("iframe");
      iframe.className = "music-embed";
      iframe.src = featured.embedUrl;
      iframe.allow = "autoplay; encrypted-media";
      iframe.loading = "lazy";
      slot.appendChild(iframe);
    } else {
      const ph = document.createElement("div");
      ph.className = "music-embed-placeholder";
      ph.textContent = "Featured track embed goes here — paste an embed URL into MEDIA.music.featured.embedUrl";
      slot.appendChild(ph);
    }

    const list = document.getElementById("tracklist");
    const tracks = m.tracklist || [];
    if (tracks.length === 0) {
      list.innerHTML = `<li class="empty-note">no tracks yet — add some in Studio's Music section and make sure assets/media.js on the live site got updated.</li>`;
    }
    tracks.forEach((track, i) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="track-index">${String(i + 1).padStart(2, "0")}</span>
        <span>
          <div class="track-title">${escapeHTML(track.title)}</div>
          <div class="track-artist">${escapeHTML(track.artist || "")}</div>
        </span>`;
      list.appendChild(li);
    });
  }

  /* ---------------- Flowers: an actual wrapped bouquet ---------------- */

  // a small cluster of overlapping rounded petals — reads like a hyacinth /
  // hydrangea spray of tiny blooms rather than one big flat flower
  function clusterMarkup(cx, cy, color, count, spread) {
    let out = "";
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (i % 2) * 0.3;
      const dist = spread * (0.35 + 0.65 * ((i * 53) % 100) / 100);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * 0.85;
      const r = spread * 0.32 * (0.75 + ((i * 37) % 100) / 200);
      out += `<circle class="bq-dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${color}" stroke="#1E1B16" stroke-width="0.8"/>`;
    }
    return out;
  }

  // a single tulip-cup bloom on a thin stem, for taller accents poking above the spray
  function tulipMarkup(cx, topY, stemLen, color) {
    const bottomY = topY + stemLen;
    return `
      <line x1="${cx}" y1="${topY + 22}" x2="${cx}" y2="${bottomY}" stroke="#8FA37E" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M${cx - 11} ${topY + 20} Q${cx - 13} ${topY + 2} ${cx - 5} ${topY - 6}
               Q${cx} ${topY - 10} ${cx + 5} ${topY - 6}
               Q${cx + 13} ${topY + 2} ${cx + 11} ${topY + 20}
               Q${cx} ${topY + 26} ${cx - 11} ${topY + 20} Z"
            fill="${color}" stroke="#1E1B16" stroke-width="1"/>`;
  }

  const CLUSTERS = [
    { cx: 92,  cy: 108, color: "#B9A8D9", count: 9, spread: 24 },
    { cx: 150, cy: 100, color: "#E9C97A", count: 8, spread: 22 },
    { cx: 68,  cy: 138, color: "#FBF4E3", count: 7, spread: 20 },
    { cx: 176, cy: 132, color: "#E3B0A9", count: 8, spread: 21 },
    { cx: 122, cy: 128, color: "#E9B7BE", count: 7, spread: 19 },
    { cx: 46,  cy: 116, color: "#D98C86", count: 6, spread: 16 },
    { cx: 198, cy: 108, color: "#B9A8D9", count: 6, spread: 16 },
  ];

  const TULIPS = [
    { cx: 100, topY: 46, stemLen: 60, color: "#E3B0A9" },
    { cx: 140, topY: 38, stemLen: 68, color: "#FBF4E3" },
    { cx: 122, topY: 58, stemLen: 48, color: "#E9C97A" },
  ];

  function bouquetSVG() {
    const clustersMarkup = CLUSTERS.map((c, i) => `
      <g class="bq-flower" id="bq-f${i}">
        ${clusterMarkup(c.cx, c.cy, c.color, c.count, c.spread)}
      </g>`).join("");

    const tulipsMarkup = TULIPS.map((t, i) => `
      <g class="bq-flower" id="bq-t${i}">
        ${tulipMarkup(t.cx, t.topY, t.stemLen, t.color)}
      </g>`).join("");

    return `
    <svg class="bq-sway-group" viewBox="0 0 260 320" width="240" height="290" xmlns="http://www.w3.org/2000/svg">
      <!-- leaves, tucked behind the flowers -->
      <path class="bq-leaf" id="bq-leaf1" style="--lr:-18deg" d="M75 150 C 40 140, 30 190, 55 215 C 60 180, 65 165, 75 150 Z" fill="#8FA37E" stroke="#1E1B16" stroke-width="1"/>
      <path class="bq-leaf" id="bq-leaf2" style="--lr:16deg" d="M185 150 C 222 142, 232 190, 205 214 C 200 180, 194 164, 185 150 Z" fill="#8FA37E" stroke="#1E1B16" stroke-width="1"/>
      <path class="bq-leaf" id="bq-leaf3" style="--lr:2deg" d="M130 140 C 130 175, 130 200, 130 230 C 118 200, 118 165, 130 140 Z" fill="#8FA37E" stroke="#1E1B16" stroke-width="1"/>

      <!-- taller tulip accents, then the clustered spray in front -->
      ${tulipsMarkup}
      ${clustersMarkup}

      <!-- kraft paper wrap, in front over the stems -->
      <g class="bq-wrap" id="bq-wrap">
        <path d="M38 166 L222 166 L184 298 Q130 318 76 298 Z" fill="#D8B888" stroke="#8A6A3E" stroke-width="2"/>
        <path d="M38 166 L130 220 L222 166" fill="none" stroke="#8A6A3E" stroke-width="1.3" opacity="0.55"/>
        <path d="M76 298 L130 220 L184 298" fill="none" stroke="#8A6A3E" stroke-width="1.3" opacity="0.55"/>
        <rect x="108" y="174" width="44" height="13" rx="6" fill="#8A6A3E" transform="rotate(-3 130 181)"/>
      </g>
    </svg>`;
  }

  function initFlowers() {
    const stage = document.getElementById("bouquet-stage");
    stage.innerHTML = bouquetSVG();

    const leaves = Array.from(stage.querySelectorAll(".bq-leaf"));
    leaves.forEach((leaf, i) => setTimeout(() => leaf.classList.add("is-shown"), i * 140));

    const flowers = Array.from(stage.querySelectorAll(".bq-flower"));
    const bloomStagger = 160;
    flowers.forEach((f, i) => {
      setTimeout(() => f.classList.add("is-bloomed"), 260 + i * bloomStagger);
    });

    // once everything has bloomed, the whole bouquet gets one gentle
    // continuous sway (never removed, never fades back out)
    const swayGroup = stage.querySelector(".bq-sway-group");
    setTimeout(() => swayGroup.classList.add("is-swaying"), 260 + flowers.length * bloomStagger + 300);

    const wrap = stage.querySelector("#bq-wrap");
    setTimeout(() => wrap.classList.add("is-shown"), 120);

    const notesWrap = document.getElementById("flower-notes");
    const notes = (window.MEDIA && MEDIA.flowerNotes) || [];
    const notesStart = 260 + flowers.length * bloomStagger + 400;
    notes.forEach((note, i) => {
      const p = document.createElement("p");
      p.className = "flower-note";
      p.textContent = note;
      notesWrap.appendChild(p);
      setTimeout(() => p.classList.add("is-shown"), notesStart + i * 200);
    });
  }

  /* ---------------- Finale: the choreographed sequence ---------------- */

  let finaleFired = false;

  document.getElementById("finale-cake-btn").addEventListener("click", runFinale);

  function runFinale() {
    if (finaleFired) return;
    finaleFired = true;

    const hint = document.getElementById("finale-hint");
    hint.style.opacity = "0";

    // 1. flame extinguishes + a soft burst of light for the "wow" moment
    document.getElementById("flame-finale").classList.add("is-out");
    document.getElementById("smoke-finale").classList.add("is-active");
    document.getElementById("finale-glow").classList.add("is-burst");

    // 2. cake shrinks slightly and settles to the left
    setTimeout(() => {
      document.getElementById("finale-cake-slot").classList.add("is-shifted");
    }, 260);

    // 3. Happy Birthday audio plays
    setTimeout(() => {
      const audioEl = document.getElementById("hbd-audio");
      const src = window.MEDIA && MEDIA.happyBirthdayAudio && MEDIA.happyBirthdayAudio.src;
      if (src) {
        audioEl.src = src;
        audioEl.play().catch(() => {
          /* autoplay can be blocked until user gesture elsewhere on some browsers;
             the tap that triggered runFinale should satisfy most, this is a safe no-op fallback */
        });
      }
    }, 500);

    // 4. the letter unfurls in on the right, next to the cake
    setTimeout(() => {
      document.getElementById("finale-message-body").textContent =
        (window.MEDIA && MEDIA.letter && MEDIA.letter.body) ||
        "PLACEHOLDER — final birthday message goes here.";
      document.getElementById("finale-message").classList.add("is-in");
    }, 750);
  }

  /* ---------------- utils ---------------- */

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
