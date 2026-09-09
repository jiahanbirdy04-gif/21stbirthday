/* ============================================================
   MEDIA CONFIG — this is the ONLY file you should need to edit
   once you have real content.

   Upload photos, the video, and the audio clip to Supabase Storage
   (or Cloudinary), make them public, and paste the public URLs
   below. Everything else in the site reads from this file.
   ============================================================ */

const MEDIA = {

  // ---- PHOTOS -------------------------------------------------
  // Add one entry per photo. Aim for ~50. `caption` is optional.
  // Placeholder photos below use a generator so the gallery is
  // fully functional right now — replace `src` with your real
  // Supabase/Cloudinary URLs when ready. Order = display order.
  photos: [
    { src: "https://picsum.photos/seed/noy01/600/750", caption: "" },
    { src: "https://picsum.photos/seed/noy02/700/560", caption: "" },
    { src: "https://picsum.photos/seed/noy03/600/600", caption: "" },
    { src: "https://picsum.photos/seed/noy04/650/800", caption: "" },
    { src: "https://picsum.photos/seed/noy05/720/540", caption: "" },
    { src: "https://picsum.photos/seed/noy06/600/750", caption: "" },
    { src: "https://picsum.photos/seed/noy07/680/600", caption: "" },
    { src: "https://picsum.photos/seed/noy08/600/680", caption: "" },
    { src: "https://picsum.photos/seed/noy09/700/560", caption: "" },
    { src: "https://picsum.photos/seed/noy10/600/750", caption: "" },
    { src: "https://picsum.photos/seed/noy11/650/650", caption: "" },
    { src: "https://picsum.photos/seed/noy12/700/580", caption: "" },
    // ...add the rest of the ~50 here, same shape.
    // PLACEHOLDER NOTE: duplicate this pattern until you have all
    // real photos in — the gallery lazy-loads regardless of count.
  ],

  // ---- VIDEO ----------------------------------------------------
  // ~50MB file — host on Supabase Storage / Cloudinary / Streamable,
  // do NOT put the raw file in the GitHub repo. Paste the public
  // playback URL (direct .mp4 link works best with the <video> tag).
  video: {
    src: "", // e.g. "https://xxxx.supabase.co/storage/v1/object/public/media/noy-video.mp4"
    poster: "https://picsum.photos/seed/noyvideo/900/560", // thumbnail shown before play
  },

  // ---- AUDIO: Happy Birthday clip (finale) -----------------------
  happyBirthdayAudio: {
    src: "", // public URL to a short royalty-free/purchased "Happy Birthday" clip
  },

  // ---- MUSIC PAGE -------------------------------------------------
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

  // ---- LETTER -------------------------------------------------------
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
