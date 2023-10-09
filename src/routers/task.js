const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router

router.post('/tasks',auth, async(req, res)=>{
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//Reading all Tasks
router.get('/tasks',auth, async(req,res)=>{
    try{
        const match = {}
        const sort ={}
        if(req.query.description){
            match.description = {$regex : new RegExp(req.query.description,'i')}
        }
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        const limit = parseInt(req.query.limit) || 10
        const skip = parseInt(req.query.skip) || 0
        const task = await Task.find({owner : req.user._id,...match}).limit(limit).skip(skip).sort(sort)
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
    
})

//Reading Task By Id
router.get('/tasks/:id',auth, async(req,res)=>{
    const _id = req.params.id

    try{
        const task = await Task.findOne({_id,owner : req.user._id})
        if(!task){
            return res.status(404).send({error : "Task not found"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }

})

//Update the task by Id
router.patch("/tasks/:id",auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedFields = ['description','completed']
    const isValidField = updates.every((update)=> allowedFields.includes(update) )
    if(!isValidField){
        return res.status(400).send({error : "Invalid Field"})
    }
    try{
        const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
        console.log("owner:"+req.user._id)
        console.log("_id:" +req.params._id)
        if(!task){
            return res.status(404).send({error : "Task Not Found"})
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//Delete Task By id
router.delete("/tasks/:id",auth, async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id : req.params.id, owner : req.user._id})
        if(!task){
            return res.status(404).send({error : "Task Not Found To Be Deleted"})
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router