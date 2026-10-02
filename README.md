# Laxmi Vanam Farmhouse

Static website for [Laxmi Vanam Farmhouse](https://laxmivanam.in), a farmstay in Bhuvanagiri, Telangana.

This is my business website, which I manage for Laxmi Vanam Farmhouse.

## Local preview

From the repository folder, start a local web server:

```bash
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser. Stop the server with `Ctrl+C`.

## GitHub Pages

The site deploys through the GitHub Actions workflow in `.github/workflows/pages.yml` whenever code is pushed to `main`.

In the repository settings, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The custom domain is `laxmivanam.in`; the root-level `CNAME` file records this domain. DNS for the domain must point to GitHub Pages.

## Enquiries and contact

The enquiry form sends booking details to `laxmifarmstays@gmail.com` through FormSubmit and opens WhatsApp with a prepared message to the primary number. Guests must review and send the WhatsApp message themselves. FormSubmit may require the recipient to confirm the address before email delivery is activated.

The contact section lists the primary phone as +91 70325 20408 and the alternate mobile as +91 70750 50408.

## Guest agreement

Guests can read the rules and submit their booking details and typed-name acknowledgement at `https://laxmivanam.in/guest-agreement.html`. Submissions are emailed to `laxmifarmstays@gmail.com` through FormSubmit with a generated PDF of the rules and signed guest details attached. The first submission may require confirming the recipient address with FormSubmit; submitted records are kept in that email inbox and are not stored by this static website.

## Photos and branding

- The homepage cover image is `src/Cover.PNG`.
- The header logo is `src/logo1.PNG`; `src/favicon-icon.png` is the square browser-tab icon generated from `src/favicon.PNG`.
- The gallery uses optimized images named `src/gallery-*.jpg`. Add or replace gallery images and update their paths and descriptions in `index.html`.
- Keep filenames and letter casing consistent because GitHub Pages runs on a case-sensitive filesystem.

## Not-found page

`404.html` is served by GitHub Pages when a visitor opens a URL that does not exist.
