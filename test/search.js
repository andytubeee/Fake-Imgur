const search = (allImages, keyword) => {
    var hits = []
    let keywordLower = String(keyword).toLowerCase()
    allImages.map(img => {
        const imageNameLower = String(img.imageName).toLowerCase()
        if (imageNameLower.includes(keywordLower)){
            hits.push(img)
        }
    })

    return hits
}

module.exports = search
