const Serve = {
  d1: 'd1',
  d2: 'd2',
  get () {

  },
  post ({d1, d2}) {
    const catchd1 = localStorage.getItem(this.d1)
    const catchd2 = localStorage.getItem(this.d2)
  }
}
