# Website production launch checklist

## Security & platform

- [ ] HTTPS only + HSTS; domain, DNS, TLS auto-renew verified
- [ ] Security headers: Content-Security-Policy (start in report-only), `X-Content-Type-Options: nosniff`,
      `Referrer-Policy`, `Permissions-Policy`, frame protection (`frame-ancestors`)
- [ ] CORS allow-list is explicit (no `*` with credentials); cookies `Secure`, `HttpOnly`, `SameSite`
- [ ] Rate limiting on auth and expensive routes; bot protection on public forms
- [ ] RLS tests green; no service-role key in any client bundle (`NEXT_PUBLIC_*` is public!)

## Performance & quality

- [ ] Core Web Vitals on a **production build**, mobile profile: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1
- [ ] Images optimized (modern formats, sized, lazy), fonts subset, JS bundle budget set in CI
- [ ] Accessibility: WCAG 2.2 AA on core journeys (keyboard, focus, labels, contrast, screen reader)
- [ ] Custom 404 / 500 pages; graceful offline/error states

## SEO & sharing

- [ ] Unique `<title>` + description per route, canonical URLs, `sitemap.xml`, `robots.txt`
- [ ] Open Graph / social preview images; structured data where relevant
- [ ] Analytics + consent banner if required by your audience's law (GDPR/DPDP/etc.)

## Legal & ops

- [ ] Privacy policy, terms, cookie policy — **reviewed by a lawyer**
- [ ] Uptime monitor on `/api/health` + alerting; Sentry release + sourcemaps
- [ ] Backups enabled and one **restore drill** completed
- [ ] Rollback tested (Vercel instant rollback; DB: forward-fix migration)
