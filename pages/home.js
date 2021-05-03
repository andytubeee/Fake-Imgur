// import Image from 'next/image'
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import UserContext from "../components/util/UserContext";
import Swal from 'sweetalert2'
import firebase from "firebase";
import firebaseConfig from "../firebase.config";
import styles from "../styles/Home.module.css";

const Home = () => {
    const router = useRouter();
    const [displayName, setDisplayName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

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
            title: 'Do you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `Logout`,
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                firebase.auth().signOut().then(() => {
                    Swal.fire(
                        'Success!',
                        'You are logged out!',
                        'success'
                    )

                }).catch((error) => {
                    // An error happened.
                    console.log(error);
                });
            }
        })

    };

    return (
        <>
            <div>
                <h1>Welcome {displayName}!</h1>
                <input
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) => {
                        console.log(e.target);
                        setSelectedFile(e.target.files)
                    }}
                />
                {selectedFile && (
                    <img
                        src={
                            selectedFile
                        }
                    />
                )}
                <button style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                }} className={styles.home_logoutbtn} onClick={signOut}>
                    Log out
        </button>
            </div>
        </>
    );
};

export default Home;
