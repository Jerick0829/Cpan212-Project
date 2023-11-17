const http = require('http');
const fs = require('fs').promises; // Using Promises for file operations

const PORT = 3000;
const versionedEndpoint = '/api/v1/travel-plans';
const filePath = 'travelPlans.json';

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith(versionedEndpoint)) {
        handleGetRequests(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

async function handleGetRequests(req, res) {
    const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const destinationFilter = urlParams.get('destination');
    const dateFilter = urlParams.get('date');
    const page = parseInt(urlParams.get('page')) || 1;
    const limit = parseInt(urlParams.get('limit')) || 10;

    try {
        let data = await fs.readFile(filePath, 'utf8');
        let travelPlans = JSON.parse(data);

        // Filtering travel plans based on query parameters
        if (destinationFilter) {
            travelPlans = travelPlans.filter(plan => plan.destination.toLowerCase() === destinationFilter.toLowerCase());
        }
        if (dateFilter) {
            travelPlans = travelPlans.filter(plan => plan.date === dateFilter);
        }

        // Implementing pagination
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedPlans = travelPlans.slice(startIndex, endIndex);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(paginatedPlans));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    }
}

// Callback example (setTimeout)
setTimeout(() => {
    console.log('Callback executed after 2 seconds');
}, 2000);

// Event Loop demonstration
console.log('Starting');
setTimeout(() => {
    console.log('Callback executed after 1 second');
}, 1000);
console.log('Ending');

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
