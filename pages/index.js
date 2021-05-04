import { useState, createContext, useContext, useEffect } from 'react'
import UserContext from '../components/util/UserContext'
import { useRouter } from 'next/router'
import firebaseConfig from '../firebase.config'

import firebase from 'firebase'


export default function Home() {
  const user_context = useContext(UserContext)
  const [signedIn, setSignedIn] = useState(false)


  const router = useRouter()

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  var provider = new firebase.auth.GoogleAuthProvider()

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setSignedIn(true)
    }
  });

  const loginWithGoogle = () => {
    firebase.auth()
      .signInWithPopup(provider)
      .then((result) => {
        var user = result.user;
        // console.log(user);
        setSignedIn(true)
      }).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage)
      });
  }

  const signOut = () => {
    firebase.auth().signOut().then(() => {
      alert("Signed Out!")
      setSignedIn(false)
    }).catch((error) => {
      // An error happened.
      console.log(error);
    });
  }
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <h1>Fake Imgur</h1>
        <button className="btn btn-info mb-1" onClick={() => router.push('/all_images')}>Browser Images</button >
        {signedIn && <button className="btn btn-primary mb-1" onClick={() => router.push('home')}>Home</button >}
        {!signedIn ? <button className="btn btn-primary" onClick={loginWithGoogle}>Login with Google</button> : (<button className="btn btn-danger" onClick={signOut}>Logout</button>)}
      </div>
    </>
  )
}
