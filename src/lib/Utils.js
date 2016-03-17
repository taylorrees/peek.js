/**
 * A set of required utilities for DOM and BOM manipulation.
 *
 */

module.exports = {

  appendClass: function(destination, classname) {
    /**
     * The function appends the class to the destination.
     *
     * @param {string} destination
     * @param {string} classname
     */

    return destination.className += ' ' + classname;
  },

  removeClass: function(source, classname) {
    /**
     * The function removes the class from the destination.
     *
     * @param {string} source
     * @param {string} classname
     */

    return source.className = source.className.replace(classname, '').trim();
  },

  getHash: function() {
    /**
     * Gets the URL parameters and returns their value.
     *
     * @return {object}
     */
    var result = {};
    var hash = window.location.hash.split('#');
    var query;
    var i;

    for (i = 0; i < hash.length; i++) {
      query = hash[i].split('=');
      // parameter = value
      if (query[0] != '') {
        result[query[0]] = query[1] != undefined ? query[1] : true;
      }
    }

    return result;
  },

  setHash: function(hash) {
    /**
     * Writes the key, value pairs as hash.
     * e.g. #key=value
     *
     * @param {object} hash
     */
    var newHash = '';

    for (query in hash) {
      newHash = newHash + '#' + query + '=' + hash[query];
    }
    window.location.hash = newHash;
  },

  addHash: function(parameter, value) {
    /**
     * Add parameter, value (optional) to existing hash.
     *
     * @param {string} parameter
     * @param {string} value
     */
    var hash = this.getHash();
    hash[parameter] = value ? value : true;
    this.setHash(hash);
  },

  removeHash: function(parameter) {
    /**
     * Removes parameter from existing hash.
     *
     * @param {string} parameter
     * @param {string} value
     */
    var hash = this.getHash();
    delete hash[parameter];
    this.setHash(hash);
  }

}
