import { Hash, HashElement } from '.'

interface UserDetails {
  name: string
  age: number
  occupation: string
  company: string
  interests: string[]
}

describe('Hash class', () => {
  let hash: Hash<string, UserDetails>

  const userDetails: UserDetails = {
    name: 'Kartar',
    age: 22,
    occupation: 'Software Engineer',
    company: 'Prettylittlething.com',
    interests: ['Guitar', 'Kickboxing', 'Women', 'Travel']
  }

  beforeEach(() => {
    hash = new Hash(5)
  })

  it('initialises the hash correctly', () => {
    expect(hash.hashArray.length).toBe(5)
  })

  describe('hashCode()', () => {
    it('the hash code function is a pure function and returns the same value for the same input and table size', () => {
      const result = hash.hashCode('Kartar')
      const resultAgain = hash.hashCode('Kartar')

      expect(result).toBe(3)
      expect(resultAgain).toBe(3)
    })
  })

  describe('add()', () => {
    it('adds element to hash', () => {
      hash.add('Kartar', userDetails)

      expect(hash.hashArray.length).toBe(5)
      expect(hash.loadFactor).toBe(0.2)
      expect(hash.numberOfElements).toBe(1)
    })
  })

  describe('remove()', () => {
    it('removes element from hash', () => {
      hash.add('Kartar', userDetails)

      expect(hash.numberOfElements).toBe(1)

      hash.remove('Kartar')

      expect(hash.numberOfElements).toBe(0)
    })
  })

  describe('resize()', () => {
    it('resizes the array when called directly', () => {
      hash.resize(10)

      expect(hash.hashArray.length).toBe(10)
    })

    it('resizes the array when max load factor is exceeded by adding elements', () => {
      hash.add('Kartar', userDetails)
      hash.add('ksinghj', userDetails)
      hash.add('K Doggy Dizzle', userDetails)
      hash.add('KJabandz', userDetails)
      hash.add('Kartinho', userDetails)

      expect(hash.hashArray.length).toBe(10)
      expect(hash.numberOfElements).toBe(5)
      expect(hash.loadFactor).toBe(0.5)
    })
  })

  describe('getValue()', () => {
    it('gets value of hash element from given key', () => {
      hash.add('Kartar', userDetails)

      const result = hash.getValue('Kartar')

      expect(result).toBe(userDetails)
    })
  })
})
