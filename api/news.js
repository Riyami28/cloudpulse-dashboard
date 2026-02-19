// Vercel Serverless Function — Hacker News proxy
// Fetches top stories from HN Firebase API server-side

// Cloud-relevant keywords for filtering
const CLOUD_KEYWORDS = [
  "aws", "amazon web services", "ec2", "s3", "lambda", "dynamodb", "cloudfront",
  "azure", "microsoft cloud",
  "gcp", "google cloud", "bigquery", "vertex",
  "oracle cloud", "oci",
  "kubernetes", "k8s", "docker", "container", "helm", "istio",
  "terraform", "opentofu", "ansible", "pulumi", "infrastructure as code",
  "devops", "ci/cd", "cicd", "sre", "platform engineer",
  "finops", "cloud cost", "cost optim",
  "serverless", "microservice",
  "cloud security", "iam", "zero trust", "devsecops",
  "cloud native", "cncf",
  "observability", "prometheus", "grafana", "datadog",
  "api gateway", "load balancer",
  "cloud migrat", "multi-cloud", "hybrid cloud",
  "data pipeline", "mlops", "databricks", "snowflake",
  "ai infra",
  "cloudflare workers", "vercel edge",
];

// Keywords that need word-boundary matching to avoid false positives
const BOUNDARY_KEYWORDS = ["oci", "s3", "iam", "sre"];

function isCloudRelevant(title) {
  const lower = title.toLowerCase();
  return CLOUD_KEYWORDS.some((kw) => {
    if (BOUNDARY_KEYWORDS.includes(kw)) {
      return new RegExp(`\\b${kw}\\b`).test(lower);
    }
    return lower.includes(kw);
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  try {
    const topRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (!topRes.ok) throw new Error(`HN API: ${topRes.status}`);
    const ids = await topRes.json();

    // Fetch more stories to have enough after cloud filtering
    const top60 = ids.slice(0, 100);
    const stories = await Promise.all(
      top60.map(async (id) => {
        try {
          const r = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return r.json();
        } catch {
          return null;
        }
      })
    );

    const filtered = stories
      .filter((s) => s && s.title && s.url)
      .filter((s) => isCloudRelevant(s.title))
      .slice(0, 30)
      .map((s) => ({
        id: s.id,
        title: s.title,
        url: s.url,
        score: s.score,
        descendants: s.descendants || 0,
        time: s.time,
        by: s.by,
      }));

    res.status(200).json({ posts: filtered, fetchedAt: Date.now() });
  } catch (e) {
    res.status(500).json({ error: e.message, posts: [] });
  }
}
