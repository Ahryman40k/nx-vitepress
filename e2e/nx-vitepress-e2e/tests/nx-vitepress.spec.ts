import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';

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
  './docs/guide/index.md',
];

describe('nx-vitepress e2e', () => {
  // Setting up individual workspaces per
  // test can cause e2e runs to take a long time.
  // For this reason, we recommend each suite only
  // consumes 1 workspace. The tests should each operate
  // on a unique project in the workspace, such that they
  // are not dependant on one another.
  beforeAll(() => {
    ensureNxProject('@ahryman40k/nx-vitepress', 'dist/packages/nx-vitepress');
  });

  afterAll(() => {
    // `nx reset` kills the daemon, and performs
    // some work which can help clean up e2e leftovers
    runNxCommandAsync('reset');
  });

  it('should create nx-vitepress', async () => {
    const project = uniq('nx-vitepress');
    await runNxCommandAsync(`generate @ahryman40k/nx-vitepress:app ${project}`);
    const result = await runNxCommandAsync(`build ${project}`);

    console.log(result.stdout);
    expect(result.stdout).toContain('Successfully ran target build for project nx-vitepress');
  }, 120000);

  describe('--directory', () => {
    it('should create src in the specified directory', async () => {
      const project = uniq('nx-vitepress');
      await runNxCommandAsync(
        `generate @ahryman40k/nx-vitepress:app ${project} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${project}/project.json`)
      ).not.toThrow();

      generatedFiles
        .map((file) => `apps/subdir/${project}/${file}`)
        .forEach((path) =>
          expect(() =>
            checkFilesExist(path)
          ).not.toThrow()
        );
    }, 120000);
  });

  describe('--tags', () => {
    it('should add tags to the project', async () => {
      const projectName = uniq('nx-vitepress');
      ensureNxProject('@ahryman40k/nx-vitepress', 'dist/packages/nx-vitepress');
      await runNxCommandAsync(
        `generate @ahryman40k/nx-vitepress:app ${projectName} --tags e2etag,e2ePackage`
      );
      const project = readJson(`apps/${projectName}/project.json`);
      expect(project.tags).toEqual(['e2etag', 'e2ePackage']);
    }, 120000);
  });
});
