import angular from 'angular'
import uirouter from '@uirouter/angularjs'
import ngModule from 'angular-material'

import routes from './address-book.routes'

import './address-book.styles.scss'

import { MainService } from '../../services'

export default angular
  .module('app.addressBook', [
    uirouter,
    ngModule,
    MainService
  ])
  .config([
    '$stateProvider',
    routes
  ])
  .name
