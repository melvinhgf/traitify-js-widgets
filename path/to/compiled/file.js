// Generated by CoffeeScript 1.8.0
(function() {
  this.Traitify = new (function() {
    this.host = "https://api.traitify.com";
    this.version = "v1";
    this.testMode = false;
    this.setTestMode = function(mode) {
      this.testMode = mode;
      return this;
    };
    this.setHost = function(host) {
      host = host.replace("http://", "").replace("https://", "");
      host = "https://" + host;
      this.host = host;
      return this;
    };
    this.setPublicKey = function(key) {
      this.publicKey = key;
      return this;
    };
    this.setVersion = function(version) {
      this.version = version;
      return this;
    };
    this.ajax = function(url, method, callback, params) {
      var xhr;
      url = "" + this.host + "/" + this.version + url;
      xhr = new XMLHttpRequest();
      if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
      } else if (typeof XDomainRequest !== "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
      } else {
        console.log("There was an error making the request.");
        xhr = null;
      }
      xhr;
      xhr.open(method, url, true);
      xhr.setRequestHeader("Authorization", "Basic " + btoa(this.publicKey + ":x"));
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onload = function() {
        var data;
        data = JSON.parse(xhr.response);
        callback(data);
        return false;
      };
      xhr.send(params);
      xhr;
      return this;
    };
    this.put = function(url, params, callback) {
      this.ajax(url, "PUT", callback, params);
      return this;
    };
    this.get = function(url, callback) {
      this.ajax(url, "GET", callback, "");
      return this;
    };
    this.getDecks = function(callBack) {
      this.get("/decks", function(data) {
        return callBack(data);
      });
      return this;
    };
    this.getSlides = function(id, callBack) {
      this.get("/assessments/" + id + "/slides", function(data) {
        return callBack(data);
      });
      return this;
    };
    this.addSlide = function(assessmentId, slideId, value, timeTaken, callBack) {
      this.put("/assessments/" + assessmentId + "/slides/" + slideId, JSON.stringify({
        "response": value,
        "time_taken": timeTaken
      }), function(data) {
        return callBack(data);
      });
      return this;
    };
    this.addSlides = function(assessmentId, values, callBack) {
      this.put("/assessments/" + assessmentId + "/slides", JSON.stringify(values), function(data) {
        return callBack(data);
      });
      return this;
    };
    this.getPersonalityTypes = function(id, callBack) {
      this.get("/assessments/" + id + "/personality_types", function(data) {
        return callBack(data);
      });
      return this;
    };
    this.getPersonalityTraits = function(id, callBack) {
      this.get("/assessments/" + id + "/personality_traits", function(data) {
        return callBack(data);
      });
      return this;
    };
    this.getPersonalityTypesTraits = function(assessmentId, personalityTypeId, callBack) {
      this.get("/assessments/" + assessmentId + "/personality_types/" + personalityTypeId + "/personality_traits", function(data) {
        return callBack(data);
      });
      return this;
    };
    this.ui = Object();
    return this;
  })();

  Traitify.ui.slideDeck = function(assessmentId, selector, options) {
    var Builder, selectedObject, touched;
    Builder = Object();
    Builder.nodes = Object();
    Builder.states = Object();
    Builder.states.animating = false;
    Builder.data = Object();
    Builder.data.slideResponses = Object();
    Builder.states.finished = false;
    if (typeof options === "undefined") {
      options = Object();
    }
    if (navigator.userAgent.match(/iPad/i)) {
      Builder.device = "ipad";
    }
    if (navigator.userAgent.match(/iPhone/i)) {
      Builder.device = "iphone";
    }
    if (navigator.userAgent.match(/Android/i)) {
      Builder.device = "android";
    }
    if (navigator.userAgent.match(/BlackBerry/i)) {
      Builder.device = "blackberry";
    }
    if (navigator.userAgent.match(/webOS/i)) {
      Builder.device = "webos";
    }
    if (typeof selector !== "string") {
      Builder.nodes.main = document.createElement("div");
      document.getElementsByTagName("body")[0].appendChild(Builder.nodes.main);
    } else if (selector.indexOf("#") !== -1) {
      selector = selector.replace("#", "");
      Builder.nodes.main = document.getElementById(selector);
    } else {
      selector = selector.replace(".", "");
      selectedObject = document.getElementsByClassName(selector);
      Builder.nodes.main = selectedObject ? selectedObject[0] : null;
    }
    if (!Builder.nodes.main) {
      console.log("YOU MUST HAVE A TAG WITH A SELECTOR FOR THIS TO WORK");
      return false;
    }
    Builder.classes = function() {
      var classes, key;
      classes = Builder.main.className.split(" ");
      for (key in classes) {
        classes[key] = "." + classes[key];
      }
      return classes.join("");
    };
    Builder.data.slidesLeft = function() {
      return Builder.data.slides.length - Builder.data.currentSlide;
    };
    Builder.data.slideValues = Array();
    Builder.data.addSlide = function(id, value) {
      Builder.data.lastSlideTime = Builder.data.currentSlideTime;
      Builder.data.currentSlideTime = new Date().getTime();
      Builder.data.slideValues.push({
        id: id,
        response: value,
        time_taken: Builder.data.currentSlideTime - Builder.data.lastSlideTime
      });
      Builder.data.sentSlides += 1;
      if (Builder.data.slideValues.length % 10 === 0 || Builder.data.sentSlides === Builder.data.slidesToPlayLength) {
        return Traitify.addSlides(assessmentId, Builder.data.slideValues, function(response) {
          if (Builder.callbacks.addSlide) {
            Builder.callbacks.addSlide(Builder);
          }
          if (Builder.data.sentSlides === Builder.data.slidesToPlayLength) {
            Builder.nodes.main.innerHTML = "";
            if (options.showResults !== false) {
              Traitify.ui.resultsDefault(assessmentId, selector, options);
            }
            if (Builder.callbacks.finished) {
              return Builder.callbacks.finished(Builder);
            }
          }
        });
      }
    };
    Builder.partials = Object();
    Builder.partials.make = function(elementType, attributes) {
      var attributeName, element;
      element = document.createElement(elementType);
      for (attributeName in attributes) {
        element.setAttribute(attributeName, attributes[attributeName]);
      }
      return element;
    };
    Builder.partials.div = function(attributes) {
      return this.make("div", attributes);
    };
    Builder.partials.img = function(attributes) {
      return this.make("img", attributes);
    };
    Builder.partials.i = function(attributes) {
      return this.make("i", attributes);
    };
    Builder.data.getProgressBarNumbers = function(initialize) {
      var currentLength, currentPosition, slideLength, value;
      slideLength = Builder.data.totalSlideLength;
      currentLength = Builder.data.slides.length;
      currentPosition = Builder.data.sentSlides;
      if (initialize !== "initializing") {
        currentPosition += 1;
      }
      value = slideLength - currentLength + currentPosition;
      return (value / Builder.data.totalSlideLength) * 100;
    };
    Builder.partials.slideDeckContainer = function() {
      var cover, slidesContainer, slidesLeft;
      slidesContainer = this.div({
        "class": "tf-slide-deck-container"
      });
      cover = this.div({
        "class": "cover"
      });
      cover.innerHTML = "Landscape mode is not currently supported";
      slidesContainer.appendChild(cover);
      slidesLeft = Builder.data.getProgressBarNumbers("initializing");
      slidesContainer.appendChild(Builder.partials.progressBar(slidesLeft));
      slidesContainer.appendChild(this.slides(Builder.data.slides));
      slidesContainer.appendChild(this.meNotMe());
      return slidesContainer;
    };
    Builder.partials.meNotMe = function() {
      var meNotMeContainer;
      meNotMeContainer = this.div({
        "class": "me-not-me-container"
      });
      Builder.nodes.me = this.div({
        "class": "me"
      });
      Builder.nodes.notMe = this.div({
        "class": "not-me"
      });
      Builder.nodes.notMe.innerHTML = "Not Me";
      Builder.nodes.me.innerHTML = "Me";
      meNotMeContainer.appendChild(Builder.nodes.me);
      meNotMeContainer.appendChild(Builder.nodes.notMe);
      Builder.nodes.meNotMeContainer = meNotMeContainer;
      return meNotMeContainer;
    };
    Builder.partials.slides = function(slidesData) {
      var placeHolderSlide, slides;
      slides = this.div({
        "class": "slides"
      });
      placeHolderSlide = Builder.partials.slide(slidesData[0]);
      placeHolderSlide.className += " placeholder";
      slides.appendChild(placeHolderSlide);
      Builder.nodes.currentSlide = Builder.partials.slide(slidesData[0]);
      Builder.nodes.currentSlide.className += " active";
      slides.appendChild(Builder.nodes.currentSlide);
      if (slidesData[1]) {
        Builder.nodes.nextSlide = Builder.partials.slide(slidesData[1]);
        slides.appendChild(Builder.nodes.nextSlide);
      } else {
        Builder.nodes.nextSlide = false;
      }
      Builder.nodes.slides = slides;
      return slides;
    };
    Builder.partials.slide = function(slideData) {
      var slide, slideCaption, slideImg;
      slide = this.div({
        "class": "slide"
      });
      slideCaption = this.div({
        "class": "caption"
      });
      slideCaption.innerHTML = slideData.caption;
      if (Builder.device) {
        slideImg = this.div({
          style: "background-image:url('" + slideData.image_desktop_retina + "'); background-position:" + slideData.focus_x + "% " + slideData.focus_y + "%;'",
          "class": "image"
        });
        slideImg.appendChild(slideCaption);
      } else {
        slideImg = this.img({
          src: slideData.image_desktop_retina
        });
        slide.appendChild(slideCaption);
      }
      slide.appendChild(slideImg);
      return slide;
    };
    Builder.partials.progressBar = function(percentFinished) {
      var progressBar, progressBarInner;
      progressBar = this.div({
        "class": "progress-bar"
      });
      progressBarInner = this.div({
        "class": "progress-bar-inner"
      });
      progressBarInner.style.width = percentFinished + "%";
      progressBar.appendChild(progressBarInner);
      Builder.nodes.progressBar = progressBar;
      Builder.nodes.progressBarInner = progressBarInner;
      return progressBar;
    };
    Builder.partials.loadingAnimation = function() {
      var leftDot, loadingContainer, loadingSymbol, rightDot;
      loadingContainer = this.div({
        "class": "loading"
      });
      leftDot = this.i(Object());
      rightDot = this.i(Object());
      loadingSymbol = this.div({
        "class": "symbol"
      });
      loadingSymbol.appendChild(leftDot);
      loadingSymbol.appendChild(rightDot);
      loadingContainer.appendChild(loadingSymbol);
      return loadingContainer;
    };
    Builder.helpers = Object();
    touched = Object();
    Builder.helpers.touch = function(touchNode, callBack) {
      touchNode.addEventListener('touchstart', function(event) {
        var touchobj;
        touchobj = event.changedTouches[0];
        touched.startx = parseInt(touchobj.clientX);
        return touched.starty = parseInt(touchobj.clientY);
      });
      return touchNode.addEventListener('touchend', function(event) {
        var touchDifferenceX, touchDifferenceY, touchobj;
        touchobj = event.changedTouches[0];
        touchDifferenceX = Math.abs(touched.startx - parseInt(touchobj.clientX));
        touchDifferenceY = Math.abs(touched.starty - parseInt(touchobj.clientY));
        if (touchDifferenceX < 2 && touchDifferenceX < 2) {
          return callBack();
        }
      });
    };
    Builder.helpers.onload = function(callBack) {
      if (window.addEventListener) {
        return window.addEventListener('load', callBack);
      } else if (window.attachEvent) {
        return window.attachEvent('onload', callBack);
      }
    };
    Builder.actions = function() {
      if (Builder.device === "iphone" || Builder.device === "ipad") {
        Builder.helpers.touch(Builder.nodes.notMe, function() {
          return Builder.events.notMe();
        });
        return Builder.helpers.touch(Builder.nodes.me, function() {
          return Builder.events.me();
        });
      } else {
        Builder.nodes.notMe.onclick = function() {
          return Builder.events.notMe();
        };
        return Builder.nodes.me.onclick = function() {
          return Builder.events.me();
        };
      }
    };
    Builder.events = Object();
    Builder.events.me = function() {
      var currentSlide;
      if (!Builder.states.animating && !Builder.data.slidesLeft() !== 1) {
        if (!Builder.data.slides[Builder.data.currentSlide]) {
          Builder.events.loadingAnimation();
        }
        Builder.states.animating = true;
        Builder.events.advanceSlide();
        currentSlide = Builder.data.slides[Builder.data.currentSlide - 1];
        Builder.data.addSlide(currentSlide.id, true);
        Builder.data.currentSlide += 1;
        if (Builder.callbacks.me) {
          return Builder.callbacks.me(Builder);
        }
      }
    };
    Builder.events.notMe = function() {
      var currentSlide;
      if (!Builder.states.animating && Builder.nodes.nextSlide) {
        if (!Builder.data.slides[Builder.data.currentSlide]) {
          Builder.events.loadingAnimation();
        }
        Builder.states.animating = true;
        Builder.events.advanceSlide();
        currentSlide = Builder.data.slides[Builder.data.currentSlide - 1];
        Builder.data.addSlide(currentSlide.id, false);
        Builder.data.currentSlide += 1;
        if (Builder.callbacks.notMe) {
          return Builder.callbacks.notMe(Builder);
        }
      }
    };
    Builder.events.advanceSlide = function() {
      var nextSlideData;
      Builder.prefetchSlides();
      Builder.nodes.progressBarInner.style.width = Builder.data.getProgressBarNumbers() + "%";
      if (Builder.nodes.playedSlide) {
        Builder.nodes.slides.removeChild(Builder.nodes.playedSlide);
      }
      Builder.nodes.playedSlide = Builder.nodes.currentSlide;
      Builder.nodes.currentSlide = Builder.nodes.nextSlide;
      Builder.nodes.currentSlide.addEventListener('webkitTransitionEnd', function(event) {
        if (Builder.events.advancedSlide) {
          Builder.events.advancedSlide();
        }
        return Builder.states.animating = false;
      }, false);
      Builder.nodes.currentSlide.addEventListener('transitionend', function(event) {
        if (Builder.events.advancedSlide) {
          Builder.events.advancedSlide();
        }
        return Builder.states.animating = false;
      }, false);
      Builder.nodes.currentSlide.addEventListener('oTransitionEnd', function(event) {
        if (Builder.events.advancedSlide) {
          Builder.events.advancedSlide();
        }
        return Builder.states.animating = false;
      }, false);
      Builder.nodes.currentSlide.addEventListener('otransitionend', function(event) {
        if (Builder.events.advancedSlide) {
          Builder.events.advancedSlide();
        }
        return Builder.states.animating = false;
      }, false);
      Builder.nodes.playedSlide.className += " played";
      Builder.nodes.currentSlide.className += " active";
      nextSlideData = Builder.data.slides[Builder.data.currentSlide + 1];
      if (nextSlideData) {
        Builder.nodes.nextSlide = Builder.partials.slide(nextSlideData);
        Builder.nodes.slides.appendChild(Builder.nodes.nextSlide);
      }
      if (Builder.callbacks.advanceSlide) {
        return Builder.callbacks.advanceSlide(Builder);
      }
    };
    Builder.events.loadingAnimation = function() {
      Builder.nodes.meNotMeContainer.className += " hide";
      Builder.nodes.slides.removeChild(Builder.nodes.currentSlide);
      return Builder.nodes.slides.insertBefore(Builder.partials.loadingAnimation(), Builder.nodes.slides.firstChild);
    };
    Builder.imageCache = Object();
    Builder.prefetchSlides = function(count) {
      var end, slide, start, _i, _len, _ref, _results;
      start = Builder.data.currentSlide - 1;
      end = Builder.data.currentSlide + 9;
      _ref = Builder.data.slides.slice(start, end);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        slide = _ref[_i];
        if (!Builder.imageCache[slide.image_desktop_retina]) {
          Builder.imageCache[slide.image_desktop_retina] = new Image();
          _results.push(Builder.imageCache[slide.image_desktop_retina].src = slide.image_desktop_retina);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    Builder.events.setContainerSize = function() {
      var width;
      width = Builder.nodes.main.scrollWidth;
      Builder.nodes.container.className = Builder.nodes.container.className.replace(" medium", "");
      Builder.nodes.container.className = Builder.nodes.container.className.replace(" large", "");
      Builder.nodes.container.className = Builder.nodes.container.className.replace(" small", "");
      if (width < 480) {
        return Builder.nodes.container.className += " small";
      } else if (width < 768) {
        return Builder.nodes.container.className += " medium";
      }
    };
    Builder.events.onRotate = function(rotateEvent) {
      var orientationEvent, supportsOrientationChange;
      supportsOrientationChange = "onorientationchange" in window;
      orientationEvent = (supportsOrientationChange ? "orientationchange" : "resize");
      return window.addEventListener(orientationEvent, function(event) {
        return rotateEvent(event);
      }, false);
    };
    Builder.states.initialized = false;
    Builder.initialize = function() {
      return Traitify.getSlides(assessmentId, function(data) {
        var setupScreen, style;
        Builder.data.currentSlide = 1;
        Builder.data.totalSlideLength = data.length;
        Builder.data.sentSlides = 0;
        Builder.data.slides = data.filter(function(slide) {
          return !slide.completed_at;
        });
        Builder.data.slidesToPlayLength = Builder.data.slides.length;
        style = Builder.partials.make("link", {
          href: "https://s3.amazonaws.com/traitify-cdn/assets/stylesheets/slide_deck.css",
          type: 'text/css',
          rel: "stylesheet"
        });
        Builder.nodes.main.innerHTML = "";
        Builder.nodes.main.appendChild(style);
        if (Builder.data.slides.length !== 0) {
          Builder.nodes.container = Builder.partials.slideDeckContainer();
          if (Builder.device) {
            Builder.nodes.container.className += " " + Builder.device;
            Builder.nodes.container.className += " mobile phone";
            if (options && options.nonTouch) {
              Builder.nodes.container.className += " non-touch";
            }
          }
          if (options && options.size) {
            Builder.nodes.container.className += " " + options.size;
          }
          Builder.nodes.main.appendChild(Builder.nodes.container);
          Builder.actions();
          Builder.prefetchSlides();
          Builder.events.setContainerSize();
          window.onresize = function() {
            if (!Builder.device) {
              return Builder.events.setContainerSize();
            }
          };
          if (Builder.device && Builder.device) {
            setupScreen = function() {
              var windowOrienter;
              windowOrienter = function() {
                return Builder.nodes.main.style.height = window.innerHeight + "px";
              };
              windowOrienter();
              return Builder.events.onRotate(function(event) {
                return windowOrienter();
              });
            };
            Builder.helpers.onload(function() {
              return setupScreen();
            });
            setupScreen();
          }
        } else {
          if (typeof selector !== "string") {
            options.container = Builder.nodes.main;
          }
          if (options && options.showResults !== false) {
            Builder.results = Traitify.ui.resultsDefault(assessmentId, selector, options);
          }
          if (Builder.callbacks.finished) {
            Builder.states.finished = true;
            Builder.callbacks.finished();
          }
        }
        if (Builder.callbacks.initialize) {
          Builder.callbacks.initialize(Builder);
        } else {
          Builder.states.initialized = true;
        }
        return Builder.data.currentSlideTime = new Date().getTime();
      });
    };
    Builder.callbacks = Object();
    Builder.onInitialize = function(callBack) {
      if (Builder.states.initialized === true) {
        callBack();
      }
      Builder.callbacks.initialize = callBack;
      return Builder;
    };
    Builder.onFinished = function(callBack) {
      if (Builder.states.finished === true) {
        callBack();
      }
      Builder.callbacks.finished = callBack;
      return Builder;
    };
    Builder.onAddSlide = function(callBack) {
      Builder.callbacks.addSlide = callBack;
      return Builder;
    };
    Builder.onMe = function(callBack) {
      Builder.callbacks.me = callBack;
      return Builder;
    };
    Builder.onNotMe = function(callBack) {
      Builder.callbacks.notMe = callBack;
      return Builder;
    };
    Builder.onAdvanceSlide = function(callBack) {
      Builder.callbacks.advanceSlide = callBack;
      return Builder;
    };
    Builder.initialize();
    return Builder;
  };

  Traitify.ui.resultsDefault = function(assessmentId, selector, options) {
    var Builder, selectedObject;
    Builder = Object();
    Builder.nodes = Object();
    Builder.states = Object();
    Builder.data = Object();
    if (typeof selector !== "string") {
      Builder.nodes.main = options.container;
    } else if (selector.indexOf("#") !== -1) {
      selector = selector.replace("#", "");
      Builder.nodes.main = document.getElementById(selector);
    } else {
      selector = selector.replace(".", "");
      selectedObject = document.getElementsByClassName(selector);
      Builder.nodes.main = selectedObject ? selectedObject[0] : null;
    }
    if (!Builder.nodes.main) {
      console.log("YOU MUST HAVE A TAG WITH A SELECTOR FOR THIS TO WORK");
      return false;
    }
    Builder.classes = function() {
      var classes, key;
      classes = Builder.main.className.split(" ");
      for (key in classes) {
        classes[key] = "." + classes[key];
      }
      return classes.join("");
    };
    Builder.partials = Object();
    Builder.partials.make = function(elementType, attributes) {
      var attributeName, element;
      element = document.createElement(elementType);
      for (attributeName in attributes) {
        element.setAttribute(attributeName, attributes[attributeName]);
      }
      return element;
    };
    Builder.partials.div = function(attributes) {
      return this.make("div", attributes);
    };
    Builder.partials.img = function(attributes) {
      return this.make("img", attributes);
    };
    Builder.partials.i = function(attributes) {
      return this.make("i", attributes);
    };
    Builder.nodes.personalityTypes = Array();
    Builder.partials.personalityType = function(typeData) {
      var badge, barLeft, barRight, name, nameAndScore, personalityType, score;
      personalityType = this.div({
        "class": "personality-type"
      });
      badge = Builder.partials.badge(typeData.personality_type.badge);
      if (typeData.score < 0) {
        barLeft = Builder.partials.barLeft(Math.abs(typeData.score));
        barRight = Builder.partials.barRight(0);
      } else {
        barLeft = Builder.partials.barLeft(0);
        barRight = Builder.partials.barRight(Math.abs(typeData.score));
      }
      name = this.div({
        "class": "name"
      });
      name.innerHTML = typeData.personality_type.name;
      score = this.div({
        "class": "score"
      });
      score.innerHTML = typeData.score < 0 ? "(" + (Math.round(Math.abs(typeData.score))) + ")" : Math.round(typeData.score);
      nameAndScore = this.div({
        "class": "name-and-score"
      });
      nameAndScore.appendChild(name);
      nameAndScore.appendChild(score);
      personalityType.appendChild(nameAndScore);
      personalityType.appendChild(barLeft);
      personalityType.appendChild(badge);
      personalityType.appendChild(barRight);
      Builder.nodes.personalityTypes.push({
        personalityType: personalityType,
        badge: badge
      });
      return personalityType;
    };
    Builder.partials.badge = function(badgeData) {
      var badge;
      badge = this.div({
        "class": "badge"
      });
      badge.appendChild(this.img({
        src: badgeData.image_large
      }));
      return badge;
    };
    Builder.partials.barLeft = function(scoreData) {
      var barLeft, innerBarLeft, last;
      last = Builder.nodes.personalityTypes.length - 1;
      innerBarLeft = this.div({
        "class": "bar-inner-left"
      });
      innerBarLeft.style.width = scoreData + "%";
      barLeft = this.div({
        "class": "bar-left"
      });
      barLeft.appendChild(innerBarLeft);
      return barLeft;
    };
    Builder.partials.barRight = function(scoreData) {
      var barRight, innerBarRight, last;
      last = Builder.nodes.personalityTypes.length - 1;
      innerBarRight = this.div({
        "class": "bar-inner-right"
      });
      innerBarRight.style.width = scoreData + "%";
      barRight = this.div({
        "class": "bar-right"
      });
      barRight.appendChild(innerBarRight);
      return barRight;
    };
    Builder.partials.toggleTraits = function() {
      var toggleTraits;
      toggleTraits = this.div({
        "class": "toggle-traits"
      });
      toggleTraits.innerHTML = "Show / Hide Traits";
      Builder.nodes.toggleTraits = toggleTraits;
      return toggleTraits;
    };
    Builder.nodes.personalityTraits = Array();
    Builder.partials.personalityTrait = function(personalityTraitData) {
      var leftName, personalityTrait, rightName, traitScorePosition;
      personalityTrait = this.div({
        "class": "personality-trait"
      });
      leftName = this.div({
        "class": "left-name"
      });
      leftName.innerHTML = personalityTraitData.left_personality_trait.name;
      rightName = this.div({
        "class": "right-name"
      });
      rightName.innerHTML = personalityTraitData.right_personality_trait.name;
      personalityTrait.appendChild(leftName);
      personalityTrait.appendChild(rightName);
      traitScorePosition = Builder.partials.traitScorePosition(personalityTraitData.score);
      personalityTrait.appendChild(traitScorePosition);
      Builder.nodes.personalityTraits.push({
        personalityTrait: personalityTrait,
        leftName: leftName,
        rightName: rightName,
        score: traitScorePosition
      });
      return personalityTrait;
    };
    Builder.partials.traitScorePosition = function(score) {
      var personalityTraitLine, personalityTraitScore, personalityTraitScoreContainer, personalityTraitScoreWrapper;
      personalityTraitScoreContainer = this.div({
        "class": "score-container"
      });
      personalityTraitScoreWrapper = this.div({
        "class": "score-wrapper"
      });
      personalityTraitScoreContainer.appendChild(personalityTraitScoreWrapper);
      personalityTraitScore = this.div({
        "class": "score"
      });
      personalityTraitScore.style.left = score + "%";
      personalityTraitScoreWrapper.appendChild(personalityTraitScore);
      personalityTraitLine = this.div({
        "class": "line"
      });
      personalityTraitScoreContainer.appendChild(personalityTraitLine);
      return personalityTraitScoreContainer;
    };
    Builder.partials.printButton = function() {
      var printButton;
      printButton = this.div({
        "class": "print-button"
      });
      Builder.nodes.printButton = printButton;
      printButton.innerHTML = "Print";
      return printButton;
    };
    Builder.actions = function() {
      if (Builder.nodes.toggleTraits) {
        Builder.nodes.toggleTraits.onclick = function() {
          if (Builder.nodes.personalityTraitContainer) {
            if (Builder.nodes.personalityTypesContainer.style.display === "block") {
              Builder.nodes.personalityTypesContainer.style.display = "none";
              return Builder.nodes.personalityTraitContainer.style.display = "block";
            } else {
              Builder.nodes.personalityTypesContainer.style.display = "block";
              return Builder.nodes.personalityTraitContainer.style.display = "none";
            }
          } else {
            return Traitify.getPersonalityTraits(assessmentId, function(data) {
              var personalityTrait, personalityTraitContainer, _i, _len;
              personalityTraitContainer = Builder.partials.div({
                "class": "personality-traits"
              });
              Builder.nodes.personalityTraitContainer = personalityTraitContainer;
              for (_i = 0, _len = data.length; _i < _len; _i++) {
                personalityTrait = data[_i];
                personalityTraitContainer.appendChild(Builder.partials.personalityTrait(personalityTrait));
              }
              Builder.nodes.container.appendChild(personalityTraitContainer);
              Builder.nodes.personalityTypesContainer.style.display = "none";
              return Builder.nodes.personalityTraitContainer.style.display = "block";
            });
          }
        };
      }
      return Builder.nodes.printButton.onclick = function() {
        var title;
        Builder.printWindow = window.open();
        Builder.nodes.printWindow = Object();
        Builder.nodes.printWindow.head = Builder.printWindow.document.getElementsByTagName("head")[0];
        Builder.nodes.printWindow.main = Builder.printWindow.document.getElementsByTagName("body")[0];
        Builder.nodes.printContainer = Builder.partials.div({
          "class": "tf-results-prop"
        });
        Builder.nodes.printContainer.appendChild(Builder.nodes.stylesheet.cloneNode(true));
        Builder.nodes.printContainer.appendChild(Builder.nodes.personalityTypesContainer.cloneNode(true));
        if (Builder.nodes.personalityTraitContainer) {
          Builder.nodes.printContainer.appendChild(Builder.nodes.personalityTraitContainer.cloneNode(true));
        }
        Builder.nodes.printWindow.main.appendChild(Builder.nodes.printContainer);
        title = Builder.partials.make("title");
        title.innerHTML = "PERSONALITY TO PRINT";
        return Builder.nodes.printWindow.head.appendChild(title);
      };
    };
    Builder.states.initialized = false;
    Builder.initialize = function() {
      Builder.nodes.main.innerHTML = "";
      return Traitify.getPersonalityTypes(assessmentId, function(data) {
        var personalityType, style, toolsContainer, _i, _len, _ref;
        Builder.data.personalityTypes = data.personality_types;
        style = Builder.partials.make("link", {
          href: "https://s3.amazonaws.com/traitify-cdn/assets/stylesheets/results_prop.css",
          type: 'text/css',
          rel: "stylesheet"
        });
        Builder.nodes.stylesheet = style;
        Builder.nodes.main.appendChild(style);
        Builder.nodes.container = Builder.partials.div({
          "class": "tf-results-prop"
        });
        toolsContainer = Builder.partials.div({
          "class": "tools"
        });
        Builder.nodes.toolsContainer = toolsContainer;
        toolsContainer.appendChild(Builder.partials.printButton());
        if (options && options.traits) {
          toolsContainer.appendChild(Builder.partials.toggleTraits());
        }
        Builder.nodes.container.appendChild(toolsContainer);
        Builder.nodes.personalityTypesContainer = Builder.partials.div({
          "class": "personality-types"
        });
        Builder.nodes.container.appendChild(Builder.nodes.personalityTypesContainer);
        _ref = Builder.data.personalityTypes;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          personalityType = _ref[_i];
          Builder.nodes.personalityTypesContainer.appendChild(Builder.partials.personalityType(personalityType));
        }
        Builder.nodes.main.appendChild(Builder.nodes.container);
        Builder.actions();
        if (Builder.callbacks.initialize) {
          return Builder.callbacks.initialize(Builder);
        } else {
          return Builder.states.initialized = true;
        }
      });
    };
    Builder.callbacks = Object();
    Builder.onInitialize = function(callBack) {
      if (Builder.states.initialized === true) {
        callBack();
      } else {
        Builder.callbacks.initialize = callBack;
      }
      return Builder;
    };
    Builder.initialize();
    return Builder;
  };

}).call(this);
