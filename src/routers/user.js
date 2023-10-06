const express = require('express')
const User = require('../models/user')
const router = new express.Router
const auth = require('../middleware/auth')

router.post('/users', async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateToken();
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send({error : e.message})
    }
})

//User Login
router.post('/users/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken();
        res.send({user,token})
    }catch(e){
        return res.status(400).send({error :e.message})
    }
})

//User Logout
router.post('/users/logout', auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send({message : "User Logged Out Successfully!!"})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})

//Logout All Tokens
router.post('/users/logoutAll',auth, async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send({message : "User Logged Out Successfully from all tokens!!"})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})

//All Users
router.get('/users', async(req,res)=>{
    try{
        const user = await User.find({})
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

//User Profile
router.get('/users/profile',auth,async(req,res)=>{
    res.send(req.user)
})

//find User by ID
router.get('/users/:id',auth, async(req,res)=>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
           return  res.status(404).send({error : "User Not Found"})
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

//update user by id
router.patch('/users/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedFields = ['name','password','email','age']
    const isValidField = updates.every((update)=>{
        return allowedFields.includes(update)
    })
    if(!isValidField){
        return res.status(400).send({error : "Invalid Field"})
    }
    try{
        const user = await User.findById(req.params.id)
        updates.forEach((update)=>{
            user[update] = req.body[update]
        })
        await user.save()
        if(!user){
            return res.status(404).send({error : " User Not Found To Be Updated"})
        }
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete user who has logged in 
router.delete('/users/deleteMe',auth,async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.user._id)
        if(!user){
            return res.status(404).send({error : "User Not Found to be deleted"})
        }
        res.send(user,{message : "User deleted successfully"})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})

module.exports = router