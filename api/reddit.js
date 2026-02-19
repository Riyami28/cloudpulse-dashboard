// Vercel Serverless Function — Reddit proxy
// Reddit blocks JSON API from datacenter IPs (403 Blocked).
// This uses RSS feeds from old.reddit.com as a workaround,
// falling back to a simulated data approach if RSS also fails.

const FETCH_SUBREDDITS = [
  { sub: "aws", category: "aws" },
  { sub: "azure", category: "azure" },
  { sub: "googlecloud", category: "gcp" },
  { sub: "oraclecloud", category: "oci" },
  { sub: "devops", category: "devops" },
  { sub: "kubernetes", category: "devops" },
  { sub: "Terraform", category: "devops" },
  { sub: "FinOps", category: "finops" },
  { sub: "CloudComputing", category: "finops" },
  { sub: "sre", category: "devops" },
  { sub: "docker", category: "devops" },
  { sub: "sysadmin", category: "devops" },
  { sub: "netsec", category: "security" },
  { sub: "SaaS", category: "saas" },
];

const FORTY_EIGHT_HOURS_S = 48 * 60 * 60;

// Parse RSS XML into post objects
function parseRSS(xmlText, subredditName) {
  const posts = [];
  // Match each <entry> in the Atom feed
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xmlText)) !== null) {
    const entry = match[1];

    const title = (entry.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
    const link = (entry.match(/<link\s+href="([^"]*)"/) || [])[1] || "";
    const updated = (entry.match(/<updated>([\s\S]*?)<\/updated>/) || [])[1] || "";
    const id = (entry.match(/<id>([\s\S]*?)<\/id>/) || [])[1] || "";
    const content = (entry.match(/<content[^>]*>([\s\S]*?)<\/content>/) || [])[1] || "";

    // Extract score and comments from content if available
    const scoreMatch = content.match(/(\d+)\s*(?:point|upvote)/i);
    const commentMatch = content.match(/(\d+)\s*comment/i);

    const createdUtc = updated ? Math.floor(new Date(updated).getTime() / 1000) : 0;

    // Clean up HTML entities in title
    const cleanTitle = title
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\[link\].*$/g, "")
      .trim();

    if (cleanTitle && link) {
      posts.push({
        id: id || `rss-${subredditName}-${posts.length}`,
        title: cleanTitle,
        selftext: "",
        subreddit: subredditName,
        score: scoreMatch ? parseInt(scoreMatch[1], 10) : 1,
        num_comments: commentMatch ? parseInt(commentMatch[1], 10) : 0,
        created_utc: createdUtc,
        permalink: `/r/${subredditName}/comments/` + (link.match(/comments\/([^/]+)/) || ["", ""])[1],
        url: link,
      });
    }
  }
  return posts;
}

async function fetchSubredditRSS(subredditName) {
  // Try old.reddit.com RSS first (less likely to be blocked)
  const url = `https://old.reddit.com/r/${subredditName}/new/.rss?limit=10`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "web:cloudpulse:v1.0.0 (by /u/CloudPulseBot)",
      "Accept": "application/rss+xml, application/xml, text/xml, application/atom+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`r/${subredditName}: RSS HTTP ${response.status}`);
  }

  // Check if we got XML (not a blocked HTML page)
  if (text.includes("<title>Blocked</title>") || !text.includes("<feed") && !text.includes("<rss")) {
    throw new Error(`r/${subredditName}: RSS blocked or invalid response`);
  }

  return parseRSS(text, subredditName);
}

async function fetchSubredditJSON(subredditName) {
  // Try the JSON API as well (might work with proper headers)
  const url = `https://www.reddit.com/r/${subredditName}/new.json?limit=10&raw_json=1`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "web:cloudpulse:v1.0.0 (by /u/CloudPulseBot)",
      "Accept": "application/json",
    },
    redirect: "follow",
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`r/${subredditName}: JSON HTTP ${response.status}`);
  }

  const data = JSON.parse(text);
  if (!data?.data?.children) {
    throw new Error(`r/${subredditName}: unexpected structure`);
  }

  return data.data.children.map((c) => c.data);
}

async function fetchSubreddit(subredditName) {
  // Try JSON first, then RSS as fallback
  try {
    return await fetchSubredditJSON(subredditName);
  } catch (jsonErr) {
    try {
      return await fetchSubredditRSS(subredditName);
    } catch (rssErr) {
      throw new Error(`JSON: ${jsonErr.message} | RSS: ${rssErr.message}`);
    }
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const nowS = Date.now() / 1000;
  const cutoff = nowS - FORTY_EIGHT_HOURS_S;
  const results = [];
  const errors = [];
  const errorDetails = [];

  // Fetch in batches of 2 with delays
  const batchSize = 2;
  for (let i = 0; i < FETCH_SUBREDDITS.length; i += batchSize) {
    const batch = FETCH_SUBREDDITS.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(({ sub }) => fetchSubreddit(sub))
    );

    batchResults.forEach((result, idx) => {
      const { sub, category } = batch[idx];
      if (result.status === "fulfilled") {
        result.value.forEach((post) => {
          if (post.created_utc && post.created_utc < cutoff) return;
          results.push({
            id: post.id || `r-${sub}-${results.length}`,
            title: post.title,
            selftext: post.selftext ? post.selftext.slice(0, 300) : "",
            subreddit: post.subreddit || sub,
            score: post.score || 0,
            num_comments: post.num_comments || 0,
            created_utc: post.created_utc || nowS,
            permalink: post.permalink || `/r/${sub}/`,
            url: post.url || `https://www.reddit.com/r/${sub}/`,
            category,
          });
        });
      } else {
        errors.push(sub);
        errorDetails.push(result.reason?.message || String(result.reason));
      }
    });

    if (i + batchSize < FETCH_SUBREDDITS.length) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  results.sort((a, b) => b.created_utc - a.created_utc);

  res.status(200).json({
    posts: results,
    errors,
    errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
    fetchedAt: Date.now(),
    totalSubreddits: FETCH_SUBREDDITS.length,
    successCount: FETCH_SUBREDDITS.length - errors.length,
  });
}
