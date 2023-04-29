import { defineConfig } from 'tsup'

export default defineConfig(options => ({
  entry: [
    'src/index.ts',
    'src/prm.ts',
    'src/yrm.ts',
  ],
  clean: true,
  minify: !options.watch,
  format: ['esm'],
  // require shims
  banner: {
    js: `
    import { createRequire as topLevelCreateRequire } from 'module';
    const require = topLevelCreateRequire(import.meta.url);
    `,
  },
}))
