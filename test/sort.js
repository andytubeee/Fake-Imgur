const sort = (allImage, type) => {
    if (type === 'name'){
        return allImage.sort((a,b) => (a.imageName > b.imageName) ? 1 : ((b.imageName > a.imageName) ? -1 : 0))
    }
    else if(type==='price') {
        // Sort by price
        return allImage.sort((a,b) => (a.price > b.price) ? 1 : ((b.price > a.price) ? -1 : 0))
    }
}

module.exports = sort
