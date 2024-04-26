// Import required modules
var express = require('express');
var app = express();
const storage = require('node-persist');
var bodyParser = require('body-parser');
const cors = require('cors');

// Import uuid
const { v4: uuidv4 } = require('uuid');

// Enable CORS 
app.use(cors());

// Create a JSON parser 
var jsonParser = bodyParser.json();

// Initialize storage
async function initializeStorage() {
    await storage.init();
    // Clear storage
    await storage.clear();
}

(async () => {
    await initializeStorage();
})();

// Endpoint to get details of all tasks
app.get('/allTasks', async (req, res) => {
    try {
        const allTasks = await storage.values();
        res.json(allTasks); // Send the tasks as JSON
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to add a new task
app.post('/task', jsonParser, async (req, res) => {
    const { task_name } = req.body;
    // Log the received task_name
    console.log("Received task_name:", task_name);
    // Generate a unique ID using uuid
    const task_id = uuidv4();


    // Store the details as an object
    const taskDetails = {
        task_id,
        task_name
    };
    await storage.setItem(task_id, taskDetails);
    console.log("Received taskDetails:", taskDetails);
    res.send("Added task succcesfully");
});


// Start the server on port 5000
app.listen(5000, () => {
    console.log("Server has started");
});