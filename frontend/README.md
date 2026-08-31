# DAB ZONE — Storefront

Next.js storefront for the DAB ZONE online shop.

Built with:

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

Features:

- Product detail & overview pages
- Product collections & categories with filters (price, material, category)
- Product reviews
- Cart & checkout with Stripe
- User accounts & order details

## Quickstart

### Environment variables

```shell
cp .env.template .env.local
```

Fill in `.env.local` with your backend URL and publishable key.

### Install dependencies

```shell
yarn
```

### Start developing

```shell
yarn dev
```

Your site runs at http://localhost:8000.

## Payment integrations

Stripe is supported out of the box. Set the following in `.env.local`:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

## Deployment

See [VERCEL_SETUP.md](./VERCEL_SETUP.md) for deploying this storefront to Vercel.
