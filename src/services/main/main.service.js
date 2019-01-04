import { BehaviorSubject } from 'rxjs'
import ApolloClient from 'apollo-boost'
import { Map, List } from 'immutable'
import _ from 'lodash'

import getAccounts from './graphql/queries/getAccounts.graphql'
import addAccount from './graphql/queries/addAccount.graphql'
import removeAccount from './graphql/queries/removeAccount.graphql'

const ACCOUNT_INPUT = [
  'id',
  'lastname',
  'firstname',
  'middlename',
  'avatar',
  'email',
  'phone'
]

const QUERY_ACTIONS_MAP = {
  addAccount: 'AddAccount',
  removeAccount: 'RemoveAccount',
  getAccounts: 'GetAccounts'
}

export default class MainService {
  constructor () {
    this.$commonState = new BehaviorSubject(this.initState())
    this.$accounts = new BehaviorSubject(List([]))
    this.client = new ApolloClient({
      uri: '/api',
      fetchPolicy: 'network-only'
    })
  }

  initState () {
    return Map({
      title: 'default title',
      selected_account: {},
      selected_account_id: '',
      perPage: 10,
      page: 1,
      pagesAmount: 1,
      accountsToShow: []
    })
  }

  getPage () {
    return this.$commonState.value.get('page')
  }

  getAccounts (page = this.$commonState.value.get('page'), perPage = 10) {
    this.client.query({
      query: getAccounts,
      variables: {
        perPage,
        page
      }
    }).then(
      answer => this.handleAnswer(answer),
      err => console.error(err)
    )
  }

  getAccount (query) {
    if (Object.keys(query).includes('id')) {
      this.changeState('selected_account_id', query.id)
      const account = this.$accounts.value.find(value => value.id === query.id)
      this.changeState('selected_account', account)
    }
  }

  changeState (key, value) {
    if (this.$commonState.value.has(key)) {
      if (key === 'page' && value >= 1 && value <= this.$commonState.value.get('pagesAmount')) {
        this.$commonState.next(this.$commonState.value.set('page', value))
        this.getAccounts(value)
      } else if (key !== 'page') {
        this.$commonState.next(this.$commonState.value.set(key, value))
      }
    }
  }

  createFilteredAccountObj (account) {
    const filteredAccount = Object.assign({}, account)

    _.forEach(Object.keys(filteredAccount), key => {
      if (!ACCOUNT_INPUT.includes(key)) {
        delete filteredAccount[key]
      }
    })

    _.forEach(ACCOUNT_INPUT, key => {
      if (!Object.keys(filteredAccount).includes(key)) {
        filteredAccount[key] = ''
      }
    })

    return filteredAccount
  }

  handleRemoveAccount (data) {
    if (data.hasError) {
      console.error(data)
      return
    }

    // this.removeAccountFromStateArray(data)
    this.getAccounts()
  }

  handleAddAccount (data) {
    if (data.hasError) {
      console.error(data)
      return
    }

    this.pushToArray(data)
  }

  handleGetAccounts (data) {
    if (data.hasError) {
      console.error(data)
      return
    }

    this.pushToArray(data.accounts)
    this.$commonState.next(this.$commonState.value.set('accountsToShow', data.accounts))
    this.$commonState.next(this.$commonState.value.set('pagesAmount', data.pagesAmount))
  }

  handleAnswer (answer) {
    _.forEach(Object.keys(QUERY_ACTIONS_MAP), action => {
      if (Object.keys(answer.data).includes(action)) {
        this[`handle${QUERY_ACTIONS_MAP[action]}`](answer.data[action])
      }
    })
  }

  addAccount (account) {
    this.client.mutate({
      mutation: addAccount,
      variables: {
        account: this.createFilteredAccountObj(account)
      },
      update: (proxy, { data: { addAccount } }) => {
        const data = proxy.readQuery({
          query: getAccounts,
          variables: {
            perPage: this.$commonState.value.get('perPage'),
            page: this.$commonState.value.get('page')
          }
        })

        console.log(data)
      }
    }).then(
      answer => this.handleAnswer(answer),
      err => console.error(err)
    )
  }

  removeAccount (account) {
    this.client.mutate({
      mutation: removeAccount,
      variables: {
        account: this.createFilteredAccountObj(account)
      }
    }).then(
      answer => this.handleAnswer(answer),
      err => console.error(err)
    )
  }

  pushToArray (value) {
    if (Array.isArray(value) && this.$accounts.value.isEmpty()) {
      this.$accounts.next(List.of(...value))
    } else if (Array.isArray(value)) {
      const page = this.$commonState.value.get('page')
      const perPage = this.$commonState.value.get('perPage')
      let arr = this.$accounts.value

      value.map((elem, idx) => {
        arr = arr.setIn([(page - 1) * perPage + idx], elem)
      })

      this.$accounts.next(List.of(...arr))
    } else {
      this.$accounts.next(this.$accounts.value.push(value))
    }

    // this.$commonState.next(this.$commonState.value.set('accountsToShow', value))
    this.updateAccountsToShow()
  }

  updateAccountsToShow () {
    const page = this.$commonState.value.get('page')
    const perPage = this.$commonState.value.get('perPage')
    const accountsToShow = this.$accounts.value.slice((page - 1) * perPage, page * perPage)
    console.log(accountsToShow)
    this.$commonState.next(this.$commonState.value.set('accountsToShow', accountsToShow))
  }

  // removeAccountFromStateArray (value) {
  //   const idx = this.$accounts.value.findIndex(v => v.id === value.id)
  //   if (idx > -1) {
  //     this.$accounts.next(this.$accounts.value.delete(idx))
  //   }
  // }
}
