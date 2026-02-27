// pages/sitemap.xml.js
export async function getServerSideProps({ res }) {
  const url = "https://storage.yandexcloud.net/jacopublic/sitemap.xml";

  try {
    const r = await fetch(url);
    const xml = await r.text();

    res.statusCode = r.ok ? 200 : 502;
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400"
    );

    res.end(xml);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("sitemap unavailable");
  }

  return { props: {} };
}

export default function SiteMap() {
  return null;
}
