import {useState, createContext, useContext, useEffect} from 'react'
import {useRouter} from 'next/router'
import firebaseConfig from '../firebase.config'
import Swal from 'sweetalert2'

import firebase from 'firebase'


export default function Home() {
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
        Swal.fire({
            title: "Do you want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Logout`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                firebase
                    .auth()
                    .signOut()
                    .then(() => {
                        Swal.fire("Success!", "You are logged out!", "success").then(_ => setSignedIn(false));
                    })
                    .catch((error) => {
                        // An error happened.
                        Swal.fire("Error!", error.message, "error")
                    });
            }
        });
    };
    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 'auto',
                height: '100vh'
            }}>
                <h1 style={{marginBottom: '60px'}}>Fake Imgur</h1>
                <button className="btn btn-info mb-2" onClick={() => router.push('/all_images')}>Browser Images</button>
                <div className="d-flex" style={{gap: '10px', alignItems: 'center'}}>
                    {signedIn &&
                    <button className="btn btn-primary" onClick={() => router.push('home')}>Home</button>}
                    {!signedIn ?
                        <button className="btn btn-primary" onClick={loginWithGoogle}>Login with Google</button> : (
                            <button className="btn btn-danger" onClick={signOut}>Logout</button>)}
                </div>
            </div>
        </>
    )
}
