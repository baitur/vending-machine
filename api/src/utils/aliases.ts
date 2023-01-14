import ModuleAlias from 'module-alias';

export function fixAliases(dirName: string) {
  ModuleAlias.addAliases({
    '@base': dirName,
    '@api': dirName + '/api',
  });
}
