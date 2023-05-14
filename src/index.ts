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
      Array.from(Array(tableSize)).forEach(
        (val, index) => (this.hashArray[index] = new LinkedList<HashElement<K, V>>())
      )
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

  add(key: K, value: V): void {
    this.numberOfElements += 1
    this.loadFactor = this.numberOfElements / this.hashArray.length

    if (this.loadFactor > this.maxLoadFactor) {
      this.resize(this.tableSize * 2)
    }

    const elementToAdd = new HashElement<K, V>(key, value)

    const hashValue = this.hashCode(elementToAdd.key)

    this.hashArray[hashValue].addFirst(elementToAdd)
  }

  remove(key: K): void {
    const hashValue = this.hashCode(key)
    this.hashArray[hashValue].findAndRemove(key)
    this.numberOfElements -= 1
  }

  resize(newSize: number): void {
    const newHashArray: LinkedList<HashElement<K, V>>[] = []
    Array.from(Array(newSize)).forEach((val, index) => (newHashArray[index] = new LinkedList<HashElement<K, V>>()))

    // for each hash element (LL, or 'bucket'), traverse the LL
    this.hashArray.forEach(hashElm => {
      let current = hashElm.head
      while (current !== null) {
        const hashElm = new HashElement(current.key, current.value)
        const hashVal = this.hashCode(current.key)
        newHashArray[hashVal].addFirst(hashElm)
        current = current.next
      }
    })

    this.tableSize = newSize
    this.hashArray = newHashArray
  }

  getValue(key: K): V | null {
    const hashValue = this.hashCode(key)
    const list = this.hashArray[hashValue]

    if (!list) return null

    // loop through LL and compare keys, then return value
    let temp = null,
      current = list.head
    while (current !== null) {
      if (current.key === key) {
        return current.value
      }
      temp = current
      current = current.next
    }

    return null
  }
}
