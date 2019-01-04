import angular from 'angular'
import uirouter from '@uirouter/angularjs'
import ngMaterial from 'angular-material'
import ngAria from 'angular-aria'
import ngAnimate from 'angular-animate'
import ngMessages from 'angular-messages'

import '../node_modules/angular-material/angular-material.scss'

import config from './app.config'
import layout from './layout/layout.module'
import {
  addressBookPage,
  detailsPage
} from './pages'

import './app.scss'

angular
  .module('app', [
    uirouter,
    ngAria,
    ngAnimate,
    ngMessages,
    ngMaterial,
    addressBookPage,
    detailsPage,
    layout
  ])
  .config([
    '$urlRouterProvider',
    '$locationProvider',
    config
  ])
