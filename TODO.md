# TODO

## First-time Setup

- [ ] Create npm organization `sulesky` at https://www.npmjs.com/org/create
- [ ] Generate npm token at https://www.npmjs.com/settings/YOUR_USERNAME/tokens (Automation type)
- [ ] Add `NPM_TOKEN` secret to GitHub repo (Settings → Secrets → Actions)
- [ ] Push branch to GitHub: `git push origin upgarde`
- [ ] Merge to master or create PR

## First Release

After setup is complete:

```bash
git checkout master
yarn version:patch    # creates v1.0.1 tag
git push origin master --tags
```

GitHub Actions will automatically publish to npm.

See [RELEASE.md](./RELEASE.md) for full documentation.
