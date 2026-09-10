/* ============================================================
   MEDIA CONFIG — hand-fixed by Claude on 2026-09-10.

   Photos + Happy Birthday audio below now point at the real files
   already sitting in your assets/photos and assets/audio folders.

   Still needs your real content: MUSIC and LETTER sections below
   are marked PLACEHOLDER — Studio never actually saved real values
   for these before, so send me the real text/track info and I'll
   fill it in, or open studio.html and fill just those two sections
   yourself, then re-download and re-upload media.js only.
   ============================================================ */

const MEDIA = {

  // ---- PHOTOS -------------------------------------------------
  // Pointing straight at the 38 files already in assets/photos/.
  // If a filename here doesn't match exactly (case/extension),
  // that one tile will just show "photo didn't load" — nothing
  // else breaks. Double check against your repo if any look wrong.
  photos: [
    { src: "assets/photos/photo-01.jpg", caption: "" },
    { src: "assets/photos/photo-02.jpg", caption: "" },
    { src: "assets/photos/photo-03.jpg", caption: "" },
    { src: "assets/photos/photo-04.jpg", caption: "" },
    { src: "assets/photos/photo-05.jpeg", caption: "" },
    { src: "assets/photos/photo-06.jpeg", caption: "" },
    { src: "assets/photos/photo-07.jpeg", caption: "" },
    { src: "assets/photos/photo-08.jpeg", caption: "" },
    { src: "assets/photos/photo-09.jpeg", caption: "" },
    { src: "assets/photos/photo-10.jpeg", caption: "" },
    { src: "assets/photos/photo-11.jpeg", caption: "" },
    { src: "assets/photos/photo-12.jpeg", caption: "" },
    { src: "assets/photos/photo-13.jpeg", caption: "" },
    { src: "assets/photos/photo-14.jpeg", caption: "" },
    { src: "assets/photos/photo-15.jpeg", caption: "" },
    { src: "assets/photos/photo-16.jpeg", caption: "" },
    { src: "assets/photos/photo-17.jpg", caption: "" },
    { src: "assets/photos/photo-18.jpeg", caption: "" },
    { src: "assets/photos/photo-19.jpeg", caption: "" },
    { src: "assets/photos/photo-20.jpeg", caption: "" },
    { src: "assets/photos/photo-21.jpeg", caption: "" },
    { src: "assets/photos/photo-22.jpeg", caption: "" },
    { src: "assets/photos/photo-23.jpeg", caption: "" },
    { src: "assets/photos/photo-24.jpeg", caption: "" },
    { src: "assets/photos/photo-25.jpeg", caption: "" },
    { src: "assets/photos/photo-26.jpeg", caption: "" },
    { src: "assets/photos/photo-27.jpeg", caption: "" },
    { src: "assets/photos/photo-28.jpeg", caption: "" },
    { src: "assets/photos/photo-29.jpeg", caption: "" },
    { src: "assets/photos/photo-30.jpeg", caption: "" },
    { src: "assets/photos/photo-31.jpeg", caption: "" },
    { src: "assets/photos/photo-32.jpeg", caption: "" },
    { src: "assets/photos/photo-33.jpeg", caption: "" },
    { src: "assets/photos/photo-34.jpeg", caption: "" },
    { src: "assets/photos/photo-35.jpeg", caption: "" },
    { src: "assets/photos/photo-36.jpeg", caption: "" },
    { src: "assets/photos/photo-37.jpeg", caption: "" },
    { src: "assets/photos/photo-38.jpeg", caption: "" },
  ],

  // ---- AUDIO: Happy Birthday clip (finale) -----------------------
  happyBirthdayAudio: {
    src: "assets/audio/happy-birthday.mp3",
  },

  // ---- MUSIC PAGE -------------------------------------------------
  // STILL PLACEHOLDER — send me the real featured track (title,
  // artist, embed URL) and tracklist, or fill this in yourself via
  // studio.html's Music section.
  music: {
    featured: {
      title: "PLACEHOLDER — Featured Track Title",
      artist: "Artist Name",
      embedUrl: "", // e.g. a Spotify/YouTube embed URL
    },
    tracklist: [
      { title: "Track 1 — placeholder", artist: "Artist" },
      { title: "Track 2 — placeholder", artist: "Artist" },
      { title: "Track 3 — placeholder", artist: "Artist" },
      { title: "Track 4 — placeholder", artist: "Artist" },
      { title: "Track 5 — placeholder", artist: "Artist" },
    ],
  },

  // ---- FLOWERS: affirmation notes ----------------------------------
  flowerNotes: [
    "You make every room warmer just by being in it.",
    "Twenty-one years of you, and the world's better for all of them.",
    "Here's to the person who always shows up for everyone else — today's for you.",
    "Still the easiest person to laugh with, no matter how far apart we are.",
    "So proud of who you're becoming. Keep going.",
  ],

  // ---- LETTER (read into the Cake finale) --------------------------
  // STILL PLACEHOLDER — send me the real letter text and I'll drop
  // it straight in, or fill it in yourself via studio.html.
  letter: {
    body:
`PLACEHOLDER — Haki's letter to Noy goes here.

Replace this text with the real message. It can be as long as you want —
the page scrolls, and the serif type is set to stay easy to read even
for a longer letter.

Happy 21st, Noy.

— Haki`,
  },
};

// explicit, in case anything ever references window.MEDIA directly
window.MEDIA = MEDIA;
