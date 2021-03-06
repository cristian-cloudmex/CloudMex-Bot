
const pg = require("pg");

var connectionString = "pg://postgres:HHTRuWoENcMv1w0vWFcQ@chatbots.cgd5y8wpwke1.us-east-1.rds.amazonaws.com:5432/new_database";
var client = new pg.Client(connectionString);

module.exports = {

    //Permite conectar a la bd de postgresql
    connect: async function(){
        await client.connect();
        console.log("database connected");
    },
    //Permite insertar la respuesta de dialogflow a la bd 
    insertDialogflowResponseQuery: async function(dialogflowTextMessage){
        let query = 'INSERT INTO messages_history (id_packs_chatbots,type,message_text) VALUES ($1,$2,$3)';
        let values = [8,"O",dialogflowTextMessage];

        await client.query(query,values,(err,res) =>{
        if (err) {
            console.log(err.stack);
            console.log("dialogflow response not sended");
        } else {
            console.log(res.rows[0]);
            console.log("dialogflow response sended");
        }
        });
    },
    //Permite ingresar el mensaje de entrada del usuario a la bd 
    insertUserInput: async function(userTextMessage){
        let query = 'INSERT INTO messages_history (id_packs_chatbots,type,message_text) VALUES ($1,$2,$3)';
        let values = [8,"I",userTextMessage];

        await client.query(query,values,(err,res) =>{
            if (err) {
            console.log(err.stack);
            console.log("user data not sended");
            } else {
            console.log(res.rows[0]);
            console.log("user data sended");
            }
        });
    },
    
    //Permite ingresar datos del usuario a la bd 
    insertDataValues: async function(email,name,service,phone){
        let query = 'INSERT INTO data_values (id_data_capture,value_1,value_2,value_3,value_4,value_5) VALUES ($1,$2,$3,$4,$5,$6)';
        let values = [1,name,email,phone,service,null];

        await client.query(query,values,(err,res) =>{
            if (err) {
            console.log(err.stack);
            console.log("user data not captured");
            } else {
            console.log(res.rows[0]);
            console.log("user data captured");
            }
        });
    }
}
