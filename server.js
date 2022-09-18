const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();

//requests for animals
const { animals } = require('./data/animals');








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

//express to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});