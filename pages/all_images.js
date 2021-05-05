import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import firebase from "firebase";
import "firebase/storage";
import firebaseConfig from "../firebase.config";
import Swal from "sweetalert2";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'


if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const ImageCard = ({name, url, price, author, authorID}) => {

    const [purchasedImages, setPurchasedimages] = useState([])
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [userUID, setUserUID] = useState('')
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setUserLoggedIn(true)
                setUserUID(user.uid)
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
            }
        })

    }, [])

    const purchaseImage = () => {
        if (userLoggedIn) {
            if (purchasedImages.includes(url)) {
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
                            p_images: firebase.firestore.FieldValue.arrayUnion({
                                imgUrl: url,
                                imgName: name,
                                author: author,
                                datePurchased: new Date()
                            })
                        }).then(s => Swal.fire('Purchased!', 'Item can be found under purchased images', 'success').then(_ => window.location.reload(false)))
                            .catch(error => Swal.fire('Error!', error.message, 'error'))
                    }
                });
            }
        } else {
            Swal.fire({
                title: "Can't Make Purchase", text: "Please sign in first", icon: 'error'
            })
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
                            {authorID !== userUID &&
                            <span style={{margin: '0 10px', cursor: 'pointer'}} className="badge bg-primary"
                                  onClick={purchaseImage}>Purchase</span>
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
    const [publicImagesDefault, setPublicImagesDefault] = useState([]);
    const [searchedImages, setSearchedImages] = useState([]);
    const [searchInput, setSearchInput] = useState('')
    const [filter, setFilter] = useState('Default')
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [userUID, setUserUID] = useState('')
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
                            setPublicImagesDefault(prev => [...prev, d_img])
                        }
                    })
                }
            })
        })

        firebase.auth().onAuthStateChanged(user => {
            if (user) setUserLoggedIn(true)
        })


    }, []);

    const searchPress = (allImages, keyword) => {
        allImages.map(img => {
            if (img.imageName.includes(keyword) || img.imageName === keyword) {
                setSearchedImages(prev => [...prev, img])
            }
        })
    }

    useEffect(() => {
        // Cleared searched input, get rid of searchedImages
        if (searchInput === '') {
            setSearchedImages([])
        }
    }, [searchInput])


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
                        Swal.fire("Success!", "You are logged out!", "success").then(_ => router.push("/"));
                    })
                    .catch((error) => {
                        // An error happened.
                        Swal.fire("Error!", error.message, "error")
                    });
            }
        });
    };


    const handleSort = (filter) => {
        if (filter === 'name') {
            // let temp = publicImages;
            // temp.sort((a,b) => (a.imageName > b.imageName) ? 1 : ((b.imageName > a.imageName) ? -1 : 0))
            setPublicImages(prev => [...prev].sort((a, b) => (a.imageName > b.imageName) ? 1 : ((b.imageName > a.imageName) ? -1 : 0)))
        } else if (filter === 'price') {
            setPublicImages(prev => [...prev].sort((a, b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0)))
        } else if (filter === 'default') {
            setPublicImages(publicImagesDefault)
        } else if (filter === 'datePosted') {
            setPublicImages(prev => [...prev].sort((a, b) => b.dateUploaded - a.dateUploaded))
        }
    }

    return (
        <div className="container d-flex flex-column">
            <h1 style={{textAlign: "center", marginTop: 20}}>All Images</h1>
            <button onClick={() => {
                router.push(userLoggedIn ? '/home' : '/')
            }} className="btn btn-secondary mb-4" style={{width: '10%', minWidth: '100px'}}>Home
            </button>
            <div className="d-flex p-1 justify-content-between">
                <input className="form-control" type="text" style={{width: '89%'}} placeholder="Search for Images"
                       aria-label="default input search" onChange={event => setSearchInput(event.target.value)}/>
                <button className="btn btn-primary" style={{width: '10%', minWidth: '80px'}}
                        onClick={() => searchPress(publicImages, searchInput)}><FontAwesomeIcon icon={faSearch}
                                                                                                style={{width: 20}}/> Search
                </button>
            </div>
            {/*Hide sort dropdown if there are no images*/}
            {(publicImages.length > 0 || searchedImages.length > 0) && (
                <>
                    <label>Sort</label>
                    <select className="form-select" style={{width: '10vmax'}} aria-label="Default select example"
                            onChange={event => handleSort(event.target.value)}>
                        <option value="default">Default</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="datePosted">Date Posted</option>
                    </select>
                </>
            )}
            {/*Showing all image if we didn't search*/}
            {!(searchInput.length > 0 && searchedImages.length > 0) && publicImages.map((img) =>
                <ImageCard price={img.price} url={img.imgUrl} name={img.imageName} author={img.author}
                           authorID={img.authorID}/>
            )}
            {/* Show filtered images if there are any, and we asked for it*/}
            {searchedImages.length > 0 && searchedImages.map((img) =>
                <ImageCard price={img.price} url={img.imgUrl} name={img.imageName} author={img.author}
                           authorID={img.authorID}/>
            )}
            {publicImages.length === 0 && <h1>No one has uploaded anything!</h1>}
            {userLoggedIn && <button
                style={{
                    position: "fixed",
                    bottom: 10,
                    left: 10,
                }}
                className={"btn btn-danger px-3"}
                onClick={signOut}
            >
                Logout
            </button>}
        </div>
    );
};

export default all_images;
