import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import firebase from "firebase";
import "firebase/storage";
import firebaseConfig from "../firebase.config";
import objectScan from 'object-scan'
import Swal from "sweetalert2";
// import {initializeApp, backup} from "firestore-export-import";
//
// const serviceAccount = require('../fakeimgur-75881-firebase-adminsdk-pavsb-432ae0f27a.json')
//
// initializeApp(serviceAccount)


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const ImageCard = ({name, url, price, author}) => {
    const purchaseImage = () => {
    }
    return (
        <>
            <div className={"align-self-center mb-4"}>
                <h4>{name}</h4>
                <img src={url} width={400} alt={name}/>
                <div title={"Change"} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <span style={{cursor: 'pointer', margin: '0 10px'}} className="badge bg-success"
                              onClick={purchaseImage}>${price}</span>
                        <div><b>Author: </b>{author}</div>
                    </div>
                </div>
            </div>
        </>
    )
}


const all_images = () => {
    // Create a storage reference from our storage service
    const storageRef = firebase.storage().ref();
    const [publicImages, setPublicImages] = useState([]);

    const router = useRouter()

    // console.log(storageRef.child("images"));

    useEffect(() => {

        const userSnapshot = firebase.firestore().collection('users').get()
        userSnapshot.then(snapshot => {
            snapshot.docs.map(d => {
                // console.log(d.data())
                d.data().images.map(d_img => {
                    if (d_img.private === false) {
                        setPublicImages(prev => [...prev, d_img])
                    }
                })
            })
        })


    }, []);

    return (
        <div className="container d-flex flex-column">
            <h1 style={{textAlign: "center", marginTop: 20}}>All Images</h1>
            <button onClick={() => {
                router.push('/home')
            }} className="btn btn-secondary mb-4" style={{width: '10%'}}>Home
            </button>
            {publicImages.map((img, index) =>
                    <ImageCard price={img.price} url={img.imgUrl} name={img.imageName} author={img.name} />

            )
            }
        </div>
    );
};

export default all_images;
