import _ from 'lodash'

export default class AddressBookCtrl {
  constructor ($state, MainService, $mdDialog, $mdToast) {
    this.$mdDialog = $mdDialog
    this.$state = $state
    this.toast = $mdToast
    this.mainService = MainService
    this.accounts = []
    this.subs = []
    this.init()
  }

  init () {
    this.subs.push(
      this.mainService.$commonState.subscribe(state => {
        this.accounts = state.get('accountsToShow')
      })
    )

    this.mainService.changeState('title', 'Address Book')
    this.changePage(this.mainService.getPage())
  }

  unsubscribeAll () {
    _.forEach(this.subs, sub => sub.unsubscribe())
  }

  removeAccount ($event, account) {
    this.$mdDialog.show(
      this.$mdDialog
        .confirm()
        .title('REMOVE ACCOUNT')
        .textContent('Are you sure you want to continue deleting account?')
        .ok('Continue')
        .cancel('Cancel')
        .targetEvent($event)
    ).then(
      onfullfield => this.mainService.removeAccount(account),
      onreject => {}
    )
  }

  addAccount ($event) {
    this.$mdDialog.show({
      template: require('./add-account-form.template.html'),
      autoWrap: true,
      fullscreen: true,
      locals: {
        raiseErrorMsg: () => {
          this.toast.show(
            this.toast
              .simple()
              .position('top right')
              .textContent('Validation error! Please check fullfield inputs.')
          )
        }
      },
      controller: function ($scope, $mdDialog, locals) {
        this.dialog = $mdDialog
        this.scope = $scope
        this.account = {}
        this.onConfirm = () => {
          if (this.scope.addAccountForm.$valid) {
            this.dialog.hide(this.account)
            return
          }
          locals.raiseErrorMsg()
        }
        this.onCancel = () => {
          this.dialog.cancel()
        }
      },
      controllerAs: 'addAccount'
    }).then(
      onfullfield => this.mainService.addAccount(onfullfield),
      onreject => {}
    )
  }

  changePage (page) {
    this.mainService.changeState('page', page)
    this.page = this.mainService.getPage()
  }

  doubleClick ($event, account) {
    $event.stopPropagation()
    this.goToDetails(account.id)
  }

  goToDetails (id) {
    this.unsubscribeAll()
    this.$state.go('details', { id })
  }
}
