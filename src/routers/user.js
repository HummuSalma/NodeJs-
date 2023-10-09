const express = require('express')
const User = require('../models/user')
const router = new express.Router
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendEmail, sendCancellationEmail}= require('../email/account')

router.post('/users', async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendEmail(user.email,user.name)
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

//update user who has logged in
router.patch('/users/updateMe',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedFields = ['name','password','email','age']
    const isValidField = updates.every((update)=>{
        return allowedFields.includes(update)
    })
    if(!isValidField){
        return res.status(400).send({error : "Invalid Field"})
    }
    try{
        updates.forEach((update)=> req.user[update] = req.body[update])
        await req.user.save()
        res.send({data :req.user, message : 'User updated Successfully'})
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete user who has logged in 
router.delete('/users/deleteMe',auth,async(req,res)=>{
    try{
        await User.deleteOne({_id : req.user._id})
        sendCancellationEmail(req.user.email, req.user.name)
        res.send({data :req.user, message : 'User Deleted Successfully!'})
    }catch(e){
        res.status(500).send({error : e.message})
    }
})

//Upload User Image
const upload = multer({
    limits :{
        fileSize : 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload a image with jpg, jpeg and png format"))
        }
        cb(undefined,true)
    }
})

//Uploading the image
router.post('/users/upload/avatar',auth, upload.single('avatar') ,async(req,res)=>{ 
    // console.log(req.file.buffer)
    const buffer = await sharp(req.file.buffer).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({message : 'Image uploaded successfully!!'})
},(error,req,res,next)=>{
    res.status(500).send({error : error.message})
})

//Deleting the image
router.delete('/users/image/delete',auth,async(req,res)=>{
    try{
        req.user.avatar=undefined
        await req.user.save()
        res.send({data :req.user, message : 'User Image Deleted Successfully!'})
    }catch(e){
        res.status(500).send({error : e.message})
    }
   
})

//Getting the image for a specific user
router.get('/users/:id/avatar',async(req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        if(!user){
            throw new Error('User Not Found')
        }
        if(!user.avatar){
            throw new Error('User Avatar not found')
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(500).send({error : e.message})
    }
})

//Getting the image of who has logged in
router.get('/image', auth, async(req,res)=>{
    try{
        const avatar = req.user.avatar
        if(!avatar){
            throw new Error("User avatar not found")
        }
        res.set('Content-Type','image/png')
        res.send(avatar)
    }catch(e){
        res.status(500).send({error : e.message})
    }
})


module.exports = router

 