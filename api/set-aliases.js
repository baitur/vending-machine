const moduleAlias = require('module-alias');

const dir = process.env.NODE_ENV === 'production' ?  'dist' : 'src';

moduleAlias.addAliases({
  '@base': __dirname + '/' + dir,
  '@api': __dirname + '/' + dir + '/api'
});
