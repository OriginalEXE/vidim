/* 
 * vidim v1.0.0
 * 2017-03-02T00:53:23.698Z
 * https://github.com/OriginalEXE/vidim 
 * 
 * Made by Ante Sepic 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.vidim = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index$1 = createCommonjsModule(function (module) {
/**
 * Expose `Emitter`.
 */

{
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};
});

// Simple utility function for setting default values
function setDefaults(object, defaults) {

  var defaultsKeys = Object.keys(defaults);

  defaultsKeys.forEach(function (key) {

    if (!object.hasOwnProperty(key)) {

      object[key] = defaults[key];
    }
  });
}

// Utility function for when we need to accept the DOM element
function getElement(query) {
  var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;


  if ('string' === typeof query) {

    return parent.querySelector(query);
  }

  return query;
}

// Thanks underscore.js :)
function throttle(func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  var later = function later() {
    previous = Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var now = Date.now();
    if (!previous) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// Fires once the DOM is ready
function ready(fn) {

  if (document.readyState != 'loading') {

    fn();
  } else {

    document.addEventListener('DOMContentLoaded', fn);
  }
}

var utility = Object.freeze({
	setDefaults: setDefaults,
	getElement: getElement,
	throttle: throttle,
	ready: ready
});

var html5Provider = function (vidim) {

  /**
   * Defaults specific to this provider
   * @type {Object}
   */
  var defaults = {
    preload: 'auto'
  };

  /**
   * Provider definition object
   * @type {Object}
   */
  var vidimHTML5Provider = {

    /**
     * Initial provider setup
     */
    _initializeProvider: function _initializeProvider() {

      setDefaults(this._options, defaults);

      this._constructPlayer();
      this._dispatch();
      this._listen();
    },

    /**
     * Sets up the actual player
     */
    _constructPlayer: function _constructPlayer() {

      this.el = document.createElement('video');

      this.el.setAttribute('playsinline', '');

      if (this._options.loop) {

        this.el.setAttribute('loop', '');
      }

      if (this._options.autoplay) {

        this.el.setAttribute('autoplay', '');
      }

      if (this._options.preload) {

        this.el.setAttribute('preload', this._options.preload);
      }

      if (this._options.muted) {

        this.el.muted = true;
      }

      this.el.style.position = 'absolute';
      this.el.style.left = '50%';
      this.el.style.top = '50%';
      this.el.style.transform = 'translate(-50%, -50%)';
      this.el.style.webkitTransform = 'translate(-50%, -50%)';
      this.el.style.msTransform = 'translate(-50%, -50%)';
      this.el.style.oTransform = 'translate(-50%, -50%)';
      this.el.style.mozTransform = 'translate(-50%, -50%)';
      this.el.style.minWidth = 'calc( 100% + 2px )';
      this.el.style.minHeight = 'calc( 100% + 2px )';
      this.el.style.opacity = '0';

      var src = this._options.src;

      if (src.length && 'string' !== typeof src) {

        for (var i = 0; i < src.length; i++) {

          var source = document.createElement('source');

          source.setAttribute('type', src[i].type);
          source.setAttribute('src', src[i].src);

          this.el.appendChild(source);
        }
      }

      this.wrapper.appendChild(this.el);

      if (this._options.startAt) {

        this.el.currentTime = this._options.startAt;
      }

      if ('function' === typeof this._options.onReady) {

        this._options.onReady(this);
      }

      this.emit('ready');

      this._constructOverlay();

      this.resize();
    },

    /**
     * Dispatches normalized events
     */
    _dispatch: function _dispatch() {
      var _this = this;

      this.el.addEventListener('play', function () {

        _this.emit('play', _this);
      }, false);

      this.el.addEventListener('pause', function () {

        _this.emit('pause', _this);
      }, false);

      this.el.addEventListener('ended', function () {

        _this.emit('end', _this);
      }, false);

      this.el.addEventListener('canplay', function () {

        _this.emit('canplay', _this);
      }, false);

      this.el.addEventListener('canplaythrough', function () {

        _this.emit('canplaythrough', _this);
      }, false);
    },

    /**
     * Any event listeners that are important to this provider
     */
    _listen: function _listen() {
      var _this2 = this;

      // Make sure we show the player once playback starts
      this.on('play', function () {

        _this2.el.style.opacity = '1';
      });

      // If the poster is hidden initially, set it once the play event happens
      if (!this._options.showPosterBeforePlay) {

        this.once('play', function () {

          _this2.wrapper.style.backgroundImage = 'url(\'' + _this2._options.poster + '\')';
        });
      }

      // Show poster on playback end
      if (this._options.showPosterOnEnd) {

        this.on('end', function () {

          _this2.el.style.opacity = '0';
        });
      }

      // Show poster on playback pause
      if (this._options.showPosterOnPause) {

        this.on('pause', function () {

          _this2.el.style.opacity = '0';
        });
      }
    },

    /**
     * Starts the video playback
     */
    play: function play() {

      this.el.play();

      return this;
    },

    /**
     * Pauses the video playback
     */
    pause: function pause() {

      this.el.pause();

      return this;
    },

    /**
     * Sets the player volume
     * @param {Number} [volume=100] Min = 0, Max = 100
     */
    setVolume: function setVolume() {
      var volume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;


      this.el.volume = parseFloat(volume / 100);

      return this;
    },

    /**
     * Gets the player volume
     * @returns {Number} Current player volume
     */
    getVolume: function getVolume() {

      return this.el.volume * 100;
    },

    /**
     * Mutes the player
     */
    mute: function mute() {

      this.el.muted = true;

      return this;
    },

    /**
     * Unmutes the server
     */
    unMute: function unMute() {

      this.el.muted = false;

      return this;
    },

    /**
     * Sets the time player should seek to
     * @param {Number} [time=0] Amount of seconds in the video to seek to
     */
    setTime: function setTime() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


      this.el.currentTime = time;

      return this;
    },

    /**
     * Gets the time video playback is currently at
     * @returns {Number} Number of seconds from start to the current position
     */
    getTime: function getTime() {

      return this.el.currentTime;
    },

    /**
     * Gets video duration in seconds
     * @returns {Number} Length of the video in seconds
     */
    getDuration: function getDuration() {

      return this.el.duration;
    },

    /**
     * Hides the media and shows the poster behind it
     */
    showPoster: function showPoster() {

      this.pause().el.style.opacity = '0';
    },

    /**
     * Changes the source of the current video
     * @param {Object} src Hash of video types and sources
     */
    changeSource: function changeSource(src) {
      var newPoster = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      this.el.innerHTML = '';

      if (src.length && 'string' !== typeof src) {

        for (var i = 0; i < src.length; i++) {

          var source = document.createElement('source');

          source.setAttribute('type', src[i].type);
          source.setAttribute('src', src[i].src);

          this.el.appendChild(source);
        }
      }

      this.el.load && this.el.load();

      if (this._options.startAt) {

        this.el.currentTime = this._options.startAt;
      }

      if (newPoster) {

        var oldPoster = this._options.poster;

        if (-1 !== this.wrapper.style.backgroundImage.indexOf(oldPoster)) {

          this.wrapper.style.backgroundImage = 'url(\'' + newPoster + '\')';
        }

        this._options.poster = newPoster;
      }
    },

    /**
     * Destroys and unloads the player
     */
    destroy: function destroy() {

      this.emit('destroy');

      this.el.pause && this.el.pause();
      this.el.src = '';
      this.el.load && this.el.load();

      // We wrap this next part in try...catch in case the element is already
      // gone for some reason
      try {
        this.wrapper.parentNode.removeChild(this.wrapper);
      } catch (e) {

        // do nothing here

      }

      vidim.deleteInstance(this.vidimID);

      delete this.container.vidimID;

      this.off();
    },

    /**
     * Resizes the player to provide the best viewing experience
     */
    resize: function resize() {

      if (!this.el) {

        return;
      }

      var containerHeight = this.container.offsetHeight,
          containerWidth = this.container.offsetWidth;

      if ('BODY' === this.container.nodeName) {

        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;
      }

      if (1 < this._options.ratio && containerWidth / containerHeight < this._options.ratio || 1 > this._options.ratio && containerHeight / containerWidth < this._options.ratio) {

        this.el.style.maxHeight = 'calc( 100% + 2px )';
        this.el.style.maxWidth = '';
      } else {

        this.el.style.maxHeight = '';
        this.el.style.maxWidth = 'calc( 100% + 2px )';
      }

      this.emit('resize');
    }
  };

  vidim.registerProvider('HTML5', vidimHTML5Provider);
};

/* global YT:false */

/**
 * Will be set to true once YouTube API is ready
 * @type {Boolean}
 */
var isAPIReady = false;

var YouTubeProvider = function (vidim) {

  /**
   * Defaults specific to this provider
   * @type {Object}
   */
  var defaults = {
    quality: 'hd1080'
  };

  /**
   * Provider definition object
   * @type {Object}
   */
  var vidimYouTubeProvider = {

    /**
     * Initial provider setup
     */
    _initializeProvider: function _initializeProvider() {
      var _this = this;

      if (isAPIReady) {

        setDefaults(this._options, defaults);

        this._constructPlayer();
        this._listen();
      } else {

        window.addEventListener('vidimYouTubeAPIReady', function () {

          setDefaults(_this._options, defaults);

          _this._constructPlayer();
          _this._listen();
        }, false);
      }
    },

    /**
     * Sets up the actual player
     */
    _constructPlayer: function _constructPlayer() {
      var _this2 = this;

      // Check if YouTube ID was given, and if not, try to extract it from url
      if (11 === this._options.src.length) {

        this.videoID = this._options.src;
      } else {

        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        var videoMatch = this._options.src.match(regex);

        if (!videoMatch || 11 !== videoMatch[2].length) {

          return new Error('Provided source is not a valid YouTube url');
        }

        this.videoID = videoMatch[2];
      }

      // Create a temporary dom element that will be replaced by the
      // YouTube iframe
      var toBeReplaced = document.createElement('div');

      this.wrapper.appendChild(toBeReplaced);

      var playerParams = {
        videoId: this.videoID,
        playerVars: {
          allowfullscreen: false,
          controls: 0,
          enablejsapi: 1,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          origin: window.location.host,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
          start: this._options.startAt,
          autoplay: +this._options.autoplay
        },
        events: {
          'onReady': function onReady() {

            if (_this2._options.muted) {

              _this2.mute();
            }

            _this2.player.setPlaybackQuality(_this2._options.quality);

            if ('function' === typeof _this2._options.onReady) {

              _this2._options.onReady(_this2);
            }

            _this2.emit('ready');

            if (_this2._options.loop) {

              var loopInterval = void 0;

              _this2.on('play', function () {

                loopInterval = setInterval(function () {

                  if (_this2.getTime() === 0 || _this2.getTime() + 0.15 > _this2.getDuration()) {

                    _this2.setTime(0);
                    _this2.play();
                  }
                }, 100);
              });

              _this2.on('pause', function () {

                clearInterval(loopInterval);
              });

              _this2.on('destroy', function () {

                clearInterval(loopInterval);
              });
            }
          },
          'onStateChange': function onStateChange(e) {

            switch (e.data) {

              case 0:
                _this2.emit('end', _this2);
                break;

              case 1:
                _this2.emit('play', _this2);
                break;

              case 2:
                _this2.emit('pause', _this2);
                break;

              case 3:
                _this2.emit('buffering', _this2);
                break;

            }
          }
        }
      };

      if (this._options.loop) {

        playerParams.playerVars.playlist = this.videoID;
        playerParams.playerVars.loop = 1;
      }

      this.player = new YT.Player(toBeReplaced, playerParams);

      this.el = this.player.getIframe();

      this.el.style.position = 'absolute';
      this.el.style.left = '50%';
      this.el.style.top = '50%';
      this.el.style.transform = 'translate(-50%, -50%)';
      this.el.style.webkitTransform = 'translate(-50%, -50%)';
      this.el.style.msTransform = 'translate(-50%, -50%)';
      this.el.style.oTransform = 'translate(-50%, -50%)';
      this.el.style.mozTransform = 'translate(-50%, -50%)';
      this.el.style.minWidth = 'calc( 100% + 2px )';
      this.el.style.minHeight = 'calc( 100% + 2px )';
      this.el.style.opacity = '0';

      this._constructOverlay();

      this.resize();
    },

    /**
     * Any event listeners that are important to this provider
     */
    _listen: function _listen() {
      var _this3 = this;

      // Make sure we show the player once playback starts
      this.on('play', function () {

        _this3.el.style.opacity = '1';
      });

      // If the poster is hidden initially, set it once the play event happens
      if (!this._options.showPosterBeforePlay) {

        this.once('play', function () {

          _this3.wrapper.style.backgroundImage = 'url(\'' + _this3._options.poster + '\')';
        });
      }

      // Show poster on playback end
      if (this._options.showPosterOnEnd) {

        this.on('end', function () {

          _this3.el.style.opacity = '0';
        });
      } else {

        // We don't want to display YouTube play button over our video,
        // this is a hacky way to stop that from happening
        this.on('end', function () {

          _this3.player.seekTo(_this3.player.getDuration());
          _this3.player.playVideo();
          _this3.player.pauseVideo();
        });
      }

      // Show poster on playback pause
      if (this._options.showPosterOnPause) {

        this.on('pause', function () {

          _this3.el.style.opacity = '0';
        });
      }
    },

    /**
     * Starts the video playback
     */
    play: function play() {

      this.player.playVideo();

      return this;
    },

    /**
     * Pauses the video playback
     */
    pause: function pause() {

      this.player.pauseVideo();

      return this;
    },

    /**
     * Sets the player volume
     * @param {Number} [volume=100] Min = 0, Max = 100
     */
    setVolume: function setVolume() {
      var volume = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;


      this.player.setVolume(volume);

      return this;
    },

    /**
     * Gets the player volume
     * @returns {Number} Current player volume
     */
    getVolume: function getVolume() {

      return this.getVolume();
    },

    /**
     * Mutes the player
     */
    mute: function mute() {

      this.player.mute();

      return this;
    },

    /**
     * Unmutes the server
     */
    unMute: function unMute() {

      this.player.unMute();

      return this;
    },

    /**
     * Sets the time player should seek to
     * @param {Number} [time=0] Amount of seconds in the video to seek to
     */
    setTime: function setTime() {
      var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;


      this.player.seekTo(time, true);

      return this;
    },

    /**
     * Gets the time video playback is currently at
     * @returns {Number} Number of seconds from start to the current position
     */
    getTime: function getTime() {

      return this.player.getCurrentTime();
    },

    /**
     * Gets video duration in seconds
     * @returns {Number} Length of the video in seconds
     */
    getDuration: function getDuration() {

      return this.player.getDuration();
    },

    /**
     * Hides the media and shows the poster behind it
     */
    showPoster: function showPoster() {

      this.pause().el.style.opacity = '0';
    },

    /**
     * Changes the source of the current video
     * @param {Object} src Hash of video types and sources
     */
    changeSource: function changeSource(src) {
      var newPoster = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      if (11 === src.length) {

        this.videoID = src;
      } else {

        var regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        var videoMatch = src.match(regex);

        if (!videoMatch || 11 !== videoMatch[2].length) {

          return new Error('Provided source is not a valid YouTube url');
        }

        this.videoID = videoMatch[2];
      }

      this.player.loadPlaylist(this.videoID, 0, this._options.startAt, this._options.quality);

      this.player.setLoop(this._options.loop);

      if (newPoster) {

        var oldPoster = this._options.poster;

        if (-1 !== this.wrapper.style.backgroundImage.indexOf(oldPoster)) {

          this.wrapper.style.backgroundImage = 'url(\'' + newPoster + '\')';
        }

        this._options.poster = newPoster;
      }
    },

    /**
     * Destroys and unloads the player
     */
    destroy: function destroy() {

      this.emit('destroy');

      this.player.destroy();

      // We wrap this next part in try...catch in case the element is already
      // gone for some reason
      try {
        this.wrapper.parentNode.removeChild(this.wrapper);
      } catch (e) {

        // do nothing here

      }

      vidim.deleteInstance(this.vidimID);

      delete this.container.vidimID;

      this.off();
    },

    /**
     * Resizes the player to provide the best viewing experience
     */
    resize: function resize() {

      if (!this.el) {

        return;
      }

      var containerHeight = this.container.offsetHeight,
          containerWidth = this.container.offsetWidth;

      if ('BODY' === this.container.nodeName) {

        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;
      }

      if (1 < this._options.ratio && containerWidth / containerHeight < this._options.ratio || 1 > this._options.ratio && containerHeight / containerWidth < this._options.ratio) {

        this.el.style.maxHeight = 'calc( 100% + 2px )';
        this.el.style.maxWidth = '';

        this.el.style.height = '';
        this.el.style.width = this.el.offsetHeight * this._options.ratio + 200 + 'px';
      } else {

        this.el.style.maxHeight = '';
        this.el.style.maxWidth = 'calc( 100% + 2px )';

        this.el.style.height = this.el.offsetWidth / this._options.ratio + 'px';
        this.el.style.width = '';

        if (this.el.offsetHeight < this.wrapper.offsetHeight + 140) {

          this.el.style.height = this.el.offsetWidth / this._options.ratio + 140 + 'px';
        }
      }

      this.emit('resize');
    }
  };

  vidim.registerProvider('YouTube', vidimYouTubeProvider);
};

// Load the YouTube API
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';

document.querySelector('body').appendChild(tag);

// Create our custom event
var event = document.createEvent('Event');

event.initEvent('vidimYouTubeAPIReady', true, true);

// Finaly, make sure we trigger that event once the API is ready
if ('undefined' === typeof window.onYouTubeIframeAPIReady) {

  window.onYouTubeIframeAPIReady = function () {

    window.vidimYouTubeAPIReady = true;

    isAPIReady = true;

    window.dispatchEvent(event);
  };
} else {

  var oldOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

  window.onYouTubeIframeAPIReady = function () {

    oldOnYouTubeIframeAPIReady();

    window.vidimYouTubeAPIReady = true;

    isAPIReady = true;

    window.dispatchEvent(event);
  };
}

var index = ((function factory(global) {

  if ('undefined' === typeof global.document) {

    return;
  }

  /**
   * Instance ID counter
   * @type {Number}
   */
  var ID = 0;

  /**
   * Hashmap of instances
   * @type {Object}
   */
  var instances = {};

  /**
   * Default options
   * @type {Object}
   */
  var defaults = {
    wrapperClass: '',
    overlayClass: '',
    src: false,
    type: 'HTML5',
    ratio: 1.7778,
    autoplay: true,
    loop: true,
    poster: '',
    showPosterBeforePlay: true,
    showPosterOnEnd: false,
    showPosterOnPause: false,
    zIndex: 0,
    autoResize: true,
    muted: true,
    startAt: 0,
    onReady: false
  };

  /**
   * Stores a list of option keys that the user provided, used for setting more
   * sensible defaults
   * @type {Array}
   */
  var optionsProvided = [];

  /**
   * Hashmap of providers
   * @type {Object}
   */
  var providers = {};

  /**
   * Register a provider for handling media embeds
   * @param  {String} type Short identifier for the media type handled
   * @param  {Function|Object} Object or a function that returns object
   */
  function registerProvider(type, provider) {

    if ('function' === typeof provider) {

      providers[type] = provider.call(global, defaults);
    } else {

      providers[type] = provider;
    }
  }

  /**
   * Get instance by its ID
   * @param  {integer} id Instance ID
   * @returns {null|Object} null or instance if found
   */
  function getInstanceFromID(id) {

    if (!instances[id]) {

      return null;
    }

    return instances[id];
  }

  /**
   * Get instance from the container element
   * @param   {Object|string} element DOM element or a query string
   * @returns {null|Object} null or instance if found
   */
  function getInstanceFromElement(element) {

    element = getElement(element);

    if ('undefined' === typeof element.vidimID || !instances[element.vidimID]) {

      return null;
    }

    return instances[element.vidimID];
  }

  /**
   * Destroys all active instances
   */
  function destroyAllInstances() {

    for (var key in instances) {

      instances[key].hasOwnProperty('destroy') && instances[key].destroy();
    }

    instances = {};
  }

  /**
   * Delete instance from the instances hash
   * NOTE: this will not destroy the instance, only remove it from the
   * instances hash. Call the destroy() method on the instance itself if you
   * want to destroy it
   * @param {string} id Instance ID
   */
  function deleteInstance(id) {

    delete instances[id];
  }

  // API method for scanning the DOM and initializing vide instances from
  // data-vide attribute

  /**
   * Scan the DOM for elements that have data-vidim attribute and initialize
   * new vidim instance based on that attribute
   */
  function scanDOM() {

    var vidimElements = document.querySelectorAll('[data-vidim]');

    if (!vidimElements.length) {

      return;
    }

    for (var i = 0; i < vidimElements.length; i++) {

      var element = vidimElements[i];
      var options = element.getAttribute('data-vidim');

      if ('undefined' !== typeof element.vidimID) {

        // this element already has an instance of vidim
        continue;
      }

      try {

        // The things we do to avoid eval...
        var regex = /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g;

        var fixedOptions = options.replace(regex, '$1"$2":').replace(/:\s?'/g, ':"').replace(/'\s?}/g, '"}').replace(/',"/g, '","');

        var parsedOptions = JSON.parse(fixedOptions);

        new vidim(element, parsedOptions);
      } catch (e) {

        // do nothing

      }
    }
  }

  /**
   * Used for instantiating new instances
   * @param {Object|string} element DOM element or a query string
   * @param {Object} [options={}] Options hash
   */
  function vidim(element) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    Object.keys(options).forEach(function (key) {

      optionsProvided.push(key);
    });

    // Set defaults
    setDefaults(options, defaults);

    if (options.src && !providers[options.type]) {

      return new Error('No provider can handle type: \'' + options.type + '\'');
    }

    if ('string' === typeof options.ratio) {

      if ('4/3' === options.ratio) {

        options.ratio = 4 / 3;
      } else {

        options.ratio = 16 / 9;
      }
    }

    this._options = options;
    this.container = getElement(element);

    if (!this.container) {

      return new Error('Could not find the container: ' + element);
    }

    // Set more sensitive defaults
    if (-1 === optionsProvided.indexOf('zIndex') && 'BODY' === this.container.nodeName) {

      this._options.zIndex = -1;
    }

    this._initialize();
  }

  var prototype = vidim.prototype;

  /**
   * Initializes the instance and does the work common to all providers
   */
  prototype._initialize = function () {

    // Assign a unique ID to this instance, and make sure we store it on the
    // container for convenience
    this.vidimID = ID++;
    this.container.vidimID = this.vidimID;

    instances[this.vidimID] = this;

    // Add emitter interface to our instance
    index$1(this);

    // Check if poster was provided but the source was not,
    // in that case we fake a simple provider interface that only displays a
    // poster
    if (!this._options.src && this._options.poster) {

      this._constructWrapper();

      this.destroy = function () {

        this.emit('destroy');

        // We wrap this next part in try...catch in case the element is already
        // gone for some reason
        try {
          this.wrapper.parentNode.removeChild(this.wrapper);
        } catch (e) {

          // do nothing here

        }

        vidim.deleteInstance(this.vidimID);

        delete this.container.vidimID;

        this.off();
      };

      return;
    }

    var provider = providers[this._options.type];

    for (var key in provider) {

      this[key] = provider[key];
    }

    if ('function' !== typeof this._initializeProvider) {

      return new Error('Provider is missing method: _initializeProvider');
    }

    this._constructWrapper();
    this._initializeProvider();

    if (this._options.autoResize) {

      window.addEventListener('resize', throttle(this.resize, 200).bind(this), false);
    }

    this.resize();
  };

  /**
   * Generates a wrapper that is used for holding the media
   */
  prototype._constructWrapper = function () {

    var containerStyle = getComputedStyle(this.container, null);

    if ('static' === containerStyle.getPropertyValue('position')) {

      this.container.style.position = 'relative';
    }

    this.wrapper = document.createElement('div');

    if ('BODY' === this.container.nodeName) {

      this.wrapper.style.position = 'fixed';
    } else {

      this.wrapper.style.position = 'absolute';
    }

    if (this._options.wrapperClass) {

      if ('function' === typeof this._options.wrapperClass) {

        this.wrapper.classList.add(this._options.wrapperClass.call(this));
      } else {

        this.wrapper.classList.add(this._options.wrapperClass);
      }
    }

    this.wrapper.style.left = 0;
    this.wrapper.style.top = 0;
    this.wrapper.style.height = '100%';
    this.wrapper.style.width = '100%';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.zIndex = parseInt(this._options.zIndex, 10);

    if (this._options.poster) {

      this.wrapper.style.backgroundSize = 'cover';
      this.wrapper.style.backgroundPosition = 'center center';
      this.wrapper.style.backgroundRepear = 'no-repeat';

      if (this._options.showPosterBeforePlay) {

        this.wrapper.style.backgroundImage = 'url(\'' + this._options.poster + '\')';
      }
    }

    this.container.insertBefore(this.wrapper, this.container.firstChild);
  };

  /**
   * Generates an overlay that is placed above the media to prevent interaction
   */
  prototype._constructOverlay = function () {

    this.overlay = document.createElement('div');

    this.overlay.style.position = 'absolute';

    if (this._options.overlayClass) {

      if ('function' === typeof this._options.overlayClass) {

        this.overlay.classList.add(this._options.overlayClass.call(this));
      } else {

        this.overlay.classList.add(this._options.overlayClass);
      }
    }

    this.overlay.style.left = 0;
    this.overlay.style.top = 0;
    this.overlay.style.height = '100%';
    this.overlay.style.width = '100%';

    this.wrapper.appendChild(this.overlay);
  };

  // Provide method for retrieving vidim instance by its id
  vidim.getInstanceFromID = getInstanceFromID;

  // Provide method for retrieving vidim instance from the container element
  vidim.getInstanceFromElement = getInstanceFromElement;

  // Provide method for registering new providers
  vidim.registerProvider = registerProvider;

  // Provide method for destroying all instances
  vidim.destroyAllInstances = destroyAllInstances;

  // Provide method for deleting the instance from instances hash
  vidim.deleteInstance = deleteInstance;

  // Export our utils functions as well so providers can make use of them
  vidim.utility = utility;

  // Provide method for scanning the DOM and initializing vidim from attribute
  vidim.scanDOM = scanDOM;

  // Initialize providers
  html5Provider(vidim);
  YouTubeProvider(vidim);

  // Parse the DOM an auto initialize based on the [data-vidim] attribute
  ready(scanDOM);

  return vidim;
}))('undefined' !== typeof window ? window : undefined);

return index;

})));
