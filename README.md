# CarpeDiction

A site that retrieves information from various lexical APIs and displays it in a dictionary-like compendium, with favorites (import/export), top and recent comments (with likes), and the ability to post comments for registered users.

## Local development

- **Start backend only:** `yarn start` or `yarn server`
- **Start frontend only:** `yarn client`
- **Run backend + frontend:** `yarn dev` (requires `yarn install` at root so `concurrently` is available)
- **Install frontend deps:** `yarn clientinstall`
- **Build frontend:** `yarn run render-postbuild` (installs and builds client)

From the root, run `yarn install` then `yarn dev` so the UI and API both run; changes in the UI are reflected against the local API.

## Deploying to Render (MERN on one Web Service)

Prereqs: GitHub repo, Render account, MongoDB (e.g. Atlas).

**Important:** Use a single **Web Service** only. Do not create a Static Site or set a "Publish directory" for this repo—that causes "Publish directory build does not exist!" The Node server serves the React build from `client/build` in production.

1. **Backend as Web Service**
   - New Web Service → connect repo.
   - **Build command:** `yarn install && yarn run render-postbuild && cd server && yarn install`
   - **Start command:** `cd server && yarn start`
   - Add env vars (e.g. `NODE_ENV=production`, `CD_DB_URL`, `JWT_KEY`, `API_ROOT`, `PORT` as set by Render).

2. **Serve frontend from the same service**
   - The server serves the React build in production from `client/build` and sends `index.html` for non-API routes, so one Web Service serves both API and static assets.

3. **MongoDB**
   - Add your MongoDB connection string as `CD_DB_URL` (or equivalent) in the service Environment; do not hardcode it.

The `render-postbuild` script installs and builds the frontend; the start command runs the Node server, which serves the built React app in production.

---

NO LICENSE! THIS CODE IS NOT MEANT TO BE REUSED OR REPRODUCED!  
Copyright ©2021 Zachery A. Bielicki, all rights reserved.