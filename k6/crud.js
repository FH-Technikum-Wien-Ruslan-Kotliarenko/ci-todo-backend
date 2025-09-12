import http from 'k6/http';
const { sleep, check } = require('k6');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<700'],
    checks: ['rate>0.98']
  },
  scenarios: {
    light: { executor: 'constant-vus', vus: 2, duration: '30s' }
  }
};

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:8083';
const KEY = __ENV.API_KEY || ''; // If not set, we skip write ops

export default function () {
  // Health is always required
  let res = http.get(`${BASE}/health`);
  check(res, { 'health 200': (r) => r.status === 200 });

  // Public list okay even without key
  res = http.get(`${BASE}/items?sort=newest&page=1&pageSize=5&q=wallet`);
  check(res, { 'list 200': (r) => r.status === 200 });

  if (!KEY) {
    sleep(1);
    return;
  } // skip writes if no key

  // Create
  res = http.post(
    `${BASE}/items`,
    JSON.stringify({ name: 'k6 wallet', description: 'near gate' }),
    { headers: { 'Content-Type': 'application/json', 'x-api-key': KEY } }
  );
  check(res, { 'create 201': (r) => r.status === 201 });

  const id = (res.json() || {}).id;

  // Update
  if (id) {
    res = http.put(`${BASE}/items/${id}`, JSON.stringify({ description: 'moved to desk' }), {
      headers: { 'Content-Type': 'application/json', 'x-api-key': KEY }
    });
    check(res, { 'update 200': (r) => r.status === 200 });

    // Delete
    res = http.del(`${BASE}/items/${id}`, null, { headers: { 'x-api-key': KEY } });
    check(res, { 'delete 204': (r) => r.status === 204 });
  }

  sleep(1);
}
