
const BIGQUERY = require('@google-cloud/bigquery');
const DATE = require('./Date');

module.exports = {
    
    //permite mandar mensajes a bigquery
    sendMessageToBigquery: async function(projectId, datasetId, tableId, message, type){

        const bigquery = new BIGQUERY({
            projectId: projectId 
        });
        
        let actualDate = DATE.getDate();

        const rows = [{Message: message, Type: type, Date: actualDate}];
        
        await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows)
        .then(() => {
            console.log("El mensaje del usuario fue enviado a bigquery");
        })
    },
    
    //Permite mandar información de contacto a bigquery
    sendContactToBigquery: async function(projectId, datasetId, tableId, name, phone, service, email){

        const bigquery = new BIGQUERY({
            projectId: projectId 
        });

        let actualDate = DATE.getDate();

        const rows = [{Name: name, Phone: phone, Service: service, Email: email, Date: actualDate}];
        
        await bigquery
        .dataset(datasetId)
        .table(tableId)
        .insert(rows)
        .then(() => {
            console.log("El mensaje del usuario fue enviado a bigquery");
        })

    }

}