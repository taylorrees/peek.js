var Peek = (function() {

  // Library

  var appendClass = function(s, c) {
    // Accepts two strings: s and c.
    // The function appends the class 'c' to the source 's'

    return s.className += ' ' + c;
  }

  var removeClass = function(s, c) {
    // Accepts two strings: s and c.
    // The function removes the class 'c' from the source 's'

    return s.className = s.className.replace(c, '').trim();
  }

  var indexSlides = function(slides) {
    // Add indexes to slides
    for (var i = 0; i < slides.count; i++) {
      var slide = slides.list[i];
      slide.dataset.index = i + 1;
    }
  }

  var incrementSlides = function(slides) {
    // Add one to slide order, largest value is n slides + 1
    if (slides.next < slides.count + 1) {
      slides.previous += 1;
      slides.current += 1;
      slides.next += 1;
    }
  }

  var decrementSlides = function(slides) {
    // Remove one from slide order, smallest value is 0
    if (slides.previous > 0) {
      slides.previous -= 1;
      slides.current -= 1;
      slides.next -= 1;
    }
  }

  var setSlideLocation = function(slide, location) {
    // Accepts two strings: slide and location.
    return slide.dataset.location = location;
  }

  var setSlideLocations = function(slides) {
    // Position slides within the peek drawer.
    for (var i = 0; i < slides.count; i++) {
      var slide = slides.list[i];
      if (slide.dataset.index < slides.current) setSlideLocation(slide, 'left');
      else if (slide.dataset.index > slides.current) setSlideLocation(slide, 'right');
      else setSlideLocation(slide, 'current');
    }
  }

  var showProgress = function(slides) {
    // Sets the width of the progress bar.
    var progress = document.querySelector('.peek .progress span');
    var percentage = ((slides.current - 1) / (slides.count- 1) ) * 100;
    progress.style.width = percentage + '%';
  }

  var isPeekActive = function() {
    // Checks whether the peek drawer is open.
    var peek = document.querySelector('.peek');
    if (peek.className.indexOf('visible') != -1) return true;
    return false;
  };

  var bindClickableKeys = function() {
    // Binds clickable keys with actions.
    document.onkeydown = function(e) {
      if (e.ctrlKey && e.shiftKey && e.keyCode == '191') Peek.toggle(); // Ctrl + ?
      if (isPeekActive() == true) {
        if (e.keyCode == '40' || e.keyCode == '27') Peek.toggle(); // down arrow or Esc
        if (e.keyCode == '37') Peek.previous(); // left arrow
        if (e.keyCode == '39' || e.keyCode == '32') Peek.next(); // right arrow
      }
    };
  };

  var setSlideBackground = function(slide, url) {
    // Sets the background image of the slide.
    if (url) slide.style.backgroundImage = "url('" + url + "')";
  };

  var setBackgrounds = function(slides) {
    // Sets the background image of slides with data-background attribute.
    for (var i = 0; i < slides.count; i++) {
      var slide = slides.list[i];
      setSlideBackground(slide, slide.dataset.background);
    }
  };

  var getNavigationButtons = function() {
    // Get the navigation buttons from the DOM
    var peakControls = document.querySelector('.peek-controls');
    return {
      previous: peakControls.children[0],
      toggle: peakControls.children[1],
      next: peakControls.children[2]
    };
  }

  var bindNavigationButtons = function(previous, toggle, next) {
    // Binds the click event for navigation button click.
    previous.onclick = function() { Peek.previous() };
    toggle.onclick = function() { Peek.toggle() };
    next.onclick = function() { Peek.next() };
  };

  var toggleControls = function() {
    // Shows peek navigation buttons when drawer is open.
    var navigationButtons = getNavigationButtons();
    // Check when drawer is closed
    if (isPeekActive() == false) {
      // On click, when drawer closed -> draw will open -> show controls
      navigationButtons.previous.style.display = 'inline';
      navigationButtons.next.style.display = 'inline';
    } else {
      // On click, when drawer open -> draw will close -> hide controls
      navigationButtons.previous.style.display = 'none';
      navigationButtons.next.style.display = 'none';
    }
  };

  // Small library to get, add and remove hash values to / from url.
  var Hash = {
    get : function() {
      // Gets the URL parameters and returns their value.
      var result = {};
      var hash = window.location.hash.split('#');
      for (var i = 0; i < hash.length; i++) {
        var query = hash[i].split('=');
        // parameter = value
        if (query[0] != '') result[query[0]] = query[1] != undefined ? query[1] : true;
      }
      // returns object of hashes and their values
      return result;
    },
    add : function(parameter, value) {
      // Adds to hash in the form #parameter=value (value is optional)
      var hash = Hash.get();
      var newHash = '';
      hash[parameter] = value ? value : true;
      for (query in hash) {
        newHash = newHash + '#' + query + '=' + hash[query];
      }
      window.location.hash = newHash;
    },
    remove : function(parameter) {
      var hash = Hash.get();
      var newHash = '';
      delete hash[parameter];
      for (query in hash) {
        newHash = newHash + '#' + query + '=' + hash[query];
      }
      window.location.hash = newHash;
    }
  };

  // DOM Injection

  var injectProgressBar = function() {
    // Add the progress bar to peek drawer.
    // Injects: <div class="progress"><span></span></div>
    var peek = document.querySelector('.peek');
    var progress = document.createElement('div');
    var progressBar = document.createElement('span');
    progress.className = 'progress';
    progress.appendChild(progressBar);
    peek.appendChild(progress);
  };

  var injectControls = function() {
    // Add the peek navigation bar to DOM.
    // Injects: <div class="peek-controls"><a>&larr;</a><a>Peek</a><a>&rarr;</a></div>
    var peekControls = document.createElement('div');
    peekControls.className = 'peek-controls';
    // previous
    var previousButton = document.createElement('a');
    previousButton.innerHTML = '&larr;';
    // toggle
    var toggleButton = document.createElement('a');
    toggleButton.innerHTML = 'Peek';
    // next
    var nextButton = document.createElement('a');
    nextButton.innerHTML = '&rarr;';

    peekControls.appendChild(previousButton);
    peekControls.appendChild(toggleButton);
    peekControls.appendChild(nextButton);

    // add click events
    bindNavigationButtons(previousButton, toggleButton, nextButton);
    document.body.appendChild(peekControls);
  };

  // Implementation

  var toggle = function() {
    // Toggles the state of the peek drawer (open / closed)
    toggleControls();
    var peek = document.querySelector('.peek');
    if (peek.className == 'peek') {
      appendClass(peek, 'visible');
      Hash.add('peek');
    } else {
      removeClass(peek, 'visible');
      Hash.remove('peek');
    }
  };

  var next = function() {
    // Moves to and displays the next slide.
    incrementSlides(Peek.slides);
    setSlideLocations(Peek.slides);
    showProgress(Peek.slides);
    Hash.add('pslide', Peek.slides.current);
  };

  var previous = function() {
    // Moves to and displays the previous slide.
    decrementSlides(Peek.slides);
    setSlideLocations(Peek.slides);
    showProgress(Peek.slides);
    Hash.add('pslide', Peek.slides.current);
  };

  var init = function(options) {
    // Starts Peek.
    var urlHash = Hash.get();
    // pslide used to keep hash unique
    if (urlHash.pslide) {
      // set index from pslide hash
      var current = parseInt(urlHash.pslide);
      Peek.slides.previous = current - 1;
      Peek.slides.current = current;
      Peek.slides.next = current + 1;
    }
    indexSlides(Peek.slides);
    setSlideLocations(Peek.slides);
    injectControls();
    injectProgressBar();
    showProgress(Peek.slides);
    bindClickableKeys();
    setBackgrounds(Peek.slides);
    // if peek is param --> show peek
    if (urlHash.peek == 'true') Peek.toggle();
  };

  var Peek = {};

  Peek.slides = {};
  Peek.slides.list = document.querySelector('.peek .slides').children;
  Peek.slides.count     = Peek.slides.list.length;
  Peek.slides.previous  = 0;
  Peek.slides.current   = 1;
  Peek.slides.next      = 2;
  Peek.toggle           = toggle;
  Peek.next             = next;
  Peek.previous         = previous;
  Peek.init             = init;

  // Initilization

  return Peek;

})();
