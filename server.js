const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override')

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))

app.use((req,res,next) =>{
console.log(`${req.method} request for ${req.url}`);
next()
})


const classwork = [
    { id: 1, name: 'Cpan 209 - Systems Design' },
    { id: 2, name: 'Cpan 211 - Data Structures & Algorithms' },
    { id: 3, name: 'Cpan 212 - Modern Web Technologies' },
    { id: 4, name: 'Cpan 213 - Cross-Platform Mobile App Dev.' },
    { id: 5, name: 'Cpan 214 - High-Level Prgrmng Languages' },
    { id: 6, name: 'Hist 217 - History of War' },
   
]

app.get('/', (req, res) =>{
    res.send(`<button ><a href="/api/classwork""> classwork </a> </button> <button ><a href="/api/classwork/add""> add classwork </a> </button> `)
})

app.get('/api/classwork', (req,res) =>{
    res.render("classwork.ejs", {classwork})
})

app.get('/api/classwork/add', (req,res) =>{
    res.render('classworkForm.ejs');
})

app.get('/api/classwork/add/:id', (req,res) =>{
    res.render('updateclasswork.ejs');
})

app.post('/api/classwork', (req, res)=>{

    console.log(req.body.name);

    const newclasswork ={
    id:classwork.length + 1,
    name: req.body.name
    };

    classwork.push(newclasswork);
    res.redirect('/api/classwork');

})

app.put('/api/classwork/update/:id', (req, res) => {
    console.log("This fuction is activated");
    const classworkId = parseInt(req.params.id);
    const updatedName = req.body.name;

    const classwork = classwork.find(w => w.id === classworkId);

    if (classwork) {
      classwork.name = updatedName;
      res.status(200).send(`classwork with ID ${classworkId} has been changed.`);
    } else {
      res.status(404).send(`classwork with ID ${classworkId} has been not found.`);
    }
  });

app.delete('/api/classwork/delete/:id', (req, res) => {
    const classworkId = parseInt(req.params.id);

    const index = classwork.findIndex(w => w.id === classworkId);

    if (index !== -1) {
      classwork.splice(index, 1);
      res.redirect('/api/classwork')
    } else {
      res.status(404).send(`classwork with ID ${classworkId} has been not found.`);
    }
  });

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}/`);
})

