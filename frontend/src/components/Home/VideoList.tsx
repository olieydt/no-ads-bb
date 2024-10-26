// frontend/src/components/Home/VideoList.tsx
import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { makeStyles } from 'tss-react/mui'

interface Video {
    id: string
    title: string
    url: string
    thumbnail: string
}

interface VideoListProps {
    searchQuery: string
    onVideoSelect: (videoUrl: string) => void
}

const useStyles = makeStyles()({
    videoList: {
        marginTop: '60px', // Height of the search bar
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '10px',
        marginLeft: '50px',
    },
    videoItem: {
        width: '200px',
        margin: '10px',
        cursor: 'pointer',
        '&:hover': {
            transform: 'scale(1.05)',
            transition: 'transform 0.2s',
        },
    },
    thumbnail: {
        width: '100%',
        height: 'auto',
        borderRadius: '4px',
    },
    title: {
        fontSize: '14px',
        textAlign: 'center',
        marginTop: '5px',
        color: '#333',
    },
    loader: {
        textAlign: 'center',
        marginLeft: '10px'
    },
    endMessage: {
        textAlign: 'center',
        marginTop: '20px',
        color: '#777',
    },
})

const VideoList: React.FC<VideoListProps> = ({ searchQuery, onVideoSelect }) => {
    const { classes } = useStyles()
    const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('')
    const [videos, setVideos] = useState<Video[]>([])
    const [page, setPage] = useState<number>(1)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [hasMore, setHasMore] = useState<boolean>(true)

    useEffect(() => {
        if (currentSearchQuery !== searchQuery && searchQuery) {
            setVideos([])
            setPage(1)
            setHasMore(true)
            setCurrentSearchQuery(searchQuery)
            fetchVideos(1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery])

    const fetchVideos = useCallback(async (pageNumber: number) => {
        try {
            setIsLoading(true)
            const response = await fetch(
                `http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}&page=${pageNumber}`
            )
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            const newVideos: Video[] = await response.json()
            if (newVideos.length === 0) {
                setHasMore(false)
                return
            }
            const filteredVideos = newVideos.filter((video) => !videos.some((v) => v.id === video.id))
            setVideos((prev) => [...prev, ...filteredVideos])
            setPage((prev) => prev + 1)
        } catch (error) {
            console.error('Error fetching videos:', error)
            setHasMore(false)
        } finally {
            setIsLoading(false)
        }
    }, [searchQuery])

    let loadingMessage = ''
    if (isLoading) {
        loadingMessage = 'Loading...'
    } else if (!searchQuery) {
        loadingMessage = 'Enter a search query to get started...'
    } else if (videos.length === 0) {
        loadingMessage = 'No videos found'
    }

    return (
        <InfiniteScroll
            dataLength={videos.length}
            next={() => fetchVideos(page)}
            hasMore={hasMore}
            loader={<h4 className={classes.loader}>{loadingMessage}</h4>}
            endMessage={<p className={classes.endMessage}>No more videos...</p>}
            className={classes.videoList}
        >
            {videos.map((video) => (
                <div
                    key={video.id}
                    className={classes.videoItem}
                    onClick={() => onVideoSelect(video.url)}
                >
                    <img src={video.thumbnail} alt={video.title} className={classes.thumbnail} />
                    <p className={classes.title}>{video.title}</p>
                </div>
            ))}
        </InfiniteScroll>
    )
}

export default VideoList
