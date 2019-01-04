export default class LayoutCtrl {
  constructor ($state, MainService) {
    this.mainService = MainService
    this.$state = $state
    this.subs = []
    this.getSubs()
  }

  getSubs () {
    this.subs.push(this.mainService.$commonState.subscribe(newState => {
      this.title = newState.get('title')
    }))
  }
}
