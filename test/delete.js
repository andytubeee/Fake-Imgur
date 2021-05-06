const deleteImg = (allImages, imageName) => {
    // allImages is an array of image objects
    // Image is an object with properties about the image
    // Delete by image name

    return allImages.filter((img) => img.imageName !== imageName)
}

module.exports = deleteImg
