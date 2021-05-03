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
        user_context.update({
          user
        })
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
        {signedIn && <button onClick={() => router.push('home')}>Home</button >}
        {!signedIn ? <button onClick={loginWithGoogle}>Login with Google</button> : (<button onClick={signOut}>Log out</button>)}
      </div>
    </>
  )
}
