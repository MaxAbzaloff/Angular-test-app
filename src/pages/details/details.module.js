import angular from 'angular'
import uirouter from '@uirouter/angularjs'

import routes from './details.routes'

import { MainService } from '../../services'

export default angular
  .module('app.details', [
    uirouter,
    MainService
  ])
  .config([
    '$stateProvider',
    routes
  ])
  .name
