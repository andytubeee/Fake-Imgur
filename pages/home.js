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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFNames, setSelectedFNames] = useState([]);

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
            Swal.fire("Success!", "You are logged out!", "success");
            router.push("/");
          })
          .catch((error) => {
            // An error happened.
            console.log(error);
          });
      }
    });
  };

  const handleImgs = async (imgArr) => {
    // console.log(imgArr);
    Object.values(imgArr).forEach((f) => {
      let reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => {
        setSelectedFiles((prev) => [
          ...prev,
          { uri: reader.result, filename: f.name },
        ]);
      };
      reader.onerror = (err) => console.error(err);
    });
  };

  return (
    <>
      <div className="container">
        <h1 style={{ textAlign: "center" }}>Welcome {displayName}!</h1>

        <div className="mx-auto">
          <label for="image-file-upload" className="form-label">
            Upload your images
          </label>
          <input
            className="form-control"
            type="file"
            accept=".png,.jpg,.jpeg"
            id="image-file-upload"
            multiple
            onChange={(e) => {
              let files = e.target.files;
              handleImgs(files);
            }}
          />
        </div>
        {selectedFiles && <CustomImage imgs={selectedFiles} />}
        <button
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
          }}
          className={"btn btn-danger px-3"}
          onClick={signOut}
        >
          Logout
        </button>
        <div className="d-flex w-25 justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/all_images")}
          >
            Browse Pictures
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => router.push("/my_images")}
          >
            My Pictures
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
