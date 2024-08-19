export default class {
  getQueue () {
    let queue = window.localStorage.getItem('queue')
    if (!queue) {
      queue = []
    }

    window.localStorage.setItem('queue', JSON.stringify(queue))

    this.queue = queue

    return this
  }

  addToQueue (object) {
    this.getQueue().push(object)
  }

  push (obj) {
    this.queue.push(obj)
    window.localStorage.setItem('queue', JSON.stringify(this.queue))
  }

  pop () {
    this.getQueue()
    if (this.queue.length){
      return this.queue.splice(0, 1)
    }
    return null
  }
}
