require( 'dotenv' ).config();

const path = require( 'path' );
const https = require( 'https' );

const express = require( 'express' );
const basicAuth = require( 'express-basic-auth' );

const api = require( './modules/api' );

const LISTEN_PORT = 4000;

const app = express();

// eslint-disable-next-line no-process-env
const API_KEY = process.env.API_KEY;

if ( !API_KEY ) {
    throw new Error( 'Unable to load API key' );
}

const users = {};
let recordsData = {
    records: [],
};
// eslint-disable-next-line no-process-env
users[ process.env.ACCESS_USERNAME ] = process.env.ACCESS_PASSWORD;

const getUnauthorizedResponse = function getUnauthorizedResponse ( request ) {
    if ( request.auth ) {
        return `Credentials ${ request.auth.user }:${ request.auth.password } rejected`;
    }

    return 'No credentials provided';
};

app.use( basicAuth( {
    challenge: true,
    unauthorizedResponse: getUnauthorizedResponse,
    users: users,
} ), ( request, response, next ) => {
    response.cookie( 'request-user', request.auth.user );
    response.cookie( 'request-password', request.auth.password );

    next();
} );
app.use( '/', express.static( path.join( __dirname, 'web' ) ) );

app.get( '/api-key', ( request, response ) => {
    response.json( process.env.API_KEY );
} );

app.listen( process.env.PORT || LISTEN_PORT, () => {
    // eslint-disable-next-line no-process-env
    console.log( `Highscore listening on port ${ process.env.PORT || LISTEN_PORT }!` );
} );
