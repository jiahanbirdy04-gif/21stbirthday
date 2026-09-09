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

  /* ---------------- Flowers: staggered bloom ---------------- */

  function petalFlowerSVG() {
    const petalColors = ["#C7AEEF", "#B79AE8", "#D9C9F0", "#9B7EDE", "#C7AEEF"];
    const petals = petalColors.map((c, i) => {
      const angle = i * 72;
      return `<g transform="rotate(${angle} 30 30)">
        <ellipse class="petal" cx="30" cy="16" rx="9" ry="14" fill="${c}" style="animation-delay:${i * 90}ms"/>
      </g>`;
    }).join("");
    return `<svg viewBox="0 0 60 60" width="52" height="52">
      ${petals}
      <circle cx="30" cy="30" r="7" fill="#FFB86B"/>
    </svg>`;
  }

  function initFlowers() {
    const field = document.getElementById("flower-field");
    const count = 6;
    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.className = "flower";
      div.innerHTML = petalFlowerSVG();
      field.appendChild(div);
    }

    const flowers = Array.from(field.querySelectorAll(".flower"));
    flowers.forEach((f, i) => {
      setTimeout(() => f.classList.add("is-bloomed"), i * 260);
    });

    const notesWrap = document.getElementById("flower-notes");
    const notes = (window.MEDIA && MEDIA.flowerNotes) || [];
    notes.forEach((note, i) => {
      const p = document.createElement("p");
      p.className = "flower-note";
      p.textContent = note;
      notesWrap.appendChild(p);
      setTimeout(() => p.classList.add("is-shown"), flowers.length * 260 + i * 220);
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
