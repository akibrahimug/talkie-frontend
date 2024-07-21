const { aliasWebpack, aliasJest } = require('react-app-alias');

const aliasMap = {
  '@components': 'src/components',
  '@services': 'src/services',
  '@pages': 'src/pages',
  '@assets': 'src/assets',
  '@redux': 'src/redux-toolkit',
  '@colors': 'src/colors',
  '@mocks': 'src/mocks',
  '@hooks': 'src/hooks',
  '@root': 'src'
};

const options = {
  alias: aliasMap
};

module.exports = aliasWebpack(options);
module.exports.jest = aliasJest(options);
