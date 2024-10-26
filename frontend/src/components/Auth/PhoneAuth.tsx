// frontend/src/components/Auth/PhoneAuth.tsx
import React, { useState } from 'react'
import { auth } from '../../firebase'
import { signInWithPhoneNumber, RecaptchaVerifier, PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import { makeStyles } from 'tss-react/mui'

const useStyles = makeStyles()({
    authContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        margin: '10px 0',
        width: '300px',
        maxWidth: '80%',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        marginTop: '10px',
        '&:hover': {
            backgroundColor: '#115293',
        },
    },
    error: {
        color: 'red',
        marginTop: '10px',
    },
})

const PhoneAuth: React.FC = () => {
    const { classes } = useStyles()
    const [phone, setPhone] = useState<string>('')
    const [otp, setOtp] = useState<string>('')
    const [verificationId, setVerificationId] = useState<string>('')
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const sendOtp = async () => {
        setError('')
        const appVerifier = window.recaptchaVerifier as RecaptchaVerifier
        try {
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier)
            setVerificationId(confirmationResult.verificationId)
            setIsOtpSent(true)
        } catch (err: any) {
            setError(err.message)
        }
    }

    const verifyOtp = async () => {
        setError('')
        try {
            const credential = PhoneAuthProvider.credential(verificationId, otp)
            await signInWithCredential(auth, credential)
            // User is signed in
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className={classes.authContainer}>
            {!isOtpSent ? (
                <div>
                    <h2>Enter your phone number</h2>
                    <input
                        type="tel"
                        placeholder="+1234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={classes.input}
                    />
                    <button onClick={sendOtp} className={classes.button}>
                        Send OTP
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Enter OTP</h2>
                    <input
                        type="text"
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={classes.input}
                    />
                    <button onClick={verifyOtp} className={classes.button}>
                        Verify OTP
                    </button>
                </div>
            )}
            {error && <p className={classes.error}>{error}</p>}
        </div>
    )
}

export default PhoneAuth
