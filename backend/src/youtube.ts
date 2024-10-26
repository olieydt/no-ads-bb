// backend/src/youtube.ts
import { execSync } from 'child_process'
import util from 'util'

const RESULTS_PER_PAGE = 5

// Search YouTube using yt-dlp and return video details
export const searchYouTube = async (query: string, page: number) => {
    const totalResults = RESULTS_PER_PAGE * page
    const output = execSync(`yt-dlp "ytsearch${totalResults}:${query}" --dump-json`, { encoding: 'utf-8', maxBuffer: totalResults * 2 * 1024 * 1024 })

    const lines = output.toString().trim().split('\n')
    return lines.map(line => {
        const data = JSON.parse(line)
        return {
            id: data.id,
            title: data.title,
            url: `https://www.youtube.com/watch?v=${data.id}`,
            thumbnail: `https://img.youtube.com/vi/${data.id}/hqdefault.jpg`,
        }
    })
}

// Get direct video stream URL using yt-dlp
export const getVideoStreamUrl = async (videoUrl: string) => {
    const command = `yt-dlp -g "${videoUrl}"`
    const output = await execSync(command)

    const streamUrl = output.toString().trim().split('\n')[0]
    return streamUrl
}
