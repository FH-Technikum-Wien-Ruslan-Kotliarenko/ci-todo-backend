import http from 'k6/http';
const { sleep, check } = require('k6');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% < 500ms
    checks: ['rate>0.99'] // at least 99% checks must pass
  },
  scenarios: {
    smoke: { executor: 'constant-vus', vus: 3, duration: '30s' }
  }
};

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:8083';

export default function () {
  const r = http.get(`${BASE}/health`);
  check(r, { 'status 200': (res) => res.status === 200 });
  sleep(1);
}
