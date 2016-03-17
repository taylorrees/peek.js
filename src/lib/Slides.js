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
