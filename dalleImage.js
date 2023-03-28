import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('Hello from DALL-E')
})

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json'
        })

        const image = aiResponse.data.data[0].b64_json
        const imageURL = await cloudinary.uploader.upload(`data:image/jpeg;base64,${image}`)
        
        res.status(200).json({ photo: image })
    } catch (error) {
        console.log('DELL-E =>', error)
        res.status(500).send(error?.response.data.error.message)
    }
})

export default router;