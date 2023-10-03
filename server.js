//Promises, Async/Await, callbacks, and error handling

const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

const classwork = [
  { id: 1, name: 'Cpan 209 - Systems Design' },
  { id: 2, name: 'Cpan 211 - Data Structures & Algorithms' },
  { id: 3, name: 'Cpan 212 - Modern Web Technologies' },
  { id: 4, name: 'Cpan 213 - Cross-Platform Mobile App Dev.' },
  { id: 5, name: 'Cpan 214 - High-Level Prgrmng Languages' },
  { id: 6, name: 'Hist 217 - History of War' },
];

app.get('/', (req, res) => {
  res.send(
    `<button><a href="/api/classwork"> classwork </a></button> <button><a href="/api/classwork/add"> add classwork </a></button> `
  );
});

// Route handler for '/api/classwork'
app.get('/api/classwork', async (req, res) => {
  try {
    // Simulate an asynchronous operation with a Promise
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (classwork) {
            resolve(classwork);
          } else {
            reject(new Error('Classwork data not found'));
          }
        }, 1000);
      });
    };

    const data = await fetchData();
    res.render('classwork.ejs', { classwork: data });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/classwork/add', (req, res) => {
  res.render('classworkForm.ejs');
});

app.get('/api/classwork/add/:id', (req, res) => {
  res.render('updateclasswork.ejs');
});

// Route handler for creating a new classwork
app.post('/api/classwork', (req, res) => {
  console.log(req.body.name);

  const newclasswork = {
    id: classwork.length + 1,
    name: req.body.name,
  };

  classwork.push(newclasswork);
  res.redirect('/api/classwork');
});

// Route handler for updating classwork
app.put('/api/classwork/update/:id', (req, res) => {
  console.log('This function is activated');
  const classworkId = parseInt(req.params.id);
  const updatedName = req.body.name;

  const existingClasswork = classwork.find((w) => w.id === classworkId);

  if (existingClasswork) {
    existingClasswork.name = updatedName;
    res.status(200).send(`classwork with ID ${classworkId} has been changed.`);
  } else {
    res.status(404).send(`classwork with ID ${classworkId} has not been found.`);
  }
});

// Route handler for deleting classwork
app.delete('/api/classwork/delete/:id', (req, res) => {
  const classworkId = parseInt(req.params.id);

  const index = classwork.findIndex((w) => w.id === classworkId);

  if (index !== -1) {
    classwork.splice(index, 1);
    res.redirect('/api/classwork');
  } else {
    res.status(404).send(`classwork with ID ${classworkId} has not been found.`);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
