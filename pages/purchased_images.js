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

const MyImageCard = ({name, url, price, author, datePurchased}) => {

    console.log(author, name)

    const imageOnClick = () => {

        Swal.fire({
                title: 'Date Purchased',
                text: datePurchased.toDate(),
                icon: 'info'
            })
    }

    return (
        <>
            <div className={"align-self-center mb-4"}>
                <h4>{name}</h4>
                <img style={{cursor: 'pointer'}} title={"View Info"} src={url} width={400} alt={name} onClick={imageOnClick}/>
                <div title={"Change"} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <span style={{margin: '0 10px'}} className="badge bg-secondary"><b>Author: </b>{author}</span>
                    </div>
                </div>
            </div>
        </>
    )
}


const my_images = () => {
    const router = useRouter()

    const db = firebase.firestore()

    const [firestoreReady, setFirestoreReady] = useState(false)
    const [dName, setDName] = useState('')
    const [uid, setUID] = useState('')
    const [purchasedImages, setPurchasedimages] = useState([])

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setUID(user.uid);
            setDName(user.displayName)
            setFirestoreReady(true)

        } else {
            router.push("/");
        }
    });

    useEffect(() => {
        if (firestoreReady) {
            const myImgRef = db.collection("users").doc(uid);
            myImgRef.get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().hasOwnProperty('p_images')) {
                        doc.data().p_images.forEach(img => {
                            setPurchasedimages(prev => [...prev, {
                                url: img.imgUrl,
                                name: img.imgName,
                                author: img.author,
                                datePurchased: img.datePurchased
                            }])
                        })
                    }

                }
            })
        }
    }, [firestoreReady])


    return (
        <div className="container d-flex flex-column">
            <h1 style={{textAlign: "center", marginTop: 20}}>Purchased Images</h1>
            <button onClick={() => {
                router.push('/home')
            }} className="btn btn-secondary mb-4" style={{width: '10%'}}>Home
            </button>
            <p><b>User ID:</b> {uid}</p>
            <p><b>Name:</b> {dName}</p>

            {purchasedImages.map(({name, url, price, author, datePurchased}) => (
                <MyImageCard name={name} url={url} price={price} author={author} datePurchased={datePurchased}/>
            ))}
            {purchasedImages.length === 0 && <h1>You have no purchased images</h1>}

        </div>
    );
};

export default my_images
