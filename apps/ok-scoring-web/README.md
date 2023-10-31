# OK Scoring Web

Deployed somewhere...
netlify? vercel? supabase? cloudflare?

Contains features

- landing page
- web UI for game scoring

## Development

### Adding features

To add a feature, use the nx tooling to generate a feature library

```bash
yarn nx g @nx/next:lib features-web-landing --directory features/web-landing
```

note, I needed to manually add the `@ok-scoring` scope in `tsconfig.base.json` for the repo, not sure why


#### Adding a component to a feature

```bash
yarn nx g @nx/next:component privacy-policy --project=features-web-landing
```
