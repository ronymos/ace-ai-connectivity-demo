(function () {
  const D = window.DemoData;
  const N = window.PresenterNotes;

  const ICO = {
    dash: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>',
    apps: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="10" height="10" rx="2"/><path d="M6 8h4M8 6v4"/></svg>',
    ai: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="3"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.2 1.2M10.8 10.8L12 12M12 4l-1.2 1.2M4 12l1.2-1.2"/></svg>',
    risk: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 3l6 10H2L8 3z"/><path d="M8 7v3M8 12h.01"/></svg>',
    comp: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8l3 3 7-7"/></svg>',
    work: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="4" width="12" height="9" rx="1.5"/><path d="M5 4V3h6v1"/></svg>',
    kube: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 2l6 3.5v5L8 14 2 10.5v-5L8 2z"/></svg>',
    devops: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="2.2"/><path d="M8 3v2M8 11v2M3 8h2M11 8h2"/></svg>',
    threat: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M8 2c3 2 5 3 5 7 0 3-2.2 4.8-5 5.8C5.2 13.8 3 12 3 9c0-4 2-5 5-7z"/></svg>',
    gear: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="2"/><path d="M8 2.5v1.5M8 12v1.5M2.5 8H4M12 8h1.5M4 4l1 1M11 11l1 1M12 4l-1 1M5 11l-1 1"/></svg>',
    chev: '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 2l4 4-4 4"/></svg>',
    bell: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7a4 4 0 018 0c0 3 1 3.5 1 3.5H3S4 10 4 7z"/><path d="M6.5 12.5a1.5 1.5 0 003 0"/></svg>',
    panel: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M10 3v10"/></svg>'
  };

  const state = {
    route: "overview",
    appTab: "connectivity",
    findTab: "all",
    postureTab: "mcp",
    cloud: "all",
    kpi: null,
    selectedApp: "finance-operations",
    selectedFinding: "F-104",
    selectedNode: "internet",
    profile: "aws",
    presenter: true,
    toast: "",
    search: ""
  };

  let toastTimer;

  function icon(name) { return `<span class="nav-ico">${ICO[name] || ""}</span>`; }
  function pill(kind, label) { return `<span class="pill ${kind}">${label}</span>`; }
  function appById(id) { return D.applications.find((a) => a.id === id); }
  function kpis() { return D.kpis[state.cloud] || D.kpis.all; }
  function assurance() { return D.assurance[state.cloud] || D.assurance.all; }

  function toast(msg) {
    state.toast = msg;
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function go(route, extra) {
    state.route = route;
    if (extra) Object.assign(state, extra);
    location.hash = route;
    render();
  }

  function conceptual(msg) {
    toast(msg || "Conceptual action — not connected to live ACE / FireFlow");
  }

  function header() {
    return `
      <header class="topbar">
        <button class="logo" data-nav="ai" style="background:none;border:0;color:#fff">
          <span class="logo-mark">${ICO.ai}</span>
          ACE <span class="product-sep">|</span> <span class="product-name">AI Connectivity Security</span>
        </button>
        <div class="top-spacer"></div>
        <button class="top-link" data-act="accounts">All accounts</button>
        <span class="top-divider"></span>
        <button class="top-link" data-act="user">Hi Jason</button>
        <span class="top-divider"></span>
        <button class="top-link" data-act="global">Global</button>
        <button class="icon-btn ${state.presenter ? "on" : ""}" data-act="presenter" title="Presenter panel (P)">${ICO.panel}</button>
        <button class="icon-btn" data-act="bell">${ICO.bell}</button>
      </header>`;
  }

  function sidebar() {
    const item = (key, ico, label, extra) =>
      `<button class="nav-item ${state.route !== "idle" && key === "ai" ? "active" : ""}" data-nav="${key}">${icon(ico)}${label}${extra || ""}</button>`;
    return `
      <aside class="sidebar">
        <button class="nav-item" data-act="dash">${icon("dash")}Dashboard</button>
        <button class="nav-item" data-act="ace-apps">${icon("apps")}Applications</button>
        ${item("ai", "ai", "AI Connectivity", '<span class="nav-badge">NEW</span>')}
        <button class="nav-item" data-act="risks">${icon("risk")}Risks</button>
        <button class="nav-item" data-act="compliance">${icon("comp")}Compliance Standards</button>
        <button class="nav-item" data-act="workloads">${icon("work")}Workloads Security</button>
        <button class="nav-item" data-act="kube">${icon("kube")}Kubernetes Security</button>
        <button class="nav-item" data-act="devops">${icon("devops")}DevOps</button>
        <button class="nav-item" data-act="threat">${icon("threat")}Threat Management</button>
        <div class="nav-label">Assets & Security Issues</div>
        <div class="cloud-links">
          <button data-cloud="aws">AWS</button>
          <button data-cloud="azure">Azure</button>
          <button data-cloud="gcp">GCP</button>
        </div>
        <div class="sidebar-foot">
          <button class="nav-item" data-act="settings">${icon("gear")}Settings</button>
        </div>
      </aside>`;
  }

  function tabs(items, active) {
    return `<div class="tabs">${items.map(([id, label]) =>
      `<button class="tab ${active === id ? "active" : ""}" data-tab="${id}">${label}</button>`
    ).join("")}</div>`;
  }

  function moduleTabs() {
    return tabs([
      ["overview", "Overview"],
      ["applications", "AI Applications"],
      ["findings", "Network Posture"],
      ["posture", "MCP / A2A"],
      ["architecture", "Compliance"],
      ["changes", "Changes"]
    ], state.route === "connectivity" ? "applications" : state.route);
  }

  function pageHead(crumb, title, sub, extraTabs) {
    return `
      <section class="pagehead">
        <div class="crumbs">${crumb}</div>
        <div class="titlerow">
          <div>
            <h1>${title} <span class="concept">CONCEPT</span></h1>
            <div class="subtitle">${sub}</div>
          </div>
          <div class="actions">
            <button class="btn" data-act="export-pdf">Export to PDF</button>
            <button class="btn" data-act="export-csv">Export to CSV</button>
            <button class="btn primary" data-act="simulate">Simulate remediation</button>
          </div>
        </div>
        ${extraTabs || moduleTabs()}
      </section>`;
  }

  function presenter() {
    if (!state.presenter) return "";
    const note = N[state.route] || N.overview;
    return `
      <aside class="presenter">
        <div class="presenter-h">
          <h2>Presenter · ${note.title}</h2>
          <button class="icon-btn" data-act="presenter" style="margin-left:auto;color:#5b677a">${ICO.panel}</button>
        </div>
        <div class="presenter-b">
          <div class="note-block"><h3>Say this</h3><p>${note.say}</p></div>
          <div class="note-block"><h3>Next click</h3><div class="next-box"><p>${note.next}</p></div></div>
          <div class="note-block"><h3>Guardrail</h3><div class="guard-box"><p>${note.guard}</p></div></div>
          <div class="keys">
            <b>Keys</b><br>
            P presenter · 1–7 pages · Esc close<br>
            1 Overview · 2 Apps · 3 Connectivity · 4 Findings<br>
            5 Posture · 6 Architecture · 7 Changes
          </div>
        </div>
      </aside>`;
  }

  function pageOverview() {
    const k = kpis();
    const a = assurance();
    const attn = D.attention.filter((row) => !state.kpi || row.filter === state.kpi || state.kpi === "apps");
    const rows = D.applications.slice(0, 3).map((app) => `
      <tr class="clickable" data-open-app="${app.id}">
        <td class="app-link">${app.name}</td>
        <td>${app.owner}</td>
        <td>${app.criticality}</td>
        <td>${app.components}</td>
        <td class="kind-${app.assuranceKind}">${app.assurance}</td>
        <td>${app.posture}</td>
        <td>${app.coverage}</td>
      </tr>`).join("");
    return `
      ${pageHead("AI Connectivity / Overview", "AI Connectivity Overview", "Network assurance for AI-enabled business applications")}
      <div class="content">
        <section class="kpis">
          <button class="kpi ${state.kpi === "apps" ? "selected" : ""}" data-kpi="apps"><div class="kpi-value">${k.apps}</div><div class="kpi-label">AI-enabled applications</div><div class="kpi-sub">${k.owned} business-owned</div></button>
          <button class="kpi ${state.kpi === "risk" ? "selected" : ""}" data-kpi="risk"><div class="kpi-value">${k.risk}</div><div class="kpi-label">Apps with network risk</div><div class="kpi-sub">${k.criticalApps} business-critical</div></button>
          <button class="kpi ${state.kpi === "exposure" ? "selected" : ""}" data-kpi="exposure"><div class="kpi-value">${k.exposure}</div><div class="kpi-label">MCP / A2A exposure</div><div class="kpi-sub">${k.review} require review</div></button>
          <button class="kpi ${state.kpi === "intent" ? "selected" : ""}" data-kpi="intent"><div class="kpi-value">${k.intent}</div><div class="kpi-label">Intent violations</div><div class="kpi-sub">${k.unapproved} unapproved destinations</div></button>
        </section>
        <section class="grid-2">
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">What requires attention</div><div class="panel-sub">Business application findings prioritized for network operations</div></div></div>
            ${attn.map((r) => `
              <button class="attn-row" data-open-app="${r.id}">
                ${pill(r.severity, r.severity[0].toUpperCase() + r.severity.slice(1))}
                <div class="attn-copy"><b>${r.app}</b><span>${r.detail}</span></div>
                <span class="chev">${ICO.chev}</span>
              </button>`).join("")}
          </article>
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">AI network assurance</div><div class="panel-sub">Approved vs permitted vs observed</div></div></div>
            <div class="assurance-row"><span>Approved boundaries</span><b style="color:var(--blue)">${a.approved}</b></div>
            <div class="assurance-row"><span>Potential exposure</span><b class="kind-critical">${a.potential}</b></div>
            <div class="assurance-row"><span>Unknown policy coverage</span><b style="color:var(--blue)">${a.unknown}</b></div>
            <div class="assurance-row"><span>New access drift</span><b class="kind-critical">${a.drift}</b></div>
          </article>
        </section>
        <article class="panel">
          <div class="panel-h"><div><div class="panel-title">AI-enabled business applications</div><div class="panel-sub">Prioritized application ownership and connectivity</div></div><button class="panel-action" data-tab="applications">View all applications →</button></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Business application</th><th>Owner</th><th>Criticality</th><th>MCP / A2A</th><th>Network posture</th><th>Config posture</th><th>Coverage</th></tr></thead>
            <tbody>${rows}</tbody>
          </table></div>
        </article>
      </div>`;
  }

  function pageApplications() {
    const q = state.search;
    const list = D.applications.filter((app) => {
      if (state.cloud !== "all" && !app.cloud.toLowerCase().includes(state.cloud)) return false;
      if (q && !`${app.name} ${app.owner}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    return `
      ${pageHead("AI Connectivity / AI Applications", "AI Business Applications", "Link AI software and observed connectivity to accountable business services")}
      <div class="content">
        <div class="filters">
          <span class="filter-label">Cloud provider</span>
          <select class="select" id="cloudSelect">
            <option value="all" ${state.cloud === "all" ? "selected" : ""}>All providers</option>
            <option value="aws" ${state.cloud === "aws" ? "selected" : ""}>AWS</option>
            <option value="azure" ${state.cloud === "azure" ? "selected" : ""}>Azure</option>
            <option value="gcp" ${state.cloud === "gcp" ? "selected" : ""}>GCP</option>
          </select>
          <input class="search" id="appSearch" placeholder="Search applications or owners" value="${(q || "").replace(/"/g, "&quot;")}">
          <button class="add-filter" data-act="add-filter">+ Add filter</button>
        </div>
        <article class="panel">
          <div class="panel-h"><div><div class="panel-title">Discovered AI-enabled applications</div><div class="panel-sub">Each row resolves to a business application or candidate, not simply a cloud workload</div></div></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Business application</th><th>Application owner</th><th>Criticality</th><th>AI components</th><th>Network assurance</th><th>MCP posture</th><th>Cloud provider</th></tr></thead>
            <tbody>
              ${list.map((app) => `
                <tr class="clickable" data-open-app="${app.id}">
                  <td class="app-link">${app.name}</td>
                  <td>${app.owner === "Unassigned" ? '<span class="kind-medium">Unassigned</span>' : app.owner}</td>
                  <td>${app.criticality}</td>
                  <td>${app.components}</td>
                  <td class="kind-${app.assuranceKind}">${app.assurance}</td>
                  <td>${app.posture}</td>
                  <td>${app.cloud}</td>
                </tr>`).join("")}
            </tbody>
          </table></div>
          <div class="foot-note">showing ${list.length} of 18 AI-enabled applications · 3 applications have unknown/partial ownership</div>
        </article>
      </div>`;
  }

  function pageConnectivity() {
    const app = appById(state.selectedApp) || appById("finance-operations");
    const ctx = D.appContext["finance-operations"];
    const node = D.nodes[state.selectedNode] || D.nodes.internet;
    const appTabs = tabs([
      ["app-overview", "Overview"],
      ["connectivity", "Connectivity & Boundaries"],
      ["components", "AI Components"],
      ["risks", "Network Risks"],
      ["secposture", "Security Posture"],
      ["history", "Change History"]
    ], "connectivity");
    return `
      ${pageHead(
        `AI Connectivity / AI Applications / ${app.name}`,
        `${app.name} <span style="color:var(--muted);font-weight:500;font-size:18px">| AI Connectivity &amp; Boundaries</span>`,
        `Business application ${ctx.appId} · ${ctx.owner} · ${ctx.env}`,
        appTabs
      )}
      <div class="content">
        <section class="meta-cards">
          <div class="meta"><span>Business service</span><b>${ctx.service}</b></div>
          <div class="meta"><span>Business owner</span><b>${ctx.owner}</b></div>
          <div class="meta"><span>Application boundary</span><b>${ctx.boundary}</b></div>
          <div class="meta"><span>Connectivity confidence</span><b>${ctx.confidence}</b></div>
        </section>
        <div class="topo-wrap">
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">AI component connectivity</div><div class="panel-sub">Solid = structured / potential · dashed = observed network traffic</div></div></div>
            <div class="topo">
              <div class="zones">
                <div class="zone">
                  <h4>Untrusted network</h4>
                  <button class="node risk ${state.selectedNode === "internet" ? "selected" : ""}" data-node="internet"><b>Internet callers</b><span>0.0.0.0/0 · Potential</span></button>
                </div>
                <div class="zone prod">
                  <h4>Finance production</h4>
                  <button class="node ${state.selectedNode === "mcp" ? "selected" : ""}" data-node="mcp"><b>mcp-finance-prod</b><span>TCP 7456 · EC2 · MCP server</span><div style="margin-top:6px">${pill("critical", "Broad ingress rule")}</div></button>
                </div>
                <div class="zone dest">
                  <h4>Authorized destinations</h4>
                  <button class="node ok ${state.selectedNode === "financeApi" ? "selected" : ""}" data-node="financeApi"><b>Internal Finance API</b><span>Approved destination</span></button>
                  <button class="node warn ${state.selectedNode === "externalAi" ? "selected" : ""}" data-node="externalAi"><b>External AI provider</b><span>Approved / review</span></button>
                </div>
              </div>
              <div class="legend-line">
                <span><i class="swatch red"></i>Untrusted → MCP: Potential</span>
                <span><i class="swatch green"></i>MCP → Finance API: Approved</span>
                <span><i class="swatch dash"></i>MCP → External AI: review</span>
              </div>
            </div>
          </article>
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">Policy & evidence inspector</div><div class="panel-sub">Selected: ${node.title}</div></div></div>
            <div class="inspector">
              <div class="insp-row"><span>Business intent</span><b>${node.intent}</b></div>
              <div class="insp-row"><span>Effective SG / policy</span><b class="${state.selectedNode === "internet" || state.selectedNode === "mcp" ? "kind-critical" : ""}">${node.policy}</b></div>
              <div class="insp-row"><span>Observed network traffic</span><b>${node.observed}</b></div>
              <div class="insp-row"><span>TSQ validation</span><b>${node.tsq}</b></div>
              <div class="insp-row"><span>Shared object</span><b>${node.shared}</b></div>
              <div class="insp-row"><span>CIS MCP reference</span><b>${node.cis}</b></div>
              <div class="callout" style="margin-top:12px"><b>What this does not prove.</b> ${node.note}</div>
              <div style="margin-top:12px;display:flex;gap:8px">
                <button class="btn" data-open-finding="F-104">Open F-104</button>
                <button class="btn primary" data-act="simulate">Simulate change</button>
              </div>
            </div>
          </article>
        </div>
        <article class="panel" style="margin-top:12px">
          <div class="panel-h"><div><div class="panel-title">Connectivity assurance matrix</div><div class="panel-sub">Compare application intent, effective network permission, observation and evidence gaps</div></div></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Flow / service</th><th>Approved intent</th><th>Effective permission</th><th>Observed</th><th>Status</th></tr></thead>
            <tbody>${D.matrix.map((m) => `<tr><td class="app-link">${m.flow}</td><td>${m.intent}</td><td>${m.permission}</td><td>${m.observed}</td><td class="kind-${m.kind}">${m.status}</td></tr>`).join("")}</tbody>
          </table></div>
        </article>
      </div>`;
  }

  function pageFindings() {
    const detail = D.findingDetails[state.selectedFinding];
    const finding = D.findings.find((f) => f.id === state.selectedFinding);
    const rows = D.findings.filter((f) => state.findTab === "all" || f.tabs.includes(state.findTab));
    const findTabs = tabs([
      ["all", "All Findings"],
      ["exposure", "Exposure"],
      ["drift", "Connectivity Drift"],
      ["egress", "Unauthorized Egress"],
      ["ownership", "Ownership"]
    ], state.findTab);
    return `
      <section class="pagehead">
        <div class="crumbs">AI Connectivity / Network Findings</div>
        <div class="titlerow">
          <div>
            <h1>AI Network Findings &amp; Intent Drift <span class="concept">CONCEPT</span></h1>
            <div class="subtitle">Prioritize network and application-boundary violations, not isolated AI asset counts</div>
          </div>
          <div class="actions">
            <button class="btn" data-act="export-pdf">Export to PDF</button>
            <button class="btn primary" data-act="simulate">Simulate remediation</button>
          </div>
        </div>
        ${moduleTabs()}
        ${findTabs}
      </section>
      <div class="content">
        <div class="stat-strip">
          <button class="stat ${state.findTab === "all" ? "selected" : ""}" data-findtab="all"><b>6</b><span>High priority</span></button>
          <button class="stat" data-findtab="drift"><b>9</b><span>Intent violations</span></button>
          <button class="stat" data-findtab="ownership"><b>3</b><span>Unowned components</span></button>
          <button class="stat" data-findtab="exposure"><b>4</b><span>Evidence gaps</span></button>
        </div>
        <div class="split-find">
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">Prioritized findings</div><div class="panel-sub">Showing network risk, application ownership and evidence confidence</div></div></div>
            ${rows.map((f) => `
              <button class="find-row ${state.selectedFinding === f.id ? "active" : ""}" data-finding="${f.id}">
                ${pill(f.severity, f.severity[0].toUpperCase() + f.severity.slice(1))}
                <div class="find-copy"><b>${f.title}</b><span>${f.app} · ${f.id} · Evidence: ${f.evidence}</span></div>
                <span class="chev">${ICO.chev}</span>
              </button>`).join("")}
          </article>
          <article class="panel">
            <div class="inv">
              ${pill(finding.severity, finding.severity[0].toUpperCase() + finding.severity.slice(1))}
              <div class="panel-sub" style="margin:8px 0 4px">${finding.id} · ${finding.app}</div>
              <h2>${finding.title}</h2>
              <h3 style="font-size:12px;text-transform:uppercase;color:var(--muted);margin:16px 0 6px">Why it matters</h3>
              <p style="margin:0 0 8px;color:#3d5163">${detail.why}</p>
              <h3 style="font-size:12px;text-transform:uppercase;color:var(--muted);margin:16px 0 8px">Evidence chain</h3>
              <div class="chain">${detail.chain.map((c) => `<div class="chain-item"><div class="num">${c.n}</div><div><b>${c.t}</b><div style="color:var(--muted);font-size:12px">${c.d}</div></div></div>`).join("")}</div>
              <div class="callout"><b>What cannot be concluded</b><br>${detail.cannot}</div>
              <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn" data-open-app="${finding.appId}">Open application</button>
                <button class="btn primary" data-act="simulate">Create change plan</button>
              </div>
            </div>
          </article>
        </div>
      </div>`;
  }

  function pagePosture() {
    const families = state.postureTab === "a2a" ? D.a2aFamilies : D.mcpFamilies;
    const k = D.postureKpis;
    const pTabs = tabs([
      ["mcp", "MCP CIS Benchmark"],
      ["a2a", "A2A Security Baseline"],
      ["coverage", "Assessment Coverage"],
      ["exceptions", "Exceptions"]
    ], state.postureTab);
    return `
      <section class="pagehead">
        <div class="crumbs">AI Connectivity / AI Security Posture</div>
        <div class="titlerow">
          <div>
            <h1>MCP / A2A Security Posture <span class="concept">CONCEPT</span></h1>
            <div class="subtitle">CIS MCP assessment + separately versioned AlgoSec A2A baseline</div>
          </div>
          <div class="actions">
            <button class="btn" data-act="export-pdf">Export to PDF</button>
            <button class="btn" data-tab="findings">View MCP findings</button>
          </div>
        </div>
        ${moduleTabs()}
        ${pTabs}
      </section>
      <div class="content">
        <section class="kpis">
          <div class="kpi"><div class="kpi-value">${k.recs}</div><div class="kpi-label">CIS MCP recommendations</div><div class="kpi-sub">Benchmark v1.0.0</div></div>
          <div class="kpi"><div class="kpi-value">${k.applicable}</div><div class="kpi-label">Applicable in example</div><div class="kpi-sub">Scope-aware assessment</div></div>
          <div class="kpi"><div class="kpi-value">${k.failed}</div><div class="kpi-label">Failed controls</div><div class="kpi-sub">4 transport / network</div></div>
          <div class="kpi"><div class="kpi-value">${k.notAssessed}</div><div class="kpi-label">Not assessed</div><div class="kpi-sub">Evidence unavailable</div></div>
        </section>
        ${state.postureTab === "coverage" || state.postureTab === "exceptions" ? `
        <article class="panel">
          <div class="panel-h"><div><div class="panel-title">${state.postureTab === "exceptions" ? "Exceptions" : "Assessment & evidence coverage"}</div>
          <div class="panel-sub">Coverage remains independent from finding counts. Missing evidence is Not assessed.</div></div></div>
          <div class="panel-b" style="padding:12px 16px 16px">
            <div class="callout info">${state.postureTab === "exceptions"
              ? "No production exceptions are recorded in this concept dataset. Exceptions would require owner, expiry and compensating control."
              : "37 of 42 AI-enabled applications have complete supported evidence. 5 require validation. Cloud configuration 98% · Network policy 94% · Observed flows 78% · App ownership 82%."}</div>
            <p style="color:var(--muted);font-size:12px;margin:12px 0 0">No finding does not mean secure when required evidence is unavailable.</p>
          </div>
        </article>` : `
        <div class="grid-2">
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">${state.postureTab === "a2a" ? "A2A security baseline — control families" : "CIS MCP Server Benchmark — control families"}</div><div class="panel-sub">Counts below are illustrative. Individual check IDs require exact CIS mapping.</div></div></div>
            <div class="table-wrap"><table>
              <thead><tr><th>Control domain</th><th>Assessment</th><th>Primary explanation</th></tr></thead>
              <tbody>${families.map((f) => `<tr><td>${f.name}</td><td class="kind-${f.kind}">${f.status}</td><td>${f.why}</td></tr>`).join("")}</tbody>
            </table></div>
          </article>
          <div>
            <article class="panel" style="margin-bottom:12px">
              <div class="panel-h"><div><div class="panel-title">Selected control: transport &amp; connectivity</div><div class="panel-sub">Finance Operations · MCP listener</div></div>${pill("critical", "FAIL — review")}</div>
              <div class="panel-b" style="padding:12px 16px 16px">
                <div class="insp-row"><span>Evidence</span><b>Configured TCP 7456 listener + broad SG ingress</b></div>
                <div class="insp-row"><span>Boundary impact</span><b>Public access conflicts with approved private design</b></div>
              </div>
            </article>
            <article class="panel">
              <div class="panel-h"><div><div class="panel-title">Important assessment distinction</div></div></div>
              <div class="panel-b" style="padding:4px 16px 16px">
                <div class="callout info">
                  A network control can fail evaluation without proving app-layer authorization.<br><br>
                  • CIS MCP: official published benchmark<br>
                  • A2A: AlgoSec profile, not CIS certification<br>
                  • Unsupported / unverified checks → Not assessed<br>
                  • Network posture scored separately from config posture
                </div>
              </div>
            </article>
          </div>
        </div>`}
      </div>`;
  }

  function pageArchitecture() {
    const rows = D.architecture[state.profile] || D.architecture.aws;
    const names = { aws: "AWS", azure: "Azure", gcp: "GCP" };
    const titles = {
      aws: "Private AgentCore / MCP",
      azure: "Private MCP via hub and spoke",
      gcp: "Private agent / tool access"
    };
    return `
      ${pageHead("AI Connectivity / Reference Architectures", "Cloud AI Reference Architecture Assurance", "Compare deployed AI connectivity with selected AWS, Azure and GCP architecture profiles")}
      <div class="content">
        <section class="profiles">
          ${["aws", "azure", "gcp"].map((p) => `
            <button class="profile ${state.profile === p ? "selected" : ""}" data-profile="${p}">
              <h3>${names[p]}</h3>
              <div style="margin-bottom:10px;color:var(--muted)">${titles[p]}</div>
              <span class="tag ${state.profile === p ? "" : "avail"}">${state.profile === p ? "Selected" : "Available"}</span>
            </button>`).join("")}
        </section>
        <article class="panel">
          <div class="panel-h"><div><div class="panel-title">Finance Operations — ${names[state.profile]} ${titles[state.profile]} Profile</div><div class="panel-sub">Architecture deviation analysis connects required security patterns to effective network policy</div></div></div>
          <div class="table-wrap"><table>
            <thead><tr><th>Architecture requirement</th><th>Expected design</th><th>Deployed configuration</th><th>Evidence type</th><th>Outcome</th></tr></thead>
            <tbody>${rows.map((r) => `<tr><td>${r.req}</td><td>${r.expected}</td><td>${r.deployed}</td><td>${r.evidence}</td><td class="kind-${r.kind}">${r.outcome}</td></tr>`).join("")}</tbody>
          </table></div>
          <div class="foot-note">Architecture profiles are selectable patterns — not universal cloud-policy rules. Network and app-layer evidence remain distinct.</div>
        </article>
      </div>`;
  }

  function pageChanges() {
    return `
      ${pageHead("AI Connectivity / Finance Operations / Change Review", "Connectivity Remediation &amp; Change Review", "Review security intent, policy impact and change approval before modifying access")}
      <div class="content">
        <section class="change-pair">
          <article class="panel rule-card">
            <h3>Current network rule</h3>
            <div class="panel-sub">AWS SG: sg-finance-mcp-prod · Inbound TCP 7456</div>
            <p>Source<br><span class="rule-bad">0.0.0.0/0 (Any network)</span></p>
            <p>Destination<br><b>mcp-finance-prod : 7456</b></p>
          </article>
          <article class="panel rule-card">
            <h3>Proposed restricted rule</h3>
            <div class="panel-sub">Candidate change — subject to impact validation and approval</div>
            <p>Source<br><span class="rule-good">Approved Agent Subnet</span></p>
            <p>Destination<br><b>mcp-finance-prod : 7456</b></p>
          </article>
        </section>
        <div class="grid-2">
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">Business connectivity impact / simulation</div><div class="panel-sub">Illustrative analysis, not an executed TSQ result</div></div></div>
            <div class="table-wrap"><table>
              <thead><tr><th>Application dependency</th><th>Before</th><th>Proposed after</th><th>Evidence state</th></tr></thead>
              <tbody>${D.changeImpact.map((r) => `<tr><td>${r.dep}</td><td>${r.before}</td><td>${r.after}</td><td>${r.evidence}</td></tr>`).join("")}</tbody>
            </table></div>
          </article>
          <article class="panel">
            <div class="panel-h"><div><div class="panel-title">Approval &amp; ITSM routing</div><div class="panel-sub">Proposed Horizon / FireFlow integration</div></div></div>
            <div class="assurance-row"><span>Business application</span><b>Finance Operations</b></div>
            <div class="assurance-row"><span>Application owner</span><b>Finance IT</b></div>
            <div class="assurance-row"><span>Network approver</span><b>Network Security</b></div>
            <div class="assurance-row"><span>Change mechanism</span><b>FireFlow / ITSM</b></div>
            <div class="assurance-row"><span>Required evidence</span><b>Simulation + validation</b></div>
            <div style="padding:12px 16px 16px">
              <button class="btn primary" data-act="open-ticket">Open FireFlow change</button>
            </div>
          </article>
        </div>
        <article class="panel" style="margin-top:12px">
          <div class="panel-h"><div><div class="panel-title">Post-change verification</div><div class="panel-sub">Closure should require a new policy snapshot and validation of both the prohibited and required paths</div></div></div>
          <div class="steps">
            <div class="step"><b>1. Implement approved rule</b><span>Change ticket reference</span></div>
            <div class="step"><b>2. Re-run analysis</b><span>Effective network policy</span></div>
            <div class="step"><b>3. Verify app connectivity</b><span>Required business flow checks</span></div>
            <div class="step"><b>4. Close finding</b><span>Retain before / after evidence</span></div>
          </div>
        </article>
      </div>`;
  }

  const pages = {
    overview: pageOverview,
    applications: pageApplications,
    connectivity: pageConnectivity,
    findings: pageFindings,
    posture: pagePosture,
    architecture: pageArchitecture,
    changes: pageChanges
  };

  function render() {
    const root = document.getElementById("app");
    const page = pages[state.route] || pageOverview;
    root.innerHTML = `
      ${header()}
      <div class="shell ${state.presenter ? "presenter-open" : ""}">
        ${sidebar()}
        <main class="main">${page()}</main>
        ${presenter()}
      </div>
      <div class="toast" id="toast"></div>`;
  }

  function onClick(e) {
    const t = e.target.closest("[data-act],[data-tab],[data-nav],[data-open-app],[data-kpi],[data-cloud],[data-node],[data-finding],[data-open-finding],[data-profile],[data-findtab]");
    if (!t) return;
    if (t.dataset.act === "presenter") { state.presenter = !state.presenter; render(); return; }
    if (t.dataset.act === "simulate") { go("changes"); toast("Change simulation opened — illustrative workflow, not a live TSQ result"); return; }
    if (t.dataset.act === "export-pdf" || t.dataset.act === "export-csv") { conceptual("Export is conceptual in this demo"); return; }
    if (t.dataset.act === "open-ticket") { conceptual("FireFlow / ITSM ticket would open here — planned integration"); return; }
    if (t.dataset.act === "add-filter") { conceptual("Additional ACE account/cloud filters would appear here"); return; }
    if (t.dataset.act && ["dash","ace-apps","risks","compliance","workloads","kube","devops","threat","settings","accounts","user","global","bell"].includes(t.dataset.act)) {
      conceptual("Existing ACE surface — not part of this AI Connectivity module demo");
      return;
    }
    if (t.dataset.nav === "ai") { go("overview"); return; }
    if (t.dataset.tab) {
      const tab = t.dataset.tab;
      if (["overview","applications","findings","posture","architecture","changes"].includes(tab)) { go(tab); return; }
      if (tab === "connectivity") { go("connectivity"); return; }
      if (tab === "app-overview") { go("applications"); return; }
      if (tab === "components") { toast("AI components inventory — conceptual tab"); return; }
      if (tab === "risks") { go("findings"); return; }
      if (tab === "secposture") { go("posture"); return; }
      if (tab === "history") { go("changes"); return; }
      if (["mcp","a2a","coverage","exceptions"].includes(tab)) { state.postureTab = tab; if (tab === "coverage" || tab === "exceptions") toast("Coverage / exceptions are illustrative in this demo"); render(); return; }
      if (["all","exposure","drift","egress","ownership"].includes(tab)) { state.findTab = tab; render(); return; }
    }
    if (t.dataset.findtab) { state.findTab = t.dataset.findtab; render(); return; }
    if (t.dataset.openApp) { state.selectedApp = t.dataset.openApp; go("connectivity"); return; }
    if (t.dataset.kpi) { state.kpi = state.kpi === t.dataset.kpi ? null : t.dataset.kpi; render(); toast("Filtered by " + t.dataset.kpi); return; }
    if (t.dataset.cloud) { state.cloud = t.dataset.cloud; go("applications"); toast("Cloud filter: " + t.dataset.cloud.toUpperCase()); return; }
    if (t.dataset.node) { state.selectedNode = t.dataset.node; render(); return; }
    if (t.dataset.finding) { state.selectedFinding = t.dataset.finding; render(); return; }
    if (t.dataset.openFinding) { state.selectedFinding = t.dataset.openFinding; go("findings"); return; }
    if (t.dataset.profile) { state.profile = t.dataset.profile; render(); toast("Architecture profile: " + t.dataset.profile.toUpperCase()); return; }
  }

  const keyMap = { "1": "overview", "2": "applications", "3": "connectivity", "4": "findings", "5": "posture", "6": "architecture", "7": "changes" };

  document.addEventListener("click", onClick);
  document.addEventListener("change", (e) => {
    if (e.target.id === "cloudSelect") {
      state.cloud = e.target.value;
      render();
      toast("Scope updated: " + e.target.value);
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "appSearch") state.search = e.target.value;
  });
  document.addEventListener("keydown", (e) => {
    if (e.target.id === "appSearch" && e.key === "Enter") { render(); return; }
    if (e.target.matches("input,select,textarea")) return;
    if (e.key === "p" || e.key === "P") { state.presenter = !state.presenter; render(); }
    if (e.key === "Escape") { state.presenter = false; render(); }
    if (keyMap[e.key]) go(keyMap[e.key]);
  });

  window.addEventListener("hashchange", () => {
    const h = location.hash.replace("#", "").replace("/", "");
    if (pages[h] && h !== state.route) { state.route = h; render(); }
  });

  if (location.hash) {
    const h = location.hash.replace("#", "").replace("/", "");
    if (pages[h]) state.route = h;
  }

  document.addEventListener("DOMContentLoaded", render);
})();
