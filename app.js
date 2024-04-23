import express from "express";
import tasks from "./task.json" with {type: "json"};
import fs from 'fs';
import Validator from "./helpers/validator.js";

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

// create a task
app.post('/tasks', (req, res) => {
    try{
        const taskDetails = req.body;
        console.log(taskDetails);
        let taskDataModified = tasks;
        taskDataModified.tasks.push(taskDetails);
        if(Validator.validateTaskInfo(taskDetails).status){
            fs.writeFile('./task.json', JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
                if(err){
                    return res.status(500).send(`Something went wrong while creating the task ${err}`);
                } else {
                    return res.status(201).send('Successfully created the task');
                }
            });
        }else{
            let message = Validator.validateTaskInfo(taskDetails).message;
            return res.status(400).send(message); 
        }
    }catch(e){
        return res.status(500).send('Error encountered');
    }
});

// edit a task
app.post('/tasks/:id', (req, res) => {
    try{
        const taskId= req.params.id;
        const taskDetails = req.body;
        let taskDataModified = tasks;
        // get the index of the requested task
        let foundIndex = taskDataModified.tasks.findIndex(obj => obj.id === taskId);
        // if index is found update at that index
        if(foundIndex !== -1){
            taskDataModified.tasks[foundIndex] = taskDetails;
            console.log(taskDataModified);
        }else{
            return res.status(500).send('Could find the task with same id');
        }
        // validate and update the local file
        if(Validator.validateTaskInfo(taskDetails).status){
            fs.writeFile('./task.json', JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
                if(err){
                    return res.status(500).send(`Something went wrong while updating the task ${err}`);
                } else {
                    return res.status(201).send('Successfully updated the task');
                }
            });
        }else{
            let message = Validator.validateTaskInfo(taskDetails).message;
            return res.status(400).send(message); 
        }
    }catch(e){
        return res.status(500).send(`Error encountered : ${e}`);
    }
});

// delete a task
app.delete('/tasks/:id', (req, res) => {
    try{
        const taskId= req.params.id;
        console.log(taskId);
        let taskDataModified = tasks;
        // get the index of the requested task by path param
        let foundIndex = taskDataModified.tasks.findIndex(obj => obj.id == taskId);
        console.log(foundIndex);
        // if index is found update at that index
        if(foundIndex !== -1){
            taskDataModified.tasks.splice(foundIndex,1);
        }else{
            return res.status(500).send('Could find the task with same id');
        }
        fs.writeFile('./task.json', JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err){
                return res.status(500).send(`Something went wrong while deleting the task ${err}`);
            } else {
                return res.status(201).send('Successfully deleted the task');
            }
        });
    }catch(e){
        return res.status(500).send(`Error encountered : ${e}`);
    }
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});