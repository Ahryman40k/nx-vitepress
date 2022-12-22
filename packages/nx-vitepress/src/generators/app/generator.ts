import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { NxVitepressGeneratorSchema } from './schema';

interface NormalizedSchema extends NxVitepressGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: NxVitepressGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (
  tree: Tree,
  options: NxVitepressGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    targets: {
      build: {
        executor: 'nx:run-commands',
        outputs: ['{options.outputPath}'],
        options: {
          command: `vitepress build ${normalizedOptions.projectRoot}`,
        },
      },
      dev: {
        executor: 'nx:run-commands',
        options: {
          command: `vitepress dev ${normalizedOptions.projectRoot}`,
        },
      },
      serve: {
        executor: 'nx:run-commands',
        options: {
          command: `vitepress serve ${normalizedOptions.projectRoot}`,
        },
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  addDependenciesToPackageJson(
    tree,
    {
      '@vue/theme': '^1.3.0',
      vitepress: '^1.0.0-alpha.33',
      vue: '^3.2.45',
    },
    {
      '@types/node': '^18.11.17',
    }
  );
  await formatFiles(tree);
}
