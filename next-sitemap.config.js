/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://babyban.kids",
  generateRobotsTxt: true,
  generateIndexSitemap: false, // optional: if you don't have many sitemaps
  changefreq: "weekly",
  priority: 0.7,
  sitemapSize: 5000,
  outDir: "./public", // makes sure it's served correctly by Next.js
};
