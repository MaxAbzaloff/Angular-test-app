function getWordsArray (name) {
  return name
    .match(/^([a-z]*[^A-Z])*|([A-Z]{1}[a-z]*)|(^[a-z]*$)/gm)
    .map(value => value.toLowerCase())
}

// function getCtrlName (array) {
//   return array.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join('') + 'Ctrl'
// }

function getNameWithDashes (array) {
  return array.join('-')
}

/**
 * Base fabric method to create ui route config.
 *
 * @typedef {Object} StateObject
 * @property {string} name - name of the object in angular module
 * @property {Object} initObj - object with all required fields
 *
 * @param {string} nameOfModule - name of the module in angular scope (camelCase format)
 * @param {string} [parent] - name of a parent state
 *
 * @return {StateObject} - ready for use StateProvider.state() config object
 */
export default function (nameOfModule, url = '/', parent = 'layout') {
  const wordsArray = getWordsArray(nameOfModule)
  const nameWithDashes = getNameWithDashes(wordsArray)

  return {
    name: nameOfModule,
    initObj: {
      parent,
      url: url,
      template: require(`../pages/${nameWithDashes}/${nameWithDashes}.template.html`),
      controller: require(`../pages/${nameWithDashes}/${nameWithDashes}.controller.js`).default,
      controllerAs: nameOfModule
    }
  }
}
