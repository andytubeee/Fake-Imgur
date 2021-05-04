import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import firebase from "firebase";
import "firebase/storage";
import firebaseConfig from "../firebase.config";
import objectScan from 'object-scan'
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch} from '@fortawesome/free-solid-svg-icons'



if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const ImageCard = ({name, url, price, author, authorID}) => {

    const [purchasedImages, setPurchasedimages] = useState([])

    useEffect(()=>{
        const db = firebase.firestore()
        const uid = firebase.auth().currentUser.uid
        const myImgRef = db.collection("users").doc(uid);
        myImgRef.get().then((doc) => {
            if (doc.exists) {
                if (doc.data().hasOwnProperty('p_images')) {
                    doc.data().p_images.forEach(img => {
                        setPurchasedimages(prev => [...prev, img.imgUrl])
                    })
                }
            }
        })
    }, [])

    const displayName = firebase.auth().currentUser.displayName

    const purchaseImage = () => {

        if (purchasedImages.includes(url)){
            Swal.fire({
                title: "Already Purchased",
                text: "Image can be found in purchased images",
                icon: 'warning'
            })
        } else {
            Swal.fire({
                title: "Do you want to purchase this image?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: `Purchase`,
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    const db = firebase.firestore().collection('users')
                    const userRef = db.doc(firebase.auth().currentUser.uid)

                    userRef.update({
                        p_images: firebase.firestore.FieldValue.arrayUnion({imgUrl: url, imgName: name, author: author, datePurchased: new Date()})
                    }).then(s => Swal.fire('Purchased!', 'Item can be found under purchased images', 'success'))
                        .catch(error => Swal.fire('Error!', error.message, 'error'))
                }
            });
        }
    }
    return (
        <>
            <div className={"align-self-center border border-2 rounded rounded-3 m-4 p-4"}>
                <h4>{name}</h4>
                <img src={url} width={400} alt={name}/>
                <div title={"Change"} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex w-100 mt-3 justify-content-between">
                        <div>
                            <span style={{margin: '0 10px'}} className="badge bg-success">${price}</span>
                            {authorID !== firebase.auth().currentUser.uid &&
                            <span style={{margin: '0 10px', cursor: 'pointer'}} className="badge bg-primary" onClick={purchaseImage}>Purchase</span>
                            }
                        </div>
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
    const [searchedImages, setSearchedImages] = useState([]);
    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState('Default')
    const router = useRouter()

    // console.log(storageRef.child("images"));

    useEffect(() => {

        const userSnapshot = firebase.firestore().collection('users').get()
        userSnapshot.then(snapshot => {
            snapshot.docs.map(d => {
                // console.log(d.data())
                if (d.data().hasOwnProperty('images')) {
                    d.data().images.map(d_img => {
                        if (d_img.private === false) {
                            setPublicImages(prev => [...prev, d_img])
                        }
                    })
                }
            })
        })


    }, []);

    const searchPress = () => {
        publicImages.map(img => {
            if (img.imageName.includes(searchInput) || img.imageName === searchInput){
                setSearchedImages(prev => [...prev, img])
            }
        })
    }

    useEffect(()=>{
        if (searchInput === ''){
            setSearchedImages([])
        }
    }, [searchInput])

    return (
        <div className="container d-flex flex-column">
            <h1 style={{textAlign: "center", marginTop: 20}}>All Images</h1>
            <button onClick={() => {
                router.push('/home')
            }} className="btn btn-secondary mb-4" style={{width: '10%', minWidth: '100px'}}>Home
            </button>
            <div className="d-flex p-1 justify-content-between">
                <input className="form-control" type="text" style={{width: '89%'}} placeholder="Search for Images" aria-label="default input search" onChange={event => setSearchInput(event.target.value)} />
                <button className="btn btn-primary" style={{width: '10%', minWidth: '80px'}} onClick={searchPress}> <FontAwesomeIcon icon={faSearch} style={{width: 20}}/> Search
                </button>
            </div>
            {/*Hide filter dropdown if there are no images*/}
            {(publicImages.length > 0 || searchedImages.length > 0) && (
                <>
                    <label>Filter</label>
                    <select className="form-select" style={{width: '10vmax'}} aria-label="Default select example">
                        <option value="1">Default</option>
                        <option value="2">Name</option>
                        <option value="3">Date Posted</option>
                    </select>
                </>
            )}
            {/*Showing all image if we didn't search*/}
            {!(searchInput.length > 0 && searchedImages.length > 0) && publicImages.map((img) =>
                <ImageCard price={img.price} url={img.imgUrl} name={img.imageName} author={img.author}
                           authorID={img.authorID}/>
            )}
            {/* Show filtered images if there are any, and we asked for it*/}
            {searchedImages.length > 0&& searchedImages.map((img) =>
                <ImageCard price={img.price} url={img.imgUrl} name={img.imageName} author={img.author}
                           authorID={img.authorID}/>
            )}
            {publicImages.length === 0 && <h1>No one has uploaded anything!</h1>}
        </div>
    );
};

export default all_images;
