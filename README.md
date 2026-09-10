# Noy's 21st — setup guide

## What's in here
- `index.html` / `style.css` / `script.js` — Noy's actual site
- `studio.html` / `studio.css` / `studio.js` — **your content tool.** Open this
  one yourself (not Noy) to add photos, video, audio, music, letter, and
  flower notes with no code editing at all.
- `assets/media.js` — where all that content lives. You shouldn't need to
  touch this by hand; Studio writes it for you.

The site works right now with placeholder photos and text, so you can preview
the whole flow before adding anything real.

## 1. Add your real content — no code needed

1. Open `studio.html` in your phone or computer's browser (double-tap the
   file, or open it once it's in your GitHub repo at
   `https://<username>.github.io/<repo-name>/studio.html`).
2. Add your photos, video, the Happy Birthday audio clip, music info, flower
   notes, and the letter text — right there in the form.
3. Tap **Generate my site files**. It downloads a `.zip` to your phone.
4. Unzip it — you'll get an `assets` folder.
5. On github.com, open your repo → drag that `assets` folder onto the file
   list → commit (it'll ask to replace the old one — confirm).
6. Your site updates automatically in about a minute. Done.

No Supabase, no pasting URLs, no editing code.

## 2. Deploy on GitHub Pages (if you haven't already)

1. Push this whole folder to a GitHub repo.
2. Repo → Settings → Pages → Deploy from branch → `main` / root.
3. Your site is live at `https://<username>.github.io/<repo-name>/`.

## Before you send the link to Noy

`studio.html` is just for you, but if it's in the same repo it's technically
reachable at `.../studio.html` by anyone who knows to look. Noy won't stumble
onto it by clicking around the site — but if you want it fully private,
delete `studio.html`, `studio.css`, and `studio.js` from the repo once you're
done adding content (or keep them; they're harmless either way).

## Notes on the build
- Photos lazy-load so the Photos page never pulls everything at once.
- The menu has 4 cards: Photos, Music, Flowers, and Cake.
- Tapping the Cake card takes you to the candle — tapping the candle blows
  it out, slides the cake left, plays the Happy Birthday clip, and slides
  the letter in from the right. It can be replayed anytime by going back to
  the menu and opening Cake again.
- The flowers page is a mixed bouquet (tulips, daffodils, hyacinth
  clusters) wrapped in kraft paper, blooming in and swaying gently after.
