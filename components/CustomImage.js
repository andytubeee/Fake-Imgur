import { useState, useEffect } from 'react'

export const CustomImage = ({ imgs }) => {
    // Default to public
    const [imgProp, setImgProp] = useState([])

    useEffect(() => {
        console.log(imgs);
        // if (!imgs) {
        //     Array.from(imgs).forEach((img) => {
        //         setImgProp(prev => [...prev, { private: false, name: '', price: 0 }])
        //     })

        //     console.log(imgProp);
        // }
    }, [imgs])

    return (
        <>
            <div className={"row row-cols-4 justify-content-center"}>
                {imgs.map((img, index) => {

                    return (
                        <div className="col p-1 m-4 d-flex flex-column justify-content-between align-items-center">
                            <img src={img.uri} width={200} style={{ margin: 10 }} />
                            <div className="d-flex flex-column">
                                <input className="form-control w-100 mb-2" type="text" placeholder="Image Name" value={img.filename} aria-label="default img-name input " />
                                <div className="input-group mb-3">
                                    <span className="input-group-text" id="basic-addon1">$</span>
                                    <input type="text" className="form-control" placeholder="Price" aria-label="Username" aria-describedby="basic-addon1" />
                                </div>
                                <div className="form-check form-switch align-self-end m-1">
                                    <input className="form-check-input" type="checkbox" id="check-private" />
                                    <label className="form-check-label" for="check-private">{"Public"}</label>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

        </>
    )
}