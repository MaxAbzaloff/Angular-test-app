import createStateProviderObj from '../../libs/createStateProviderObj'

function config ($stateProvider) {
  const state = createStateProviderObj('details', '/details/:id')

  $stateProvider
    .state(state.name, state.initObj)
};

export default config
