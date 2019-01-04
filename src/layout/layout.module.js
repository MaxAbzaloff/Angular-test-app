import angular from 'angular'
import uirouter from '@uirouter/angularjs'

import config from './layout.routes'

import { MainService } from '../services'

export default angular
  .module('app.layout', [
    uirouter,
    MainService
  ])
  .config(config)
  .name
