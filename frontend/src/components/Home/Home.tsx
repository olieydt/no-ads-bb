// frontend/src/components/Home/Home.tsx
import React, { useState } from 'react'
import SearchBar from './SearchBar'
import VideoList from './VideoList'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    videoPlayerContainer: {
        position: 'fixed',
        top: '60px', // Height of the search bar
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 1000,
    },
    '@media (max-width: 768px)': {
        videoPlayerContainer: {
            top: '50px',
        },
    },
})

const Home: React.FC = () => {
    const { classes } = useStyles()
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const handleVideoSelect = (videoUrl: string) => {
        setSelectedVideo(videoUrl)
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setSelectedVideo(null) // Close the video player when a new search is made
    }

    return (
        <div className={classes.homeContainer}>
            <SearchBar onSearch={handleSearch} />
            {selectedVideo && (
                <div className={classes.videoPlayerContainer}>
                    <VideoPlayer videoUrl={selectedVideo} />
                </div>
            )}
            <VideoList searchQuery={searchQuery} onVideoSelect={handleVideoSelect} />
        </div>
    )
}

export default Home
