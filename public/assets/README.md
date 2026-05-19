# Global Minang Ventura — Uploaded Assets Guide

Welcome! Use this folder to place, manage, and reference any visual or media assets (images, videos, logos, etc.) for the website.

---

## 1. Replacing the Hero Video

The landing page uses a high-quality video background in the Hero section. 

* **Current file location**: `/public/heroanimate.mp4`
* **How to replace it**:
  1. Prepare your new video file in `.mp4` format.
  2. Save it to this folder as `/public/assets/heroanimate.mp4` (or keep it in the root `/public/heroanimate.mp4` if you prefer to just replace the old file directly).
  3. If you save it to this `/public/assets` folder as `my-video.mp4`, open `/components/Hero.tsx` and change line 52:
     ```tsx
     // Before:
     <source src="/heroanimate.mp4" type="video/mp4" />

     // After:
     <source src="/assets/my-video.mp4" type="video/mp4" />
     ```

---

## 2. Adding Custom Images, Logos, and Photos

You can place any new image files (e.g. restaurant photos, team pictures, icons) inside this `/public/assets` folder. 

In Next.js, files inside the `public` directory are served statically from the root URL.
* For example, a file saved at `/public/assets/my-photo.jpg` can be referenced in your code using the path:
  `"/assets/my-photo.jpg"`

### Usage Example in Code:
```tsx
<img src="/assets/my-photo.jpg" alt="Description" />
```

---

## 3. Recommended Media Formats
* **Videos**: `.mp4` (optimized for web, under 5MB for fast loading).
* **Images**: `.webp` or `.jpg` (compressed for high quality and quick performance).
* **Logos/Icons**: `.svg` or `.png` (transparent background).
