( function() {

  'use strict';

  var htmlSrc1 = [
    {
      type: 'video/webm',
      src: 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Symmetric-Traffic.webm'
    },
    {
      type: 'video/mp4',
      src: 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Symmetric-Traffic.mp4'
    },
    {
      type: 'video/ogv',
      src: 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Symmetric-Traffic.ogv'
    }
  ];

  var htmlSrc2 = [
    {
      type: 'video/mp4',
      src: 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Coverr-Lulu.mp4'
    },
    {
      type: 'video/ogv',
      src: 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Coverr-Lulu.ogv'
    }
  ];

  var poster1 = 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Symmetric-Traffic.jpg';
  var poster2 = 'https://s3-eu-west-1.amazonaws.com/originalexe/vidim/videos/Coverr-Lulu.jpg';

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
