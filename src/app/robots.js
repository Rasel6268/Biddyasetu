
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: "https://www.biddyasetu.org/sitemap.xml",
    host: "https://www.biddyasetu.org",
  };
}
