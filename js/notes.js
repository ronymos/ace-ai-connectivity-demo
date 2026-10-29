window.PresenterNotes = {
  overview: {
    title: "Overview",
    say: "Lead with application impact, not a CIS score. Four metric cards and the work queue are the entry point. Each finding should already name a business application.",
    next: "Click Finance Operations in What requires attention.",
    guard: "Do not position this as AI-SPM or runtime protection. Differentiator is network governance linked to application context."
  },
  applications: {
    title: "Business applications",
    say: "The application is the top-level object. MCP/A2A are components. Keep unowned and candidate apps visible. Evidence type and coverage stay on the row — an SDK match is not a running server.",
    next: "Open Finance Operations to see connectivity and security boundaries.",
    guard: "Never infer AI association from names alone. Unowned is an accountability gap, not a confirmed attack."
  },
  connectivity: {
    title: "Connectivity & boundaries",
    say: "Five states stay distinct: approved, permitted, observed, potential, prohibited. Solid vs dashed is illustrative. Effective reachability depends on policy, routes, NAT and firewalls.",
    next: "Click Internet callers, then open F-104 from the inspector or go to Network Posture.",
    guard: "Horizon TSQ is linked only for supported path segments. Potential is not detected activity."
  },
  findings: {
    title: "Network findings",
    say: "The investigation panel must say what the evidence cannot prove. Broad SG ingress plus a listener does not prove successful external tool invocation.",
    next: "Keep F-104 selected, then go to MCP / A2A to show complementary posture — not a replacement score.",
    guard: "A permitted path is not necessarily observed. An observed TCP flow is not tool invocation or data transfer."
  },
  posture: {
    title: "MCP / A2A posture",
    say: "CIS MCP Benchmark v1.0.0 has 55 recommendations. Keep passed, failed, not applicable, not assessed and unsupported separate. There is no official CIS A2A benchmark — this is an AlgoSec baseline.",
    next: "Open Compliance to compare the AWS Private MCP reference architecture.",
    guard: "Do not infer compliance from missing data. Do not claim official CIS A2A certification."
  },
  architecture: {
    title: "Cloud architecture",
    say: "Reference patterns are selectable and contextual. Public access can be intentional. Compare expected private endpoints, security groups, firewalls, routing, identity and logging with actual deployment.",
    next: "Click Simulate remediation or open Changes to show governed connectivity change.",
    guard: "Architecture profiles are customer-selectable — not universal cloud-policy rules."
  },
  changes: {
    title: "Change review",
    say: "Use CNS for cloud-native network risks; invoke AFA TSQ for supported network paths, then open FireFlow/ITSM. Keep application and ownership context visible through the change.",
    next: "Walk the four verification steps. Return to Overview if you need to restart the story.",
    guard: "This integration is planned, not a claim of an existing unified workflow. Simulation here is illustrative, not a live TSQ result."
  }
};
