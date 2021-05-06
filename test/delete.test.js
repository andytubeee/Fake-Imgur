const deleteImg = require('./delete')

test("Delete existing value from a list of images", ()=>{
    const tempTestData = [
        {imageName: 'Mountain'},
        {imageName: 'Cake'},
        {imageName: 'Apple'},
    ]
    expect(deleteImg(tempTestData, 'Apple')).toStrictEqual([{imageName: 'Mountain'},
        {imageName: 'Cake'}])
})

test("Delete an image that never existed", ()=>{
    const tempTestData = [
        {imageName: 'Mountain'},
        {imageName: 'Cake'},
        {imageName: 'Apple'},
    ]
    expect(deleteImg(tempTestData, 'Computer')).toStrictEqual(tempTestData)
})
