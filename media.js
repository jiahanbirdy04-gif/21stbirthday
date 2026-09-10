/* ============================================================
   MEDIA CONFIG — filled in by Claude on 2026-09-10.
   Photos, audio, music, flowers, and the letter are all real now.
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
  music: {
    featured: {
      title: "Lifetime (Reimagined)",
      artist: "Ben&Ben",
      embedUrl: "", // a Spotify/YouTube embed URL -> shows as an embedded player
      audioSrc: "", // OR: path to your own mp3 in assets/audio/ -> shows as a full custom
                     // player (scrubber + play/pause) instead, like the pink Canva player.
                     // If both are empty, it just shows the title/artist card.
    },
    tracklist: [
      { title: "From The Start", artist: "Laufey" },
      { title: "Walang Kapalit", artist: "Arthur Nery" },
      { title: "Just Friends", artist: "Jordy Searcy" },
    ],
  },

  // ---- FLOWERS: affirmation notes ----------------------------------
  flowerNotes: [
    "I'm glad our paths crossed..",
    "Happy birthday to a truly wonderful friend.",
    "Here's to the person who always shows up for everyone else — today's for you.",
    "I'm lucky to call you my friend.",
    "So proud of who you're becoming. Keep going.",
  ],

  // ---- LETTER (read into the Cake finale) --------------------------
  letter: {
    body:
`Dear Noy,

I wish you the happiest birthday! Thank you always for everything, and thank you for being my friend.

I know sometimes I purposely don't talk to you or I suddenly become quiet, and I think you probably noticed that. HAHAHAHA. I don't always know how to act around you, especially after everything that happened before. Things became a little awkward between us, and I know sometimes I also contribute to that. I'm sorry if there were times I made you feel like I didn't want to talk to you or be around you. It's not because I don't appreciate you. Sometimes I just don't know how to act.

Despite all that, I'm really thankful that we're still friends.

Thank you for being my mauutangan friend whenever I'm out of money. HAHAHAHA. Thank you rin sa mga hatid-sundo, sa pagsama sa mga gala, sa random bonding, sa paglalaro ng ML, and for all the little things you've done for me. I might not always say it, but I genuinely appreciate them.

We've already made a lot of memories together, and I'm glad that even after everything, we're still able to talk, laugh, and spend time together. I hope we can continue making more memories, even if most of them are probably going to be random and chaotic. HAHAHAHA.

I hope you have a really good birthday. I wish you good health, happiness, success, and more good things in life. And sana mas dumami pa pera mo para may mauutangan pa ako. HAHAHAHAHA.

Happy birthday, Noy! Thank you for being my friend. 🤍`,
  },
};

// explicit, in case anything ever references window.MEDIA directly
window.MEDIA = MEDIA;
