import * as utility from '../utils.js';

export default function( vidim ) {

  /**
   * Defaults specific to this provider
   * @type {Object}
   */
  const defaults = {
    preload: 'auto'
  };

  /**
   * Provider definition object
   * @type {Object}
   */
  const vidimHTML5Provider = {

    /**
     * Initial provider setup
     */
    _initializeProvider: function() {

      utility.setDefaults( this._options, defaults );

      this._constructPlayer();
      this._dispatch();
      this._listen();

    },

    /**
     * Sets up the actual player
     */
    _constructPlayer: function() {

      this.el = document.createElement( 'video' );

      this.el.setAttribute( 'playsinline', '' );

      if ( this._options.loop ) {

        this.el.setAttribute( 'loop', '' );

      }

      if ( this._options.autoplay ) {

        this.el.setAttribute( 'autoplay', '' );

      }

      if ( this._options.preload ) {

        this.el.setAttribute( 'preload', this._options.preload );

      }

      if ( this._options.muted ) {

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

      const src = this._options.src;

      if ( src.length && 'string' !== typeof src ) {

        for ( let i = 0; i < src.length; i++ ) {

          let source = document.createElement( 'source' );

          source.setAttribute( 'type', src[ i ].type );
          source.setAttribute( 'src', src[ i ].src );

          this.el.appendChild( source );

        }

      }

      this.wrapper.appendChild( this.el );

      if ( this._options.startAt ) {

        this.el.currentTime = this._options.startAt;

      }

      if ( 'function' === typeof this._options.onReady ) {

        this._options.onReady( this );

      }

      this.emit( 'ready' );

      this._constructOverlay();

      this.resize();

    },

    /**
     * Dispatches normalized events
     */
    _dispatch: function() {

      this.el.addEventListener( 'play', () => {

        this.emit( 'play', this );

      }, false );

      this.el.addEventListener( 'pause', () => {

        this.emit( 'pause', this );

      }, false );

      this.el.addEventListener( 'ended', () => {

        this.emit( 'end', this );

      }, false );

      this.el.addEventListener( 'canplay', () => {

        this.emit( 'canplay', this );

      }, false );

      this.el.addEventListener( 'canplaythrough', () => {

        this.emit( 'canplaythrough', this );

      }, false );

    },

    /**
     * Any event listeners that are important to this provider
     */
    _listen: function() {

      // Make sure we show the player once playback starts
      this.on( 'play', () => {

        this.el.style.opacity = '1';

      });

      // If the poster is hidden initially, set it once the play event happens
      if ( ! this._options.showPosterBeforePlay ) {

        this.once( 'play', () => {

          this.wrapper.style.backgroundImage = `url('${this._options.poster}')`;

        });

      }

      // Show poster on playback end
      if ( this._options.showPosterOnEnd ) {

        this.on( 'end', () => {

          this.el.style.opacity = '0';

        });

      }

      // Show poster on playback pause
      if ( this._options.showPosterOnPause ) {

        this.on( 'pause', () => {

          this.el.style.opacity = '0';

        });

      }

    },

    /**
     * Starts the video playback
     */
    play: function() {

      this.el.play();

      return this;

    },

    /**
     * Pauses the video playback
     */
    pause: function() {

      this.el.pause();

      return this;

    },

    /**
     * Sets the player volume
     * @param {Number} [volume=100] Min = 0, Max = 100
     */
    setVolume: function( volume = 100 ) {

      this.el.volume = parseFloat( volume / 100 );

      return this;

    },

    /**
     * Gets the player volume
     * @returns {Number} Current player volume
     */
    getVolume: function() {

      return this.el.volume * 100;

    },

    /**
     * Mutes the player
     */
    mute: function() {

      this.el.muted = true;

      return this;

    },

    /**
     * Unmutes the server
     */
    unMute: function() {

      this.el.muted = false;

      return this;

    },

    /**
     * Sets the time player should seek to
     * @param {Number} [time=0] Amount of seconds in the video to seek to
     */
    setTime: function( time = 0 ) {

      this.el.currentTime = time;

      return this;

    },

    /**
     * Gets the time video playback is currently at
     * @returns {Number} Number of seconds from start to the current position
     */
    getTime: function() {

      return this.el.currentTime;

    },

    /**
     * Gets video duration in seconds
     * @returns {Number} Length of the video in seconds
     */
    getDuration: function() {

      return this.el.duration;

    },

    /**
     * Hides the media and shows the poster behind it
     */
    showPoster: function() {

      this.pause().el.style.opacity = '0';

    },

    /**
     * Changes the source of the current video
     * @param {Object} src Hash of video types and sources
     */
    changeSource: function( src ) {

      this.el.innerHTML = '';

      if ( src.length && 'string' !== typeof src ) {

        for ( let i = 0; i < src.length; i++ ) {

          let source = document.createElement( 'source' );

          source.setAttribute( 'type', src[ i ].type );
          source.setAttribute( 'src', src[ i ].src );

          this.el.appendChild( source );

        }

      }

      this.el.load && this.el.load();

      if ( this._options.startAt ) {

        this.el.currentTime = this._options.startAt;

      }

    },

    /**
     * Destroys and unloads the player
     */
    destroy: function() {

      this.emit( 'destroy' );

      this.el.pause && this.el.pause();
      this.el.src = '';
      this.el.load && this.el.load();

      // We wrap this next part in try...catch in case the element is already
      // gone for some reason
      try {
        this.wrapper.parentNode.removeChild( this.wrapper );
      } catch ( e ) {

        // do nothing here

      }

      vidim.deleteInstance( this.vidimID );

      delete this.container.vidimID;

      this.off();

    },

    /**
     * Resizes the player to provide the best viewing experience
     */
    resize: function() {

      if ( ! this.el ) {

        return;

      }

      let containerHeight = this.container.offsetHeight,
        containerWidth = this.container.offsetWidth;

      if ( 'BODY' === this.container.nodeName ) {

        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;

      }

      if (
        (
             1 < this._options.ratio
          && ( containerWidth / containerHeight ) < this._options.ratio
        )
        ||
        (
             1 > this._options.ratio
          && ( containerHeight / containerWidth ) < this._options.ratio
        )
      ) {

        this.el.style.maxHeight = 'calc( 100% + 2px )';
        this.el.style.maxWidth = '';

      } else {

        this.el.style.maxHeight = '';
        this.el.style.maxWidth = 'calc( 100% + 2px )';

      }

      this.emit( 'resize' );

    }
  };

  vidim.registerProvider( 'HTML5', vidimHTML5Provider );

}
