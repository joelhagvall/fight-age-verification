# Fight Age Verification

Campaign site against mandatory online age verification.

Live site: [https://fightageverification.com](https://fightageverification.com)

## The Problem

Age verification is often presented as a simple way to protect children online. In practice, broad ID checks can turn ordinary internet use into something that depends on identity systems and platform permission.

That affects both minors and adults. Young people can lose private access to information, support, culture, communities, debate, learning resources, and ways to create or start projects or businesses. Adults can also be pushed into showing ID to read lawful content, participate politically, or browse privately.

## Core Position

Children should be protected online, but not by making the whole web dependent on general identity checks.

Better policy should target actual harm: grooming, exploitation, harassment, fraud, manipulative design, and weak enforcement. The goal is safety without sacrificing privacy, anonymity, free expression, and access to knowledge.

## What The Site Does

- explains the issue
- shows why the issue matters now across the EU, Sweden, the UK, and Australia
- shows concrete scenarios for who is affected
- collects sources for the claims, including inline links near major claims
- lets visitors choose political representatives and open a prefilled email draft to them
- offers short and detailed email templates
- lets visitors copy the email text or recipients if their mail app blocks `mailto`

The main action is simple: pick representatives, review the message, then open the draft in your own mail app before sending.

## Tech

Built with TanStack Start, React, TypeScript, Tailwind CSS, shadcn/ui components, and Bun.

## Analytics

The site includes Vercel Analytics to understand basic traffic after deployment. It is used for aggregate page analytics, not accounts, forms, or identity collection.

## Run

```bash
bun install
bun run dev
```

Local URL: `http://localhost:3000`

## Scripts

```bash
bun run dev        # dev server
bun run build      # production build
bun run preview    # preview build
bun run typecheck  # TypeScript
bun run test       # unit tests
bun run test:e2e   # Playwright
bun run check      # typecheck, unit tests, e2e, build, Lighthouse
```

## Deploy

Vercel build command:

```bash
bun run build
```

Run this before deploying:

```bash
bun run check
```

## Structure

```text
src/components/   React components
src/i18n/         English and Swedish copy
src/routes/       TanStack routes
e2e/              Playwright tests
public/           static assets
```

## Copy

All user-facing text lives in:

- `src/i18n/en.json`
- `src/i18n/sv.json`


Built by [Joel Hägvall](https://joelhagvall.com): https://joelhagvall.com

Source code: [https://github.com/joelhagvall/fight-age-verification](https://github.com/joelhagvall/fight-age-verification)
