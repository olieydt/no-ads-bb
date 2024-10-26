import express, { Request, Response } from 'express'
import cors from 'cors'
import { searchYouTube, getVideoStreamUrl } from './youtube'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
})

// Endpoint to search YouTube videos
app.get('/api/search', async (req: Request, res: Response) => {
    const query = req.query.q as string
    const page = parseInt(req.query.page as string) || 1

    if (!query) {
        res.status(400).json({ error: 'Query parameter "q" is required.' })
        return
    }

    try {
        const results = await searchYouTube(query, page)
        res.json(results)
    } catch (error) {
        console.error('Search Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

// Endpoint to get video stream URL
app.get('/api/video', async (req: Request, res: Response) => {
    const videoUrl = req.query.url as string

    if (!videoUrl) {
        res.status(400).json({ error: 'Query parameter "url" is required.' })
        return
    }

    try {
        const streamUrl = await getVideoStreamUrl(videoUrl)
        res.json({ streamUrl })
    } catch (error) {
        console.error('Video Stream Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`)
})
