window.DemoData = {
  kpis: {
    all: { apps: 18, owned: 12, risk: 6, criticalApps: 3, exposure: 4, review: 2, intent: 9, unapproved: 5 },
    aws: { apps: 8, owned: 6, risk: 3, criticalApps: 2, exposure: 2, review: 1, intent: 4, unapproved: 3 },
    azure: { apps: 5, owned: 3, risk: 2, criticalApps: 0, exposure: 1, review: 1, intent: 3, unapproved: 1 },
    gcp: { apps: 5, owned: 3, risk: 1, criticalApps: 1, exposure: 1, review: 0, intent: 2, unapproved: 1 }
  },
  assurance: {
    all: { approved: "14 / 18 apps", potential: "4 components", unknown: "3 paths", drift: "9 findings" },
    aws: { approved: "5 / 8 apps", potential: "2 components", unknown: "1 path", drift: "4 findings" },
    azure: { approved: "4 / 5 apps", potential: "1 component", unknown: "1 path", drift: "3 findings" },
    gcp: { approved: "5 / 5 apps", potential: "1 component", unknown: "1 path", drift: "2 findings" }
  },
  attention: [
    { id: "finance-operations", severity: "critical", app: "Finance Operations", detail: "MCP listener may be publicly reachable", filter: "risk" },
    { id: "supermart-checkout", severity: "high", app: "SuperMart Checkout", detail: "Observed traffic to unapproved AI provider", filter: "intent" },
    { id: "customer-support-ai", severity: "high", app: "Customer Support AI", detail: "New direct path to protected data service", filter: "risk" },
    { id: "order-concierge", severity: "medium", app: "Order Concierge", detail: "A2A component lacks business owner", filter: "apps" }
  ],
  applications: [
    { id: "finance-operations", name: "Finance Operations", owner: "Finance IT", criticality: "Critical", components: "3 MCP", assurance: "CRITICAL · public ingress", assuranceKind: "critical", posture: "8 fail / 12 N/A", coverage: "Partial", cloud: "AWS + hybrid", bu: "Finance" },
    { id: "supermart-checkout", name: "SuperMart Checkout", owner: "Commerce Platform", criticality: "Critical", components: "2 MCP, 1 A2A", assurance: "HIGH · unauthorized egress", assuranceKind: "high", posture: "5 fail / 4 N/A", coverage: "Partial", cloud: "AWS", bu: "Commerce" },
    { id: "customer-support-ai", name: "Customer Support AI", owner: "CX Operations", criticality: "High", components: "2 MCP", assurance: "PASS · within intent", assuranceKind: "ok", posture: "2 fail / 6 N/A", coverage: "Full", cloud: "GCP", bu: "CX" },
    { id: "order-concierge", name: "Order Concierge", owner: "Unassigned", criticality: "Medium", components: "2 A2A", assurance: "UNKNOWN · no intent", assuranceKind: "medium", posture: "Assessment partial", coverage: "Partial", cloud: "Azure", bu: "CX" },
    { id: "inventory-insights", name: "Inventory Insights", owner: "Supply Chain IT", criticality: "High", components: "1 MCP", assurance: "REVIEW · broad egress", assuranceKind: "high", posture: "3 fail", coverage: "Partial", cloud: "AWS", bu: "Supply" },
    { id: "staff-copilot", name: "Staff Copilot", owner: "People Systems", criticality: "Medium", components: "2 MCP", assurance: "PASS · controlled", assuranceKind: "ok", posture: "1 fail", coverage: "Full", cloud: "Azure", bu: "HR" },
    { id: "ai-analytics-sandbox", name: "AI Analytics Sandbox", owner: "Unassigned", criticality: "Low", components: "1 MCP", assurance: "REVIEW · no owner", assuranceKind: "medium", posture: "Not assessed", coverage: "None", cloud: "GCP", bu: "Analytics" },
    { id: "customer360", name: "Customer360", owner: "Customer Experience", criticality: "High", components: "1 MCP, 2 A2A", assurance: "REVIEW · cross-account", assuranceKind: "high", posture: "6 fail", coverage: "Partial", cloud: "AWS", bu: "CX" }
  ],
  appContext: {
    "finance-operations": {
      service: "Payment reconciliation",
      owner: "Finance IT",
      boundary: "Finance production",
      confidence: "Mixed evidence",
      env: "Production · AWS / Hybrid",
      appId: "APP-1042",
      criticality: "Business critical"
    }
  },
  nodes: {
    internet: {
      title: "Internet callers",
      subtitle: "0.0.0.0/0 · Potential",
      intent: "Internal callers only",
      policy: "0.0.0.0/0 — TCP 7456",
      observed: "Not observed",
      tsq: "Scope review required",
      shared: "2 additional workloads",
      cis: "Transport / connectivity",
      note: "Broad security-group ingress plus a listener does not prove a successful external tool invocation."
    },
    mcp: {
      title: "mcp-finance-prod",
      subtitle: "TCP 7456 · EC2 · MCP server",
      intent: "Approved agent subnet only",
      policy: "Inbound TCP 7456 from any",
      observed: "No matching flow in window",
      tsq: "Cloud path only — AFA TSQ not linked",
      shared: "sg-finance-mcp-prod shared by 2 workloads",
      cis: "Network boundaries · FAIL",
      note: "Effective reachability depends on security group, route and NAT. Potential is not observed traffic."
    },
    financeApi: {
      title: "Internal Finance API",
      subtitle: "Approved destination",
      intent: "Required business flow",
      policy: "Permitted east-west",
      observed: "Approved pattern",
      tsq: "Not requested",
      shared: "Same production VPC",
      cis: "Not a posture failure",
      note: "Preserve this path when narrowing public ingress."
    },
    externalAi: {
      title: "External AI provider",
      subtitle: "Approved / review",
      intent: "Allowlisted provider only",
      policy: "Broad outbound still permitted",
      observed: "DNS to provider seen on sibling app",
      tsq: "Needs validation",
      shared: "Shared egress path",
      cis: "Public exposure · review",
      note: "Do not treat sibling SuperMart Checkout telemetry as proof this app called the provider."
    }
  },
  matrix: [
    { flow: "Internet → MCP :7456", intent: "Prohibited", permission: "Broad SG inbound", observed: "No evidence", status: "CRITICAL · investigate", kind: "critical" },
    { flow: "Approved agent → MCP", intent: "Required", permission: "Permitted", observed: "Not in window", status: "Preserve", kind: "ok" },
    { flow: "MCP → Finance API", intent: "Approved", permission: "Permitted", observed: "Not in window", status: "Preserve", kind: "ok" },
    { flow: "MCP → External AI provider", intent: "Allowlist only", permission: "Broad egress", observed: "Unverified", status: "REVIEW", kind: "medium" }
  ],
  findings: [
    { id: "F-104", severity: "critical", title: "MCP endpoint potentially reachable from the internet", app: "Finance Operations", appId: "finance-operations", evidence: "Rule + listener", tabs: ["all", "exposure"] },
    { id: "F-112", severity: "high", title: "Observed AI traffic to unapproved provider", app: "SuperMart Checkout", appId: "supermart-checkout", evidence: "Flow + DNS", tabs: ["all", "egress"] },
    { id: "F-121", severity: "high", title: "New direct connection bypasses approved MCP gateway", app: "Finance Operations", appId: "finance-operations", evidence: "Intent + policy", tabs: ["all", "drift"] },
    { id: "F-125", severity: "high", title: "Broad east-west access to protected data service", app: "Customer Support AI", appId: "customer-support-ai", evidence: "Cloud policy", tabs: ["all", "exposure"] },
    { id: "F-133", severity: "medium", title: "A2A component has no accountable owner", app: "Order Concierge", appId: "order-concierge", evidence: "Inventory + CMDB", tabs: ["all", "ownership"] },
    { id: "F-140", severity: "medium", title: "MCP network posture not assessed on VM", app: "Inventory Insights", appId: "inventory-insights", evidence: "Coverage gap", tabs: ["all", "all"] }
  ],
  findingDetails: {
    "F-104": {
      why: "A Finance production service has a configured listener and broad ingress security-group permission.",
      chain: [
        { n: "1", t: "Static software", d: "MCP listener: TCP 7456" },
        { n: "2", t: "Network policy", d: "Broad ingress source range 0.0.0.0/0" },
        { n: "3", t: "Flow logs", d: "No invocation verified" }
      ],
      cannot: "Tool invocation or authentication bypass. Broad SG ingress plus a listener does not prove successful external tool invocation."
    },
    "F-112": {
      why: "Observed DNS and flow telemetry from SuperMart Checkout to a destination that is not on the approved AI-provider allowlist.",
      chain: [
        { n: "1", t: "Observed flow", d: "Egress to unapproved provider" },
        { n: "2", t: "DNS", d: "Resolver logs match provider hostname" },
        { n: "3", t: "App intent", d: "Allowlist does not include this destination" }
      ],
      cannot: "Prompt content, tool name, or sensitive data transfer. An observed TCP flow is not proof of tool invocation."
    },
    "F-121": {
      why: "Effective policy allows a path that bypasses the approved MCP gateway used as the application trust boundary.",
      chain: [
        { n: "1", t: "Intent", d: "Gateway is the required inspection point" },
        { n: "2", t: "Cloud policy", d: "Alternate SG/route still permits reachability" },
        { n: "3", t: "TSQ", d: "Not run — concept only for supported segments" }
      ],
      cannot: "That production traffic already used the bypass. Potential is inferred from configuration."
    },
    "F-125": {
      why: "Customer Support AI workloads can reach a protected data service beyond the approved east-west boundary.",
      chain: [
        { n: "1", t: "Cloud policy", d: "Broad east-west rule" },
        { n: "2", t: "App boundary", d: "Data service is out of approved scope" },
        { n: "3", t: "Observed", d: "Not confirmed in this window" }
      ],
      cannot: "That the AI agent read customer records. Policy permission is not observation."
    },
    "F-133": {
      why: "Discovered A2A agent card is not mapped to a business owner in AppViz / CMDB.",
      chain: [
        { n: "1", t: "Inventory", d: "A2A component discovered" },
        { n: "2", t: "CMDB", d: "No owner relationship" },
        { n: "3", t: "Network", d: "Not a connectivity violation by itself" }
      ],
      cannot: "That the agent is malicious. Unowned is an accountability gap, not a confirmed attack."
    },
    "F-140": {
      why: "Required network-posture evidence is unavailable on this VM image. Status is Not assessed.",
      chain: [
        { n: "1", t: "Coverage", d: "Supported check not collected" },
        { n: "2", t: "Last scan", d: "Stale / incomplete" },
        { n: "3", t: "Finding count", d: "Zero findings must not be read as secure" }
      ],
      cannot: "That the MCP server is compliant. Missing evidence is never treated as pass."
    }
  },
  postureKpis: { recs: 55, applicable: 27, failed: 8, notAssessed: 12 },
  mcpFamilies: [
    { name: "Transport and connectivity", status: "FAIL 3", kind: "critical", why: "Public ingress + weak transport evidence" },
    { name: "Authentication and authorization", status: "UNKNOWN 5", kind: "medium", why: "Server authentication evidence incomplete" },
    { name: "Server configuration", status: "FAIL 2", kind: "critical", why: "Listener configuration review" },
    { name: "Data protection and privacy", status: "REVIEW 1", kind: "medium", why: "Encryption controls partially assessed" },
    { name: "Observability and audit", status: "UNKNOWN 3", kind: "medium", why: "Application audit evidence unavailable" },
    { name: "Supply chain security", status: "PASS 8", kind: "ok", why: "SBOM / vulnerability scan coverage" },
    { name: "Isolation and execution safety", status: "REVIEW 2", kind: "medium", why: "Container privilege and isolation" },
    { name: "Resource limits and caching", status: "UNKNOWN 1", kind: "medium", why: "Runtime configuration unavailable" }
  ],
  a2aFamilies: [
    { name: "Agent authentication", status: "FAIL 2", kind: "critical", why: "Identity evidence incomplete on 2 agents" },
    { name: "Trust relationship validation", status: "REVIEW 3", kind: "medium", why: "External trust cards not attested" },
    { name: "External agent controls", status: "FAIL 1", kind: "critical", why: "Unauthenticated agent card exposure" },
    { name: "Network boundaries", status: "REVIEW 2", kind: "medium", why: "A2A paths inherit cloud SG scope" },
    { name: "Transport security", status: "PASS 4", kind: "ok", why: "TLS present where assessed" },
    { name: "Ownership and inventory", status: "UNKNOWN 3", kind: "medium", why: "Unowned agents remain in catalogue" }
  ],
  architecture: {
    aws: [
      { req: "Inbound MCP endpoint", expected: "Private approved callers", deployed: "0.0.0.0/0 permitted; TCP 7456", evidence: "SG + listener", outcome: "FAIL — validate route", kind: "critical" },
      { req: "Outbound AI endpoints", expected: "Approved provider allowlist", deployed: "Broad outbound permission", evidence: "Policy + DNS", outcome: "REVIEW", kind: "medium" },
      { req: "Inspection route", expected: "Required security gateway", deployed: "Alternate path may exist", evidence: "Route + TSQ", outcome: "REVIEW", kind: "medium" },
      { req: "Authentication", expected: "Approved identity mechanism", deployed: "Not collected", evidence: "Config coverage", outcome: "UNKNOWN", kind: "medium" },
      { req: "Network logging", expected: "Network & app audit enabled", deployed: "Flow logs on; app audit unknown", evidence: "Scan state", outcome: "PARTIAL", kind: "medium" },
      { req: "Protected data services", expected: "Restricted internal access", deployed: "Cross-segment rule found", evidence: "Policy object", outcome: "REVIEW", kind: "medium" }
    ],
    azure: [
      { req: "Private MCP via hub", expected: "Hub-spoke private endpoint", deployed: "Public IP still associated", evidence: "NSG + endpoint", outcome: "REVIEW", kind: "medium" },
      { req: "Spoke isolation", expected: "No direct internet ingress", deployed: "NSG allows 0.0.0.0/0 on 7456 analog", evidence: "NSG", outcome: "FAIL — validate route", kind: "critical" },
      { req: "Inspection", expected: "Azure Firewall / gateway", deployed: "UDR incomplete", evidence: "Route", outcome: "UNKNOWN", kind: "medium" }
    ],
    gcp: [
      { req: "Private agent access", expected: "Private Google Access / PSC", deployed: "External IP on listener", evidence: "VPC + FW", outcome: "FAIL — validate route", kind: "critical" },
      { req: "Tool egress", expected: "Restricted egress to APIs", deployed: "Default-allow egress", evidence: "Firewall", outcome: "REVIEW", kind: "medium" },
      { req: "Logging", expected: "VPC flow + Cloud Audit", deployed: "Flow logs partial", evidence: "Scan state", outcome: "PARTIAL", kind: "medium" }
    ]
  },
  changeImpact: [
    { dep: "Approved agent → MCP", before: "Permitted", after: "Permitted", evidence: "Cloud policy" },
    { dep: "Public Internet → MCP", before: "Potentially permitted", after: "Expected restricted", evidence: "Needs reachability test" },
    { dep: "Finance API → MCP", before: "Permitted", after: "Unchanged", evidence: "Needs validation" },
    { dep: "Other 2 workloads on shared SG", before: "Shared security group", after: "Possible effect", evidence: "Impact review" }
  ]
};
