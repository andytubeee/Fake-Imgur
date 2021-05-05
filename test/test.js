const testData = require('./test.json')
const search = require('./search')

test('Search mountain from our image list (Same case)', ()=>{
    expect(search(testData, 'Mountain').length).toBe(2)
})
test('Search mountain from nothing', ()=>{
    expect(search([], 'Mountain').length).toBe(0)
})
test('Search mountain from our image list (case-insensitive)', ()=>{
    expect(search(testData, 'mountaIN').length).toBe(2)
})
test('Cake is the only result', ()=>{
    expect(search(testData, 'Cake')).toStrictEqual([testData[testData.length-1]])
})
test('Search nothing should return everything', ()=>{
    expect(search(testData, '')).toStrictEqual(testData)
})

