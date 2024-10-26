// frontend/src/components/VideoPlayer/VideoPlayer.tsx

import React, { useEffect, useRef, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

interface VideoPlayerProps {
    videoUrl: string
}

const useStyles = makeStyles()({
    videoPlayerContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
})

const fetchStreamUrl = async (videoUrl: string): Promise<string> => {
    try {
        const response = await fetch(
            `http://localhost:5000/api/video?url=${encodeURIComponent(videoUrl)}`
        )
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await response.json()
        return data.streamUrl
    } catch (error) {
        console.error('Error fetching stream URL:', error)
        return ''
    }
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    const { classes } = useStyles()
    const [streamUrl, setStreamUrl] = useState<string>('')
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        fetchStreamUrl(videoUrl).then(setStreamUrl)
    }, [videoUrl])

    useEffect(() => {
        if (streamUrl && videoRef.current) {
            videoRef.current.load()
            videoRef.current.play().catch((error) => {
                console.error('Error playing video:', error)
            })
        }
    }, [streamUrl])

    if (!streamUrl) {
        return <div>Loading video...</div>
    }

    return (
        <div className={classes.videoPlayerContainer}>
            <video
                ref={videoRef}
                className={classes.video}
                controls
                src={streamUrl}
            >
                Your browser does not support the video tag.
            </video>
        </div>
    )
}

export default VideoPlayer
