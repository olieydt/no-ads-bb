// frontend/src/components/VideoPlayer/VideoPlayer.tsx
import React, { useEffect, useRef, useState } from 'react'
import Clappr from 'clappr'
import { makeStyles } from 'tss-react/mui'

interface VideoPlayerProps {
    videoUrl: string
}

const useStyles = makeStyles()({
    clapprPlayerContainer: {
        width: '100%',
        height: '100%',
    },
})

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
    const { classes } = useStyles()
    const [streamUrl, setStreamUrl] = useState<string>('')
    const playerRef = useRef<HTMLDivElement>(null)
    const playerInstance = useRef<Clappr.Player | null>(null)

    useEffect(() => {
        const fetchStreamUrl = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/video?url=${encodeURIComponent(videoUrl)}`
                )
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                const data = await response.json()
                setStreamUrl(data.streamUrl)
            } catch (error) {
                console.error('Error fetching stream URL:', error)
            }
        }

        fetchStreamUrl()
    }, [videoUrl])

    useEffect(() => {
        if (streamUrl && playerRef.current) {
            // Destroy previous player if exists
            if (playerInstance.current) {
                playerInstance.current.destroy()
            }

            // Initialize Clappr player
            playerInstance.current = new Clappr.Player({
                source: streamUrl,
                parent: playerRef.current,
                autoPlay: true,
                width: '100%',
                height: '100%',
            })
        }

        // Cleanup on unmount
        return () => {
            if (playerInstance.current) {
                playerInstance.current.destroy()
            }
        }
    }, [streamUrl])

    if (!streamUrl) {
        return <div>Loading video...</div>
    }

    return (
        <div className={classes.clapprPlayerContainer}>
            <div ref={playerRef}></div>
        </div>
    )
}

export default VideoPlayer
