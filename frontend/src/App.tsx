// frontend/src/App.tsx
import React, { useEffect, useState } from 'react'
import { auth, setupRecaptcha } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'
import PhoneAuth from './components/Auth/PhoneAuth'
import Home from './components/Home/Home'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
  appContainer: {
    height: '100vh',
    width: '100%',
    position: 'relative',
  },
})

const App: React.FC = () => {
  const { classes } = useStyles()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setupRecaptcha('recaptcha-container')
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className={classes.appContainer}>
      {user ? <Home /> : <PhoneAuth />}
      <div id="recaptcha-container"></div>
    </div>
  )
}

export default App
