import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { NxVitepressGeneratorSchema } from './schema';


const generatedFiles = [
  './tsconfig.json',
  './.vitepress',
  './.vitepress/config.ts',
  './.vitepress/theme',
  './.vitepress/theme/components',
  './.vitepress/theme/components/starter-layout.vue',
  './.vitepress/theme/index.ts',
  './.vitepress/theme/styles',
  './.vitepress/theme/styles/dark-theme.css',
  './docs',
  './docs/index.md',
  './docs/about',
  './docs/about/index.md',
  './docs/guide',
  './docs/guide/index.md'
];


describe('nx-vitepress generator', () => {
  let appTree: Tree;
  const options: NxVitepressGeneratorSchema = { name: 'my-app' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'my-app');
    expect(config).toBeDefined();
  });

  it('should update workspace.json', async () => {
    await generator(appTree, options);

    const config = readProjectConfiguration(appTree, 'my-app');
    const { build, serve } = config.targets || {};

    expect(config.root).toBe('apps/my-app');
    expect(build.executor).toBe('@ahryman40k/nx-vitepress:build');
    expect(build.options).toEqual({ outputPath: 'dist/apps/my-app' });
    expect(serve.executor).toBe('@ahryman40k/nx-vitepress:serve');
    expect(serve.options).toEqual({
      port: 3000,
    });
  });

  it('should generate files', async () => {
    await generator(appTree, options);

    generatedFiles
      .map((file) => `apps/my-app/${file}`)
      .forEach((path) => expect(appTree.exists(path)).toBeTruthy());
  });

  describe('--directory', () => {
    it('should update workspace.json and generate files', async () => {
      await generator(appTree, { ...options, directory: 'subdir' });

      const config = readProjectConfiguration(appTree, 'subdir-my-app');
      const { build } = config.targets || {};

      expect(config.root).toBe('apps/subdir/my-app');
      expect(build.options).toEqual({ outputPath: 'dist/apps/subdir/my-app' });

      generatedFiles
        .map((file) => `apps/subdir/my-app/${file}`)
        .forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });
  });

  describe('workspaceLayout', () => {
    beforeEach(() => {
      const nxJson = JSON.parse(appTree.read('nx.json', 'utf-8') || '');
      const updateNxJson = {
        ...nxJson,
        workspaceLayout: { appsDir: 'custom-apps-dir' },
      };
      appTree.write('nx.json', JSON.stringify(updateNxJson));
    });

    it('should update workspace.json and generate files', async () => {
      await generator(appTree, options);

      const config = readProjectConfiguration(appTree, 'my-app');
      const { build } = config.targets || {};

      expect(config.root).toBe('custom-apps-dir/my-app');
      expect(build.options).toEqual({
        outputPath: 'dist/custom-apps-dir/my-app',
      });

      generatedFiles
        .map((file) => `custom-apps-dir/my-app/${file}`)
        .forEach((path) => expect(appTree.exists(path)).toBeTruthy());
    });
  });


});
