import React, { createContext, useContext, useEffect, useState } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    sendPasswordResetEmail,
    updatePassword,
    updateEmail
} from "firebase/auth";
import { auth, db, googleProvider } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, fullName) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: fullName,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
        });

        // Update profile (optional but good for display name immediately)
        await updateProfile(user, { displayName: fullName });

        return userCredential;
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout() {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Optimistically set user
                setCurrentUser(user);

                // Optionally update last login in background
                const userRef = doc(db, "users", user.uid);
                // We can use setDoc with merge to update lastLogin without overwriting
                try {
                    // Check if doc exists to avoid overwriting specific fields if needed
                    // For now, just a timestamp update is safe enough or we can skip it to reduce writes
                    // setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
                } catch (e) {
                    console.error("Error updating user stats", e);
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    async function loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user doc exists, if not create it
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString(),
            });
        } else {
            // Update last login
            try {
                await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
            } catch (e) {
                console.error("Error updating login stat", e);
            }
        }
        return result;
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    function updateUserPassword(password) {
        return updatePassword(currentUser, password);
    }

    async function updateUserProfile(data) {
        // Update auth profile
        if (data.displayName || data.photoURL) {
            await updateProfile(currentUser, {
                displayName: data.displayName,
                photoURL: data.photoURL
            });
        }

        // Update email if changed (requires re-auth usually, but basic impl here)
        if (data.email && data.email !== currentUser.email) {
            await updateEmail(currentUser, data.email);
        }

        // Update Firestore doc
        const userRef = doc(db, "users", currentUser.uid);
        await setDoc(userRef, data, { merge: true });
    }

    function getIdToken() {
        return currentUser ? currentUser.getIdToken() : Promise.resolve(null);
    }

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserPassword,
        updateUserProfile,
        getIdToken
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
