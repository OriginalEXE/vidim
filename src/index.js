import Emitter from 'component-emitter';
import * as utility from './utils.js';
import html5Provider from './providers/html5';
import YouTubeProvider from './providers/youtube';

export default ( function factory( global ) {

  if ( 'undefined' === typeof global.document ) {

    return;

  }

  /**
   * Instance ID counter
   * @type {Number}
   */
  let ID = 0;

  /**
   * Hashmap of instances
   * @type {Object}
   */
  let instances = {};

  /**
   * Default options
   * @type {Object}
   */
  const defaults = {
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
  const optionsProvided = [];

  /**
   * Hashmap of providers
   * @type {Object}
   */
  const providers = {};

  /**
   * Register a provider for handling media embeds
   * @param  {String} type Short identifier for the media type handled
   * @param  {Function|Object} Object or a function that returns object
   */
  function registerProvider( type, provider ) {

    if ( 'function' === typeof provider ) {

      providers[ type ] = provider.call( global, defaults );

    } else {

      providers[ type ] = provider;

    }

  }

  /**
   * Get instance by its ID
   * @param  {integer} id Instance ID
   * @returns {null|Object} null or instance if found
   */
  function getInstanceFromID( id ) {

    if ( ! instances[ id ] ) {

      return null;

    }

    return instances[ id ];

  }

  /**
   * Get instance from the container element
   * @param   {Object|string} element DOM element or a query string
   * @returns {null|Object} null or instance if found
   */
  function getInstanceFromElement( element ) {

    element = utility.getElement( element );

    if (
         'undefined' === typeof element.vidimID
      || ! instances[ element.vidimID ]
    ) {

      return null;

    }

    return instances[ element.vidimID ];

  }

  /**
   * Destroys all active instances
   */
  function destroyAllInstances() {

    for ( let key in instances ) {

      instances[ key ].hasOwnProperty( 'destroy' )
      && instances[ key ].destroy();

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
  function deleteInstance( id ) {

    delete instances[ id ];

  }

  // API method for scanning the DOM and initializing vide instances from
  // data-vide attribute

  /**
   * Scan the DOM for elements that have data-vidim attribute and initialize
   * new vidim instance based on that attribute
   */
  function scanDOM() {

    const vidimElements = document.querySelectorAll( '[data-vidim]' );

    if ( ! vidimElements.length ) {

      return;

    }

    for ( let i = 0; i < vidimElements.length; i++ ) {

      let element = vidimElements[ i ];
      let options = element.getAttribute( 'data-vidim' );

      if ( 'undefined' !== typeof element.vidimID ) {

        // this element already has an instance of vidim
        continue;

      }

      try {

        // The things we do to avoid eval...
        const regex =
          /({|,)(?:\s*)(?:')?([A-Za-z_$\.][A-Za-z0-9_ \-\.$]*)(?:')?(?:\s*):/g;

        let fixedOptions = options
          .replace( regex, '$1"$2":' )
          .replace( /:\s?'/g, ':"' )
          .replace( /'\s?}/g, '"}' )
          .replace( /',"/g, '","' );

        let parsedOptions = JSON.parse( fixedOptions );

        new vidim( element, parsedOptions );

      } catch ( e ) {

        // do nothing

      }

    }

  }

  /**
   * Used for instantiating new instances
   * @param {Object|string} element DOM element or a query string
   * @param {Object} [options={}] Options hash
   */
  function vidim( element, options = {} ) {

    Object.keys( options ).forEach( ( key ) => {

      optionsProvided.push( key );

    });

    // Set defaults
    utility.setDefaults( options, defaults );

    if ( options.src && ! providers[ options.type ] ) {

      return new Error( `No provider can handle type: '${options.type}'` );

    }

    if ( 'string' === typeof options.ratio ) {

      if ( '4/3' === options.ratio ) {

        options.ratio = 4/3;

      } else {

        options.ratio = 16/9;

      }

    }

    this._options = options;
    this.container = utility.getElement( element );

    if ( ! this.container ) {

      return new Error( `Could not find the container: ${element}` );

    }

    // Set more sensitive defaults
    if (
         -1 === optionsProvided.indexOf( 'zIndex' )
      && 'BODY' === this.container.nodeName
    ) {

      this._options.zIndex = -1;

    }

    this._initialize();

  }

  const prototype = vidim.prototype;

  /**
   * Initializes the instance and does the work common to all providers
   */
  prototype._initialize = function() {

    // Assign a unique ID to this instance, and make sure we store it on the
    // container for convenience
    this.vidimID = ID++;
    this.container.vidimID = this.vidimID;

    instances[ this.vidimID ] = this;

    // Add emitter interface to our instance
    Emitter( this );

    // Check if poster was provided but the source was not,
    // in that case we fake a simple provider interface that only displays a
    // poster
    if ( ! this._options.src && this._options.poster ) {

      this._constructWrapper();

      this.destroy = function() {

        this.emit( 'destroy' );

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

      };

      return;

    }

    const provider = providers[ this._options.type ];

    for ( let key in provider ) {

      this[ key ] = provider[ key ];

    }

    if ( 'function' !== typeof this._initializeProvider ) {

      return new Error( 'Provider is missing method: _initializeProvider' );

    }

    this._constructWrapper();
    this._initializeProvider();

    if ( this._options.autoResize ) {

      window.addEventListener(
        'resize',
        utility.throttle( this.resize, 200 ).bind( this ),
        false
      );

    }

    this.resize();

  };

  /**
   * Generates a wrapper that is used for holding the media
   */
  prototype._constructWrapper = function() {

    const containerStyle = getComputedStyle( this.container, null );

    if ( 'static' === containerStyle.getPropertyValue( 'position' ) ) {

      this.container.style.position = 'relative';

    }

    this.wrapper = document.createElement( 'div' );

    if ( 'BODY' === this.container.nodeName ) {

      this.wrapper.style.position = 'fixed';

    } else {

      this.wrapper.style.position = 'absolute';

    }

    if ( this._options.wrapperClass ) {

      if ( 'function' === typeof this._options.wrapperClass ) {

        this.wrapper.classList.add( this._options.wrapperClass.call( this ) );

      } else {

        this.wrapper.classList.add( this._options.wrapperClass );

      }

    }

    this.wrapper.style.left = 0;
    this.wrapper.style.top = 0;
    this.wrapper.style.height = '100%';
    this.wrapper.style.width = '100%';
    this.wrapper.style.overflow = 'hidden';
    this.wrapper.style.zIndex = parseInt( this._options.zIndex, 10 );

    if ( this._options.poster ) {

      this.wrapper.style.backgroundSize = 'cover';
      this.wrapper.style.backgroundPosition = 'center center';
      this.wrapper.style.backgroundRepear = 'no-repeat';

      if ( this._options.showPosterBeforePlay ) {

        this.wrapper.style.backgroundImage = `url('${this._options.poster}')`;

      }

    }

    this.container.insertBefore( this.wrapper, this.container.firstChild );

  };

  /**
   * Generates an overlay that is placed above the media to prevent interaction
   */
  prototype._constructOverlay = function() {

    this.overlay = document.createElement( 'div' );

    this.overlay.style.position = 'absolute';

    if ( this._options.overlayClass ) {

      if ( 'function' === typeof this._options.overlayClass ) {

        this.overlay.classList.add( this._options.overlayClass.call( this ) );

      } else {

        this.overlay.classList.add( this._options.overlayClass );

      }

    }

    this.overlay.style.left = 0;
    this.overlay.style.top = 0;
    this.overlay.style.height = '100%';
    this.overlay.style.width = '100%';

    this.wrapper.appendChild( this.overlay );

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
  html5Provider( vidim );
  YouTubeProvider( vidim );

  // Parse the DOM an auto initialize based on the [data-vidim] attribute
  utility.ready( scanDOM );

  return vidim;

})( 'undefined' !== typeof window ? window : undefined );
