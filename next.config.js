// Fix for esm modules segfaulting next.js
module.exports = {
  experimental: {
    esmExternals: false,
  },
  productionBrowserSourceMaps: true,
};
