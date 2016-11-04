( function() {

  'use strict';

  var htmlSrc1 = [
    {
      type: 'video/webm',
      src: 'video/Symmetric-Traffic.webm'
    },
    {
      type: 'video/mp4',
      src: 'video/Symmetric-Traffic.mp4'
    },
    {
      type: 'video/ogv',
      src: 'video/Symmetric-Traffic.ogv'
    }
  ];

  var htmlSrc2 = [
    {
      type: 'video/mp4',
      src: 'video/Coverr-Lulu.mp4'
    },
    {
      type: 'video/ogv',
      src: 'video/Coverr-Lulu.ogv'
    }
  ];

  var poster1 = 'video/Symmetric-Traffic.jpg';
  var poster2 = 'video/Coverr-Lulu.jpg';

  var youtubeSrc = 'https://www.youtube.com/watch?v=uVW81kp2HSo';

  var cover = document.querySelector( '.js-cover' );

  Modernizr.on( 'videoautoplay', function( canAutoplay ) {

    var vidimCover = new vidim( cover, {
      src: canAutoplay ? htmlSrc1 : false,
      poster: poster1,
      overlayClass: 'cover__overlay'
    });

    var demo1 = new vidim( '#demo-1', {
      src: canAutoplay ? htmlSrc1 : false,
      poster: poster1
    });

    var demo2 = new vidim( '#demo-2', {
      src: canAutoplay ? youtubeSrc : false,
      type: 'YouTube',
      poster: poster1
    });

    var demo3 = new vidim( '#demo-3', {
      src: htmlSrc1,
      poster: poster1
    });

    document.querySelector( '.js-play' )
      .addEventListener( 'click', function( e ) {

        e.preventDefault();

        demo3.play();

      }, false );

    document.querySelector( '.js-pause' )
      .addEventListener( 'click', function( e ) {

        e.preventDefault();

        demo3.pause();

      }, false );

    document.querySelector( '.js-change-source' )
      .addEventListener( 'click', function( e ) {

        e.preventDefault();

        demo3.changeSource( htmlSrc2, poster2 );

      }, false );

    document.querySelector( '.js-show-poster' )
      .addEventListener( 'click', function( e ) {

        e.preventDefault();

        demo3.showPoster();

      }, false );

  });

})();
