import createStateProviderObj from '../../libs/createStateProviderObj'

function config ($stateProvider) {
  const state = createStateProviderObj('addressBook')

  $stateProvider
    .state(state.name, state.initObj)
};

export default config
