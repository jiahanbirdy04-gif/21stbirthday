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
    if (name === "video") initVideo();
    if (name === "flowers") initFlowers();
    if (name === "letter") initLetter();
  }

  /* ---------------- Photos: lazy-loaded scattered gallery + lightbox ---------------- */

  function initPhotos() {
    const grid = document.getElementById("photo-grid");
    const photos = (window.MEDIA && MEDIA.photos) || [];

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

  /* ---------------- Video ---------------- */

  function initVideo() {
    const wrap = document.getElementById("video-wrap");
    const v = (window.MEDIA && MEDIA.video) || {};

    if (v.src) {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "none"; // don't pull the ~50MB file until user presses play
      video.poster = v.poster || "";
      video.src = v.src;
      wrap.appendChild(video);
    } else {
      const ph = document.createElement("div");
      ph.className = "video-placeholder";
      ph.textContent = "Video goes here once hosted (Supabase/Cloudinary/Streamable) — paste the public URL into MEDIA.video.src";
      wrap.appendChild(ph);
    }
  }

  /* ---------------- Flowers: an actual wrapped bouquet ---------------- */

  // one flower "bloom": a ring of petals around a center, sized/colored per spec
  function flowerMarkup(cx, cy, size, petalColor, centerColor, petalCount) {
    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      const angle = (360 / petalCount) * i;
      petals.push(
        `<g transform="translate(${cx} ${cy}) rotate(${angle})">
           <ellipse class="bq-petal" cx="0" cy="${-size * 0.68}" rx="${size * 0.36}" ry="${size * 0.55}" fill="${petalColor}" stroke="#1E1B16" stroke-width="1"/>
         </g>`
      );
    }
    return `${petals.join("")}<circle cx="${cx}" cy="${cy}" r="${size * 0.32}" fill="${centerColor}" stroke="#1E1B16" stroke-width="1"/>`;
  }

  // Bouquet layout: a handful of flowers of varied size/color at hand-placed
  // positions, wrapped in paper, with a couple of leaves for realism.
  const BOUQUET_FLOWERS = [
    { cx: 100, cy: 96,  size: 30, petals: "#FBF4E3", center: "#D98C86", n: 6, r: -6 },
    { cx: 150, cy: 88,  size: 26, petals: "#E9C6C2", center: "#F3E8D2", n: 6, r: 5 },
    { cx: 70,  cy: 118, size: 24, petals: "#F3E8D2", center: "#D98C86", n: 5, r: -10 },
    { cx: 180, cy: 116, size: 22, petals: "#FBF4E3", center: "#8FA37E", n: 5, r: 9 },
    { cx: 122, cy: 60,  size: 22, petals: "#FBF4E3", center: "#E9C6C2", n: 6, r: 2 },
    { cx: 60,  cy: 78,  size: 18, petals: "#E9C6C2", center: "#D98C86", n: 5, r: -14 },
    { cx: 190, cy: 76,  size: 18, petals: "#F3E8D2", center: "#8FA37E", n: 5, r: 12 },
  ];

  function bouquetSVG() {
    const flowersMarkup = BOUQUET_FLOWERS.map((f, i) => `
      <g class="bq-flower" id="bq-f${i}" style="--r:${f.r}deg">
        ${flowerMarkup(f.cx, f.cy, f.size, f.petals, f.center, f.n)}
      </g>`).join("");

    return `
    <svg viewBox="0 0 260 320" width="240" height="290" xmlns="http://www.w3.org/2000/svg">
      <!-- leaves, tucked behind the flowers -->
      <path class="bq-leaf" id="bq-leaf1" style="--lr:-18deg" d="M75 150 C 40 140, 30 190, 55 215 C 60 180, 65 165, 75 150 Z" fill="var(--leaf)"/>
      <path class="bq-leaf" id="bq-leaf2" style="--lr:16deg" d="M185 150 C 222 142, 232 190, 205 214 C 200 180, 194 164, 185 150 Z" fill="var(--leaf)"/>
      <path class="bq-leaf" id="bq-leaf3" style="--lr:2deg" d="M130 140 C 130 175, 130 200, 130 230 C 118 200, 118 165, 130 140 Z" fill="var(--leaf)"/>

      <!-- flowers -->
      ${flowersMarkup}

      <!-- paper wrap, in front over the stems -->
      <g class="bq-wrap" id="bq-wrap">
        <path d="M40 168 L220 168 L182 296 Q130 316 78 296 Z" fill="var(--wrap)" stroke="var(--wrap-line)" stroke-width="2"/>
        <path d="M40 168 L130 220 L220 168" fill="none" stroke="var(--wrap-line)" stroke-width="1.4" opacity="0.6"/>
        <path d="M78 296 L130 220 L182 296" fill="none" stroke="var(--wrap-line)" stroke-width="1.4" opacity="0.6"/>
        <rect x="110" y="176" width="40" height="14" rx="7" fill="var(--accent-deep)" transform="rotate(-3 130 183)"/>
      </g>
    </svg>`;
  }

  function initFlowers() {
    const stage = document.getElementById("bouquet-stage");
    stage.innerHTML = bouquetSVG();

    const leaves = Array.from(stage.querySelectorAll(".bq-leaf"));
    leaves.forEach((leaf, i) => setTimeout(() => leaf.classList.add("is-shown"), i * 140));

    const flowers = Array.from(stage.querySelectorAll(".bq-flower"));
    const bloomStagger = 190;
    flowers.forEach((f, i) => {
      setTimeout(() => {
        f.classList.add("is-bloomed");
        // once bloomed, ease into a gentle continuous sway so the bouquet feels alive
        const swayDur = 3600 + Math.round(Math.random() * 1800);
        const swayDelay = Math.round(Math.random() * 600);
        f.style.setProperty("--sway-dur", swayDur + "ms");
        f.style.setProperty("--sway-delay", swayDelay + "ms");
        setTimeout(() => f.classList.add("is-swaying"), 780);
      }, 260 + i * bloomStagger);
    });

    const wrap = stage.querySelector("#bq-wrap");
    setTimeout(() => wrap.classList.add("is-shown"), 120);

    const notesWrap = document.getElementById("flower-notes");
    const notes = (window.MEDIA && MEDIA.flowerNotes) || [];
    const notesStart = 260 + flowers.length * bloomStagger + 200;
    notes.forEach((note, i) => {
      const p = document.createElement("p");
      p.className = "flower-note";
      p.textContent = note;
      notesWrap.appendChild(p);
      setTimeout(() => p.classList.add("is-shown"), notesStart + i * 200);
    });
  }

  /* ---------------- Letter ---------------- */

  function initLetter() {
    const body = (window.MEDIA && MEDIA.letter && MEDIA.letter.body) || "";
    document.getElementById("letter-body").textContent = body;
  }

  /* ---------------- Finale: the choreographed sequence ---------------- */

  let finaleFired = false;

  document.getElementById("finale-cake-btn").addEventListener("click", runFinale);

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
      const src = window.MEDIA && MEDIA.happyBirthdayAudio && MEDIA.happyBirthdayAudio.src;
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
        (window.MEDIA && MEDIA.letter && MEDIA.letter.body) ||
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
