import _ from 'lodash'

export default class DetailsCtrl {
  constructor ($state, MainService) {
    this.mainService = MainService
    this.account = this.mainService.$commonState.value.get('selected_account')
    this.$state = $state
    this.subs = []
    this.init()
  }

  init () {
    this.subs.push(
      this.mainService.$commonState.subscribe(state => { this.account = state.get('selected_account') })
    )

    this.mainService.changeState('title', 'Details')

    this.mainService.getAccount({
      id: this.$state.params.id
    })
  }

  unsubscribeAll () {
    _.forEach(this.subs, sub => sub.unsubscribe())
  }

  goBack () {
    this.unsubscribeAll()
    this.$state.go('addressBook')
  }
}
