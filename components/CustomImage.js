import {useState, useEffect, useContext} from "react";
import Swal from "sweetalert2";
import firebase from "firebase";
import firebaseConfig from "../firebase.config";
import update from 'immutability-helper'
import { v4 as uuidv4 } from 'uuid';


import UserContext from './util/UserContext.js'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}


const ImageUploadCard = ({uri, filename, events: {imgProp, setImgProp}}) => {

    return (
        <div className="col p-1 m-4 d-flex flex-column justify-content-between align-items-center">
            <img src={uri} width={200} style={{margin: 10}}/>
            <div className="d-flex flex-column">
                <input
                    className="form-control w-100 mb-2"
                    type="text"
                    placeholder="Image Name"
                    defaultValue={imgProp.imageName}
                    onChange={(e) => {
                        setImgProp({...imgProp, imageName: e.target.value})
                    }}
                    aria-label="default img-name input"
                />
                <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            $
          </span>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        aria-label="Price"
                        aria-describedby="basic-addon1"
                        onChange={(e) => {
                            setImgProp({...imgProp, price: e.target.value})
                        }}
                    />
                </div>
                <div className="form-check form-switch align-self-end m-1">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id="check-private"
                        onClick={() => {
                            setImgProp({...imgProp, private: !imgProp.private})
                        }}
                    />
                    <label className="form-check-label">Private
                        {}
                    </label>
                </div>
            </div>
        </div>
    );
};

export const CustomImage = ({img, authorID}) => {
    // Default to public
    const [dataLoaded, setDataLoaded] = useState(false);
    const [imgProp, setImgProp] = useState({private: false, price: null, imageName: img.filename, authorID: authorID});

    useEffect(() => {

        if (img.length > 0) {
            setDataLoaded(true);
        }
    }, [img]);

    const handleUpload = (dir_file) => {
        if (!(imgProp.price == null || imgProp.imageName === '')) {
            Swal.fire({
                title: "Are you sure?",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Upload",
            }).then((result) => {
                if (result.isConfirmed) {
                    // Create a root reference
                    var storageRef = firebase.storage().ref();
                    // Create a reference to 'images/mountains.jpg'
                    let randomName = uuidv4().split('-').join('')
                    var fileImagesRef = storageRef.child(imgProp.private ? `images/private/${randomName}` : `images/public/${randomName}`);

                    fileImagesRef
                        .put(dir_file, {name: imgProp.imageName})
                        .then((s) => {
                            var user = firebase.auth().currentUser;
                            var db = firebase.firestore();
                            s.ref.getDownloadURL().then(url=>{
                                db.collection('users').doc(user.uid).set({images: firebase.firestore.FieldValue.arrayUnion(
                                        {
                                            author: user.displayName,
                                            imgUrl: url,
                                            imageName: imgProp.imageName,
                                            price: imgProp.price,
                                            private: imgProp.private,
                                            dateUploaded: new Date(),
                                            authorID: imgProp.authorID
                                        }
                                    )}, {merge: true})
                                    .then(() => {
                                        Swal.fire("Uploaded", "Your images has been uploaded.", "success")
                                    })
                                    .catch((error) => {
                                        Swal.fire("Failed", error.message, "error")
                                    })
                            })
                            }
                        ).catch(err =>
                        Swal.fire("Failed", err.message, "error")
                    );
                }
            });
        } else {
            Swal.fire("Failed", "Missing Information!", "error")

        }
    };

    return (
        <>
            <div className={"row row-cols-2 justify-content-center"}>
                <ImageUploadCard filename={img.filename} uri={img.uri} events={{imgProp, setImgProp}}/>
            </div>

            <div className="w-100 mt-3">
                <button className="btn btn-primary float-end" onClick={() => handleUpload(img.directFile)}>Upload
                </button>
            </div>
        </>
    );
};
