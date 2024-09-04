import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../../config/firebase";
import GoogleLogo from "../../images/googleLogo.png";
import "./auth.css";

const AuthPage = (props) => {
    const { setIsAuth } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState("");

    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'auth/user-disabled':
                return 'User account has been disabled.';
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'Email is already in use.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-credential':
                return 'Invalid credentials provided.';
            default:
                return 'An unexpected error occurred. Please try again.';
        }
    };

    const handleAuth = async () => {
        if (!email || !password || (isRegistering && (!name || !confirmPassword))) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 8 || password.length > 20) {
            setError("Password must be between 8 and 20 characters.");
            return;
        }

        if (isRegistering) {
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                if (user) {
                    await updateProfile(user, { displayName: name });

                    const userRef = doc(db, 'users', user.uid);
                    await setDoc(userRef, { name, email });

                    setIsAuth(true);
                    window.location.assign("/trivia");
                }
            } catch (error) {
                console.error("Error during authentication:", error.message);
                setError(getErrorMessage(error.code));
            }
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                setIsAuth(true);
                window.location.assign("/trivia");
            } catch (error) {
                console.error("Error during authentication:", error.message);
                setError(getErrorMessage(error.code));
            }
        }
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                await setDoc(userRef, { name: user.displayName || 'Anonymous', email: user.email });
            }

            setIsAuth(true);
            window.location.assign("/trivia");
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
            setError(getErrorMessage(error.code)); 
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleAuth();
        }
    };

    return (
        <div className="register-container">
            <h1>{isRegistering ? "Join Us" : "Sign In"}</h1>
            {isRegistering && (
                <input
                    type="text"
                    placeholder="Name"
                    className="input-field"
                    onChange={(e) => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            )}
            <input
                type="email"
                placeholder="Email"
                className="input-field"
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <input
                type="password"
                placeholder="Password"
                className="input-field"
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            {isRegistering && (
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="input-field"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
            )}
            {error && <p className="error-message">{error}</p>}
            <button className="sign-in-button" onClick={handleAuth}>
                {isRegistering ? "Sign Up" : "Sign In"}
            </button>
            <p className="or-text">or</p>
            <button className="google-sign-in-button" onClick={signInWithGoogle}>
                <img src={GoogleLogo} alt="Google logo" className="google-logo" />
                Sign in with Google
            </button>
            <p className="toggle-auth">
                {isRegistering ? "Already have an account? " : "Don't have an account? "}
                <button className="link-transfer-mode" onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? "Sign In" : "Sign Up"}
                </button>
            </p>
        </div>
    );
};

export default AuthPage;
