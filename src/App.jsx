import { useState, useMemo, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// ICONS — Sun / Moon for theme toggle
// ═══════════════════════════════════════════════════════════
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zm8-5a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zm11.95-4.95a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-9.9 9.9a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM16.95 15.95a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zm-9.9-9.9a.75.75 0 01-1.06 0L4.93 5.05a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM10 7a3 3 0 100 6 3 3 0 000-6z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z" clipRule="evenodd" />
  </svg>
);

// ═══════════════════════════════════════════════════════════
// 50+ TRACKED SUBREDDITS — FinOps, Cloud, DevOps, SRE, OCI
// ═══════════════════════════════════════════════════════════
const TRACKED_SUBREDDITS = [
  // AWS Ecosystem
  { name: "r/aws", url: "https://www.reddit.com/r/aws/", category: "AWS", members: "420K" },
  { name: "r/AWSCertifications", url: "https://www.reddit.com/r/AWSCertifications/", category: "AWS", members: "120K" },
  { name: "r/serverless", url: "https://www.reddit.com/r/serverless/", category: "AWS", members: "18K" },
  { name: "r/lambda", url: "https://www.reddit.com/r/lambda/", category: "AWS", members: "8K" },
  { name: "r/AmazonECS", url: "https://www.reddit.com/r/AmazonECS/", category: "AWS", members: "5K" },
  // Azure Ecosystem
  { name: "r/azure", url: "https://www.reddit.com/r/azure/", category: "Azure", members: "210K" },
  { name: "r/AzureCertification", url: "https://www.reddit.com/r/AzureCertification/", category: "Azure", members: "45K" },
  { name: "r/AZURE_AI", url: "https://www.reddit.com/r/AZURE_AI/", category: "Azure", members: "12K" },
  { name: "r/AzureDevOps", url: "https://www.reddit.com/r/AzureDevOps/", category: "Azure", members: "15K" },
  { name: "r/AzureStack", url: "https://www.reddit.com/r/AzureStack/", category: "Azure", members: "4K" },
  // GCP Ecosystem
  { name: "r/googlecloud", url: "https://www.reddit.com/r/googlecloud/", category: "GCP", members: "85K" },
  { name: "r/GoogleCloudPlatform", url: "https://www.reddit.com/r/GoogleCloudPlatform/", category: "GCP", members: "12K" },
  { name: "r/bigquery", url: "https://www.reddit.com/r/bigquery/", category: "GCP", members: "9K" },
  { name: "r/firebase", url: "https://www.reddit.com/r/firebase/", category: "GCP", members: "65K" },
  // OCI (Oracle Cloud Infrastructure)
  { name: "r/oraclecloud", url: "https://www.reddit.com/r/oraclecloud/", category: "OCI", members: "12K" },
  { name: "r/oracle", url: "https://www.reddit.com/r/oracle/", category: "OCI", members: "18K" },
  { name: "r/OracleDatabase", url: "https://www.reddit.com/r/OracleDatabase/", category: "OCI", members: "8K" },
  // FinOps & Cloud Cost Optimization
  { name: "r/FinOps", url: "https://www.reddit.com/r/FinOps/", category: "FinOps", members: "6K" },
  { name: "r/CloudCostOptimization", url: "https://www.reddit.com/r/CloudCostOptimization/", category: "FinOps", members: "3K" },
  { name: "r/CloudFinance", url: "https://www.reddit.com/r/CloudFinance/", category: "FinOps", members: "2K" },
  { name: "r/costoptimization", url: "https://www.reddit.com/r/costoptimization/", category: "FinOps", members: "1.5K" },
  { name: "r/reservedinstances", url: "https://www.reddit.com/r/reservedinstances/", category: "FinOps", members: "1K" },
  // DevOps & SRE
  { name: "r/devops", url: "https://www.reddit.com/r/devops/", category: "DevOps", members: "350K" },
  { name: "r/sre", url: "https://www.reddit.com/r/sre/", category: "DevOps", members: "42K" },
  { name: "r/sysadmin", url: "https://www.reddit.com/r/sysadmin/", category: "DevOps", members: "820K" },
  { name: "r/linuxadmin", url: "https://www.reddit.com/r/linuxadmin/", category: "DevOps", members: "120K" },
  { name: "r/CICD", url: "https://www.reddit.com/r/CICD/", category: "DevOps", members: "5K" },
  { name: "r/platformengineering", url: "https://www.reddit.com/r/platformengineering/", category: "DevOps", members: "8K" },
  // Kubernetes & Containers
  { name: "r/kubernetes", url: "https://www.reddit.com/r/kubernetes/", category: "Kubernetes", members: "180K" },
  { name: "r/docker", url: "https://www.reddit.com/r/docker/", category: "Kubernetes", members: "220K" },
  { name: "r/helm", url: "https://www.reddit.com/r/helm/", category: "Kubernetes", members: "6K" },
  { name: "r/istio", url: "https://www.reddit.com/r/istio/", category: "Kubernetes", members: "4K" },
  { name: "r/containers", url: "https://www.reddit.com/r/containers/", category: "Kubernetes", members: "3K" },
  // Infrastructure as Code
  { name: "r/Terraform", url: "https://www.reddit.com/r/Terraform/", category: "IaC", members: "85K" },
  { name: "r/ansible", url: "https://www.reddit.com/r/ansible/", category: "IaC", members: "55K" },
  { name: "r/Pulumi", url: "https://www.reddit.com/r/Pulumi/", category: "IaC", members: "7K" },
  { name: "r/opentofu", url: "https://www.reddit.com/r/opentofu/", category: "IaC", members: "5K" },
  { name: "r/crossplane", url: "https://www.reddit.com/r/crossplane/", category: "IaC", members: "2K" },
  // Cloud Security
  { name: "r/cloudsecurity", url: "https://www.reddit.com/r/cloudsecurity/", category: "Security", members: "25K" },
  { name: "r/netsec", url: "https://www.reddit.com/r/netsec/", category: "Security", members: "530K" },
  { name: "r/AWSSecurityBlog", url: "https://www.reddit.com/r/AWSSecurityBlog/", category: "Security", members: "3K" },
  { name: "r/devsecops", url: "https://www.reddit.com/r/devsecops/", category: "Security", members: "15K" },
  { name: "r/zerotrust", url: "https://www.reddit.com/r/zerotrust/", category: "Security", members: "4K" },
  // SaaS & Cloud Business
  { name: "r/SaaS", url: "https://www.reddit.com/r/SaaS/", category: "SaaS", members: "95K" },
  { name: "r/CloudComputing", url: "https://www.reddit.com/r/CloudComputing/", category: "SaaS", members: "35K" },
  { name: "r/cloudmigration", url: "https://www.reddit.com/r/cloudmigration/", category: "SaaS", members: "2K" },
  { name: "r/MSP", url: "https://www.reddit.com/r/msp/", category: "SaaS", members: "165K" },
  { name: "r/StartupSaaS", url: "https://www.reddit.com/r/StartupSaaS/", category: "SaaS", members: "3K" },
  // Observability & Monitoring
  { name: "r/Prometheus", url: "https://www.reddit.com/r/PrometheusMonitoring/", category: "Observability", members: "12K" },
  { name: "r/grafana", url: "https://www.reddit.com/r/grafana/", category: "Observability", members: "28K" },
  { name: "r/datadog", url: "https://www.reddit.com/r/datadog/", category: "Observability", members: "8K" },
  { name: "r/OpenTelemetry", url: "https://www.reddit.com/r/OpenTelemetry/", category: "Observability", members: "5K" },
  // Data & AI on Cloud
  { name: "r/dataengineering", url: "https://www.reddit.com/r/dataengineering/", category: "Data", members: "250K" },
  { name: "r/MachineLearning", url: "https://www.reddit.com/r/MachineLearning/", category: "Data", members: "2.8M" },
  { name: "r/mlops", url: "https://www.reddit.com/r/mlops/", category: "Data", members: "22K" },
  { name: "r/databricks", url: "https://www.reddit.com/r/databricks/", category: "Data", members: "18K" },
  { name: "r/snowflake", url: "https://www.reddit.com/r/snowflake/", category: "Data", members: "15K" },
];

// Subreddits to actively fetch posts from (representative subset to avoid rate limits)
const FETCH_SUBREDDITS = [
  { sub: "aws", category: "aws", label: "r/aws" },
  { sub: "azure", category: "azure", label: "r/azure" },
  { sub: "googlecloud", category: "gcp", label: "r/googlecloud" },
  { sub: "oraclecloud", category: "oci", label: "r/oraclecloud" },
  { sub: "devops", category: "devops", label: "r/devops" },
  { sub: "kubernetes", category: "devops", label: "r/kubernetes" },
  { sub: "Terraform", category: "devops", label: "r/Terraform" },
  { sub: "FinOps", category: "finops", label: "r/FinOps" },
  { sub: "CloudComputing", category: "finops", label: "r/CloudComputing" },
  { sub: "sre", category: "devops", label: "r/sre" },
  { sub: "docker", category: "devops", label: "r/docker" },
  { sub: "sysadmin", category: "devops", label: "r/sysadmin" },
  { sub: "netsec", category: "security", label: "r/netsec" },
  { sub: "SaaS", category: "saas", label: "r/SaaS" },
];

// ═══════════════════════════════════════════════════════════
// COMPETITOR INTELLIGENCE
// ═══════════════════════════════════════════════════════════
const COMPETITOR_INTEL = [
  { company: "Vantage", type: "Product Launch", title: "Multi-Cloud K8s Cost Allocation", impact: "Directly competes with Zop's container cost attribution. They now support namespace-level allocation across all three hyperscalers.", action: "Evaluate feature parity and publish comparison blog", severity: "high", url: "https://www.vantage.sh/blog" },
  { company: "CloudZero", type: "Feature Update", title: "Real-Time Unit Cost Analytics", impact: "Moves into real-time SaaS unit economics — an area where Zop can differentiate with deeper billing integration and actionable recommendations.", action: "Highlight Zop's recommendation engine as differentiator", severity: "high", url: "https://www.cloudzero.com/blog/" },
  { company: "Spot.io", type: "Product Launch", title: "AI Workload GPU Optimizer", impact: "Entering GPU cost optimization market. Growing demand for AI infra cost management could pull budget from general FinOps tools.", action: "Consider AI cost optimization content series", severity: "medium", url: "https://spot.io/blog/" },
  { company: "Datadog", type: "Acquisition", title: "$280M Cloud Cost Intelligence Acquisition", impact: "Observability giant entering FinOps directly. Bundled offering could pressure standalone FinOps tools on enterprise deals.", action: "Publish thought leadership on best-of-breed vs. bundled FinOps", severity: "high", url: "https://www.datadoghq.com/blog/" },
];

// ═══════════════════════════════════════════════════════════
// CATEGORIES — includes OCI, Twitter Voices, Reddit Community
// ═══════════════════════════════════════════════════════════
const DEFAULT_CATEGORIES = [
  { id: "all", label: "All News", icon: "📋" },
  { id: "news", label: "Tech News", icon: "📰" },
  { id: "aws", label: "AWS", icon: "☁️" },
  { id: "azure", label: "Azure", icon: "🔷" },
  { id: "gcp", label: "GCP", icon: "🟢" },
  { id: "oci", label: "OCI", icon: "🔶" },
  { id: "finops", label: "FinOps", icon: "💰" },
  { id: "devops", label: "DevOps / SRE", icon: "⚙️" },
  { id: "security", label: "Security", icon: "🔒" },
  { id: "twitter-voices", label: "Twitter Voices", icon: "\u{1D54F}" },
  { id: "reddit-community", label: "Reddit Community", icon: "🔴" },
];

const LOW_COUNT_THRESHOLD = 5;

const PLATFORMS = [
  { id: "all", label: "All Platforms", icon: "🌐" },
  { id: "official", label: "Official Blogs", icon: "📢" },
  { id: "twitter", label: "Twitter / X", icon: "\u{1D54F}" },
  { id: "reddit", label: "Reddit", icon: "🔴" },
  { id: "google", label: "Google News", icon: "🔍" },
];

// ═══════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function timeAgo(epochSeconds) {
  const now = Date.now();
  const diff = now - epochSeconds * 1000;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function isWithin48Hours(epochSeconds) {
  return (Date.now() - epochSeconds * 1000) <= FORTY_EIGHT_HOURS_MS;
}

function mapRedditCategory(subredditName) {
  const sub = subredditName.toLowerCase();
  const mapping = FETCH_SUBREDDITS.find((s) => s.sub.toLowerCase() === sub);
  return mapping ? mapping.category : "devops";
}

function generateTags(title, subreddit) {
  const tags = [];
  const text = (title + " " + subreddit).toLowerCase();
  if (text.includes("aws") || text.includes("amazon") || text.includes("ec2") || text.includes("lambda") || text.includes("s3")) tags.push("AWS");
  if (text.includes("azure") || text.includes("microsoft")) tags.push("Azure");
  if (text.includes("gcp") || text.includes("google cloud") || text.includes("bigquery")) tags.push("GCP");
  if (text.includes("oracle") || /\boci\b/.test(text)) tags.push("OCI");
  if (text.includes("kubernetes") || text.includes("k8s") || text.includes("helm") || text.includes("istio")) tags.push("Kubernetes");
  if (text.includes("docker") || text.includes("container")) tags.push("Kubernetes");
  if (text.includes("terraform") || text.includes("opentofu") || text.includes("ansible") || text.includes("pulumi")) tags.push("DevOps");
  if (text.includes("finops") || text.includes("cost") || text.includes("billing") || text.includes("pricing") || text.includes("saving")) tags.push("FinOps");
  if (text.includes("security") || text.includes("iam") || text.includes("zero trust")) tags.push("Security");
  if (text.includes("saas") || text.includes("startup")) tags.push("SaaS");
  if (text.includes("devops") || text.includes("ci/cd") || text.includes("sre") || text.includes("platform engineer")) tags.push("DevOps");
  if (text.includes("ai") || text.includes("ml") || text.includes("machine learning") || text.includes("gpu")) tags.push("AI/ML");
  const unique = [...new Set(tags)];
  return unique.length > 0 ? unique.slice(0, 4) : ["Cloud"];
}

// ═══════════════════════════════════════════════════════════
// API — Fetch Hacker News via server-side proxy
// ═══════════════════════════════════════════════════════════
async function fetchHackerNewsPosts() {
  try {
    const res = await fetch("/api/news");
    if (!res.ok) throw new Error(`News API returned ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return (data.posts || []).map((s) => {
      const source = s.url ? new URL(s.url).hostname.replace("www.", "") : "news.ycombinator.com";
      const tags = generateTags(s.title, "");
      const catMap = { AWS: "aws", Azure: "azure", GCP: "gcp", OCI: "oci", FinOps: "finops", DevOps: "devops", Security: "security", Kubernetes: "devops", SaaS: "saas", "AI/ML": "news" };
      const category = tags.reduce((acc, t) => acc || catMap[t], null) || "news";
      return {
        id: `hn-${s.id}`,
        title: s.title,
        source: source,
        sourceIcon: "\uD83D\uDCF0",
        platform: "official",
        summary: `${s.score} points \u2022 ${s.descendants || 0} comments on Hacker News \u2014 Source: ${source}`,
        blogAngle: "",
        tags,
        relevance: s.score > 200 ? "High" : s.score > 50 ? "Medium" : "Low",
        category,
        time: timeAgo(s.time),
        timestamp: s.time,
        engagement: s.score + (s.descendants || 0),
        url: s.url,
      };
    });
  } catch (e) {
    console.error("News API error:", e);
    throw e;
  }
}

// ═══════════════════════════════════════════════════════════
// API — Fetch Reddit via server-side proxy (avoids CORS)
// ═══════════════════════════════════════════════════════════
async function fetchAllRedditPosts() {
  try {
    const res = await fetch("/api/reddit");
    if (!res.ok) throw new Error(`Reddit API returned ${res.status}`);
    const data = await res.json();
    const posts = (data.posts || []).map((post) => ({
      id: `reddit-${post.id}`,
      title: post.title,
      source: "Reddit",
      sourceIcon: "\uD83D\uDD34",
      platform: "reddit",
      summary: post.selftext
        ? post.selftext.slice(0, 280) + (post.selftext.length > 280 ? "..." : "")
        : `Posted in r/${post.subreddit} with ${post.score} upvotes and ${post.num_comments} comments.`,
      blogAngle: "",
      tags: generateTags(post.title, post.subreddit),
      relevance: post.score > 100 ? "High" : post.score > 20 ? "Medium" : "Low",
      category: post.category || mapRedditCategory(post.subreddit),
      time: timeAgo(post.created_utc),
      timestamp: post.created_utc,
      engagement: post.score + post.num_comments,
      subreddit: `r/${post.subreddit}`,
      url: `https://www.reddit.com${post.permalink}`,
    }));
    return { posts, errors: data.errors || [] };
  } catch (e) {
    console.error("Reddit API error:", e);
    throw e;
  }
}

// ═══════════════════════════════════════════════════════════
// API — Fetch Twitter via server-side proxy
// ═══════════════════════════════════════════════════════════
async function fetchTwitterPosts() {
  try {
    const res = await fetch("/api/twitter");
    if (!res.ok) throw new Error(`Twitter API returned ${res.status}`);
    const data = await res.json();
    return (data.posts || []).map((post) => ({
      id: `twitter-${post.id}`,
      title: `${post.author}: ${post.title}`,
      source: "Twitter/X",
      sourceIcon: "\u{1D54F}",
      platform: "twitter",
      summary: post.summary,
      blogAngle: "",
      tags: post.tags || [],
      relevance: post.relevance || "Medium",
      category: post.category,
      time: timeAgo(post.timestamp),
      timestamp: post.timestamp,
      engagement: post.engagement || 0,
      url: post.url,
    }));
  } catch (e) {
    console.error("Twitter API error:", e);
    throw e;
  }
}

// ═══════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════
const RelevanceBadge = ({ level }) => {
  const colors = {
    High: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Low: "bg-slate-200/60 dark:bg-slate-500/20 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-500/30",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[level]}`}>{level}</span>;
};

const Tag = ({ label }) => {
  const colorMap = {
    AWS: "bg-orange-500/15 text-orange-600 dark:text-orange-300", Azure: "bg-blue-500/15 text-blue-600 dark:text-blue-300", GCP: "bg-green-500/15 text-green-600 dark:text-green-300", OCI: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    FinOps: "bg-purple-500/15 text-purple-600 dark:text-purple-300", DevOps: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300", Kubernetes: "bg-sky-500/15 text-sky-600 dark:text-sky-300", Security: "bg-red-500/15 text-red-600 dark:text-red-300",
    "Cost Optimization": "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300", "AI/ML": "bg-pink-500/15 text-pink-600 dark:text-pink-300", Competitors: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
    SaaS: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300", SRE: "bg-teal-500/15 text-teal-600 dark:text-teal-300", "Multi-Cloud": "bg-violet-500/15 text-violet-600 dark:text-violet-300", Cloud: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  };
  const color = colorMap[label] || "bg-slate-500/15 text-slate-500 dark:text-slate-400";
  return <span className={`px-2 py-0.5 rounded text-xs ${color}`}>{label}</span>;
};

const NewsCard = ({ item, expanded, onToggle }) => (
  <div className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-xl p-5 hover:border-gray-300 dark:hover:border-slate-600/70 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-slate-800/80 shadow-sm dark:shadow-none">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{item.sourceIcon}</span>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 dark:text-slate-400 font-medium uppercase tracking-wider hover:text-emerald-400 transition-colors underline underline-offset-2 decoration-gray-300 dark:decoration-slate-600 hover:decoration-emerald-400">{item.source}</a>
          {item.subreddit && (
            <>
              <span className="text-xs text-gray-400 dark:text-slate-600">&bull;</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300">{item.subreddit}</a>
            </>
          )}
          <span className="text-xs text-gray-400 dark:text-slate-600">&bull;</span>
          <span className="text-xs text-gray-500 dark:text-slate-500">{item.time}</span>
          {item.engagement > 0 && (
            <>
              <span className="text-xs text-gray-400 dark:text-slate-600">&bull;</span>
              <span className="text-xs text-gray-500 dark:text-slate-500">{item.engagement.toLocaleString()} engagements</span>
            </>
          )}
        </div>
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-gray-900 dark:text-slate-100 leading-snug hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer block">{item.title}</a>
      </div>
      <RelevanceBadge level={item.relevance} />
    </div>
    <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed mb-3">{item.summary}</p>
    <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-40 opacity-100 mb-3" : "max-h-0 opacity-0"}`}>
      <div className="bg-gray-100 dark:bg-slate-700/30 rounded-lg p-3 border-l-2 border-emerald-500/50">
        <p className="text-xs font-medium text-emerald-400 mb-1 uppercase tracking-wider">Blog Angle</p>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{item.blogAngle}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-1.5">{item.tags.map((tag) => <Tag key={tag} label={tag} />)}</div>
      <div className="flex items-center gap-3 ml-3">
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-500 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors whitespace-nowrap flex items-center gap-1">Read Source <span className="text-sm">{"\u2197"}</span></a>
        {item.blogAngle && (
          <button onClick={onToggle} className="text-xs text-gray-500 dark:text-slate-500 hover:text-emerald-400 transition-colors whitespace-nowrap">{expanded ? "Hide angle \u25B2" : "Blog angle \u25BC"}</button>
        )}
      </div>
    </div>
  </div>
);

const CompetitorCard = ({ intel }) => {
  const severityColor = { high: "border-l-red-500", medium: "border-l-amber-500", low: "border-l-slate-500" };
  return (
    <div className={`bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-xl p-4 border-l-4 shadow-sm dark:shadow-none ${severityColor[intel.severity]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <a href={intel.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-800 dark:text-slate-200 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{intel.company}</a>
          <span className="px-2 py-0.5 rounded text-xs bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-slate-400">{intel.type}</span>
        </div>
        <span className={`text-xs font-medium uppercase ${intel.severity === "high" ? "text-red-400" : "text-amber-400"}`}>{intel.severity} impact</span>
      </div>
      <a href={intel.url} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2 block hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">{intel.title}</a>
      <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 leading-relaxed">{intel.impact}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-xs text-emerald-400">&rarr;</span><span className="text-xs text-emerald-400/80">{intel.action}</span></div>
        <a href={intel.url} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-500 dark:text-cyan-400 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors flex items-center gap-1">View Source <span className="text-sm">{"\u2197"}</span></a>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon }) => (
  <div className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-xl p-4 shadow-sm dark:shadow-none">
    <div className="flex items-center justify-between mb-1"><span className="text-xs text-gray-500 dark:text-slate-500 uppercase tracking-wider">{label}</span><span className="text-lg">{icon}</span></div>
    <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">{value}</div>
    <div className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">{sub}</div>
  </div>
);

const SubredditBadge = ({ sub, onRemove }) => (
  <div className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-lg px-3 py-2 hover:border-orange-500/40 hover:bg-gray-50 dark:hover:bg-slate-800/80 transition-all flex items-center gap-2 group shadow-sm dark:shadow-none">
    <a href={sub.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
      <span className="text-orange-400 text-xs">🔴</span>
      <span className="text-xs text-gray-700 dark:text-slate-300 group-hover:text-orange-300 transition-colors">{sub.name}</span>
      <span className="text-xs text-gray-400 dark:text-slate-600">{sub.members}</span>
    </a>
    {sub.isCustom && onRemove && (
      <button onClick={() => onRemove(sub.name)} className="text-[10px] text-gray-400 dark:text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1" title="Remove">&times;</button>
    )}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="flex items-center gap-3 mb-4">
      <span className="text-2xl">📰</span>
      <span className="text-2xl">🔴</span>
      <span className="text-2xl">{"\u{1D54F}"}</span>
    </div>
    <p className="text-sm text-gray-500 dark:text-slate-500">Loading live data from 3 sources...</p>
    <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">Hacker News + Reddit + Twitter</p>
  </div>
);

const ErrorBanner = ({ errors, onRetry }) => (
  <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-center justify-between">
    <div>
      <p className="text-sm text-red-400">Some data sources could not be reached</p>
      <p className="text-xs text-red-400/70 mt-0.5">Failed: {errors.join(", ")}</p>
    </div>
    <button onClick={onRetry} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Retry</button>
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════
export default function CloudNewsDashboard() {
  // Dark mode with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('cloudpulse-theme');
    return stored ? stored === 'dark' : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('cloudpulse-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const [activeCategory, setActiveCategory] = useState("all");
  const [activePlatform, setActivePlatform] = useState("all");
  const [expandedCards, setExpandedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("digest");
  const [relevanceFilter, setRelevanceFilter] = useState("all");
  const [subredditFilter, setSubredditFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Custom categories
  const [customCategories, setCustomCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("📌");

  // Custom subreddits
  const [customSubreddits, setCustomSubreddits] = useState([]);
  const [showAddSubreddit, setShowAddSubreddit] = useState(false);
  const [newSubName, setNewSubName] = useState("");
  const [newSubUrl, setNewSubUrl] = useState("");
  const [newSubCategory, setNewSubCategory] = useState("AWS");
  const [newSubMembers, setNewSubMembers] = useState("");

  // Live data state
  const [newsPosts, setNewsPosts] = useState([]);
  const [redditPosts, setRedditPosts] = useState([]);
  const [twitterPosts, setTwitterPosts] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [redditLoading, setRedditLoading] = useState(true);
  const [twitterLoading, setTwitterLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [redditError, setRedditError] = useState(null);
  const [twitterError, setTwitterError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const isLoading = newsLoading || redditLoading || twitterLoading;

  useEffect(() => {
    // Fetch Hacker News
    setNewsLoading(true);
    fetchHackerNewsPosts()
      .then((posts) => { setNewsPosts(posts); setNewsError(null); })
      .catch((e) => setNewsError(e.message))
      .finally(() => setNewsLoading(false));

    // Fetch Reddit
    setRedditLoading(true);
    fetchAllRedditPosts()
      .then((result) => { setRedditPosts(result.posts); setRedditError(result.errors.length > 0 ? result.errors.join(", ") : null); })
      .catch((e) => setRedditError(e.message))
      .finally(() => setRedditLoading(false));

    // Fetch Twitter
    setTwitterLoading(true);
    fetchTwitterPosts()
      .then((posts) => { setTwitterPosts(posts); setTwitterError(null); })
      .catch((e) => setTwitterError(e.message))
      .finally(() => setTwitterLoading(false));

    setLastFetchTime(new Date());
  }, []);

  // Combine all news items
  const allNews = useMemo(() => {
    const combined = [...newsPosts, ...redditPosts, ...twitterPosts];
    combined.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    return combined;
  }, [newsPosts, redditPosts, twitterPosts]);

  // Merged categories = default + custom
  const allCategories = useMemo(
    () => [
      ...DEFAULT_CATEGORIES,
      ...customCategories.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
    ].map((cat) => {
      let count;
      if (cat.id === "all") count = allNews.length;
      else if (cat.id === "twitter-voices") count = allNews.filter((item) => item.platform === "twitter").length;
      else if (cat.id === "reddit-community") count = allNews.filter((item) => item.platform === "reddit").length;
      else count = allNews.filter((item) => item.category === cat.id).length;
      return { ...cat, count };
    }),
    [customCategories, allNews]
  );

  // Merged subreddits = default + custom
  const allSubreddits = useMemo(() => [...TRACKED_SUBREDDITS, ...customSubreddits], [customSubreddits]);

  // Add category handler
  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const id = newCatName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (allCategories.some((c) => c.id === id)) return;
    setCustomCategories((prev) => [...prev, { id, label: newCatName.trim(), icon: newCatIcon }]);
    setNewCatName("");
    setNewCatIcon("📌");
    setShowAddCategory(false);
  };

  const removeCustomCategory = (id) => {
    setCustomCategories((prev) => prev.filter((c) => c.id !== id));
    if (activeCategory === id) setActiveCategory("all");
  };

  // Add subreddit handler
  const handleAddSubreddit = () => {
    if (!newSubName.trim()) return;
    const name = newSubName.startsWith("r/") ? newSubName.trim() : `r/${newSubName.trim()}`;
    const url = newSubUrl.trim() || `https://www.reddit.com/${name}/`;
    if (allSubreddits.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    setCustomSubreddits((prev) => [...prev, { name, url, category: newSubCategory, members: newSubMembers || "\u2014", isCustom: true }]);
    setNewSubName(""); setNewSubUrl(""); setNewSubMembers(""); setShowAddSubreddit(false);
  };

  const removeCustomSubreddit = (name) => {
    setCustomSubreddits((prev) => prev.filter((s) => s.name !== name));
  };

  const filteredNews = useMemo(() => {
    let items = allNews;
    if (activeCategory === "twitter-voices") {
      items = items.filter((item) => item.platform === "twitter");
    } else if (activeCategory === "reddit-community") {
      items = items.filter((item) => item.platform === "reddit");
    } else if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (activePlatform !== "all") items = items.filter((item) => item.platform === activePlatform);
    if (relevanceFilter !== "all") items = items.filter((item) => item.relevance === relevanceFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter((item) =>
        item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [allNews, activeCategory, activePlatform, searchQuery, relevanceFilter]);

  const toggleExpand = (id) => setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));

  const highCount = allNews.filter((n) => n.relevance === "High").length;
  const redditCount = allNews.filter((n) => n.platform === "reddit").length;
  const twitterCount = allNews.filter((n) => n.platform === "twitter").length;
  const newsCount = allNews.filter((n) => n.platform === "official").length;

  const subredditCategories = [...new Set(allSubreddits.map((s) => s.category))];
  const filteredSubreddits = subredditFilter === "all" ? allSubreddits : allSubreddits.filter((s) => s.category === subredditFilter);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const headerSummary = `${allNews.length} live articles \u2022 ${newsCount} news + ${redditCount} Reddit + ${twitterCount} Twitter \u2022 Updated ${timeStr}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 dark:bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`w-64 bg-white/80 dark:bg-slate-900/80 border-r border-gray-200 dark:border-slate-800 flex flex-col fixed h-full overflow-y-auto z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-5 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">Z</div>
            <div>
              <h1 className="text-base font-bold text-gray-900 dark:text-slate-100">CloudPulse</h1>
              <p className="text-xs text-gray-500 dark:text-slate-500">by Riya's Intelligence</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <input type="text" placeholder="Search news..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
            <span className="absolute right-3 top-2.5 text-gray-400 dark:text-slate-600 text-xs">&#8984;K</span>
          </div>
        </div>

        <nav className="flex-1 px-3 overflow-y-auto">
          {/* Categories header with + button */}
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-xs text-gray-400 dark:text-slate-600 uppercase tracking-wider">Categories</p>
            <button onClick={() => setShowAddCategory(!showAddCategory)} className="w-5 h-5 rounded flex items-center justify-center text-xs text-gray-500 dark:text-slate-500 hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all" title="Add custom category">
              {showAddCategory ? "\u2715" : "+"}
            </button>
          </div>

          {/* Add category form */}
          {showAddCategory && (
            <div className="mb-3 bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-lg p-3">
              <p className="text-xs text-emerald-400 font-medium mb-2">New Category</p>
              <div className="flex gap-2 mb-2">
                <input type="text" placeholder="Icon" value={newCatIcon} onChange={(e) => setNewCatIcon(e.target.value)} className="w-10 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-1.5 py-1 text-sm text-center focus:outline-none focus:border-emerald-500/50" maxLength={2} />
                <input type="text" placeholder="Category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddCategory()} className="flex-1 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded px-2 py-1 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500/50" />
              </div>
              <button onClick={handleAddCategory} className="w-full py-1.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-all">Add Category</button>
            </div>
          )}

          {/* Category list */}
          {allCategories.map((cat) => {
            const isCustom = customCategories.some((c) => c.id === cat.id);
            const isLowCount = cat.id !== "all" && cat.count < LOW_COUNT_THRESHOLD;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setSidebarOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-0.5 transition-all group ${activeCategory === cat.id ? "bg-emerald-500/15 text-emerald-400" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-700 dark:hover:text-slate-300"}`}
              >
                <div className="flex items-center gap-2.5">
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                  {isLowCount && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30" title={`Below ${LOW_COUNT_THRESHOLD} item threshold`}>!</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs ${activeCategory === cat.id ? "text-emerald-500" : "text-gray-400 dark:text-slate-600"}`}>{cat.count}</span>
                  {isCustom && (
                    <span onClick={(e) => { e.stopPropagation(); removeCustomCategory(cat.id); }} className="text-[10px] text-gray-400 dark:text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Remove category">&times;</span>
                  )}
                </div>
              </button>
            );
          })}

          <div className="border-t border-gray-200 dark:border-slate-800 my-4" />
          <p className="px-2 text-xs text-gray-400 dark:text-slate-600 uppercase tracking-wider mb-2">Platform</p>
          {PLATFORMS.map((plat) => (
            <button key={plat.id} onClick={() => { setActivePlatform(plat.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${activePlatform === plat.id ? "bg-cyan-500/15 text-cyan-400" : "text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-700 dark:hover:text-slate-300"}`}>
              <span>{plat.icon}</span><span>{plat.label}</span>
            </button>
          ))}

          <div className="border-t border-gray-200 dark:border-slate-800 my-4" />
          <p className="px-2 text-xs text-gray-400 dark:text-slate-600 uppercase tracking-wider mb-2">Relevance</p>
          {["all", "High", "Medium"].map((level) => (
            <button key={level} onClick={() => { setRelevanceFilter(level); setSidebarOpen(false); }} className={`w-full flex items-center px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${relevanceFilter === level ? "bg-gray-200 dark:bg-slate-700/50 text-gray-800 dark:text-slate-200" : "text-gray-500 dark:text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-600 dark:hover:text-slate-400"}`}>
              {level === "all" ? "All Levels" : level}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-slate-800">
          <div className="bg-gray-100 dark:bg-slate-800/40 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Data Sources</p>
            <p className="text-sm font-medium text-emerald-400">{isLoading ? "Loading..." : "Live"}</p>
            <p className="text-xs text-gray-400 dark:text-slate-600 mt-1">News + {allSubreddits.length} subreddits + Twitter</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-slate-200">&equiv;</button>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Daily Cloud Intelligence</h2>
                <p className="text-sm text-gray-500 dark:text-slate-500">{headerSummary}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Theme toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-9 h-9 rounded-lg bg-gray-200 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 transition-colors border border-gray-300 dark:border-slate-700"
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <SunIcon /> : <MoonIcon />}
              </button>
              <div className="flex bg-gray-100 dark:bg-slate-800/60 rounded-lg p-0.5 border border-gray-200 dark:border-slate-700/50">
                {["digest", "competitors", "subreddits", "trends"].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === tab ? "bg-emerald-500/20 text-emerald-400" : "text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"}`}>
                    {tab === "digest" ? "Daily Digest" : tab === "competitors" ? "Competitor Intel" : tab === "subreddits" ? `Subreddits (${allSubreddits.length})` : "Trends"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard label="TOTAL LIVE" value={isLoading ? "\u2026" : allNews.length} sub={isLoading ? "loading..." : "100% real data"} icon="📰" />
            <StatCard label="TECH NEWS" value={isLoading ? "\u2026" : newsCount} sub={`Hacker News \u2022 7d`} icon="🟡" />
            <StatCard label="REDDIT LIVE" value={redditCount} sub={`${FETCH_SUBREDDITS.length} subs \u2022 48h`} icon="🔴" />
            <StatCard label="TWITTER LIVE" value={twitterCount} sub={`cloud voices \u2022 48h`} icon={"\u{1D54F}"} />
            <StatCard label="HIGH PRIORITY" value={highCount} sub="blog-worthy" icon="🔥" />
          </div>

          {(newsError || redditError || twitterError) && (
            <ErrorBanner errors={[newsError, redditError, twitterError].filter(Boolean)} onRetry={() => window.location.reload()} />
          )}

          {activeTab === "digest" && (
            <>
              {activePlatform !== "all" && (
                <div className="mb-4 bg-gray-100 dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-slate-400">Filtering by:</span>
                  <span className="text-xs font-medium text-cyan-400">{PLATFORMS.find((p) => p.id === activePlatform)?.label}</span>
                  <button onClick={() => setActivePlatform("all")} className="text-xs text-gray-400 dark:text-slate-600 hover:text-red-400 ml-2">&times; Clear</button>
                </div>
              )}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">
                    {activeCategory === "all" ? "Today's Top Stories" : allCategories.find((c) => c.id === activeCategory)?.label || activeCategory}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-slate-500">({filteredNews.length} items)</span>
                </div>
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <div className="space-y-3">
                    {filteredNews.map((item) => (
                      <NewsCard key={item.id} item={item} expanded={!!expandedCards[item.id]} onToggle={() => toggleExpand(item.id)} />
                    ))}
                    {filteredNews.length === 0 && (
                      <div className="text-center py-12 text-gray-400 dark:text-slate-600">
                        <p className="text-4xl mb-3">🔍</p>
                        <p className="text-sm">No items match your current filters</p>
                        <p className="text-xs mt-1">Try changing category or platform filter</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "competitors" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-red-500 rounded-full" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Competitor Intelligence</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {COMPETITOR_INTEL.map((intel, i) => <CompetitorCard key={i} intel={intel} />)}
              </div>
              <div className="bg-white dark:bg-slate-800/40 border border-gray-200 dark:border-slate-700/50 rounded-xl p-5 mt-4 shadow-sm dark:shadow-none">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-3 flex items-center gap-2"><span>📊</span> Weekly Competitive Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><div className="text-2xl font-bold text-red-400">4</div><div className="text-xs text-gray-500 dark:text-slate-500">Competitor Moves</div></div>
                  <div><div className="text-2xl font-bold text-amber-400">2</div><div className="text-xs text-gray-500 dark:text-slate-500">Funding Rounds</div></div>
                  <div><div className="text-2xl font-bold text-emerald-400">3</div><div className="text-xs text-gray-500 dark:text-slate-500">Blog Opportunities</div></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subreddits" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-orange-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Tracked Subreddits</h3>
                  <span className="text-sm text-gray-500 dark:text-slate-500">({allSubreddits.length} active sources)</span>
                </div>
                <button onClick={() => setShowAddSubreddit(!showAddSubreddit)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${showAddSubreddit ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"}`}>
                  {showAddSubreddit ? "\u2715 Cancel" : "+ Add Subreddit"}
                </button>
              </div>

              {/* Add subreddit form */}
              {showAddSubreddit && (
                <div className="mb-5 bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-xl p-4 shadow-sm dark:shadow-none">
                  <p className="text-sm text-orange-400 font-medium mb-3">Add a Subreddit</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">Subreddit Name *</label>
                      <input type="text" placeholder="e.g. r/cloudarchitecture" value={newSubName} onChange={(e) => setNewSubName(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-orange-500/50" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">URL (optional)</label>
                      <input type="text" placeholder="https://www.reddit.com/r/..." value={newSubUrl} onChange={(e) => setNewSubUrl(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-orange-500/50" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">Category</label>
                      <select value={newSubCategory} onChange={(e) => setNewSubCategory(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-300 focus:outline-none focus:border-orange-500/50">
                        {subredditCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-slate-500 mb-1 block">Members (optional)</label>
                      <input type="text" placeholder="e.g. 12K" value={newSubMembers} onChange={(e) => setNewSubMembers(e.target.value)} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-slate-300 placeholder-gray-400 dark:placeholder-slate-600 focus:outline-none focus:border-orange-500/50" />
                    </div>
                  </div>
                  <button onClick={handleAddSubreddit} className="px-4 py-2 rounded-lg text-sm font-medium bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 transition-all">Add Subreddit</button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-5">
                <button onClick={() => setSubredditFilter("all")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subredditFilter === "all" ? "bg-orange-500/20 text-orange-400" : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"}`}>
                  All ({allSubreddits.length})
                </button>
                {subredditCategories.map((cat) => (
                  <button key={cat} onClick={() => setSubredditFilter(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subredditFilter === cat ? "bg-orange-500/20 text-orange-400" : "bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"}`}>
                    {cat} ({allSubreddits.filter((s) => s.category === cat).length})
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSubreddits.map((sub, i) => <SubredditBadge key={i} sub={sub} onRemove={sub.isCustom ? removeCustomSubreddit : null} />)}
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-200">Trending Topics</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { topic: "GPU Cost Optimization", mentions: 8, trend: "\u2191 340%", desc: "AI infrastructure costs driving massive interest in GPU-specific FinOps tooling" },
                  { topic: "Platform Engineering", mentions: 6, trend: "\u2191 120%", desc: "CNCF maturity model release sparking enterprise platform team discussions" },
                  { topic: "Multi-Cloud FinOps", mentions: 12, trend: "\u2191 85%", desc: "Cross-cloud cost visibility and allocation becoming table-stakes requirement" },
                  { topic: "IaC Wars (Terraform vs OpenTofu)", mentions: 5, trend: "\u2191 200%", desc: "Both tools releasing 2.0 \u2014 community debating migration and feature parity" },
                  { topic: "Serverless Cost Models", mentions: 4, trend: "\u2191 60%", desc: "AWS Savings Plans expansion making serverless economics more predictable" },
                  { topic: "Cloud Security + AI", mentions: 7, trend: "\u2191 150%", desc: "All three hyperscalers releasing AI-powered security tools simultaneously" },
                ].map((t, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 rounded-xl p-4 shadow-sm dark:shadow-none">
                    <div className="flex items-center justify-between mb-2"><span className="text-sm font-semibold text-gray-800 dark:text-slate-200">{t.topic}</span><span className="text-xs text-emerald-400 font-medium">{t.trend}</span></div>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mb-3 leading-relaxed">{t.desc}</p>
                    <div className="text-xs text-gray-400 dark:text-slate-600">{t.mentions} mentions today</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
