import React, { useState } from 'react'
import SearchBar from './SearchBar'
import VideoList from './VideoList'
import VideoPlayer from '../VideoPlayer/VideoPlayer'
import { makeStyles } from 'tss-react/mui'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase'

const useStyles = makeStyles()({
    homeContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        width: '100%',
        backgroundColor: '#fff',
        zIndex: 999,
    },
    logoutButton: {
        position: 'fixed',
        top: '10px',
        right: '10px',
        padding: '8px 16px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#d32f2f',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: '#9a0007',
        },
    },
    videoPlayerContainer: {
        position: 'fixed',
        top: '60px', // Height of the header
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

    const handleLogout = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <div className={classes.homeContainer}>
            <div className={classes.header}>
                <SearchBar onSearch={handleSearch} />
                <button onClick={handleLogout} className={classes.logoutButton}>
                    Logout
                </button>
            </div>
            {selectedVideo && (
                <div className={classes.videoPlayerContainer}>
                    <VideoPlayer videoUrl={selectedVideo} />
                </div>
            )}
            {!selectedVideo && (
                <VideoList searchQuery={searchQuery} onVideoSelect={handleVideoSelect} />
            )}
        </div>
    )
}

export default Home
