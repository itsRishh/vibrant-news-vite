# NewsHub Vite

this is the screenshot of figma design we created for our news channel website. code it in vite react framework. the font used in the website is, HEADING: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; and the main red color of the website is #DC143C and white and black. place dummy news images wherever needed.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a7654440-4f66-418c-b88d-cf5c81ae5a55).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

### Local public and admin origins

The public website and development admin panel run as separate local origins,
matching the production boundary between `www` and `admin` domains:

```sh
npm run dev:public  # http://127.0.0.1:8081
npm run dev:admin   # http://127.0.0.1:8082/admin/breaking-news
```

Both surfaces use the same Convex deployment from `.env.local`, but the admin
route is disabled when the app is started in public mode. In production, build
and deploy the public and admin modes as separate applications/domains:

```sh
npm run build:public
npm run build:admin
```
