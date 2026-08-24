# Vercel CLI project add defaults to static

- `vercel project add` on this team created the project as Framework **Other** with output `public` (because `public/` exists). The Next.js build still ran, but `/` 404’d until the project framework was set to `nextjs` and production was redeployed.
- After creating a project with the CLI, inspect Framework Settings before the first shareable deploy. Set `framework: "nextjs"` via the API or dashboard if it is not already Next.js.
- Production URL for this prototype: `https://afc-design.vercel.app` on the Make (`letsmake`) team. There is no Git remote, so later deploys are CLI-only until a repo is connected.
