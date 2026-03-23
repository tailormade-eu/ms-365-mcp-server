#!/usr/bin/env node
/**
 * Graph API Gap Check
 * Compares endpoints.json against the local Graph API v1.0 OpenAPI spec.
 *
 * Usage: node scripts/gap-check.cjs [prefix-filter]
 *   node scripts/gap-check.cjs              → all practical gaps
 *   node scripts/gap-check.cjs /me/mail     → only /me/mail* gaps
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SPEC_PATH = path.join(ROOT, 'openapi/openapi.yaml');
const ENDPOINTS_PATH = path.join(ROOT, 'src/endpoints.json');

const normalize = p => p.replace(/\{[^}]+\}/g, '{id}');

const eps = JSON.parse(fs.readFileSync(ENDPOINTS_PATH, 'utf8'));
const ourPaths = new Set(eps.map(e => e.method.toUpperCase() + ' ' + normalize(e.pathPattern)));

// Line-scan spec (too large for yaml parser)
const lines = fs.readFileSync(SPEC_PATH, 'utf8').split('\n');
let currentPath = null;
const specOpsMap = new Map();

for (const line of lines) {
  const pathMatch = line.match(/^  (\/[^:]+):$/);
  if (pathMatch) { currentPath = pathMatch[1]; continue; }
  const methodMatch = line.match(/^    (get|post|patch|delete|put):/);
  if (methodMatch && currentPath) {
    const key = methodMatch[1].toUpperCase() + ' ' + normalize(currentPath);
    if (!specOpsMap.has(key)) specOpsMap.set(key, { method: methodMatch[1].toUpperCase(), path: currentPath });
  }
}

const isNoise = ({ path: p }) =>
  p.includes('/$count') || p.includes('/$ref') || p.includes('/$value') ||
  p.includes('microsoft.graph.') || /\(\)$/.test(p) ||
  p.includes('/admin/') || p.includes('/education/') || p.includes('/copilot/') ||
  p.includes('/roleManagement/') || p.includes('/identityGovernance/') ||
  p.includes('/deviceManagement/') || p.includes('/identity/conditionalAccess') ||
  p.includes('/identity/b2x') || p.includes('/identity/apiConnectors') ||
  p.includes('/identity/authenticationEvent') || p.includes('/identity/riskPrevention') ||
  p.includes('/security/') || p.includes('/auditLogs/') || p.includes('/reports/') ||
  p.includes('/communications/calls') || p.includes('/communications/adhocCalls') ||
  p.includes('/solutions/backupRestore') || p.includes('/dataSecurityAndGovernance') ||
  p.includes('/adhocCalls') || p.includes('/cloudPCs') || p.includes('/managedDevices') ||
  p.includes('/managedApp') || p.includes('/registeredDevices') || p.includes('/ownedDevices') ||
  p.includes('/authentication/') || p.includes('/employeeExperience') ||
  p.includes('/onPremises') || p.includes('/cloudClipboard') ||
  p.includes('getAvailableExtensionProperties') || p.includes('validateProperties') ||
  p.includes('getByIds') || p.includes('exportPersonalData') ||
  p.includes('wipeManagedApp') || p.includes('removeAllDevices') ||
  p.includes('reprocessLicense') || p.includes('retryServiceProvisioning') ||
  p.includes('translateExchangeIds') || p.includes('/scopedRoleMemberOf') ||
  p.includes('/agreementAcceptances') || p.includes('/cloudClipboard') ||
  p.includes('/ownedDevices') || p.includes('/registeredDevices');

const isRelevant = ({ path: p }) =>
  p.startsWith('/me/') || p.startsWith('/users/') || p.startsWith('/groups/') ||
  p.startsWith('/teams/') || p.startsWith('/drives/') || p.startsWith('/sites/') ||
  p.startsWith('/chats/') || p.startsWith('/planner/') || p.startsWith('/places/') ||
  p.startsWith('/subscriptions') || p.startsWith('/solutions/booking') ||
  p.startsWith('/organization/');

const missing = [...specOpsMap.values()].filter(op =>
  !ourPaths.has(op.method + ' ' + normalize(op.path)) && !isNoise(op) && isRelevant(op)
);

const grouped = {};
for (const op of missing) {
  const parts = op.path.split('/');
  const key = '/' + parts[1] + (parts[2] && !parts[2].startsWith('{') ? '/' + parts[2] : '');
  if (!grouped[key]) grouped[key] = [];
  grouped[key].push(op);
}

console.log(`Graph API spec:     ${specOpsMap.size} unique operations`);
console.log(`Our endpoints:      ${eps.length}`);
console.log(`Missing (filtered): ${missing.length}`);
console.log('');

const filterArg = process.argv[2] || '';
const keys = Object.keys(grouped).filter(k => !filterArg || k.includes(filterArg)).sort();

for (const key of keys) {
  const items = grouped[key];
  console.log(`${key} (${items.length})`);
  items.forEach(op => console.log(`  ${op.method.padEnd(7)} ${op.path}`));
}
