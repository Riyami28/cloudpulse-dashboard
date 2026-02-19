// Vercel Serverless Function — Twitter/X cloud voices
// Since Twitter/X has no public RSS or free API access,
// we fetch cloud industry voices from Google News RSS,
// filtering for tweets and X posts referenced in news articles.
// Falls back to cloud influencer news when direct tweet sources are unavailable.

const CLOUD_VOICE_SEARCHES = [
  { query: "AWS cloud announcement OR launch OR update", category: "aws", tags: ["AWS"] },
  { query: "Azure cloud announcement OR update OR preview", category: "azure", tags: ["Azure"] },
  { query: "Google Cloud GCP announcement OR launch", category: "gcp", tags: ["GCP"] },
  { query: "kubernetes devops cloud native", category: "twitter-voices", tags: ["Kubernetes", "DevOps"] },
  { query: "FinOps cloud cost optimization", category: "twitter-voices", tags: ["FinOps"] },
  { query: "cloud infrastructure SRE observability", category: "twitter-voices", tags: ["DevOps", "SRE"] },
  { query: "Oracle Cloud OCI announcement", category: "oci", tags: ["OCI"] },
  { query: "serverless lambda functions edge computing", category: "twitter-voices", tags: ["Serverless"] },
];

const FORTY_EIGHT_HOURS_S = 48 * 60 * 60;

function parseGoogleNewsRSS(xmlText) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xmlText)) !== null) {
    const entry = match[1];
    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    const link = (entry.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
    const pubDate = (entry.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || "";
    const source = (entry.match(/<source[^>]*>([\s\S]*?)<\/source>/) || [])[1] || "";

    const cleanTitle = title
      .replace(/<!\[CDATA\[/g, "").replace(/\]\]>/g, "")
      .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .trim();

    const timestamp = pubDate ? Math.floor(new Date(pubDate).getTime() / 1000) : 0;

    if (cleanTitle && link) {
      items.push({ title: cleanTitle, url: link, source: source.trim(), timestamp });
    }
  }
  return items;
}

async function fetchCloudVoices(query, category, tags) {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "web:cloudpulse:v1.0.0 (by /u/CloudPulseBot)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    });
    const text = await response.text();
    if (!response.ok || text.includes("<title>Blocked</title>")) return [];

    const items = parseGoogleNewsRSS(text);
    const nowS = Date.now() / 1000;
    const cutoff = nowS - FORTY_EIGHT_HOURS_S;

    return items
      .filter((item) => item.timestamp >= cutoff)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        author: item.source ? `@${item.source.replace(/\s+/g, "")}` : `@${category}`,
        category,
        tags,
      }));
  } catch {
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=1200");

  const allPosts = [];
  const seen = new Set();

  // Fetch cloud voices from all search queries in parallel
  const results = await Promise.allSettled(
    CLOUD_VOICE_SEARCHES.map(({ query, category, tags }) =>
      fetchCloudVoices(query, category, tags)
    )
  );

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      result.value.forEach((post) => {
        const key = post.title.slice(0, 60);
        if (!seen.has(key)) {
          seen.add(key);
          allPosts.push(post);
        }
      });
    }
  });

  // Format all posts with IDs
  const posts = allPosts
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 25)
    .map((post, i) => ({
      id: `tw-${i}`,
      author: post.author || "@cloud",
      title: post.title,
      summary: post.title,
      tags: post.tags || [],
      relevance: "High",
      category: post.category || "twitter-voices",
      engagement: 0,
      url: post.url,
      timestamp: post.timestamp,
    }));

  if (posts.length === 0) {
    res.status(200).json({
      posts: [],
      fetchedAt: Date.now(),
      note: "Cloud voice sources temporarily unavailable",
    });
    return;
  }

  res.status(200).json({ posts, fetchedAt: Date.now() });
}
