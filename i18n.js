module.exports = {
  locales: ['en', 'fr', 'ru'],
  defaultLocale: 'ru',
  logBuild: process.env.NODE_ENV !== 'production',
  pages: {
    '*': ['common'],
    '/login': ['login'],
    '/(dashboard)/dashboard': ['dashboard'],
  },
};
