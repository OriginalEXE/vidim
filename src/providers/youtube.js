/* global YT:false */

import * as utility from '../utils.js';

/**
 * Will be set to true once YouTube API is ready
 * @type {Boolean}
 */
let isAPIReady = false;

export default function( vidim ) {

  /**
   * Defaults specific to this provider
   * @type {Object}
   */
  const defaults = {
    quality: 'hd1080'
  };

  /**
   * Provider definition object
   * @type {Object}
   */
  const vidimYouTubeProvider = {

    /**
     * Initial provider setup
     */
    _initializeProvider: function() {

      if ( isAPIReady ) {

        utility.setDefaults( this._options, defaults );

        this._constructPlayer();
        this._listen();

      } else {

        window.addEventListener( 'vidimYouTubeAPIReady', () => {

          utility.setDefaults( this._options, defaults );

          this._constructPlayer();
          this._listen();

        }, false );

      }

    },

    /**
     * Sets up the actual player
     */
    _constructPlayer: function() {

      // Check if YouTube ID was given, and if not, try to extract it from url
      if ( 11 === this._options.src.length ) {

        this.videoID = this._options.src;

      } else {

        let regex =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        let videoMatch = this._options.src.match( regex );

        if ( ! videoMatch || 11 !== videoMatch[2].length ) {

          return new Error( 'Provided source is not a valid YouTube url' );

        }

        this.videoID = videoMatch[2];

      }

      // Create a temporary dom element that will be replaced by the
      // YouTube iframe
      let toBeReplaced = document.createElement( 'div' );

      this.wrapper.appendChild( toBeReplaced );

      const playerParams = {
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
          'onReady': () => {

            if ( this._options.muted ) {

              this.mute();

            }

            this.player.setPlaybackQuality( this._options.quality );

            if ( 'function' === typeof this._options.onReady ) {

              this._options.onReady( this );

            }

            this.emit( 'ready' );

          },
          'onStateChange': ( e ) => {

            switch ( e.data ) {

              case ( 0 ) :
                this.emit( 'end', this );
                break;

              case ( 1 ) :
                this.emit( 'play', this );
                break;

              case ( 2 ) :
                this.emit( 'pause', this );
                break;

              case ( 3 ) :
                this.emit( 'buffering', this );
                break;

            }

          }
        }
      };

      if ( this._options.loop ) {

        playerParams.playlist = this.videoID;
        playerParams.loop = 1;

      }

      this.player = new YT.Player( toBeReplaced, playerParams );

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

      } else {

        // We don't want to display YouTube play button over our video,
        // this is a hacky way to stop that from happening
        this.on( 'end', () => {

          this.player.seekTo( this.player.getDuration() );
          this.player.playVideo();
          this.player.pauseVideo();

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

      this.player.playVideo();

      return this;

    },

    /**
     * Pauses the video playback
     */
    pause: function() {

      this.player.pauseVideo();

      return this;

    },

    /**
     * Sets the player volume
     * @param {Number} [volume=100] Min = 0, Max = 100
     */
    setVolume: function( volume = 100 ) {

      this.player.setVolume( volume );

      return this;

    },

    /**
     * Gets the player volume
     * @returns {Number} Current player volume
     */
    getVolume: function() {

      return this.getVolume();

    },

    /**
     * Mutes the player
     */
    mute: function() {

      this.player.mute();

      return this;

    },

    /**
     * Unmutes the server
     */
    unMute: function() {

      this.player.unMute();

      return this;

    },

    /**
     * Sets the time player should seek to
     * @param {Number} [time=0] Amount of seconds in the video to seek to
     */
    setTime: function( time = 0 ) {

      this.player.seekTo( time, true );

      return this;

    },

    /**
     * Gets the time video playback is currently at
     * @returns {Number} Number of seconds from start to the current position
     */
    getTime: function() {

      return this.player.getCurrentTime();

    },

    /**
     * Gets video duration in seconds
     * @returns {Number} Length of the video in seconds
     */
    getDuration: function() {

      return this.player.getDuration();

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
    changeSource: function( src, newPoster = false ) {

      if ( 11 === src.length ) {

        this.videoID = src;

      } else {

        let regex =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;

        let videoMatch = src.match( regex );

        if ( ! videoMatch || 11 !== videoMatch[2].length ) {

          return new Error( 'Provided source is not a valid YouTube url' );

        }

        this.videoID = videoMatch[2];

      }

      this.player.loadPlaylist(
        this.videoID,
        0,
        this._options.startAt,
        this._options.quality
      );

      this.player.setLoop( this._options.loop );

      if ( newPoster ) {

        var oldPoster = this._options.poster;

        if ( -1 !== this.wrapper.style.backgroundImage.indexOf( oldPoster ) ) {

          this.wrapper.style.backgroundImage = `url('${newPoster}')`;

        }

        this._options.poster = newPoster;

      }

    },

    /**
     * Destroys and unloads the player
     */
    destroy: function() {

      this.emit( 'destroy' );

      this.player.destroy();

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

        this.el.style.height = '';
        this.el.style.width =
          ( this.el.offsetHeight * this._options.ratio ) + 200 + 'px';

      } else {

        this.el.style.maxHeight = '';
        this.el.style.maxWidth = 'calc( 100% + 2px )';

        this.el.style.height = this.el.offsetWidth / this._options.ratio + 'px';
        this.el.style.width = '';

        if ( this.el.offsetHeight < this.wrapper.offsetHeight + 140 ) {

          this.el.style.height =
            ( this.el.offsetWidth / this._options.ratio ) + 140 + 'px';

        }

      }

      this.emit( 'resize' );

    }
  };

  vidim.registerProvider( 'YouTube', vidimYouTubeProvider );

}

// Load the YouTube API
const tag = document.createElement( 'script' );

tag.src = 'https://www.youtube.com/iframe_api';

document.querySelector( 'body' ).appendChild( tag );

// Create our custom event
const event = document.createEvent( 'Event' );

event.initEvent( 'vidimYouTubeAPIReady', true, true );

// Finaly, make sure we trigger that event once the API is ready
if ( 'undefined' === typeof window.onYouTubeIframeAPIReady ) {

  window.onYouTubeIframeAPIReady = function() {

    window.vidimYouTubeAPIReady = true;

    isAPIReady = true;

    window.dispatchEvent( event );

  };

} else {

  let oldOnYouTubeIframeAPIReady = window.onYouTubeIframeAPIReady;

  window.onYouTubeIframeAPIReady = function() {

    oldOnYouTubeIframeAPIReady();

    window.vidimYouTubeAPIReady = true;

    isAPIReady = true;

    window.dispatchEvent( event );

  };

}
