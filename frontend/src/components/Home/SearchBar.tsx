// frontend/src/components/Home/SearchBar.tsx
import React, { useState } from 'react'
import { makeStyles } from 'tss-react/mui'

interface SearchBarProps {
    onSearch: (query: string) => void
}

const useStyles = makeStyles()({
    searchBar: {
        display: 'flex',
        padding: '10px',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        width: '60%',
        zIndex: 999,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    input: {
        flex: 1,
        padding: '8px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '8px 16px',
        marginLeft: '8px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: '#115293',
        },
    },
})

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const { classes } = useStyles()
    const [input, setInput] = useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim()) {
            onSearch(input.trim())
        }
    }

    return (
        <form className={classes.searchBar} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Search videos..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={classes.input}
            />
            <button type="submit" className={classes.button}>
                Search
            </button>
        </form>
    )
}

export default SearchBar
