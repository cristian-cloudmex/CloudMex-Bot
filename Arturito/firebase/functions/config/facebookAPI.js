
const requestAPI = require('request-promise');
const req = require('request');

module.exports = {
    //Permite retornar el nombre del usuario de Facebook 
    callApiFacebookUsername: function(user_id, pageToken){
        return requestAPI(`https://graph.facebook.com/${user_id}?fields=first_name&access_token=${pageToken}`)
        .then(function (data) {
            let username = JSON.parse(JSON.stringify(data));
            username = username.first_name;
            console.log(username)
            return username;
        });
    },
    
    /* Permite crear templates mediante un payload proporcionado por facebook 
    https://developers.facebook.com/docs/messenger-platform/send-messages/templates */
    
    callApiFacebookTemplate: async function(pageToken, data){

        let headers = {
            'Content-Type': 'application/json'
        };

        let requestData = {
            url: `https://graph.facebook.com/v2.6/me/messages?access_token=${pageToken}`,
            method: 'POST',
            headers: headers,
            body: data
        };
        
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
            }
        }
        
        req(requestData, callback);
    }

} 