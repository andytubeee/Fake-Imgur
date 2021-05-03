import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import firebase from "firebase";
import firebaseConfig from "../firebase.config";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const CustomImage = ({ imgs }) => {
  // Default to public
  const [dataLoaded, setDataLoaded] = useState(false);
  const [imgProp, setImgProp] = useState([]);

  useEffect(() => {
    // console.log(imgs);
    if (imgs.length > 0) {
      setImgProp((prev) => [
        ...prev,
        { private: false, price: 0, imgName: "" },
      ]);

      setDataLoaded(true);
    }
    // if (!imgs) {
    //     Array.from(imgs).forEach((img) => {
    //         setImgProp(prev => [...prev, { private: false, name: '', price: 0 }])
    //     })

    //     console.log(imgProp);
    // }
  }, [imgs]);

  // useEffect(() => {
  //     console.log(imgProp);
  // }, [imgProp])

  const handleUpload = () => {
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

        Array.from(imgs).map((i) => {
          // Create a reference to 'images/mountains.jpg'
          var fileImagesRef = storageRef.child(`images/${i.filename}`);

          fileImagesRef
            .put(i.uri)
            .then((s) =>
              Swal.fire("Uploaded", "Your images has been uploaded.", "success")
            );
        });
      }
    });
  };

  return (
    <>
      <div className={"row row-cols-4 justify-content-center"}>
        {dataLoaded &&
          Array.from(imgProp).length > 0 &&
          imgs.map((img, index) => {
            return (
              <div className="col p-1 m-4 d-flex flex-column justify-content-between align-items-center">
                <img src={img.uri} width={200} style={{ margin: 10 }} />
                <div className="d-flex flex-column">
                  <input
                    className="form-control w-100 mb-2"
                    type="text"
                    placeholder="Image Name"
                    value={img.filename}
                    aria-label="default img-name input "
                  />
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">
                      $
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Price"
                      aria-label="Username"
                      onChange={(e) => {
                        setImgProp(
                          imgProp.map((ti, ind) => {
                            setDataLoaded(false);
                            ind === index
                              ? { ...ti, price: e.target.value }
                              : ti;
                          })
                        );
                        setDataLoaded(true);
                      }}
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div className="form-check form-switch align-self-end m-1">
                    <input
                      className="form-check-input"
                      onChange={() => {
                        setImgProp(
                          imgProp.map((ti, ind) => {
                            setDataLoaded(false);
                            ind === index
                              ? {
                                  ...ti,
                                  private: !imgProp[String(index)].private,
                                }
                              : ti;
                          })
                        );
                        setDataLoaded(true);
                      }}
                      type="checkbox"
                      id="check-private"
                    />
                    <label className="form-check-label" for="check-private">
                      {imgProp[String(index)].private ? "Private" : "Public"}
                    </label>
                    {console.log(imgProp)}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="w-100 mt-3">
        <button className="btn btn-primary float-end" onClick={handleUpload}>
          Upload
        </button>
      </div>
    </>
  );
};
