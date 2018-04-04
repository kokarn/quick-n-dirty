(function(){
    var dataKey = '5ac4fcf9656b6e0b857c424e';
    var apiSecret;
    var loadRecentData = function loadRecentData(){
        return new Promise( ( resolve, reject ) => {
            $.ajax( {
                url: 'https://api.jsonbin.io/b/' + dataKey + '/latest',
                type: 'GET',
                headers: {
                    'secret-key': apiSecret,
                },
                success: ( currentData ) => {
                    resolve( currentData );
                },
                error: ( err ) => {
                    reject( err.responseJSON );
                }
            } );
        } );
    };

    var uuidv4 = function uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            )
    };

    var deleteRecord = function deleteRecord( id ) {
        loadRecentData()
            .then( ( currentData ) => {
                for ( let i = 0; i < currentData.records.length; i = i + 1 ) {
                    if ( currentData.records[ i ].id === id ) {
                        currentData.records.splice( i, 1 );
                    }
                }

                $.ajax( {
                    url: 'https://api.jsonbin.io/b/' + dataKey,
                    type: 'PUT',
                    headers: {
                        'secret-key': apiSecret,
                    },
                    contentType: 'application/json',
                    data: JSON.stringify( currentData ),
                    success: ( data ) => {
                        handleData( currentData );
                    },
                    error: ( err ) => {
                        console.log( err.responseJSON );
                    }
                } );
            } );
    };

    var saveRecord = function saveRecord(){
        loadRecentData()
            .then( ( currentData ) => {
                currentData.records.push( {
                    name: $( 'input[name="name"]' ).val(),
                    score: Number( $( 'input[name="score"]' ).val() ),
                    timestamp: Date.now(),
                    id: uuidv4(),
                } );

                $.ajax( {
                    url: 'https://api.jsonbin.io/b/' + dataKey,
                    type: 'PUT',
                    headers: {
                        'secret-key': apiSecret,
                    },
                    contentType: 'application/json',
                    data: JSON.stringify( currentData ),
                    success: ( data ) => {
                        console.log( data );
                        handleSubmit();
                    },
                    error: ( err ) => {
                        console.log( err.responseJSON );
                    }
                } );
            } );
    };

    var handleSubmit = function handleSubmit(){
        $( 'input[name="name"]' ).val( '' ).focus();
        $( 'input[name="score"]' ).val( '' );
    };

    var handleData = function handleData( recordData ){
        $( '.js-records-wrapper' ).empty();

        for ( var i = 0; i < recordData.records.length; i = i + 1 ) {
            $( '.js-records-wrapper' ).append( `<tr>
                <td><a href="#" class="js-del-item" data-id="${ recordData.records[ i ].id }" >Ta bort</a></td>
                <td>${ recordData.records[ i ].name }</td>
                <td>${ recordData.records[ i ].score }</td>
                <td>${ moment( recordData.records[ i ].timestamp ).format( 'MMMM Do YYYY, h:mm:ss a' ) }</td>
                </tr>
            ` );
        }
    };

    $( function(){
        $.getJSON( '/api-key', ( apiKey ) => {
            apiSecret = apiKey;

            loadRecentData()
                .then( ( currentData ) => {
                    handleData( currentData );
                } );
                
            dataInterval = setInterval( () => {
                loadRecentData()
                    .then( ( currentData ) => {
                        handleData( currentData );
                    } );
            }, 5000 );
        } );

        $( 'body' ).on( 'submit', ( event ) => {
            event.preventDefault();

            saveRecord();
        } );

        $( 'body' ).on( 'click', '.js-del-item', ( event ) => {
            if ( confirm( 'Är du säker på att du vill ta bort den här raden?' ) ) {
                deleteRecord( $( event.currentTarget ).data( 'id' ) );
            }
        } );
    } );
})();
