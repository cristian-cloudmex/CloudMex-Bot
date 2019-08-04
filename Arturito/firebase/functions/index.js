// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion,Payload,Text,Image} = require('dialogflow-fulfillment');
const bigQuery  = require('./config/bigquery');
const db = require('./config/databaseQuery');
const facebookData = require('./config/facebookAPI');
const req = require('request');

//conexion a la base de datos
db.connect();

//bigquery data
var projectId = 'cloudmex-assistant-93660';
var datasetId = 'Arturito';

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  //Captamos información del usuario e imprimimos en la consola de firebase 
  var userInputMessage = JSON.parse(JSON.stringify(request.body.queryResult.queryText));
  var dialogflowResponse = JSON.parse(JSON.stringify(request.body.queryResult.fulfillmentText)); 
  
  //Facebook data
  var facebookUserId = JSON.parse(JSON.stringify(request.body.originalDetectIntentRequest.payload.data.sender.id));
  var facebookTokenPage = `EAAK4XIvoEDYBAN9Evy9Xz1zlq3vmd7QFMkfZBKYdEZB6usD6wxxzZCZB3OGI7uIjc1psVakKRyxU60INSZCFUCRTqlWfawMiZClgYAciAJ1ftejPrWoXbZCYQ64GiXvVrWl91ofkoZAJHpd8Vyb19K7vLAqN0kNlW0gcBK57s09WiwZDZD`;
  var facebookUsername = facebookData.callApiFacebookUsername(facebookUserId,facebookTokenPage);
  
  console.log("User input: " + userInputMessage);
  console.log("Dialogflow repsonse: " + dialogflowResponse);
  console.log("Facebook user: " + facebookUserId);
  console.log("Facebook username: " + facebookUsername);

  //Inserta datos de entrada del usuario a la bd y a bigquery
  db.insertUserInput(userInputMessage);
  bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',userInputMessage,'I');
  
  //INTENTS FUNCTIONS
  function welcome(agent) {

    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');

    let responses = [
      "¡Hola! " + facebookUsername + ", ¿Cómo te va?",
      "¡Hey!" + facebookUsername + "¿Cómo estás?",
      "¡Buenos días " + facebookUsername + "!, estoy listo para apoyarte.",  
      "Qué gusto escucharte. ¿En que te puedo servir?",
      "Hola, yo soy Arturito, ¿Cómo te puedo ayudar?"
    ];

    //Seleccion random de respuestas
    let random = responses[Math.floor(Math.random() * responses.length)];
    agent.add(random);

    /* Ejemplo Peticion de plantilla de lista

    let dataTemplate = `{

    "recipient":{
      "id": ${facebookUserId}
    },
    "message": {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": [
            {
              "title": "Classic T-Shirt Collection",
              "subtitle": "See all our colors",
              "image_url": "https://peterssendreceiveapp.ngrok.io/img/collection.png",          
              "buttons": [
                {
                  "title": "View",
                  "type": "web_url",
                  "url": "https://peterssendreceiveapp.ngrok.io/collection",
                  "messenger_extensions": true,
                  "webview_height_ratio": "tall",
                  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
                }
              ]
            },
            {
              "title": "Classic White T-Shirt",
              "subtitle": "See all our colors",
              "default_action": {
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/view?item=100",
                "messenger_extensions": false,
                "webview_height_ratio": "tall"
              }
            },
            {
              "title": "Classic Blue T-Shirt",
              "image_url": "https://peterssendreceiveapp.ngrok.io/img/blue-t-shirt.png",
              "subtitle": "100% Cotton, 200% Comfortable",
              "default_action": {
                "type": "web_url",
                "url": "https://peterssendreceiveapp.ngrok.io/view?item=101",
                "messenger_extensions": true,
                "webview_height_ratio": "tall",
                "fallback_url": "https://peterssendreceiveapp.ngrok.io/"
              },
              "buttons": [
                {
                  "title": "Shop Now",
                  "type": "web_url",
                  "url": "https://peterssendreceiveapp.ngrok.io/shop?item=101",
                  "messenger_extensions": true,
                  "webview_height_ratio": "tall",
                  "fallback_url": "https://peterssendreceiveapp.ngrok.io/"            
                }
              ]        
            }
          ],
           "buttons": [
            {
              "title": "View More",
              "type": "postback",
              "payload": "payload"            
            }
          ]  
        }
      }
    }
  }`;

  facebookData.callApiFacebookTemplate(facebookTokenPage,dataTemplate);

  */

  }// fin welcome intent
 
  function fallback(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function services(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }// fin services intent

  function Address(agent){
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }// fin address intent

  function cloudmex(agent){
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function community(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function Help(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function HowRU(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function fine(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function starWars(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function Thanks(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function WhoRU(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function workshop(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  //Price intents

  function price(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function priceYes(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function priceNo(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  } 

  //Contact intents
  function contact(agent){
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
  }

  function contactEmail(agent){
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
    var email = JSON.parse(JSON.stringify(request.body.queryResult.parameters.email));
  }

  function contactName(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
    var nombre = JSON.parse(JSON.stringify(request.body.queryResult.parameters.name));;
  }

  function contactService(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
    var servicio = JSON.parse(JSON.stringify(request.body.queryResult.parameters.service));
  }

  function contactPhone(agent) {
    db.insertDialogflowResponseQuery(dialogflowResponse);
    bigQuery.sendMessageToBigquery(projectId,datasetId,'Messages',dialogflowResponse,'O');
    var phone = JSON.parse(JSON.stringify(request.body.queryResult.parameters['phone-number']));
    db.insertDataValues(email,nombre,servicio,phone);
    bigQuery.sendContactToBigquery(projectId,datasetId,'Datos_contacto',nombre,phone,servicio,email);
  }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('ServicesIntent',services);
  intentMap.set('AddressIntent',Address);
  intentMap.set('CloudMexIntent',cloudmex);
  intentMap.set('CommunityIntent',community);
  intentMap.set('HelpIntent',Help);
  intentMap.set('HowRUIntent',HowRU);
  intentMap.set('ImFineIntent',fine);
  intentMap.set('StarwarsIntent',starWars);
  intentMap.set('ThanksIntent',Thanks);
  intentMap.set('WhoRUIntent',WhoRU);
  intentMap.set('WorkshopIntent',workshop);
  //Princing intent
  intentMap.set('PricingIntent',price);
  intentMap.set('PricingIntent - yes', priceYes);
  intentMap.set('PricingIntent - no', priceNo);
  //contact intent
  intentMap.set('ContactIntent',contact);
  intentMap.set('ContactIntent - email',contactEmail);
  intentMap.set('ContactIntent - name', contactName);
  intentMap.set('ContactIntent - services', contactService);
  intentMap.set('ContactIntent - phone',contactPhone);

  agent.handleRequest(intentMap);

}); // end export Fulfillment

