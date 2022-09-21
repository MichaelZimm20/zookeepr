// define router: allows us to declare routes in any file as long as using the proper middleware. Can not use "app" because server.js is using it
const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');



//add the route for animals 
//get method requires two arguments 
//first, is string that describes the route the client will have to fetch form
//second, callback function that will execute everytime that route is accessed with a GET request
router.get('/animals', (req, res) =>{
    let results = animals;
    if (req.query){
        results = filterByQuery(req.query, results);
    };
    //sends the string to out client 
    //send - sends short messages 
    // json can send alot of json at once 
    res.json(results);
});


// GET route for animals 
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

router.post('/animals', (req, res) => {
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


module.exports = router;