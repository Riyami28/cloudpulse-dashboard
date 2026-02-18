import { useState, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
// 50+ TRACKED SUBREDDITS — FinOps, Cloud, DevOps, SRE
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

const SAMPLE_NEWS = [
  {
    id: 1,
    title: "AWS Launches Amazon Aurora Limitless Database for Petabyte-Scale Workloads",
    source: "AWS",
    sourceIcon: "☁️",
    platform: "official",
    summary: "Amazon announces Aurora Limitless, a new distributed database engine capable of handling petabyte-scale transactional workloads with automatic sharding. This eliminates the need for custom sharding logic and promises near-linear horizontal scaling across multiple regions.",
    blogAngle: "Write a deep-dive comparing Aurora Limitless vs. traditional sharding approaches. Include cost analysis for enterprises migrating from self-managed PostgreSQL clusters — strong FinOps tie-in for Zop audience.",
    tags: ["AWS", "Database", "Scalability", "Enterprise"],
    relevance: "High",
    category: "aws",
    time: "2h ago",
    engagement: 842,
    url: "https://aws.amazon.com/blogs/database/"
  },
  {
    id: 2,
    title: "Azure Introduces AI-Powered Cost Anomaly Detection in Cost Management",
    source: "Azure",
    sourceIcon: "🔷",
    platform: "official",
    summary: "Microsoft Azure rolls out an ML-driven cost anomaly detection feature inside Azure Cost Management. It automatically flags unexpected spending spikes across subscriptions, resource groups, and services with root-cause analysis and recommended actions.",
    blogAngle: "Perfect blog opportunity: 'Azure's New Cost Anomaly Detection vs. Third-Party FinOps Tools — What Cloud Teams Need to Know.' Directly relevant to Zop's FinOps positioning.",
    tags: ["Azure", "FinOps", "Cost Optimization", "AI/ML"],
    relevance: "High",
    category: "finops",
    time: "3h ago",
    engagement: 1205,
    url: "https://azure.microsoft.com/en-us/blog/topic/cost-management/"
  },
  {
    id: 3,
    title: "Kubernetes 1.32 Released with Native Sidecar Containers GA",
    source: "CNCF",
    sourceIcon: "⚙️",
    platform: "official",
    summary: "Kubernetes v1.32 ships with native sidecar containers reaching general availability, along with improvements to pod lifecycle management, enhanced memory management for Windows nodes, and a new Job success/failure policy.",
    blogAngle: "Blog: 'Kubernetes 1.32 — What Platform Teams Need to Know.' Focus on sidecar containers impact on service mesh architectures and Istio/Envoy deployments.",
    tags: ["Kubernetes", "DevOps", "CNCF", "Infrastructure"],
    relevance: "High",
    category: "devops",
    time: "4h ago",
    engagement: 2340,
    url: "https://kubernetes.io/blog/"
  },
  {
    id: 4,
    title: "GCP Announces Committed Use Discount Recommendations Engine",
    source: "GCP",
    sourceIcon: "🟢",
    platform: "official",
    summary: "Google Cloud launches an intelligent Committed Use Discount (CUD) recommendations engine that analyzes 90-day usage patterns to suggest optimal commitment levels across Compute, Cloud SQL, and BigQuery reservations.",
    blogAngle: "Blog angle: 'GCP's CUD Recommender vs. AWS Savings Plans Recommender vs. Azure Advisor — Which Cloud Saves You More?' Great comparative FinOps content.",
    tags: ["GCP", "FinOps", "Cost Optimization", "Compute"],
    relevance: "High",
    category: "finops",
    time: "5h ago",
    engagement: 678,
    url: "https://cloud.google.com/blog/products/compute"
  },
  {
    id: 5,
    title: "HashiCorp Terraform 2.0 Preview: Native Drift Detection and Auto-Remediation",
    source: "HashiCorp",
    sourceIcon: "🔧",
    platform: "official",
    summary: "HashiCorp previews Terraform 2.0 featuring native infrastructure drift detection with automatic remediation workflows, improved state management, and a new policy-as-code framework that replaces Sentinel.",
    blogAngle: "Write: 'Terraform 2.0 Changes Everything — Here's What DevOps Teams Should Prepare For.' Cover migration path from 1.x and impact on existing CI/CD pipelines.",
    tags: ["DevOps", "IaC", "Terraform", "Infrastructure"],
    relevance: "High",
    category: "devops",
    time: "5h ago",
    engagement: 3120,
    url: "https://www.hashicorp.com/blog"
  },
  {
    id: 6,
    title: "Datadog Acquires Cloud Cost Intelligence Startup for $280M",
    source: "TechCrunch",
    sourceIcon: "📰",
    platform: "google",
    summary: "Datadog announces the acquisition of a cloud cost intelligence startup, signaling deeper integration of observability and FinOps. The move aims to combine real-time performance data with cost attribution directly inside Datadog dashboards.",
    blogAngle: "Competitor alert: 'Datadog's FinOps Play — What It Means for Standalone Cloud Cost Tools.' Analyze how observability platforms are eating into FinOps tooling market. Direct Zop positioning opportunity.",
    tags: ["Competitors", "FinOps", "M&A", "Observability"],
    relevance: "High",
    category: "competitors",
    time: "1h ago",
    engagement: 4500,
    url: "https://techcrunch.com/category/cloud/"
  },
  {
    id: 7,
    title: "AWS re:Invent 2026 Keynote: Graviton5 Chips Promise 60% Better Price-Performance",
    source: "AWS",
    sourceIcon: "☁️",
    platform: "official",
    summary: "AWS unveils Graviton5 processors with 60% better price-performance over Graviton3, new EC2 instance types optimized for AI inference workloads, and expanded Spot Instance availability across 8 new regions.",
    blogAngle: "Blog: 'Graviton5 vs. Azure Cobalt vs. GCP Axion — The Custom Silicon Wars.' Include TCO comparisons and migration guides for ARM-based workloads.",
    tags: ["AWS", "Compute", "Cost Optimization", "Hardware"],
    relevance: "High",
    category: "aws",
    time: "6h ago",
    engagement: 5600,
    url: "https://aws.amazon.com/blogs/aws/"
  },
  {
    id: 8,
    title: "r/devops: Platform Engineering Maturity Model Released by CNCF TAG",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "The CNCF Platform Engineering TAG publishes a comprehensive maturity model with five stages, from ad-hoc tooling to fully self-service internal developer platforms. Includes assessment rubrics and case studies from companies at each stage.",
    blogAngle: "Blog: 'Where Does Your Platform Team Stand? Using the CNCF Maturity Model to Benchmark.' Practical guide for engineering leaders assessing their platform engineering journey.",
    tags: ["DevOps", "Platform Engineering", "CNCF", "SRE"],
    relevance: "Medium",
    category: "devops",
    time: "7h ago",
    engagement: 1890,
    subreddit: "r/devops",
    url: "https://www.reddit.com/r/devops/"
  },
  {
    id: 9,
    title: "Cloudflare Launches R2 Super Slurper for Zero-Cost Cloud Storage Migration",
    source: "Google News",
    sourceIcon: "🔍",
    platform: "google",
    summary: "Cloudflare introduces R2 Super Slurper, a free tool to migrate data from AWS S3, Azure Blob, or GCP Cloud Storage to Cloudflare R2 with zero egress fees, automatic checkpointing, and delta sync capabilities.",
    blogAngle: "Blog angle: 'The Real Cost of Cloud Storage Egress — And Why Cloudflare R2 Is Disrupting It.' Calculate actual savings for common storage patterns. Strong FinOps content.",
    tags: ["Storage", "FinOps", "Migration", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "4h ago",
    engagement: 2100,
    url: "https://blog.cloudflare.com/"
  },
  {
    id: 10,
    title: "Vantage Cloud Costs Platform Raises $45M Series C, Adds Multi-Cloud K8s Cost Allocation",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "Vantage announces $45M Series C funding and launches multi-cloud Kubernetes cost allocation, letting teams attribute container costs to specific namespaces, labels, and business units across AWS EKS, Azure AKS, and GCP GKE.",
    blogAngle: "Competitor intelligence: 'Vantage's K8s Cost Allocation — How It Compares to Kubecost, CloudZero, and Native Tools.' Position Zop's differentiation clearly.",
    tags: ["Competitors", "FinOps", "Kubernetes", "Funding"],
    relevance: "High",
    category: "competitors",
    time: "2h ago",
    engagement: 890,
    url: "https://x.com/JoinVantage"
  },
  {
    id: 11,
    title: "Google Cloud Introduces Gemini-Powered Security Command Center AI",
    source: "GCP",
    sourceIcon: "🟢",
    platform: "official",
    summary: "GCP launches Gemini-powered threat analysis inside Security Command Center. It provides natural language threat summaries, automated incident response playbooks, and AI-generated remediation scripts for common cloud misconfigurations.",
    blogAngle: "Blog: 'AI Meets Cloud Security — GCP's Gemini Security vs. AWS GuardDuty AI vs. Azure Sentinel Copilot.' Compare the AI security offerings across hyperscalers.",
    tags: ["GCP", "Security", "AI/ML", "Enterprise"],
    relevance: "Medium",
    category: "gcp",
    time: "8h ago",
    engagement: 1450,
    url: "https://cloud.google.com/blog/products/identity-security"
  },
  {
    id: 12,
    title: "r/Terraform: OpenTofu 2.0 Reaches GA with State Encryption",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "OpenTofu 2.0 goes GA with built-in state encryption, a revamped provider registry surpassing 2,000 providers, improved performance for large state files, and a new testing framework for infrastructure modules.",
    blogAngle: "Blog: 'OpenTofu 2.0 vs. Terraform 2.0 — The IaC Fork War Heats Up.' Compare features, ecosystem support, and enterprise adoption trends.",
    tags: ["DevOps", "IaC", "Open Source", "Infrastructure"],
    relevance: "Medium",
    category: "devops",
    time: "9h ago",
    engagement: 2780,
    subreddit: "r/Terraform",
    url: "https://www.reddit.com/r/Terraform/"
  },
  {
    id: 13,
    title: "AWS Announces 30% Price Reduction on NAT Gateway Data Processing",
    source: "AWS",
    sourceIcon: "☁️",
    platform: "official",
    summary: "AWS reduces NAT Gateway data processing charges by 30% across all regions, responding to years of customer feedback about networking costs. The reduction applies automatically to all existing and new NAT Gateways.",
    blogAngle: "Quick blog: 'AWS Finally Cuts NAT Gateway Costs — Calculate Your Savings.' Include a cost calculator and updated networking architecture recommendations to minimize remaining charges.",
    tags: ["AWS", "FinOps", "Networking", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "3h ago",
    engagement: 6200,
    url: "https://aws.amazon.com/blogs/networking-and-content-delivery/"
  },
  {
    id: 14,
    title: "@grafana: FinOps Dashboard Templates with Cross-Cloud Support",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "Grafana Labs releases pre-built FinOps dashboard templates supporting AWS, Azure, and GCP cost data. Templates include unit economics tracking, team-level showback, and anomaly highlighting powered by Grafana's alerting engine.",
    blogAngle: "Blog: 'Building a Multi-Cloud FinOps Dashboard with Grafana — Step-by-Step Guide.' Practical tutorial that positions Zop alongside open-source tooling.",
    tags: ["FinOps", "Observability", "Multi-Cloud", "Open Source"],
    relevance: "Medium",
    category: "finops",
    time: "6h ago",
    engagement: 920,
    url: "https://x.com/grafana"
  },
  {
    id: 15,
    title: "Azure Arc-Enabled Kubernetes Now Supports GitOps with Flux v2 at Scale",
    source: "Azure",
    sourceIcon: "🔷",
    platform: "official",
    summary: "Microsoft announces GA support for Flux v2 GitOps at scale through Azure Arc, enabling centralized management of thousands of Kubernetes clusters with consistent configurations, automated compliance, and integrated Azure Policy enforcement.",
    blogAngle: "Blog: 'GitOps at Enterprise Scale — Azure Arc + Flux vs. ArgoCD + Crossplane.' Compare approaches for managing multi-cluster Kubernetes environments.",
    tags: ["Azure", "Kubernetes", "GitOps", "Enterprise"],
    relevance: "Medium",
    category: "azure",
    time: "10h ago",
    engagement: 760,
    url: "https://azure.microsoft.com/en-us/blog/topic/kubernetes/"
  },
  {
    id: 16,
    title: "FinOps Foundation Releases Cloud Sustainability Metrics Standard v1.0",
    source: "Google News",
    sourceIcon: "🔍",
    platform: "google",
    summary: "The FinOps Foundation publishes its first standardized framework for measuring and reporting cloud carbon emissions. The standard includes metrics for energy consumption per workload, PUE-adjusted carbon estimates, and green region scoring.",
    blogAngle: "Blog: 'Green Cloud Computing — New FinOps Foundation Standards for Measuring Your Carbon Footprint.' Practical guide for implementing sustainability metrics in cloud cost reporting.",
    tags: ["FinOps", "Sustainability", "Standards", "ESG"],
    relevance: "Medium",
    category: "finops",
    time: "11h ago",
    engagement: 540,
    url: "https://www.finops.org/insights/"
  },
  {
    id: 17,
    title: "Spot.io (NetApp) Launches AI Workload Optimizer for GPU Instance Cost Reduction",
    source: "Google News",
    sourceIcon: "🔍",
    platform: "google",
    summary: "Spot.io introduces an AI Workload Optimizer specifically for GPU instances, claiming 40-70% cost savings on AI/ML training jobs by intelligently mixing on-demand, reserved, and spot GPU instances across AWS, Azure, and GCP.",
    blogAngle: "Competitor watch: 'GPU Cost Optimization — How Spot.io, Cast.ai, and Native Tools Compare.' Relevant for AI infrastructure cost management content.",
    tags: ["Competitors", "FinOps", "AI/ML", "GPU"],
    relevance: "High",
    category: "competitors",
    time: "5h ago",
    engagement: 1670,
    url: "https://techcrunch.com/category/cloud/"
  },
  {
    id: 18,
    title: "@neabornal: Neon Serverless Raises $150M, Challenges AWS Aurora",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "Neon, the serverless Postgres platform, closes a $150M Series C. Their auto-scaling, branching-first database challenges Aurora Serverless v2 with per-query billing and instant database branching for development workflows.",
    blogAngle: "Blog: 'Serverless Databases in 2026 — Neon vs. Aurora Serverless vs. PlanetScale.' Compare pricing models, scaling behavior, and developer experience.",
    tags: ["Database", "SaaS", "Funding", "Serverless"],
    relevance: "Medium",
    category: "saas",
    time: "7h ago",
    engagement: 3400,
    url: "https://x.com/neabornal"
  },
  {
    id: 19,
    title: "AWS Extends Savings Plans to Cover Lambda, Fargate, and SageMaker",
    source: "AWS",
    sourceIcon: "☁️",
    platform: "official",
    summary: "AWS expands Compute Savings Plans coverage to include Lambda function invocations, Fargate tasks, and SageMaker real-time inference endpoints. Customers can now apply a single commitment across EC2, Lambda, Fargate, and SageMaker.",
    blogAngle: "Blog: 'AWS Savings Plans Now Cover Serverless — Updated FinOps Strategy Guide for 2026.' Recalculate optimal commitment strategies with the expanded coverage.",
    tags: ["AWS", "FinOps", "Serverless", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "4h ago",
    engagement: 4100,
    url: "https://aws.amazon.com/blogs/aws-cloud-financial-management/"
  },
  {
    id: 20,
    title: "r/kubernetes: Cilium 1.17 Ships with L7 Traffic Cost Visibility",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "Cilium 1.17 introduces L7 traffic cost visibility, showing real-time data transfer costs per service in Kubernetes clusters. Integrates with AWS, Azure, and GCP billing APIs to map networking costs to individual microservices.",
    blogAngle: "Blog: 'Cilium's Network Cost Visibility — Finally See Where Your Cloud Egress Budget Goes.' Tutorial on setting up network cost attribution in Kubernetes.",
    tags: ["Kubernetes", "FinOps", "Networking", "Open Source"],
    relevance: "High",
    category: "devops",
    time: "8h ago",
    engagement: 1230,
    subreddit: "r/kubernetes",
    url: "https://www.reddit.com/r/kubernetes/"
  },
  {
    id: 21,
    title: "CloudZero Launches Real-Time Unit Cost Analytics for SaaS Companies",
    source: "Google News",
    sourceIcon: "🔍",
    platform: "google",
    summary: "CloudZero releases real-time unit cost analytics enabling SaaS companies to track cost-per-customer, cost-per-feature, and cost-per-transaction in real time. Integrates with Stripe and billing systems for margin analysis.",
    blogAngle: "Competitor deep-dive: 'CloudZero's Unit Economics vs. Zop's Approach — What SaaS CFOs Need.' Position Zop's differentiation in unit cost tracking.",
    tags: ["Competitors", "FinOps", "SaaS", "Analytics"],
    relevance: "High",
    category: "competitors",
    time: "6h ago",
    engagement: 780,
    url: "https://www.cloudzero.com/blog/"
  },
  {
    id: 22,
    title: "Microsoft Announces Azure Migrate Assessment for AI Workloads",
    source: "Azure",
    sourceIcon: "🔷",
    platform: "official",
    summary: "Azure introduces a new migration assessment tool specifically designed for AI/ML workloads, estimating GPU requirements, cost projections, and recommending optimal VM series for training and inference based on workload profiling.",
    blogAngle: "Blog: 'Migrating AI Workloads to Azure — New Assessment Tool Review and Cost Comparison.' Help readers estimate their AI infrastructure costs across clouds.",
    tags: ["Azure", "AI/ML", "Migration", "Cost Optimization"],
    relevance: "Medium",
    category: "azure",
    time: "9h ago",
    engagement: 640,
    url: "https://azure.microsoft.com/en-us/blog/topic/migration/"
  },
  {
    id: 23,
    title: "r/FinOps: Enterprise FinOps Adoption Report 2026 — 78% Now Have Dedicated Teams",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "A new industry survey shows 78% of enterprises with $10M+ cloud spend now have dedicated FinOps teams, up from 45% in 2024. The report highlights showback/chargeback maturity, tooling adoption rates, and the rise of AI-powered cost recommendations.",
    blogAngle: "Blog: 'State of FinOps 2026 — Key Takeaways for Cloud Finance Teams.' Benchmark your organization against industry peers and identify maturity gaps.",
    tags: ["FinOps", "Enterprise", "Research", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "3h ago",
    engagement: 2450,
    subreddit: "r/FinOps",
    url: "https://www.reddit.com/r/FinOps/"
  },
  {
    id: 24,
    title: "@awscloud: EC2 Flex Instances — Pay Only for vCPUs You Actually Use",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "AWS launches EC2 Flex Instances, a new pricing model where customers pay only for the vCPU seconds actually consumed during instance runtime. Idle cores are automatically released and billed at a reduced standby rate.",
    blogAngle: "Blog: 'EC2 Flex Instances Explained — Could This Kill Reserved Instances?' Deep-dive into the new pricing model with real-world cost scenarios and comparison tables.",
    tags: ["AWS", "Cost Optimization", "Compute", "FinOps"],
    relevance: "High",
    category: "aws",
    time: "1h ago",
    engagement: 7800,
    url: "https://x.com/awscloud"
  },
  {
    id: 25,
    title: "r/CloudComputing: Multi-Cloud vs Single Cloud Cost Analysis — 2026 Data",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "A detailed community analysis comparing TCO of multi-cloud vs single-cloud strategies using real billing data from 50+ companies. Findings show multi-cloud adds 15-30% overhead but reduces vendor lock-in risk and enables best-of-breed service selection.",
    blogAngle: "Blog: 'The True Cost of Multi-Cloud in 2026 — Data From 50 Companies.' Present the findings with actionable recommendations for different company sizes and cloud maturity levels.",
    tags: ["Multi-Cloud", "FinOps", "Strategy", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "5h ago",
    engagement: 3200,
    subreddit: "r/CloudComputing",
    url: "https://www.reddit.com/r/CloudComputing/"
  },
  {
    id: 26,
    title: "@kelaborners: Kubernetes Cost Per Pod Benchmarks Across All Three Clouds",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "Cloud architect Kelsey Hightower shares detailed benchmarks of per-pod costs across EKS, AKS, and GKE including control plane fees, networking overhead, and storage costs. GKE Autopilot shows 22% lower per-pod cost than EKS managed nodes.",
    blogAngle: "Blog: 'The Real Cost of Running Kubernetes — EKS vs AKS vs GKE Benchmarks 2026.' Add your own testing and include Fargate/Container Apps serverless options.",
    tags: ["Kubernetes", "Cost Optimization", "Multi-Cloud", "Benchmarks"],
    relevance: "High",
    category: "devops",
    time: "4h ago",
    engagement: 5100,
    url: "https://x.com/kelaborners"
  },
  {
    id: 27,
    title: "r/aws: AWS Introduces Free Tier Dashboard with Cost Forecasting",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "AWS launches a dedicated Free Tier Dashboard that shows real-time usage against free tier limits, forecasts when limits will be exceeded, and sends proactive alerts. Community reaction is overwhelmingly positive after years of surprise billing complaints.",
    blogAngle: "Blog: 'AWS Free Tier Dashboard — Everything You Need to Know.' Step-by-step guide for students and startups to avoid unexpected charges with the new tool.",
    tags: ["AWS", "FinOps", "Free Tier", "Billing"],
    relevance: "Medium",
    category: "aws",
    time: "6h ago",
    engagement: 4300,
    subreddit: "r/aws",
    url: "https://www.reddit.com/r/aws/"
  },
  {
    id: 28,
    title: "r/sre: Google Publishes Updated SRE Workbook with Cloud Cost Reliability Tradeoffs",
    source: "Reddit",
    sourceIcon: "🔴",
    platform: "reddit",
    summary: "Google releases an updated SRE Workbook chapter on balancing reliability with cloud costs. New framework helps teams quantify the cost of each additional nine of availability and make data-driven decisions on SLO targets vs infrastructure spend.",
    blogAngle: "Blog: 'How Many Nines Can You Afford? Google's Framework for Cost-Reliability Tradeoffs.' Practical guide for SRE and FinOps teams working together on budget-aware reliability targets.",
    tags: ["SRE", "FinOps", "Reliability", "GCP"],
    relevance: "High",
    category: "devops",
    time: "7h ago",
    engagement: 1850,
    subreddit: "r/sre",
    url: "https://www.reddit.com/r/sre/"
  },
  {
    id: 29,
    title: "Azure Cost Management Now Integrates with ServiceNow ITSM",
    source: "Google News",
    sourceIcon: "🔍",
    platform: "google",
    summary: "Microsoft announces native integration between Azure Cost Management and ServiceNow ITSM, enabling automated ticket creation for cost anomalies, budget breaches, and optimization recommendations directly in ServiceNow workflows.",
    blogAngle: "Blog: 'Azure Cost Management + ServiceNow — Automating FinOps Workflows.' How to set up the integration and build automated cost governance processes for enterprise teams.",
    tags: ["Azure", "FinOps", "Enterprise", "Automation"],
    relevance: "Medium",
    category: "azure",
    time: "8h ago",
    engagement: 560,
    url: "https://azure.microsoft.com/en-us/blog/"
  },
  {
    id: 30,
    title: "@jeffbarr: AWS Cost Explorer Gets Natural Language Queries via Bedrock",
    source: "Twitter/X",
    sourceIcon: "𝕏",
    platform: "twitter",
    summary: "Jeff Barr announces AWS Cost Explorer now supports natural language queries powered by Bedrock. Users can type questions like 'Why did my EC2 spend increase last week?' and get AI-generated explanations with charts and drill-down recommendations.",
    blogAngle: "Blog: 'Talk to Your AWS Bill — Natural Language Cost Analysis Is Here.' Demo walkthrough with real cost scenarios showing the power and limitations of AI-powered cost exploration.",
    tags: ["AWS", "FinOps", "AI/ML", "Cost Optimization"],
    relevance: "High",
    category: "finops",
    time: "2h ago",
    engagement: 8900,
    url: "https://x.com/jeffbarr"
  }
];

const COMPETITOR_INTEL = [
  {
    company: "Vantage",
    type: "Product Launch",
    title: "Multi-Cloud K8s Cost Allocation",
    impact: "Directly competes with Zop's container cost attribution. They now support namespace-level allocation across all three hyperscalers.",
    action: "Evaluate feature parity and publish comparison blog",
    severity: "high",
    url: "https://www.vantage.sh/blog"
  },
  {
    company: "CloudZero",
    type: "Feature Update",
    title: "Real-Time Unit Cost Analytics",
    impact: "Moves into real-time SaaS unit economics — an area where Zop can differentiate with deeper billing integration and actionable recommendations.",
    action: "Highlight Zop's recommendation engine as differentiator",
    severity: "high",
    url: "https://www.cloudzero.com/blog/"
  },
  {
    company: "Spot.io",
    type: "Product Launch",
    title: "AI Workload GPU Optimizer",
    impact: "Entering GPU cost optimization market. Growing demand for AI infra cost management could pull budget from general FinOps tools.",
    action: "Consider AI cost optimization content series",
    severity: "medium",
    url: "https://spot.io/blog/"
  },
  {
    company: "Datadog",
    type: "Acquisition",
    title: "$280M Cloud Cost Intelligence Acquisition",
    impact: "Observability giant entering FinOps directly. Bundled offering could pressure standalone FinOps tools on enterprise deals.",
    action: "Publish thought leadership on best-of-breed vs. bundled FinOps",
    severity: "high",
    url: "https://www.datadoghq.com/blog/"
  }
];

const CATEGORIES = [
  { id: "all", label: "All News", icon: "📋", count: 30 },
  { id: "aws", label: "AWS", icon: "☁️", count: 6 },
  { id: "azure", label: "Azure", icon: "🔷", count: 4 },
  { id: "gcp", label: "GCP", icon: "🟢", count: 2 },
  { id: "finops", label: "FinOps", icon: "💰", count: 9 },
  { id: "devops", label: "DevOps / SRE", icon: "⚙️", count: 6 },
  { id: "competitors", label: "Competitors", icon: "🎯", count: 4 },
  { id: "saas", label: "SaaS", icon: "🚀", count: 1 },
];

const PLATFORMS = [
  { id: "all", label: "All Platforms", icon: "🌐" },
  { id: "official", label: "Official Blogs", icon: "📢" },
  { id: "twitter", label: "Twitter / X", icon: "𝕏" },
  { id: "reddit", label: "Reddit", icon: "🔴" },
  { id: "google", label: "Google News", icon: "🔍" },
];

const RelevanceBadge = ({ level }) => {
  const colors = {
    High: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    Medium: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    Low: "bg-slate-500/20 text-slate-400 border border-slate-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[level]}`}>
      {level}
    </span>
  );
};

const Tag = ({ label }) => {
  const colorMap = {
    AWS: "bg-orange-500/15 text-orange-300",
    Azure: "bg-blue-500/15 text-blue-300",
    GCP: "bg-green-500/15 text-green-300",
    FinOps: "bg-purple-500/15 text-purple-300",
    DevOps: "bg-cyan-500/15 text-cyan-300",
    Kubernetes: "bg-sky-500/15 text-sky-300",
    Security: "bg-red-500/15 text-red-300",
    "Cost Optimization": "bg-yellow-500/15 text-yellow-300",
    "AI/ML": "bg-pink-500/15 text-pink-300",
    Competitors: "bg-rose-500/15 text-rose-300",
    SaaS: "bg-indigo-500/15 text-indigo-300",
    SRE: "bg-teal-500/15 text-teal-300",
    "Multi-Cloud": "bg-violet-500/15 text-violet-300",
  };
  const color = colorMap[label] || "bg-slate-500/15 text-slate-400";
  return (
    <span className={`px-2 py-0.5 rounded text-xs ${color}`}>{label}</span>
  );
};

const NewsCard = ({ item, expanded, onToggle }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:border-slate-600/70 transition-all duration-200 hover:bg-slate-800/80">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{item.sourceIcon}</span>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 font-medium uppercase tracking-wider hover:text-emerald-400 transition-colors underline underline-offset-2 decoration-slate-600 hover:decoration-emerald-400"
          >
            {item.source}
          </a>
          {item.subreddit && (
            <>
              <span className="text-xs text-slate-600">•</span>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-400 hover:text-orange-300">{item.subreddit}</a>
            </>
          )}
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500">{item.time}</span>
          <span className="text-xs text-slate-600">•</span>
          <span className="text-xs text-slate-500">{item.engagement.toLocaleString()} engagements</span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-semibold text-slate-100 leading-snug hover:text-emerald-400 transition-colors cursor-pointer block"
        >
          {item.title}
        </a>
      </div>
      <RelevanceBadge level={item.relevance} />
    </div>
    <p className="text-sm text-slate-400 leading-relaxed mb-3">{item.summary}</p>
    <div
      className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-40 opacity-100 mb-3" : "max-h-0 opacity-0"}`}
    >
      <div className="bg-slate-700/30 rounded-lg p-3 border-l-2 border-emerald-500/50">
        <p className="text-xs font-medium text-emerald-400 mb-1 uppercase tracking-wider">Blog Angle</p>
        <p className="text-sm text-slate-300 leading-relaxed">{item.blogAngle}</p>
      </div>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-1.5">
        {item.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
      <div className="flex items-center gap-3 ml-3">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap flex items-center gap-1"
        >
          Read Source <span className="text-sm">↗</span>
        </a>
        <button
          onClick={onToggle}
          className="text-xs text-slate-500 hover:text-emerald-400 transition-colors whitespace-nowrap"
        >
          {expanded ? "Hide angle ▲" : "Blog angle ▼"}
        </button>
      </div>
    </div>
  </div>
);

const CompetitorCard = ({ intel }) => {
  const severityColor = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-slate-500",
  };
  return (
    <div className={`bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 border-l-4 ${severityColor[intel.severity]}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <a
            href={intel.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-slate-200 hover:text-emerald-400 transition-colors"
          >
            {intel.company}
          </a>
          <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-400">{intel.type}</span>
        </div>
        <span className={`text-xs font-medium uppercase ${intel.severity === "high" ? "text-red-400" : "text-amber-400"}`}>
          {intel.severity} impact
        </span>
      </div>
      <a
        href={intel.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-semibold text-slate-100 mb-2 block hover:text-emerald-400 transition-colors"
      >
        {intel.title}
      </a>
      <p className="text-xs text-slate-400 mb-3 leading-relaxed">{intel.impact}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400">→</span>
          <span className="text-xs text-emerald-400/80">{intel.action}</span>
        </div>
        <a
          href={intel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
        >
          View Source <span className="text-sm">↗</span>
        </a>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, icon }) => (
  <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-slate-100">{value}</div>
    <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
  </div>
);

const SubredditBadge = ({ sub }) => (
  <a
    href={sub.url}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 hover:border-orange-500/40 hover:bg-slate-800/80 transition-all flex items-center gap-2 group"
  >
    <span className="text-orange-400 text-xs">🔴</span>
    <span className="text-xs text-slate-300 group-hover:text-orange-300 transition-colors">{sub.name}</span>
    <span className="text-xs text-slate-600">{sub.members}</span>
  </a>
);

export default function CloudNewsDashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activePlatform, setActivePlatform] = useState("all");
  const [expandedCards, setExpandedCards] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("digest");
  const [relevanceFilter, setRelevanceFilter] = useState("all");
  const [showSubreddits, setShowSubreddits] = useState(false);
  const [subredditFilter, setSubredditFilter] = useState("all");

  const filteredNews = useMemo(() => {
    let items = SAMPLE_NEWS;
    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (activePlatform !== "all") {
      items = items.filter((item) => item.platform === activePlatform);
    }
    if (relevanceFilter !== "all") {
      items = items.filter((item) => item.relevance === relevanceFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeCategory, activePlatform, searchQuery, relevanceFilter]);

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const highCount = SAMPLE_NEWS.filter((n) => n.relevance === "High").length;
  const redditCount = SAMPLE_NEWS.filter((n) => n.platform === "reddit").length;
  const twitterCount = SAMPLE_NEWS.filter((n) => n.platform === "twitter").length;
  const googleCount = SAMPLE_NEWS.filter((n) => n.platform === "google").length;

  const subredditCategories = [...new Set(TRACKED_SUBREDDITS.map(s => s.category))];
  const filteredSubreddits = subredditFilter === "all"
    ? TRACKED_SUBREDDITS
    : TRACKED_SUBREDDITS.filter(s => s.category === subredditFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/80 border-r border-slate-800 flex flex-col fixed h-full overflow-y-auto">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">Z</div>
            <div>
              <h1 className="text-base font-bold text-slate-100">CloudPulse</h1>
              <p className="text-xs text-slate-500">by Riya's Intelligence</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
            <span className="absolute right-3 top-2.5 text-slate-600 text-xs">⌘K</span>
          </div>
        </div>

        <nav className="flex-1 px-3">
          <p className="px-2 text-xs text-slate-600 uppercase tracking-wider mb-2">Categories</p>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                activeCategory === cat.id
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </div>
              <span className={`text-xs ${activeCategory === cat.id ? "text-emerald-500" : "text-slate-600"}`}>{cat.count}</span>
            </button>
          ))}

          <div className="border-t border-slate-800 my-4" />
          <p className="px-2 text-xs text-slate-600 uppercase tracking-wider mb-2">Platform</p>
          {PLATFORMS.map((plat) => (
            <button
              key={plat.id}
              onClick={() => setActivePlatform(plat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                activePlatform === plat.id
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-300"
              }`}
            >
              <span>{plat.icon}</span>
              <span>{plat.label}</span>
            </button>
          ))}

          <div className="border-t border-slate-800 my-4" />
          <p className="px-2 text-xs text-slate-600 uppercase tracking-wider mb-2">Relevance</p>
          {["all", "High", "Medium"].map((level) => (
            <button
              key={level}
              onClick={() => setRelevanceFilter(level)}
              className={`w-full flex items-center px-3 py-2 rounded-lg text-sm mb-0.5 transition-all ${
                relevanceFilter === level
                  ? "bg-slate-700/50 text-slate-200"
                  : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-400"
              }`}
            >
              {level === "all" ? "All Levels" : level}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/40 rounded-lg p-3 text-center">
            <p className="text-xs text-slate-500 mb-1">Last scanned</p>
            <p className="text-sm font-medium text-emerald-400">12 min ago</p>
            <p className="text-xs text-slate-600 mt-1">Tracking {TRACKED_SUBREDDITS.length} subreddits</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-100">Daily Cloud Intelligence</h2>
              <p className="text-sm text-slate-500">Tuesday, February 18, 2026 — {SAMPLE_NEWS.length} items curated • {TRACKED_SUBREDDITS.length} subreddits tracked</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-800/60 rounded-lg p-0.5 border border-slate-700/50">
                {["digest", "competitors", "subreddits", "trends"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab === "digest" ? "Daily Digest" : tab === "competitors" ? "Competitor Intel" : tab === "subreddits" ? `Subreddits (${TRACKED_SUBREDDITS.length})` : "Trends"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatCard label="Total Items" value={SAMPLE_NEWS.length} sub="25+ daily target" icon="📰" />
            <StatCard label="High Relevance" value={highCount} sub="blog-worthy" icon="🔥" />
            <StatCard label="Reddit" value={redditCount} sub={`from ${TRACKED_SUBREDDITS.length} subs`} icon="🔴" />
            <StatCard label="Twitter/X" value={twitterCount} sub="cloud leaders" icon="𝕏" />
            <StatCard label="Google News" value={googleCount} sub="curated articles" icon="🔍" />
          </div>

          {activeTab === "digest" && (
            <>
              {activePlatform !== "all" && (
                <div className="mb-4 bg-slate-800/40 border border-slate-700/50 rounded-lg px-4 py-2 flex items-center gap-2">
                  <span className="text-xs text-slate-400">Filtering by:</span>
                  <span className="text-xs font-medium text-cyan-400">{PLATFORMS.find(p => p.id === activePlatform)?.label}</span>
                  <button onClick={() => setActivePlatform("all")} className="text-xs text-slate-600 hover:text-red-400 ml-2">✕ Clear</button>
                </div>
              )}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-slate-200">
                    {activeCategory === "all" ? "Today's Top Stories" : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h3>
                  <span className="text-sm text-slate-500">({filteredNews.length} items)</span>
                </div>
                <div className="space-y-3">
                  {filteredNews.map((item) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      expanded={!!expandedCards[item.id]}
                      onToggle={() => toggleExpand(item.id)}
                    />
                  ))}
                  {filteredNews.length === 0 && (
                    <div className="text-center py-12 text-slate-600">
                      <p className="text-4xl mb-3">🔍</p>
                      <p className="text-sm">No items match your current filters</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "competitors" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-red-500 rounded-full" />
                <h3 className="text-lg font-semibold text-slate-200">Competitor Intelligence</h3>
                <span className="text-sm text-slate-500">Zopnight & Zopday competitive landscape</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {COMPETITOR_INTEL.map((intel, i) => (
                  <CompetitorCard key={i} intel={intel} />
                ))}
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 mt-4">
                <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                  <span>📊</span> Weekly Competitive Summary
                </h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-400">4</div>
                    <div className="text-xs text-slate-500">Competitor Moves</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-amber-400">2</div>
                    <div className="text-xs text-slate-500">Funding Rounds</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">3</div>
                    <div className="text-xs text-slate-500">Blog Opportunities</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subreddits" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 bg-orange-500 rounded-full" />
                  <h3 className="text-lg font-semibold text-slate-200">Tracked Subreddits</h3>
                  <span className="text-sm text-slate-500">({TRACKED_SUBREDDITS.length} active sources)</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                <button
                  onClick={() => setSubredditFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subredditFilter === "all" ? "bg-orange-500/20 text-orange-400" : "bg-slate-800 text-slate-500 hover:text-slate-300"}`}
                >
                  All ({TRACKED_SUBREDDITS.length})
                </button>
                {subredditCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSubredditFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${subredditFilter === cat ? "bg-orange-500/20 text-orange-400" : "bg-slate-800 text-slate-500 hover:text-slate-300"}`}
                  >
                    {cat} ({TRACKED_SUBREDDITS.filter(s => s.category === cat).length})
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {filteredSubreddits.map((sub, i) => (
                  <SubredditBadge key={i} sub={sub} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                <h3 className="text-lg font-semibold text-slate-200">Trending Topics</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { topic: "GPU Cost Optimization", mentions: 8, trend: "↑ 340%", desc: "AI infrastructure costs driving massive interest in GPU-specific FinOps tooling" },
                  { topic: "Platform Engineering", mentions: 6, trend: "↑ 120%", desc: "CNCF maturity model release sparking enterprise platform team discussions" },
                  { topic: "Multi-Cloud FinOps", mentions: 12, trend: "↑ 85%", desc: "Cross-cloud cost visibility and allocation becoming table-stakes requirement" },
                  { topic: "IaC Wars (Terraform vs OpenTofu)", mentions: 5, trend: "↑ 200%", desc: "Both tools releasing 2.0 — community debating migration and feature parity" },
                  { topic: "Serverless Cost Models", mentions: 4, trend: "↑ 60%", desc: "AWS Savings Plans expansion making serverless economics more predictable" },
                  { topic: "Cloud Security + AI", mentions: 7, trend: "↑ 150%", desc: "All three hyperscalers releasing AI-powered security tools simultaneously" },
                ].map((t, i) => (
                  <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-200">{t.topic}</span>
                      <span className="text-xs text-emerald-400 font-medium">{t.trend}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 leading-relaxed">{t.desc}</p>
                    <div className="text-xs text-slate-600">{t.mentions} mentions today</div>
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