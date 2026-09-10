/* ============================================================
   Noy's 21st — script.js
   ============================================================ */

(function () {
  "use strict";

  /* ---------------- Cake SVG (shared, parameterized by id suffix) ---------------- */

  function cakeSVG(suffix) {
    return `
    <svg viewBox="0 0 220 220" width="220" height="220" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="110" cy="188" rx="72" ry="10" fill="#3D2C56" opacity="0.08"/>
      <!-- plate -->
      <ellipse cx="110" cy="176" rx="66" ry="9" fill="#D9C9F0"/>
      <!-- bottom tier -->
      <rect x="52" y="128" width="116" height="48" rx="10" fill="#B79AE8"/>
      <rect x="52" y="128" width="116" height="14" rx="7" fill="#C7AEEF"/>
      <!-- top tier -->
      <rect x="72" y="92" width="76" height="42" rx="9" fill="#9B7EDE"/>
      <rect x="72" y="92" width="76" height="12" rx="6" fill="#AC93E6"/>
      <!-- drip dots -->
      <circle cx="86" cy="106" r="4" fill="#FBF8FD"/>
      <circle cx="110" cy="104" r="4" fill="#FBF8FD"/>
      <circle cx="134" cy="106" r="4" fill="#FBF8FD"/>
      <!-- candle -->
      <rect x="104" y="66" width="10" height="28" rx="2" fill="#FFF6EA"/>
      <rect x="104" y="66" width="10" height="6" fill="#FFB86B"/>
      <!-- flame -->
      <g id="flame-${suffix}" class="flame">
        <path d="M109 44c6 7 9 12 9 17a9 9 0 1 1-18 0c0-5 3-10 9-17z" fill="#FFB86B"/>
        <path d="M109 52c3 4 4.5 7 4.5 9.5a4.5 4.5 0 1 1-9 0c0-2.5 1.5-5.5 4.5-9.5z" fill="#FFE3B0"/>
      </g>
      <!-- smoke (hidden until blown) -->
      <g id="smoke-${suffix}" class="smoke">
        <path d="M109 40c-4-4-4-9 0-13" stroke="#C7BBD6" stroke-width="3" fill="none" stroke-linecap="round"/>
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
    if (name === "finale") {
      // not a one-time lazy init — reset the whole sequence every visit so
      // it can be replayed from the menu as many times as they like
      resetFinaleVisual();
      return;
    }

    if (initialized.has(name)) return;
    initialized.add(name);

    try {
      if (name === "photos") initPhotos();
      if (name === "music") initMusic();
      if (name === "flowers") initFlowers();
    } catch (err) {
      // surface the real error on-page instead of a silent blank page —
      // makes any future bug screenshot-able and fixable immediately
      initialized.delete(name);
      const page = getPage(name);
      const body = page && page.querySelector(".subpage-body");
      if (body) {
        const msg = document.createElement("div");
        msg.style.cssText = "padding:16px;color:#a33;font-size:0.82rem;font-family:monospace;white-space:pre-wrap;";
        msg.textContent = "Something broke loading this page:\n" + (err && err.message ? err.message : err);
        body.prepend(msg);
      }
      console.error("initPage(" + name + ") failed:", err);
    }
  }

  /* ---------------- Photos: lazy-loaded scattered gallery + lightbox ---------------- */

  function initPhotos() {
    const grid = document.getElementById("photo-grid");
    const photos = (typeof MEDIA !== "undefined" && MEDIA.photos) || [];

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
    const m = (typeof MEDIA !== "undefined" && MEDIA.music) || {};
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
    (m.tracklist || []).forEach((track, i) => {
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

  // Realistic mixed bouquet: tulips, daffodils, and hyacinth clusters,
  // fanned above a kraft-paper wrap — modeled on a real bouquet photo.

  function tulipMarkup(cx, cy, size, color) {
    return [-15, 0, 15].map((rot) => `
      <g transform="translate(${cx} ${cy}) rotate(${rot})">
        <path class="bq-petal" d="M0,2
          C ${-size * 0.46},${-size * 0.3} ${-size * 0.34},${-size * 1.05} 0,${-size * 1.3}
          C ${size * 0.34},${-size * 1.05} ${size * 0.46},${-size * 0.3} 0,2 Z"
          fill="${color}"/>
      </g>`).join("");
  }

  function daffodilMarkup(cx, cy, size, petalColor, centerColor) {
    const petals = [];
    for (let i = 0; i < 6; i++) {
      const angle = 60 * i;
      petals.push(`
        <g transform="translate(${cx} ${cy}) rotate(${angle})">
          <ellipse class="bq-petal" cx="0" cy="${-size * 0.62}" rx="${size * 0.32}" ry="${size * 0.48}" fill="${petalColor}"/>
        </g>`);
    }
    return petals.join("") +
      `<ellipse class="bq-petal" cx="${cx}" cy="${cy - size * 0.06}" rx="${size * 0.3}" ry="${size * 0.24}" fill="${centerColor}"/>`;
  }

  function hyacinthMarkup(cx, cy, size, color) {
    const dots = [];
    const rows = 6;
    for (let i = 0; i < rows; i++) {
      const rowY = cy - i * size * 0.34;
      const rowWidth = size * (1 - i / rows) * 1.1;
      const count = Math.max(2, 5 - i);
      for (let j = 0; j < count; j++) {
        const t = count === 1 ? 0 : j / (count - 1) - 0.5;
        const dx = t * rowWidth;
        const jitter = (i % 2 === 0) ? size * 0.08 : -size * 0.08;
        dots.push(`<circle class="bq-petal" cx="${cx + dx + jitter}" cy="${rowY}" r="${size * 0.15}" fill="${color}"/>`);
      }
    }
    return dots.join("");
  }

  function fillerMarkup(cx, cy, size, color) {
    const petals = [0, 90, 180, 270].map((rot) => `
      <g transform="translate(${cx} ${cy}) rotate(${rot})">
        <ellipse class="bq-petal" cx="0" cy="${-size * 0.5}" rx="${size * 0.26}" ry="${size * 0.36}" fill="${color}"/>
      </g>`).join("");
    return petals + `<circle class="bq-petal" cx="${cx}" cy="${cy}" r="${size * 0.2}" fill="#F2C94C"/>`;
  }

  function flowerGroupMarkup(f) {
    if (f.type === "tulip") return tulipMarkup(f.cx, f.cy, f.size, f.color);
    if (f.type === "daffodil") return daffodilMarkup(f.cx, f.cy, f.size, f.petal, f.center);
    if (f.type === "hyacinth") return hyacinthMarkup(f.cx, f.cy, f.size, f.color);
    if (f.type === "filler") return fillerMarkup(f.cx, f.cy, f.size, f.color);
    return "";
  }

  // Fanned arrangement: taller stems toward the back-center, shorter and
  // wider toward the sides, mixed colors like the reference bouquet.
  const BOUQUET_FLOWERS = [
    { type: "tulip",    cx: 126, cy: 66,  size: 26, color: "#7B5BC4", r: 0 },
    { type: "tulip",    cx: 96,  cy: 78,  size: 26, color: "#B79AE8", r: -10 },
    { type: "tulip",    cx: 156, cy: 78,  size: 26, color: "#F2C94C", r: 10 },
    { type: "daffodil", cx: 68,  cy: 100, size: 22, petal: "#FBF8FD", center: "#F2C94C", r: -16 },
    { type: "daffodil", cx: 186, cy: 98,  size: 22, petal: "#FBF8FD", center: "#F2C94C", r: 16 },
    { type: "tulip",    cx: 112, cy: 104, size: 24, color: "#E8A9C4", r: -4 },
    { type: "tulip",    cx: 142, cy: 104, size: 24, color: "#E8A9C4", r: 4 },
    { type: "hyacinth", cx: 52,  cy: 90,  size: 15, color: "#9B7EDE", r: -20 },
    { type: "hyacinth", cx: 200, cy: 88,  size: 15, color: "#7B5BC4", r: 20 },
    { type: "filler",   cx: 84,  cy: 62,  size: 11, color: "#FBF8FD", r: 0 },
    { type: "filler",   cx: 168, cy: 60,  size: 11, color: "#FBF8FD", r: 0 },
    { type: "daffodil", cx: 126, cy: 118, size: 20, petal: "#F2C94C", center: "#7B5BC4", r: 0 },
  ];

  function bouquetSVG() {
    const flowersMarkup = BOUQUET_FLOWERS.map((f, i) => `
      <g class="bq-flower" id="bq-f${i}" style="--r:${f.r}deg">
        ${flowerGroupMarkup(f)}
      </g>`).join("");

    return `
    <svg viewBox="0 0 260 320" width="240" height="290" xmlns="http://www.w3.org/2000/svg">
      <!-- leaves, tucked behind the flowers -->
      <path class="bq-leaf" id="bq-leaf1" style="--lr:-18deg" d="M75 150 C 38 138, 26 190, 52 218 C 58 182, 64 165, 75 150 Z" fill="var(--leaf)"/>
      <path class="bq-leaf" id="bq-leaf2" style="--lr:16deg" d="M185 150 C 224 140, 236 190, 210 217 C 202 182, 195 164, 185 150 Z" fill="var(--leaf)"/>
      <path class="bq-leaf" id="bq-leaf3" style="--lr:-4deg" d="M110 140 C 96 172, 96 200, 106 228 C 114 198, 116 166, 110 140 Z" fill="var(--leaf)"/>
      <path class="bq-leaf" id="bq-leaf4" style="--lr:6deg" d="M148 140 C 160 172, 160 200, 150 228 C 142 198, 140 166, 148 140 Z" fill="var(--leaf)"/>

      <!-- flowers -->
      ${flowersMarkup}

      <!-- kraft paper wrap, in front over the stems -->
      <g class="bq-wrap" id="bq-wrap">
        <path d="M40 168 L220 168 L182 296 Q130 316 78 296 Z" fill="var(--wrap)" stroke="var(--wrap-line)" stroke-width="2"/>
        <path d="M40 168 L130 220 L220 168" fill="none" stroke="var(--wrap-line)" stroke-width="1.4" opacity="0.55"/>
        <path d="M78 296 L130 220 L182 296" fill="none" stroke="var(--wrap-line)" stroke-width="1.4" opacity="0.55"/>
        <!-- raffia tie -->
        <rect x="103" y="180" width="54" height="11" rx="5.5" fill="var(--raffia)" transform="rotate(-2 130 185)"/>
        <path d="M116 186 q-16 18 -6 36" fill="none" stroke="var(--raffia)" stroke-width="4" stroke-linecap="round"/>
        <path d="M144 186 q16 18 6 36" fill="none" stroke="var(--raffia)" stroke-width="4" stroke-linecap="round"/>
      </g>
    </svg>`;
  }

  function initFlowers() {
    const stage = document.getElementById("bouquet-stage");
    stage.innerHTML = bouquetSVG();

    const leaves = Array.from(stage.querySelectorAll(".bq-leaf"));
    leaves.forEach((leaf, i) => setTimeout(() => leaf.classList.add("is-shown"), i * 140));

    const flowers = Array.from(stage.querySelectorAll(".bq-flower"));
    const bloomStagger = 70;
    flowers.forEach((f, i) => {
      setTimeout(() => {
        f.classList.add("is-bloomed");
        // once bloomed, ease into a gentle continuous sway so the bouquet feels alive
        const swayDur = 3600 + Math.round(Math.random() * 1800);
        const swayDelay = Math.round(Math.random() * 600);
        f.style.setProperty("--sway-dur", swayDur + "ms");
        f.style.setProperty("--sway-delay", swayDelay + "ms");
        setTimeout(() => f.classList.add("is-swaying"), 780);
      }, i * bloomStagger);
    });

    const wrap = stage.querySelector("#bq-wrap");
    wrap.classList.add("is-shown");

    const notesWrap = document.getElementById("flower-notes");
    const notes = (typeof MEDIA !== "undefined" && MEDIA.flowerNotes) || [];
    const notesStart = flowers.length * bloomStagger + 500;
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

  function resetFinaleVisual() {
    document.getElementById("flame-finale").classList.remove("is-out");
    document.getElementById("smoke-finale").classList.remove("is-active");
    document.getElementById("finale-cake-slot").classList.remove("is-shifted");
    document.getElementById("finale-message").classList.remove("is-in");
    document.getElementById("finale-hint").style.opacity = "";
    finaleFired = false;
  }

  function runFinale() {
    if (finaleFired) return;
    finaleFired = true;

    const hint = document.getElementById("finale-hint");
    hint.style.opacity = "0";

    // 1. flame extinguishes
    document.getElementById("flame-finale").classList.add("is-out");
    document.getElementById("smoke-finale").classList.add("is-active");

    // 2. cake slides left
    setTimeout(() => {
      document.getElementById("finale-cake-slot").classList.add("is-shifted");
    }, 260);

    // 3. Happy Birthday audio plays
    setTimeout(() => {
      const audioEl = document.getElementById("hbd-audio");
      const src = typeof MEDIA !== "undefined" && MEDIA.happyBirthdayAudio && MEDIA.happyBirthdayAudio.src;
      if (src) {
        audioEl.src = src;
        audioEl.play().catch(() => {
          /* autoplay can be blocked until user gesture elsewhere on some browsers;
             the tap that triggered runFinale should satisfy most, this is a safe no-op fallback */
        });
      }
    }, 500);

    // 4. message box slides in with the final message
    setTimeout(() => {
      document.getElementById("finale-message-body").textContent =
        (typeof MEDIA !== "undefined" && MEDIA.letter && MEDIA.letter.body) ||
        "PLACEHOLDER — final birthday message goes here.";
      document.getElementById("finale-message").classList.add("is-in");
    }, 900);
  }

  /* ---------------- utils ---------------- */

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
