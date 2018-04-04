(function(){
    var dataKey = '5ac4fcf9656b6e0b857c424e';
    var apiSecret;
    var dataInterval;
    var loadRecentData = function loadRecentData(){
        $.ajax( {
            url: 'https://api.jsonbin.io/b/' + dataKey + '/latest',
            type: 'GET',
            headers: {
                'secret-key': apiSecret,
            },
            success: ( recordData ) => {
                recordData.records.sort( ( a, b ) => {
                    if ( a.score > b.score ) {
                        return -1;
                    }

                    if ( a.score < b.score ) {
                        return 1;
                    }

                    return 0;
                } );

                updateContent( recordData );
            },
            error: ( err ) => {
                console.log( err.responseJSON );
            }
        } );
    };

    var updateContent = function updateContent( recordData ){
        $( '.js-records-wrapper' ).empty();

        for ( var i = 0; i < recordData.records.length; i = i + 1 ) {
            $( '.js-records-wrapper' ).append( `<tr>
                <td>${ i + 1 }</td>
                <td>${ recordData.records[ i ].name }</td>
                <td>${ recordData.records[ i ].score }</td>
                </tr>
            ` );
        }
    };

    $( function(){
        $.getJSON( '/api-key', ( apiKey ) => {
            apiSecret = apiKey;

            loadRecentData();
            dataInterval = setInterval( loadRecentData, 10000 );
        } );
    } );
})();
