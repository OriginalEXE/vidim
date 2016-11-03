// Simple utility function for setting default values
export function setDefaults( object, defaults ) {

  const defaultsKeys = Object.keys( defaults );

  defaultsKeys.forEach( ( key ) => {

    if ( ! object.hasOwnProperty( key ) ) {

      object[ key ] = defaults[ key ];

    }

  });

}

// Utility function for when we need to accept the DOM element
export function getElement( query, parent = document ) {

  if ( 'string' === typeof query ) {

    return parent.querySelector( query );

  }

  return query;

}

// Thanks underscore.js :)
export function throttle(func, wait) {
  var timeout, context, args, result;
  var previous = 0;

  var later = function() {
    previous = Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
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

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}

// Fires once the DOM is ready
export function ready( fn ) {

  if ( document.readyState != 'loading' ) {

    fn();

  } else {

    document.addEventListener( 'DOMContentLoaded', fn );

  }

}
