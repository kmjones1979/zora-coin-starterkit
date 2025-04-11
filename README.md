# Zora Coin Monorepo

This monorepo contains the Zora Coin Creator application and its associated subgraph.

## Project Structure

```
zora-coin-monorepo/
├── apps/
│   └── web/           # Next.js web application
├── packages/
│   └── subgraph/      # The Graph subgraph
├── package.json       # Root package.json
└── turbo.json         # Turborepo configuration
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development environment:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start all packages in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format all code

## Web Application

The web application is a Next.js app that allows users to create and manage Zora coins.

To run the web app specifically:

```bash
cd apps/web
npm run dev
```

## Subgraph

The subgraph indexes Zora coin creation events and provides a GraphQL API for querying coin data.

To work with the subgraph:

```bash
cd packages/subgraph
npm run codegen    # Generate AssemblyScript types
npm run build      # Build the subgraph
npm run deploy     # Deploy to The Graph
```

## Development

This monorepo uses:

- Turborepo for monorepo management
- Next.js for the web application
- The Graph for blockchain indexing
- TypeScript for type safety
- ESLint and Prettier for code quality

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
