// backend/src/youtube.ts
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

// Search YouTube using yt-dlp and return video details
export const searchYouTube = async (query: string, page: number) => {
    // Note: yt-dlp doesn't support YouTube search directly.
    // As a workaround, use YouTube's search URL.
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&page=${page}`

    const command = `yt-dlp -j --flat-playlist "${searchUrl}"`
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
        console.error('yt-dlp stderr:', stderr)
    }

    const lines = stdout.trim().split('\n')
    const videos = lines.map(line => {
        const data = JSON.parse(line)
        return {
            id: data.id,
            title: data.title,
            url: `https://www.youtube.com/watch?v=${data.id}`,
            thumbnail: `https://img.youtube.com/vi/${data.id}/hqdefault.jpg`,
        }
    })

    return videos
}

// Get direct video stream URL using yt-dlp
export const getVideoStreamUrl = async (videoUrl: string) => {
    const command = `yt-dlp -f best -g "${videoUrl}"`
    const { stdout, stderr } = await execPromise(command)

    if (stderr) {
        console.error('yt-dlp stderr:', stderr)
    }

    const streamUrl = stdout.trim().split('\n')[0]
    return streamUrl
}
