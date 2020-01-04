var glob = require( 'glob' )
  , path = require( 'path' );

glob.sync( './models/**/*.js' ).forEach( function( file ) {
  require( path.resolve( file ) );
});