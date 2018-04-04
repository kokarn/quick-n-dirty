require( 'dotenv' ).config();

const https = require( 'https' );

const DATA_STORAGE_HOSTNAME = 'api.jsonbin.io';
const DATABASE_SUCCESS_STATUS_CODE = 200;

const load = function load () {
    return new Promise( ( resolve, reject ) => {
        const request = https.request(
            {
                hostname: DATA_STORAGE_HOSTNAME,
                method: 'GET',
                headers: {
                    'secret-key': process.env.API_KEY
                },
                path: `/b/${ process.env.DATA_KEY }`,
                port: 443,
            },
            ( response ) => {
                let recordData = '';

                response.setEncoding( 'utf8' );

                response.on( 'data', ( chunk ) => {
                    recordData = recordData + chunk;
                } );

                response.on( 'end', () => {
                    console.log( `got ${ recordData }` );
                    const dataSet = JSON.parse( recordData );

                    resolve( dataSet );
                } );
            }
        )
        .on( 'error', ( error ) => {
            reject( error );
        } );

        request.end();
    } );
};

const store = function store ( recordData ) {
    return new Promise( ( resolve, reject ) => {
        const putData = JSON.stringify( recordData );

        const request = https.request(
            {
                headers: {
                    'content-length': Buffer.byteLength( putData ),
                    'content-type': 'application/json',
                    'secret-key': process.env.API_KEY
                },
                hostname: DATA_STORAGE_HOSTNAME,
                method: 'PUT',
                path: `/b/${ process.env.DATA_KEY }`,
                port: 443,
            },
            ( response ) => {
                console.log( response.statusCode, response.body );
                if ( response.statusCode !== DATABASE_SUCCESS_STATUS_CODE ) {
                    reject( new Error( `API returned ${ response.statusCode }` ) );

                    return false;
                }

                resolve();

                return true;
            }
        )
        .on( 'error', ( error ) => {
            reject( error );
        } );

        request.write( putData );
        request.end();
    } );
};

module.exports = {
    load,
    store,
};
