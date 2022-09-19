const express = require('express');
//requests for animals
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;
const app = express();

//parse incoming string or array data 
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON DATA
app.use(express.json());
app.use(express.static('public'));//middleware // provided a file path to "public" folder, then instructed the server to make these files static resources. all files can be accessed without having a specific server endpoint.








function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        // sve personalityTraits  as a dedicated array.
        //if personalityTraits is a string, place it into a new array and save
        if(typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array:
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember, it is initially a copy of the animalsArray,
            // but here we're updating it for each trait in the .forEach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one 
            // of the traits when the .forEach() loop is finished.

            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if(query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if(query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


// function findById() returns a single animal object
function findById(id, animalsArray) {
const result = animalsArray.filter(animal => animal.id === id)[0];
return result;
}


function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push (animal);
    //write to file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );


    //return finished code to post route for response 
    return animal;
}


function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;

}

//add the route for animals 
//get method requires two arguments 
//first, is string that describes the route the client will have to fetch form
//second, callback function that will execute everytime that route is accessed with a GET request
app.get('/api/animals', (req, res) =>{
    let results = animals 
    if (req.query){
        results = filterByQuery(req.query, results);
    };
    //sends the string to out client 
    //send - sends short messages 
    // json can send alot of json at once 
    res.json(results);
});


// GET route for animals 
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

app.post('/api/animals', (req, res) => {
    //set id based on what the next index of the array will be 
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
})

app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//express to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});