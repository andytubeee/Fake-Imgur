import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import firebase from "firebase/app";
import "firebase/storage";
import firebaseConfig from "../firebase.config";
import Swal from "sweetalert2";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

const MyImageCard = ({name, url, price, Isprivate}) => {
  const purchaseImage = () => {}
  return (
      <>
        <div className={"align-self-center mb-4"}>
          <h4>{name}</h4>
          <img src={url} width={400} alt={name}/>
          <div title={"Change"} className="d-flex justify-content-between align-items-center">
            <div className="d-flex">
              <span style={{cursor: 'pointer', margin: '0 10px'}} className="badge bg-success" onClick={purchaseImage}>${price}</span>
            </div>
          </div>
        </div>
      </>
  )
}


const all_images = () => {
  // Create a storage reference from our storage service
  const storageRef = firebase.storage().ref();
  const [imgUriArr, setIUArr] = useState([]);

  const router = useRouter()

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
    <div className="container d-flex flex-column">
      <h1 style={{ textAlign: "center", marginTop: 20 }}>All Images</h1>
      <button onClick={()=>{router.push('/home')}} className="btn btn-secondary mb-4" style={{width: '10%'}}>Home</button>
      {imgUriArr.map((img, index) => (

        <img src={img} width={500} style={{margin: 10}} className={"d-block align-self-center"} key={index} />
      ))}
    </div>
  );
};

export default all_images;
