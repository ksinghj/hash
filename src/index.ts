// TS Hash
import { LinkedList } from 'linked-list-ksinghj'

export class HashElement<K, V> {
  key: K
  value: V

  constructor(key: K, value: V) {
    this.key = key
    this.value = value
  }

  compareTo(element: HashElement<K, V>) {
    return element.value === this.value
  }
}

export class Hash<K, V> {
  hashArray: LinkedList<HashElement<K, V>>[]
  tableSize: number
  loadFactor: number
  maxLoadFactor: number
  numberOfElements: number

  constructor(tableSize: number) {
    this.hashArray = []
    this.tableSize = tableSize
    this.loadFactor = 0

    // initialise hashArray to be an array of linked lists
    for (let i = 0; i < tableSize; i++) {
      Array.from(Array(5)).forEach((val, index) => (this.hashArray[index] = new LinkedList<HashElement<K, V>>()))
    }

    this.maxLoadFactor = 0.75
    this.numberOfElements = 0
  }

  /**
   * Returns a hash code from a given key, key must be a string
   * @param  {String} key The string to hash.
   * @return {Number} A 32bit integer
   * @see http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
   */
  hashCode(key: K): number {
    if (typeof key !== 'string') return 0
    let hashValue = 0
    for (let i = 0, len = key.length; i < len; i++) {
      let chr = key.charCodeAt(i)
      hashValue = (hashValue << 5) - hashValue + chr
      hashValue |= 0 // Convert to 32bit integer
    }
    hashValue = Math.abs(hashValue)
    hashValue = hashValue % this.tableSize
    return hashValue
  }

  add(key: K, value: V) {
    if (this.loadFactor > this.maxLoadFactor) {
      this.resize(this.tableSize * 2)
    }

    const elementToAdd = new HashElement<K, V>(key, value)

    const hashValue = this.hashCode(elementToAdd.key)

    this.hashArray[hashValue].addFirst(elementToAdd)
    this.numberOfElements += 1
  }

  //   resize() {}

  remove(key: K) {
    const hashValue = this.hashCode(key)
    this.hashArray[hashValue].findAndRemove(key)
  }

  //   getValue() {}
}

// mock data type for testing
interface UserDetails {
  age: number
}

const myHash = new Hash<string, UserDetails>(5)
myHash.add('kartar', { age: 22 })
myHash.add('Max', { age: 23 })
myHash.remove('Max')

console.log({ myHash })
