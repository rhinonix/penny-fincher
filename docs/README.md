# PennyFincher Documentation

This is the documentation site for the PennyFincher personal finance tracker application. It is built with VitePress and automatically generates API documentation from JSDoc comments in the codebase.

## Local Development

To run the documentation site locally:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Documentation Structure

- `api/`: Auto-generated API documentation from JSDoc comments
- `components/`: Documentation for React components
- `guide/`: User guide and setup instructions

## Building for Production

```bash
# Build the documentation site
npm run build

# Preview the built site
npm run preview
```

## GitHub Pages Deployment

The documentation site is automatically deployed to GitHub Pages when changes are pushed to the main branch. The deployment is handled by a GitHub Actions workflow defined in `/.github/workflows/deploy-docs.yml`.

## Adding Documentation

1. For API documentation, add JSDoc comments to your source code files.
2. For component documentation, update or create new files in the `components/` directory.
3. For guide documentation, update or create new files in the `guide/` directory.

## Structure

```
docs/
├── .vitepress/          # VitePress configuration
├── api/                 # Auto-generated API documentation
├── components/          # Component documentation
├── guide/               # User guide
├── public/              # Static assets
├── index.md             # Home page
├── package.json         # Dependencies and scripts
└── vitepress-jsdoc.config.js  # JSDoc configuration
```