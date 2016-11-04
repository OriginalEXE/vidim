// General options
QUnit.test( 'wrapperClass', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    wrapperClass: 'qunit-wrapper'
  });

  var wrapper = document.querySelector( '.qunit-wrapper' );

  assert.notEqual( wrapper, null );

});

QUnit.test( 'overlayClass', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    overlayClass: 'qunit-overlay'
  });

  var overlay = document.querySelector( '.qunit-overlay' );

  assert.notEqual( overlay, null );

});

QUnit.test( 'Poster only', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    poster: 'base/test/video/Coverr-Lulu.jpg'
  });

  var wrapper = vidimInstance.wrapper;

  assert.notEqual( wrapper.style.backgroundImage, '' );

});

QUnit.test( 'showPosterBeforePlay', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: false,
    showPosterBeforePlay: true
  });

  assert.notEqual( vidimInstance.wrapper.style.backgroundImage, '' );

  vidimInstance.destroy();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: false,
    showPosterBeforePlay: false
  });

  assert.equal( vidimInstance.wrapper.style.backgroundImage, '' );

});

QUnit.test( 'zIndex', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    zIndex: 999
  });

  assert.equal( vidimInstance.wrapper.style.zIndex, 999 );

});

QUnit.test( 'scanDOM', function( assert ) {

  var div = document.createElement( 'div' );

  div.setAttribute(
    'data-vidim',
    "{ src: [{ type: 'video/mp4', src: 'base/test/video/Coverr-Lulu.mp4'}]}"
  );

  document.querySelector( '#qunit-fixture' ).appendChild( div );

  vidim.scanDOM();

  var sources = document.querySelectorAll( 'source' );

  assert.equal( sources.length, 1 );
  assert.equal( sources[0].getAttribute( 'type' ), 'video/mp4' );

});

// HTML5
QUnit.test( 'HTML5 Video Works', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg'
  });

  var sources = document.querySelectorAll( 'source' );

  assert.equal( sources.length, 2 );
  assert.equal( sources[0].getAttribute( 'type' ), 'video/mp4' );
  assert.equal( sources[1].getAttribute( 'type' ), 'video/webm' );

});

QUnit.test( 'HTML5 autoplay', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: false
  });

  assert.ok( ! vidimInstance.el.hasAttribute( 'autoplay' ) );

  vidimInstance.destroy();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: true
  });

  assert.ok( vidimInstance.el.hasAttribute( 'autoplay' ) );

});

QUnit.test( 'HTML5 loop', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    loop: false
  });

  assert.ok( ! vidimInstance.el.hasAttribute( 'loop' ) );

  vidimInstance.destroy();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    loop: true
  });

  assert.ok( vidimInstance.el.hasAttribute( 'loop' ) );

});

QUnit.test( 'HTML5 muted', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    muted: true
  });

  assert.equal( vidimInstance.el.muted, true );

  vidimInstance.destroy();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    muted: false
  });

  assert.notEqual( vidimInstance.el.muted, true );

});

QUnit.test( 'HTML5 preload', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    preload: 'meta'
  });

  assert.equal( vidimInstance.el.getAttribute( 'preload' ), 'meta' );

});

QUnit.test( 'HTML5 changeSource', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg'
  });

  var sources = vidimInstance.wrapper.querySelectorAll( 'source' );

  assert.equal( sources.length, 2 );

  vidimInstance.changeSource([
    {
      type: 'video/webm',
      src: 'base/test/video/Coverr-Lulu.webm'
    }
  ]);

  sources = vidimInstance.wrapper.querySelectorAll( 'source' );

  assert.equal( sources.length, 1 );
  assert.equal( sources[0].getAttribute( 'type' ), 'video/webm' );

});

QUnit.test( 'HTML5 showPosterOnEnd:true', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnEnd: true,
    loop: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'end', function() {

      assert.equal( vidimInstance.el.style.opacity, 0 );

      done();

    });

    vidimInstance.setTime( vidimInstance.getDuration() );

  });

});

QUnit.test( 'HTML5 showPosterOnEnd:false', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnEnd: false,
    loop: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'end', function() {

      assert.equal( vidimInstance.el.style.opacity, 1 );

      done();

    });

    vidimInstance.setTime( vidimInstance.getDuration() );

  });

});

QUnit.test( 'HTML5 showPosterOnPause:true', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnPause: true
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'pause', function() {

      assert.equal( vidimInstance.el.style.opacity, 0 );

      done();

    });

    vidimInstance.pause();

  });

});

QUnit.test( 'HTML5 showPosterOnPause:false', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnPause: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'pause', function() {

      assert.equal( vidimInstance.el.style.opacity, 1 );

      done();

    });

    vidimInstance.pause();

  });

});

QUnit.test( 'HTML5 startAt', function( assert ) {

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: [
      {
        type: 'video/mp4',
        src: 'base/test/video/Coverr-Lulu.mp4'
      },
      {
        type: 'video/webm',
        src: 'base/test/video/Coverr-Lulu.webm'
      }
    ],
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: false,
    startAt: 3
  });

  assert.equal( vidimInstance.getTime(), 3 );

});


// YouTube
QUnit.test( 'YouTube Video Works', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    onReady: function() {

      assert.equal( window.vidimYouTubeAPIReady, true );

      var iframe = document.querySelector( 'iframe' );

      assert.notEqual( iframe, null );

      done();

    }
  });

});

QUnit.test( 'YouTube autoplay', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    quality: 'small',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    onReady: function( instance ) {

      var state = instance.player.getPlayerState();

      assert.ok( -1 !== [-1, 5].indexOf( state ) );

      instance.destroy();

      var vidimInstance = new vidim( '#qunit-fixture', {
        src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
        type: 'YouTube',
        quality: 'small',
        poster: 'base/test/video/Coverr-Lulu.jpg',
        onReady: function( instance ) {

          var state = instance.player.getPlayerState();

          assert.ok( -1 !== [1, 3].indexOf( state ) );

          done();

        },
        autoplay: true
      });

    },
    autoplay: false
  });

});

QUnit.test( 'YouTube muted', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    quality: 'small',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    muted: false,
    onReady: function( instance ) {

      assert.ok( ! instance.player.isMuted() );

      instance.destroy();

      var vidimInstance = new vidim( '#qunit-fixture', {
        src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
        type: 'YouTube',
        quality: 'small',
        poster: 'base/test/video/Coverr-Lulu.jpg',
        muted: true,
        onReady: function( instance ) {

          setTimeout( function() {

            assert.ok( instance.player.isMuted() );

            done();

          }, 2000 );

        }
      });

    }
  });

});

QUnit.test( 'YouTube changeSource', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    quality: 'small',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    onReady: function( instance ) {

      assert.equal( instance.player.getVideoUrl(), 'https://www.youtube.com/watch?v=o6SprGmHTy4' );

      instance.changeSource( 'https://www.youtube.com/watch?v=wDjeBNv6ip0' );

      setTimeout( function() {

        assert.equal( instance.player.getVideoUrl(), 'https://www.youtube.com/watch?v=wDjeBNv6ip0' );

        done();

      }, 2000 );

    }
  });

});

QUnit.test( 'YouTube showPosterOnEnd:true', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnEnd: true,
    loop: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'end', function() {

      assert.equal( vidimInstance.el.style.opacity, 0 );

      done();

    });

    vidimInstance.setTime( vidimInstance.getDuration() );

  });

});

QUnit.test( 'YouTube showPosterOnEnd:false', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnEnd: false,
    loop: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'end', function() {

      assert.equal( vidimInstance.el.style.opacity, 1 );

      done();

    });

    vidimInstance.setTime( vidimInstance.getDuration() );

  });

});

QUnit.test( 'YouTube showPosterOnPause:true', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnPause: true
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'pause', function() {

      assert.equal( vidimInstance.el.style.opacity, 0 );

      done();

    });

    vidimInstance.pause();

  });

});

QUnit.test( 'YouTube showPosterOnPause:false', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    showPosterOnPause: false
  });

  vidimInstance.once( 'play', function() {

    assert.equal( vidimInstance.el.style.opacity, 1 );

    vidimInstance.once( 'pause', function() {

      assert.equal( vidimInstance.el.style.opacity, 1 );

      done();

    });

    vidimInstance.pause();

  });

});

QUnit.test( 'YouTube startAt', function( assert ) {

  var done = assert.async();

  var vidimInstance = new vidim( '#qunit-fixture', {
    src: 'https://www.youtube.com/watch?v=o6SprGmHTy4',
    type: 'YouTube',
    poster: 'base/test/video/Coverr-Lulu.jpg',
    autoplay: false,
    startAt: 3,
    onReady: function( instance ) {

      assert.equal( instance.getTime(), 3 );

      done();

    }
  });

});
