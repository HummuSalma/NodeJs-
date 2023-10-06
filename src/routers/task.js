const express = require('express')
const Task = require('../models/task')
const router = new express.Router

router.post('/tasks', async(req, res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//Reading all Tasks
router.get('/tasks',async(req,res)=>{
    try{
        const task = await Task.find({})
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
})

//Reading Task By Id
router.get('/tasks/:id',async(req,res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send({error : "Task not found"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }

})

//Update the task by Id
router.patch("/tasks/:id",async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedFields = ['description','completed']
    const isValidField = updates.every((update)=> allowedFields.includes(update) )
    if(!isValidField){
        return res.status(400).send({error : "Invalid Field"})
    }
    try{
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        if(!task){
            return res.status(404).send({error : "Task Not Found"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//Delete Task By id
router.delete("/tasks/:id",async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(404).send({error : "Task Not Found To Be Deleted"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router