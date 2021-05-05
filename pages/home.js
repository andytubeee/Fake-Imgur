// import Image from 'next/image'
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserContext from "../components/util/UserContext";
import Swal from "sweetalert2";
import firebase from "firebase";
import firebaseConfig from "../firebase.config";
import styles from "../styles/Home.module.css";
import { CustomImage } from "../components/CustomImage";

const Home = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [selectedFiles, setSelectedFiles] = useState({});

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      setDisplayName(user.displayName);
    } else {
      router.push("/");
    }
  });

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

  const handleImgs = async (img) => {
      let reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = () => {
        setSelectedFiles(
          { uri: reader.result, filename: img.name, directFile: img });
      };
      reader.onerror = (err) => console.error(err);
  };

  return (
    <>
      <div className="container">
        <h1 style={{ textAlign: "center", marginTop: 20 }}>
          Welcome {displayName}!
        </h1>

        <div className="mx-auto">
          <label for="image-file-upload" className="form-label">
            Upload your image
          </label>
          <input
            className="form-control"
            type="file"
            accept=".png,.jpg,.jpeg"
            id="image-file-upload"
            onChange={(e) => {
              let file = e.target.files[0];
              handleImgs(file);
            }}
          />
        </div>
        {Object.keys(selectedFiles).length > 0 && <CustomImage img={selectedFiles} authorID={firebase.auth().currentUser.uid}/>}
        <button
          style={{
            position: "fixed",
            bottom: 10,
            left: 10,
          }}
          className={"btn btn-danger px-3"}
          onClick={signOut}
        >
          Logout
        </button>
        <div className="d-flex mt-4 justify-content-between flex-wrap align-content-center align-items-center" style={{width: '35%'}}>
          <button
            className="btn btn-secondary m-2"
            onClick={() => router.push("/all_images")}
          >
            Browse Pictures
          </button>
          <button
            className="btn btn-secondary m-2"
            onClick={() => router.push("/my_images")}
          >
            My Pictures
          </button><button
            className="btn btn-secondary m-2"
            onClick={() => router.push("/purchased_images")}
          >
            Purchased Pictures
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
