import firebase from "firebase";
import firebaseConfig from "../firebase.config";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Swal from "sweetalert2";
import {withCoalescedInvoke} from "next/dist/lib/coalesced-function";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const MyImageCard = ({name, url, price, Isprivate}) => {

    const db = firebase.firestore()

    const changePrice = () => {
        Swal.fire({
            title: 'Update Price',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Update',
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                const newPrice = result.value
                console.log(newPrice)
                Swal.fire({title: 'Coming Soon', text: 'Feature under construction'})
            }
        })
    }

    const deleteImage = () => {
        const uid = firebase.auth().currentUser.uid
        const userImgRef = db.collection("users").doc(uid)

        userImgRef.get().then((doc) => {
            doc.data().images.forEach(img => {
                if (img.imgUrl === url && img.private === Isprivate) {
                    userImgRef.update({
                        images: firebase.firestore.FieldValue.arrayRemove(img)
                    }).then(() => window.location.reload(false));
                }
            })
        })
    }

    const changePrivate = () => {
        if (firebase.auth().currentUser.uid) {
            const uid = firebase.auth().currentUser.uid
            const userImageRef = db.collection('users').doc(uid)
            userImageRef.get().then(doc => {
                doc.data().images.map(d_img => {
                    if (d_img.imgUrl === url) {
                        const opposite = !d_img.private
                        userImageRef.set({
                            images: firebase.firestore.FieldValue.arrayUnion({...d_img, private: opposite})
                        }).then(s => window.location.reload(false))
                    }
                })
            })
        }
    }

    return (
        <>
            <div className={"align-self-center mb-4"}>
                <h4>{name}</h4>
                <img src={url} width={400} alt={name}/>
                <div title={"Change"} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <span style={{cursor: 'pointer', margin: '0 10px'}} className="badge bg-success"
                              onClick={changePrice}>${price}</span>
                        <span style={{cursor: 'pointer'}} className="badge bg-danger"
                              onClick={deleteImage}>Delete</span>
                    </div>
                    <div className="form-check form-switch align-self-end m-1">
                        <input
                            className="form-check-input"
                            style={{cursor: 'pointer'}}
                            type="checkbox"
                            id="check-private"
                            checked={Isprivate}
                            onClick={changePrivate}
                        />
                        <label className="form-check-label">
                            Private
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}


const my_images = () => {
    const router = useRouter()

    const db = firebase.firestore()

    const [userSignedIn, setUserSignedIn] = useState(false)
    const [firestoreReady, setFirestoreReady] = useState(false)
    const [dName, setDName] = useState('')
    const [uid, setUID] = useState('')
    const [userImages, setUserimages] = useState([])


    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUserSignedIn(true)
                setUID(user.uid);
                setDName(user.displayName)
                setFirestoreReady(true)
                if (firestoreReady) {
                    const myImgRef = db.collection("users").doc(uid);
                    myImgRef.get().then((doc) => {
                        if (doc.exists) {
                            if (doc.data().hasOwnProperty('images')) {
                                doc.data().images.forEach(img => {
                                    // console.log(img)
                                    setUserimages(prev => [...prev, {
                                        url: img.imgUrl,
                                        name: img.imageName,
                                        Isprivate: img.private,
                                        price: img.price
                                    }])
                                })
                            }
                        }
                    })
                }
            }
        });
    }, [firestoreReady])

    const loginWithGoogle = () => {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                var user = result.user;
                setUserSignedIn(true)
            }).catch((error) => {
            // Handle Errors here.
            var errorMessage = error.message;
            Swal.fire({title:"Error", text: errorMessage, icon:'error'})
        });
    }

    return (
        <div className="container d-flex flex-column">
            <h1 style={{textAlign: "center", marginTop: 20}}>My Images</h1>
            <button onClick={() => {
                router.push('/home')
            }} className="btn btn-secondary mb-4" style={{width: '10%'}}>Home
            </button>
            {!userSignedIn && <button className="btn btn-primary" onClick={loginWithGoogle}>Login with Google</button>}

            {userSignedIn && (
                <><p><b>User ID:</b> {uid}</p>
                    <p><b>Name:</b> {dName}</p></>
            )}


            {userImages.map(({name, url, price, Isprivate}) => (
                <MyImageCard name={name} url={url} price={price} Isprivate={Isprivate}/>
            ))}
            {userImages.length === 0 && userSignedIn && <h1>You have no Images</h1>}

        </div>
    );
};

export default my_images
