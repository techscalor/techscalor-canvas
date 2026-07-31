# Project images

Drop your screenshots here, grouped by category and project:

```
public/projects/<category>/<project>/1.png
public/projects/<category>/<project>/2.png
...
```

Examples:

```
public/projects/agency/p1/1.png
public/projects/ecommerce/p2/1.jpg
public/projects/saas/p3/1.webp
```

Then reference them in `src/data/projects.json` with the URL path (no import needed):

```json
{
  "featureImage": "/projects/ecommerce/p2/1.jpg",
  "images": ["/projects/ecommerce/p2/1.jpg", "/projects/ecommerce/p2/2.jpg"]
}
```

Because these files live in `public/`, they are committed to git and work
immediately after cloning the repo — no build step, no CDN.

Tips for fast loading:
- Prefer `.webp` (or `.avif`) and keep each image under ~300 KB.
- Keep a consistent 16:10 crop for feature images.
- Images are lazy-loaded, decoded async, and cached by the browser automatically.
