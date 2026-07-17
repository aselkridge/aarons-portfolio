# How to start the next session correctly

Two things went wrong last session and both need fixing for the next one:

1. **Network access was `Trusted`** → blocked Google Drive + the general web, so the
   3D model couldn't be downloaded. Fix: set it to **Full**.
2. **GitHub access was read-only** → the session could read the repo but not *push*
   to it (error: "Resource not accessible by integration"). Fix: grant the Claude
   GitHub connection **write access** to `aselkridge/aarons-portfolio`.

## Fix #2 first — GitHub write access (plain English)

When you connect GitHub to Claude Code, the app has to be allowed to *write* to this
specific repo, not just read it. To fix:
- Go to your GitHub settings → **Applications** → the Claude / Claude Code GitHub App
  → **Configure**.
- Under **Repository access**, make sure **`aselkridge/aarons-portfolio`** is selected
  (either "All repositories" or add it to "Only select repositories").
- Save. That grants the "Contents: write" permission the app needs to push.
- (If you connected via a personal access token instead, the token needs the **`repo`**
  scope.)

Without this, a new session still can't save code to GitHub — it'll only be able to
show you previews (Artifacts), like last time.

## For Aaron (plain English)

Everything we did is saved in this repo (`aselkridge/aarons-portfolio`) on the branch
**`claude/website-build-nevi30`**. A new session that uses this repo + branch will
have all of it. You just need to give the new session an **open door to the internet.**

### Steps
1. Go to **claude.ai/code**.
2. Before starting the task, look at the **environment** (there's a small **cloud
   icon** showing the environment's name near where you start a session). Click it to
   open the environment selector.
3. Either **edit** the current environment (hover it, click the gear/settings icon) or
   **Add environment**. In the dialog, find the **Network access** setting and change
   it from **Trusted** to **Full**.
   - *Full = "any website allowed."* That's what lets me reach your Google Drive to
     grab the Walkman model. (If you'd rather be cautious, choose **Custom** and add
     these lines instead, keeping the "include common package managers" box checked:*
     ```
     *.google.com
     *.googleusercontent.com
     *.googleapis.com
     *.jsdelivr.net
     *.unpkg.com
     ```
   )
4. Save the environment.
5. Start a **new session** on repo **`aselkridge/aarons-portfolio`**, branch
   **`claude/website-build-nevi30`** (same repo, same branch — that's where the saved
   progress is).
6. As your **first message**, paste the kickoff prompt below.

### First message to paste into the new session
> Read `docs/DESIGN-BRIEF.md` and `docs/NEXT-SESSION.md` in this repo — that's the full
> context for my website "Aaronautics." We left off needing to build the real 3D
> Walkman. My model is in my Google Drive (file id `1FNHrIAFbC2tQC-730DSA-Q-pi8eAyuEr`,
> `sony_walkman_wm-f2078.glb`, 167 MB — needs optimizing to ~5 MB). This session should
> have Full network access now. Please download it, optimize it, and stand up a real
> Three.js preview of it (orbit + clickable buttons) deployed to GitHub Pages so I get
> a live link. Then continue the plan in the brief.

### How to confirm the network is actually open (optional)
Ask the new session: *"run `curl -sS -o /dev/null -w '%{http_code}' https://drive.google.com`
and tell me the result."* Anything other than a proxy `403` means the door is open.

## Notes
- Your **prototype previews** are saved to your claude.ai account regardless — find
  them anytime at **claude.ai/code/artifacts**.
- Your **model** stays in your Google Drive; nothing needs to change about its sharing.
- If you ever want to keep working in THIS (Trusted) session instead, that's fine for
  design/type/layout work — just not for downloading the 3D model.
