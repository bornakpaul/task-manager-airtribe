import express from "express";
import tasks from "./task.json" with {type: "json"};

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// get all tasks
app.get('/tasks',(req, res) => {
    return res.status(200).json(tasks);
});

// get task by id
app.get('/tasks/:id',(req, res) => {
    try{
    const taskId= req.params.id;
    let data = tasks.tasks;
    let filteredTask = data.filter(val => val.id == taskId);
    if(filteredTask.length == 0){
        return res.status(404).json('No task found with the id');
    }
    return res.status(200).json(filteredTask);
    }catch(e){
        return res.status(500).json('Something went wrong');
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});