# Portfolio Hugo Site

This is a static portfolio site built with Hugo, hosted on GitHub Pages with automatic deployment.

## Features

- Red/black satanic theme with Cinzel titles and Roboto body.
- Sections: Restores, Edits, Videos, Timeline.
- Draggable before/after slider for restores.
- Arrow layout for edits with sources and final.
- Video embeds for YouTube or direct mp4.
- Responsive design.
- Git-based timeline with enableGitInfo.

## Setup

1. Clone this repository.
2. Install Hugo extended (latest version): Download from https://gohugo.io/installation/
3. Run `hugo server` to preview locally.
4. Change `baseURL` in `config.toml` to your GitHub Pages URL, e.g., `https://yourusername.github.io/yourrepo/`
5. Commit and push to GitHub.
6. In repository Settings > Pages, set Source to "GitHub Actions".
7. Push again to trigger the workflow.

## Usage

You don't need to program. Just drag folders to `content/` and push.

### Adding Projects

#### Restores

Create a folder `content/restores/yourproject/`

Add:

- `before.jpg|png|webp`
- `after.jpg|png|webp`
- `notes.md` (optional markdown description)

The slider will show before/after.

#### Edits

Create a folder `content/edits/yourproject/`

Add:

- `src_01.jpg|png|webp`, `src_02.jpg`, etc.
- `final.jpg|png|webp`
- `notes.md` (optional)

Shows sources in column, arrow, final.

#### Videos

Create a folder `content/videos/yourproject/`

Add:

- Either `video.mp4` (local video)
- Or `link.txt` with URL (YouTube, Cloudinary, direct mp4)
- `thumb.jpg|png` (optional thumbnail)
- `notes.md` (optional)

If `video.mp4`, embeds HTML5 video.

If `link.txt`:

- YouTube: embeds player
- Direct mp4: embeds video
- Cloudinary: embeds iframe

#### Timeline

Add a `timeline/` folder to any project (restores, edits, videos) to create a step-by-step timeline.

Files use two-digit prefix NN (01, 02, etc.):

- `NN.jpg|png|webp`: Image step
- `NN.mp4`: Video step
- `NN.url`: External media URL (YouTube, Cloudinary, direct mp4 or image)
- `NN.md`: Markdown caption

Steps ordered by NN ascending.

For edits, if no final step, automatically adds a step with `final.*` and first paragraph of `notes.md`.

Supported URLs:

- YouTube: Embedded player
- Direct .mp4: HTML5 video
- Images: Direct display
- Others: Iframe

Example: `content/restores/project/timeline/01.jpg`, `01.md`, `02.url`, etc.

#### Notes

- `notes.md` renders as description below.
- Alt texts generated automatically, or override with "Alt: your alt" in notes.md

### Timeline

Automatically collects all projects, sorted by date (git or file).

Shows mini preview, type, date, link.

## File Naming Rules

- before.* / after.* for restores
- src_*.{jpg,png,webp} for edit sources
- final.* for edit final
- video.mp4 for local video
- link.txt for external video URL
- thumb.* for video thumbnail
- notes.md for description
- NN.jpg|png|webp|mp4|url|md for timeline steps (NN=01,02,...)

## Customization

- Theme in `themes/azazel/`
- CSS in `static/css/main.css`
- JS in `static/js/slider.js`
- Change colors in CSS variables.

## Deployment

Workflow in `.github/workflows/deploy.yml`

Triggers on push to main, builds with Hugo extended, deploys to Pages.

## Examples

Included example projects with placeholders for demo, including a timeline in proyecto-001.

Run `hugo server` to see.

## Requirements

- Hugo extended
- GitHub repository
- No databases, no JS frameworks.

## Success Criteria

- `hugo server` runs and shows examples.
- Add new folder, push, site updates automatically.
