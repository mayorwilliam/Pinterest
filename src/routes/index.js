const { Router } = require("express");

const router = Router()

const path = require('path')
const {unlink} = require('fs-extra')

const Image = require('../models/Image')

router.get('/', async(request, response) => {
    const images = await Image.find()
    console.log(images)
    response.render('index', {images})
})

router.get('/upload', (request,response) => {
    response.render('upload')
})

router.post('/upload', async(request,response) => {
    const image = new Image()
    image.title = request.body.title
    image.description = request.body.description
    image.filename = request.file.filename
    image.path = '/img/uploads/' + request.file.filename
    image.originalname = request.file.originalname
    image.mimetype = request.file.mimetype
    image.size = request.file.size

    await image.save()
    
    console.log(image)
    response.redirect('/')
})

router.get('/image/:id' , async( request, response) => {
    const {id} = request.params
    const image = await Image.findById(id)
    console.log(image)
    response.render('profile', {image})
})


router.get('/image/:id/delete', async (request,response) => {
    const {id} = request.params
    const image = await Image.findByIdAndDelete(id)
    await unlink(path.resolve('./src/public' + image.path))
    response.redirect('/')
})



module.exports = router