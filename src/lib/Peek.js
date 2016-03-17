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
