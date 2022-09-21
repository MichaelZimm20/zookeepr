const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

//requests for animals
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');



//parse incoming string or array data 
app.use(express.urlencoded({ extended: true }));
//parse incoming JSON DATA
app.use(express.json());
app.use(express.static('public')); //middleware // provided a file path to "public" folder, then instructed the server to make these files static resources. all files can be accessed without having a specific server endpoint.

//Use ApiRoutes
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);


//express to listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});






