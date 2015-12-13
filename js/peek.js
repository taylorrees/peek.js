var Peek = (function() {

  /**
   * A set of required utilities for DOM and BOM manipulation.
   *
   */
  var utils = {

    appendClass : function(destination, classname) {
      /**
       * The function appends the class to the destination.
       *
       * @param {string} destination
       * @param {string} classname
       */

      return destination.className += ' ' + classname;
    },

    removeClass : function(source, classname) {
      /**
       * The function removes the class from the destination.
       *
       * @param {string} source
       * @param {string} classname
       */

      return source.className = source.className.replace(classname, '').trim();
    },

    getHash : function() {
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

    setHash : function(hash) {
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

    addHash : function(parameter, value) {
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

    removeHash : function(parameter) {
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

  };


  var Slides = {

    allSlides : document.querySelector('.peek .slides').children,
    previousSlideIndex : 0,
    currentSlideIndex  : 1,
    nextSlideIndex     : 2,

    increment : function () {
      /**
       * Add one to slide order, largest value is n slides + 1.
       *
       */
      if (this.nextSlideIndex < this.allSlides.length + 1) {
        this.previousSlideIndex  += 1;
        this.currentSlideIndex   += 1;
        this.nextSlideIndex      += 1;
      }
    },

    decrement : function () {
      /**
       * Remove one from slide order, smallest value is 0.
       *
       */
      if (this.previousSlideIndex > 0) {
        this.previousSlideIndex  -= 1;
        this.currentSlideIndex   -= 1;
        this.nextSlideIndex      -= 1;
      }
    },

    setIndexes : function () {
      /**
       * Add indexes to slides.
       *
       */
      var i;

      for (i = 0; i < this.allSlides.length; i++) {
        this.allSlides[i].dataset.index = i + 1;
      }
    },

    setLocations : function () {
      /**
       * Position all slides within the peek drawer.
       *
       */

      var slides = this.allSlides;
      var slide;
      var i;
      var setLocation = function(slide, location) {
        /**
         * Sets the location of a slide in the slideshow.
         *
         * @param {HTMLElement} slide
         * @param {string} location (left, right, current)
         */
        return slide.dataset.location = location;
      }

      for (i = 0; i < slides.length; i++) {
        slide = slides[i];

        if (slide.dataset.index < this.currentSlideIndex) {
          setLocation(slide, 'left');
        }
        else if (slide.dataset.index > this.currentSlideIndex) {
          setLocation(slide, 'right');
        }
        else {
          setLocation(slide, 'current');
        }
      }
    },

    setBackgrounds : function () {
      /**
       * Set the background image of slides with
       * data-background attribute.
       *
       */
      var slides = this.allSlides;
      var slide;
      var i;
      var setBackground = function(slide, url) {
        /**
         * Sets the background image of the slide.
         *
         * @param {HTMLElement} slide
         * @param {string} url
         */
        if (url) slide.style.backgroundImage = "url('" + url + "')";
      }

      for (i = 0; i < slides.length; i++) {
        slide = slides[i];
        setBackground(slide, slide.dataset.background);
      }
    },

    progressBar : function() {
      /**
       * Creates the progress bar.
       * Sets the percentage width of the progress bar.
       *
       */
      var current = this.currentSlideIndex;
      var len = this.allSlides.length;
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

      progressBar.style.width = ( ( (current - 1) / (len - 1) ) * 100 ) + '%';
    }

  };


  // Implementation

  var Peek = {

    isActive : function() {
      /**
       * Checks whether the peek drawer is open.
       *
       */
      var peek = document.querySelector('.peek');

      if (peek.className.indexOf('visible') != -1) {
        return true;
      }

      return false;
    },

    toggle : function() {
      /**
       * Toggles the state of the peek drawer (open / closed).
       *
       */
      var peek = document.querySelector('.peek');

      if (peek.className == 'peek') {
        utils.appendClass(peek, 'visible');
        utils.addHash('peek');
      } else {
        utils.removeClass(peek, 'visible');
        utils.removeHash('peek');
      }
    },

    next : function() {
      /**
       * Increments Slide indexes and displays the next slide.
       *
       */
      var slides = Slides;
      slides.increment();
      slides.setLocations();
      slides.progressBar();
      utils.addHash('pslide', slides.currentSlideIndex);
    },

    previous : function() {
      /**
       * Decrements slide indexes and displays the previous slide.
       *
       */
      var slides = Slides;
      slides.decrement();
      slides.setLocations();
      slides.progressBar();
      utils.addHash('pslide', slides.currentSlideIndex);
    },

    bindKeys : function() {
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
    },

    init : function() {
      /**
       * Starts Peek.
       *
       */
      var urlHash = utils.getHash();
      var slides = Slides;

      if (urlHash.pslide) {
        // `pslide` is used to keep hash unique
        // set index from pslide hash
        var pslide = parseInt(urlHash.pslide);
        slides.previousSlideIndex = pslide - 1;
        slides.currentSlideIndex  = pslide;
        slides.nextSlideIndex     = pslide + 1;
      }

      slides.setIndexes();
      slides.setLocations();
      slides.setBackgrounds();
      slides.progressBar();

      this.bindKeys();
      if (urlHash.peek === 'true') this.toggle();
    }

  };

  return Peek;

})();
