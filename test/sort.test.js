const sort = require('./sort')
const testData = require('./test.json')

test("Letter A in the first", ()=>{
    expect(sort(testData, 'name')[0].imageName[0]).toBe('A')
})

test("Letter Z in the end", ()=>{
    expect(sort(testData, 'name')[testData.length-1].imageName[0]).toBe('Z')
})

test("Verify is sorted", ()=>{
    const dummyObj0 = {imageName: 'B'}
    const dummyObj1 = {imageName: 'A'}
    const dummyObj2 = {imageName: 'V'}
    expect(sort([dummyObj0, dummyObj1, dummyObj2], 'name')).toStrictEqual([dummyObj1, dummyObj0, dummyObj2])
})

test('Sort by price', ()=>{
    expect(sort(testData, 'price')[0].price < sort(testData, 'price')[testData.length - 1].price).toBe(true)
})

test('Sort by price, empty image list', ()=>{
    expect(sort([], 'price').length).toBe(0)
})
