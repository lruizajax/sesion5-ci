import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export const options = {
    stages: [
        { duration: '20s', target: 5 },
        { duration: '40s', target: 50 },
        { duration: '1m', target: 50 },
        { duration: '20s', target: 0 },
    ],

    thresholds: {
        'http_req_failed': ['rate<0.01'],
        'http_req_duration': ['p(95)<500'],
        'checks': ['rate>0.99'],
    },
};

export default function () {

    let res = http.get('https://statuscheckup.com');

    check(res, {
        'status es 200': (r) => r.status === 200,
        'tiempo < 800ms': (r) => r.timings.duration < 800,
    });

    sleep(1);
}

export function handleSummary(data) {
    return {
        'reports/report.html': htmlReport(data),
    };
}