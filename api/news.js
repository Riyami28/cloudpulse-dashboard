// Vercel Serverless Function — Hacker News proxy
// Fetches top stories from HN Firebase API server-side

// Cloud-relevant keywords for filtering
const CLOUD_KEYWORDS = [
  "aws", "amazon web services", "ec2", "s3", "lambda",
  "azure", "microsoft cloud",
  "gcp", "google cloud", "bigquery", "vertex",
  "oracle cloud", "oci",
  "kubernetes", "k8s", "docker", "container", "helm", "istio",
  "terraform", "opentofu", "ansible", "pulumi", "infrastructure as code",
  "devops", "ci/cd", "cicd", "sre", "platform engineer",
  "finops", "cloud cost", "billing", "cost optim",
  "serverless", "microservice",
  "cloud security", "iam", "zero trust", "devsecops",
  "saas", "paas", "iaas",
  "cloud native", "cncf",
  "observability", "monitoring", "prometheus", "grafana", "datadog",
  "api gateway", "load balancer",
  "cloud migrat", "multi-cloud", "hybrid cloud",
  "data pipeline", "data engineer", "mlops", "databricks", "snowflake",
  "gpu", "ai infra", "machine learning",
  "vercel", "netlify", "cloudflare",
  "linux", "sysadmin", "deployment",
];

function isCloudRelevant(title) {
  const lower = title.toLowerCase();
  return CLOUD_KEYWORDS.some((kw) => lower.includes(kw));
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  try {
    const topRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    if (!topRes.ok) throw new Error(`HN API: ${topRes.status}`);
    const ids = await topRes.json();

    // Fetch more stories to have enough after filtering
    const top60 = ids.slice(0, 60);
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

    // If not enough cloud-relevant stories, include top general ones
    if (filtered.length < 10) {
      const general = stories
        .filter((s) => s && s.title && s.url)
        .filter((s) => !filtered.some((f) => f.id === s.id))
        .slice(0, 15)
        .map((s) => ({
          id: s.id,
          title: s.title,
          url: s.url,
          score: s.score,
          descendants: s.descendants || 0,
          time: s.time,
          by: s.by,
        }));
      filtered.push(...general);
    }

    res.status(200).json({ posts: filtered, fetchedAt: Date.now() });
  } catch (e) {
    res.status(500).json({ error: e.message, posts: [] });
  }
}
