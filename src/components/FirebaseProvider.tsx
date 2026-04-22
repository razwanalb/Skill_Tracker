import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signOut as firebaseSignOut, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useStore } from '../store/useStore';
import { doc, getDocFromServer, getDoc, setDoc, onSnapshot, collection, query, writeBatch } from 'firebase/firestore';
import { User, RoutineColumn, RoutineTask, Quote, DailyRecord } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firebase';
import { formatInTimeZone } from 'date-fns-tz';

export const FirebaseContext = createContext<{
  isAuthReady: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signInWithGithub: () => Promise<void>;
}>({
  isAuthReady: false,
  signIn: async () => {},
  signOut: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  signInWithGithub: async () => {}
});

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  
  const setUser = useStore(state => state.setUser);
  
  // Test connection on mount
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Use Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      setIsAuthReady(true);
      
      if (!u) {
        useStore.setState({ user: null });
      }
    });
    return unsubscribe;
  }, []);

  // Use Firestore Sync
  useEffect(() => {
    if (!isAuthReady) return;

    if (!fbUser) return;
    
    // Listen to user document
    const userDocRef = doc(db, 'users', fbUser.uid);
    const unsubUser = onSnapshot(userDocRef, (snap) => {
      if (!snap.exists()) {
        // Initialize user doc
        const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        // We might not have displayName if they signed up with email, but we'll try to extract it from email
        let fallbackName = fbUser.displayName || 'User';
        if (!fbUser.displayName && fbUser.email) {
            fallbackName = fbUser.email.split('@')[0];
        }

        const initialData = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          name: fallbackName,
          theme: 'light',
          timezone: defaultTz,
          baseTimezone: defaultTz,
          columns: useStore.getState().columns, // Keep default columns
          templateTasks: useStore.getState().templateTasks,
          quotes: useStore.getState().quotes
        };
        
        setDoc(userDocRef, initialData).catch(err => {
          handleFirestoreError(err, OperationType.CREATE, `users/${fbUser.uid}`);
        });
        
        setUser({ id: fbUser.uid, name: fallbackName, email: fbUser.email || '' });
        return;
      }
      
      const data = snap.data();
      
      setUser({
        id: fbUser.uid,
        name: data.name || '',
        email: data.email || '',
        profilePicture: data.profilePicture || '',
        username: data.username || '',
        phone: data.phone || '',
        gender: data.gender || '',
        location: data.location || '',
        website: data.website || '',
        socialLink: data.socialLink || ''
      });
      
      useStore.setState({
        theme: data.theme || 'light',
        timezone: data.timezone || 'UTC',
        baseTimezone: data.baseTimezone || 'UTC',
        columns: data.columns || [],
        templateTasks: data.templateTasks || [],
        quotes: data.quotes || []
      });
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${fbUser.uid}`);
    });

    // Listen to daily records
    const recordsColRef = collection(db, 'users', fbUser.uid, 'dailyRecords');
    const unsubRecords = onSnapshot(recordsColRef, (snap) => {
      const records: Record<string, DailyRecord> = {};
      snap.docs.forEach(d => {
        const dData = d.data() as DailyRecord;
        records[d.id] = dData;
      });
      
      useStore.setState({ dailyRecords: records });
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `users/${fbUser.uid}/dailyRecords`);
    });

    return () => {
      unsubUser();
      unsubRecords();
    };
  }, [isAuthReady, fbUser, setUser]);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    
    // Add the initial document here to include the name parameter that was passed during signup
    const defaultTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const initialData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        name: name || userCredential.user.email?.split('@')[0] || 'User',
        theme: 'light',
        timezone: defaultTz,
        baseTimezone: defaultTz,
        columns: useStore.getState().columns, 
        templateTasks: useStore.getState().templateTasks,
        quotes: useStore.getState().quotes
    };
    
    // We create the doc immediately instead of waiting for onSnapshot fallback, 
    // to ensure the 'name' is captured properly.
    await setDoc(doc(db, 'users', userCredential.user.uid), initialData).catch(err => {
        handleFirestoreError(err, OperationType.CREATE, `users/${userCredential.user.uid}`);
    });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <FirebaseContext.Provider value={{ 
        isAuthReady, 
        signIn, 
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        signOut,
        signInWithGithub
    }}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);
