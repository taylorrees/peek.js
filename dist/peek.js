(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Name: Peek.js
 * Author: Taylor Rees
 *
 * Responsible for all actions relating to the
 * Peek drawer. The Peek class is bound to the
 * window object at the bottom of this file.
 *
 */

var Slides  = require('./Slides');
var Utils   = require('./Utils');

var Peek = function(peek) {
  /**
   * Constructs the Peek object.
   * Accepts an optional parameter to explicitly
   * specify which peek container should make up
   * the Peek object. This allows for multiple
   * instances.
   *
   * @param {HTMLElement} peek
   */

   var urlhash = Utils.getHash();

   /**
    * If peek container provided, set peek container
    * of the instance to that container, otherwise
    * set to the default.
    *
    */
   this.peek = (peek) ? peek : document.querySelector('.peek');
   /**
    * Instantiate Slides object with the Peek slides.
    *
    * Parent  | First Child | N Slides
    * -------->------------->----------------
    * .peek   | .slides     | section (slide)
    */
   this.slides = new Slides(this.peek.children[0].children);

   if (urlhash.pslide) {
     /**
      * Set the current slide index according to the
      * value of the 'pslide' fragment identifier.
      *
      */
     this.slides.setCurrent(parseInt(urlhash.pslide));
   } else {
     /**
      * Set the current slide index to the start
      * position of the walkthrough.
      */
      this.slides.setCurrent(0);
   }

   this.bindKeys();
   this.bindControls();

   if (urlhash.peek === 'true') {
     this.toggle();
   }

};

Peek.prototype.isActive = function() {
  /**
   * Checks whether the peek drawer is open.
   *
   * @return {boolean}
   */

   if (this.peek.className.indexOf('visible') != -1) {
     return true;
   }

   return false;
};

Peek.prototype.toggle = function() {
  /**
   * Toggles the state of the peek drawer
   * (open / closed).
   *
   */

  if (this.peek.className == 'peek') {
    Utils.appendClass(this.peek, 'visible');
    Utils.addHash('peek');
  } else {
    Utils.removeClass(this.peek, 'visible');
    Utils.removeHash('peek');
  }
};

Peek.prototype.next = function() {
  /**
   * Increments Slide indexes and displays
   * the next slide but only if the peek
   * drawer is open.
   *
   */

  if (this.isActive()) {
    this.slides.increment();
    Utils.addHash('pslide', '' + this.slides.getIndexes().current);
  }
};

Peek.prototype.previous = function() {
  /**
   * Decrements slide indexes and displays
   * the previous slide but only if the peek
   * drawer is open.
   *
   */

  if (this.isActive()) {
    this.slides.decrement();
    Utils.addHash('pslide', '' + this.slides.getIndexes().current);
  }
};

Peek.prototype.bindKeys = function() {
  /**
   * Binds clickable keys with actions.
   *
   */

  var peek = this;

  document.onkeydown = function(e) {

    // Combination click: Ctrl + ?
    if (e.ctrlKey && e.shiftKey && e.keyCode == '191') {
      peek.toggle();
    }

    if (peek.isActive()) {

      // Down arrow or Esc key click.
      if (e.keyCode == '40' || e.keyCode == '27') {
        peek.toggle();
      }

      // Left arrow click.
      if (e.keyCode == '37') {
        peek.previous();
      }

      // Right arrow click.
      if (e.keyCode == '39' || e.keyCode == '32') {
        peek.next();
      }
    }
  };
};

Peek.prototype.bindControls = function() {

  var previous = document.querySelectorAll('[data-peek-previous]');
  var next = document.querySelectorAll('[data-peek-next]');
  var toggle = document.querySelectorAll('[data-peek-toggle]');

  function bindControl(elements, callback) {
    /**
     * @param {HTMLCollection} elements
     * @param {function} control
     *
     * A small function to bind a function
     * to each a click event on each
     * HTMLElement in a collection of
     * elements.
     */

    var i = 0;

    for (i = 0; i < elements.length; i++) {
      elements[i].onclick = function(e) {
        callback();
      }
    }
  }

  bindControl(toggle, this.toggle.bind(this));
  bindControl(next, this.next.bind(this));
  bindControl(previous, this.previous.bind(this));

};

Peek.prototype.destroy = function() {
  /**
   * A method to destroy the current instance
   * of the peek walkthrough. This will allow
   * a new instance to be created without conflict.
   * It does this by removing the HTMLElement.
   */

   this.peek.parentNode.removeChild(this.peek);
   Utils.addHash('pslide', '0');
}

// Bind Peek to window.
window.Peek = Peek;

},{"./Slides":2,"./Utils":3}],2:[function(require,module,exports){
/**
 * Name: Slides.js
 * Author: Taylor Rees
 *
 * Responsible for all slide related actions
 * within the Peek library. The Slides class is
 * exported at the bottom of the file.
 *
 */

var Slides = function(slides) {
  /**
   * Constructs the Slides object.
   *
   * @param {HTMLElements} slides
   */

  this.slides = slides;
  this.previousIndex  = -1;
  this.currentIndex   = 0;
  this.nextIndex      = 1;
}

Slides.prototype.forEach = function(callback) {
  /**
   * A method to loop through each slide in
   * the slide drawer and execute the callback
   * with the current slide as a parameter.
   *
   * @param {function} callback
   */

  var i = 0;

  for (i = 0; i < this.getSize(); i++) {
    /**
     * Invokes a callback with two params.
     *
     * @param {HTMLElement}
     * @param {integer}
     */
    callback(this.getAll()[i], i);
  }
};

Slides.prototype.getAll = function() {
  /**
   * A method to get all the slide elements in the
   * current drawer.
   *
   * @return {HTMLCollection}
   */

  return this.slides;
};

Slides.prototype.getPrevious = function() {
  /**
   * @returns {HTMLElement}
   *
   * Gets the previous slide element and returns it
   *
   */

   return this.getAll()[this.getIndexes().previous];
}

Slides.prototype.getCurrent = function() {
  /**
   * @returns {HTMLElement}
   *
   * Gets the current slide element and returns it
   *
   */

   return this.getAll()[this.getIndexes().current];
}

Slides.prototype.getNext = function() {
  /**
   * @returns {HTMLElement}
   *
   * Gets the next slide element and returns it
   *
   */

   return this.getAll()[this.getIndexes().next];
}

Slides.prototype.getIndexes = function () {
  /**
   * A method to get the indexes of the previous,
   * current and next slides in the drawer. Returns
   * and object in the form {previous, current, next}.
   *
   * @return {object}
   */

  return {
    previous: this.previousIndex,
    current:  this.currentIndex,
    next:     this.nextIndex
  }
};

Slides.prototype.getSize = function () {
  /**
   * A method to get the number of slides
   * in the drawer.
   *
   * @return {integer}
   */

  return this.getAll().length;
};

Slides.prototype.setCurrent = function (index) {
  /**
   * A method to set the index of the current
   * slide in the drawer. This will set the indexes
   * of the previos and next slides relative to the
   * current slide index. It will only set the index
   * if the index is within range.
   *
   * @param {integer} index
   */

  if (index > -1 && index < this.getSize()) {
    this.currentIndex   = index;
    this.previousIndex  = index - 1;
    this.nextIndex = index + 1;
    this.setIndexes();
    this.setLocations();
    this.setBackgrounds();
    this.setProgress();
  }
};

Slides.prototype.setIndexes = function() {
  /**
   * Add indexes to slides.
   *
   */

   this.forEach(function(slide, i) {
     slide.dataset.index = i;
   });
};

Slides.prototype.setLocations = function() {
  /**
   * Position all slides within the peek drawer.
   *
   */

   var currentIndex = this.getIndexes().current;
   var setLocation = function(slide, location) {
     /**
      * Sets the location of a slide in the slideshow.
      *
      * @param {HTMLElement} slide
      * @param {string} location (left, right, current)
      */
     return slide.dataset.location = location;
   }

   this.forEach(function(slide) {

     if (slide.dataset.index < currentIndex) {
       setLocation(slide, 'left');
     }
     else if (slide.dataset.index > currentIndex) {
       setLocation(slide, 'right');
     }
     else {
       setLocation(slide, 'current');
     }

   });
};

Slides.prototype.setBackgrounds = function() {
  /**
   * Set the background image of slides with
   * data-background attribute.
   *
   */

   var setBackground = function(slide, url) {
     /**
      * Sets the background image of the slide.
      *
      * @param {HTMLElement} slide
      * @param {string} url
      */
     if (url) slide.style.backgroundImage = "url('" + url + "')";
   }

   this.forEach(function(slide) {
     setBackground(slide, slide.dataset.background);
   });
};

// Move this to Peek class
Slides.prototype.setProgress = function() {
  /**
   * Creates the progress bar.
   * Sets the percentage width of the progress bar.
   *
   */

   var current = this.getIndexes().current;
   var len = this.getSize();
   var progressBar = document.querySelector('.peek .progress span');

   if (!progressBar) {
     progressBar = (function createProgressBar() {
       /**
        * Add the progress bar to peek drawer.
        * Injects: <div class="progress"><span></span></div>
        *
        */
       var peek = document.querySelector('.peek');
       var progress = document.createElement('div');
       var progressBar = document.createElement('span');

       progress.className = 'progress';
       progress.appendChild(progressBar);
       peek.appendChild(progress);

       return progressBar;
     })();
   }

   progressBar.style.width = ( ( (current) / (len - 1) ) * 100 ) + '%';
};

Slides.prototype.increment = function () {
  /**
   * Add one to slide order, largest value is
   * n slides + 1.
   *
   */

  this.setCurrent(this.getIndexes().current + 1);
};

Slides.prototype.decrement = function () {
  /**
   * Remove one from slide order, smallest
   * value is 0.
   *
   */

  this.setCurrent(this.getIndexes().current - 1);
};

module.exports = Slides;

},{}],3:[function(require,module,exports){
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

},{}]},{},[1]);
