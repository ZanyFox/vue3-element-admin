function StorageCache(type = 'local') {
  let storage;
  if (type === 'session')
    storage = sessionStorage;
  else storage = localStorage;

  this.getItem = (key) => {
    const item = storage.getItem(key)
    try {
      return JSON.parse(item)
    } catch (e) {
      return item;
    }
  }

  this.setItem = (key, value) => {

    storage.setItem(key, JSON.stringify(value))
  }

  this.removeItem = (key) => {
    storage.removeItem(key)
  }

  this.clear = () => {
    storage.clear()
  }
}

const storage = new StorageCache()

export default storage