import LayoutCtrl from './layout.controller'

function config ($stateProvider) {
  $stateProvider
    .state('layout', {
      template: require('./layout.template.html'),
      controller: LayoutCtrl,
      controllerAs: 'layout'
    })
};

export default config
