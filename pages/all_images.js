import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import firebaseConfig from "../firebase.config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const all_images = () => {
  // Create a storage reference from our storage service
  const storageRef = firebase.storage().ref();
  const [imgUriArr, setIUArr] = useState([]);

  // console.log(storageRef.child("images"));

  useEffect(() => {
    storageRef
      .child("images/public")
      .listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          let imgRef = firebase.storage().ref(itemRef.fullPath);
          imgRef
            .getDownloadURL()
            .then((url) => {
              // `url` is the download URL for 'images/stars.jpg'

              // // This can be downloaded directly:
              // var xhr = new XMLHttpRequest();
              // xhr.responseType = "blob";
              // xhr.onload = (event) => {
              //   var blob = xhr.response;
              // };
              // xhr.open("GET", url);
              // xhr.send();
              setIUArr((prev) => [...prev, url]);
            })
            .catch((error) => {
              // Handle any errors
              console.log(error);
            });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <h1 style={{ textAlign: "center", marginTop: 20 }}>All Images</h1>
      {imgUriArr.map((img, index) => (
        <img src={img} key={index} />
      ))}
    </div>
  );
};

export default all_images;
