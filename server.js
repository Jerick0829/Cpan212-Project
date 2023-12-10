const http = require('http');
const { MongoClient } = require('mongodb');

const PORT = 3000;
const versionedEndpoint = '/api/v1/travel-plans';
const connectionString = 'mongodb://localhost:27017/';
const dbName = 'travelplanner';
const collectionName = 'planner';

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith(versionedEndpoint)) {
    handleGetRequests(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

let db;
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');
    db = client.db(dbName);
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

async function handleGetRequests(req, res) {
  const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const destinationFilter = urlParams.get('destination');
  const dateFilter = urlParams.get('date');
  const page = parseInt(urlParams.get('page')) || 1;
  const limit = parseInt(urlParams.get('limit')) || 10;

  try {
    const collection = db.collection(collectionName);

    const query = {};
    if (destinationFilter) {
      query.destination = new RegExp(destinationFilter, 'i');
    }
    if (dateFilter) {
      query.date = dateFilter;
    }

    const totalCount = await collection.countDocuments(query);
    const paginatedPlans = await collection
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ totalCount, paginatedPlans }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
