import firebase from "firebase";
import firebaseConfig from "../firebase.config";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Swal from "sweetalert2";

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
                Swal.fire({title:'Coming Soon', text:'Feature under construction'})
            }
        })
    }

    const deleteImage = () => {
        const uid = firebase.auth().currentUser.uid
        const userImgRef = db.collection("users").doc(uid)

        userImgRef.get().then((doc)=>{
            doc.data().images.forEach(img => {
                if (img.imgUrl === url){
                    userImgRef.update({
                        images: firebase.firestore.FieldValue.arrayRemove(img)
                    });
                }
            })
        }).then(() => window.location.reload(false)
        )
    }

    return (
        <>
            <div className={"align-self-center mb-4"}>
                <h4>{name}</h4>
                <img src={url} width={400} alt={name}/>
                <div title={"Change"} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex">
                        <span style={{cursor: 'pointer', margin: '0 10px'}} className="badge bg-success" onClick={changePrice}>${price}</span>
                        <span style={{cursor: 'pointer'}} className="badge bg-danger" onClick={deleteImage}>Delete</span>
                    </div>
                    <div className="form-check form-switch align-self-end m-1">
                        <input
                            className="form-check-input"
                            style={{cursor: 'pointer'}}
                            type="checkbox"
                            id="check-private"
                            checked={Isprivate}
                            onClick={() => {
                                // window.location.reload(false)
                            }}
                        />
                        <label className="form-check-label">
                            {Isprivate ? 'Private' : 'Public'}
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

    const [firestoreReady, setFirestoreReady] = useState(false)
    const [dName, setDName] = useState('')
    const [uid, setUID] = useState('')
    const [userImages, setUserimages] = useState([])

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            setUID(user.uid);
            setDName(user.displayName)
            setFirestoreReady(true)

        } else {
            router.push("/");
        }
    });

    useEffect(()=>{
        if (firestoreReady) {
            const myImgRef = db.collection("users").doc(uid);
            myImgRef.get().then((doc)=>{
                if (doc.exists) {
                    doc.data().images.forEach(img => {
                        console.log(img)
                        setUserimages(prev=>[...prev, {url: img.imgUrl, name: img.imageName, Isprivate: img.private, price: img.price}])
                    })
                }
            })
        }
    }, [firestoreReady])


    return (
        <div className="container d-flex flex-column">
            <h1 style={{ textAlign: "center", marginTop: 20 }}>My Images</h1>
            <button onClick={()=>{router.push('/home')}} className="btn btn-secondary mb-4" style={{width: '10%'}}>Home</button>
            <p><b>User ID:</b> {uid}</p>
            <p><b>Name:</b> {dName}</p>

            {userImages.map(({name, url, price, Isprivate}) => (
                <MyImageCard name={name} url={url} price={price} Isprivate={Isprivate}/>
            ))}
            {userImages.length === 0 && <h1>You have no Images</h1>}

        </div>
    );
};

export default my_images
