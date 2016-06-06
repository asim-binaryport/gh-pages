'use strict';
var reg;// Type is ServiceWorkerRegistration
var sub;// Type is PushSubscription 
var subscribeButton = document.querySelector('button');
var isSubscribed = false;
var subscribeButton = document.querySelector('button');

// TODO
// Register -> Install -> Activate
if ('serviceWorker' in navigator) {
    console.log('Service Worker is supported');
    navigator.serviceWorker.register('sw.js').then(serviceWorkerRegisterSuccessHandler).catch(serviceWorkerRegisterFailureHandler);
}

function serviceWorkerRegisterSuccessHandler(swReg){
	console.log("serviceWorkerRegisterSuccessHandler called");
	console.log(':^)', swReg);

	navigator.serviceWorker.ready.then(swReadyHandler).catch(function(e) {
        console.error('Error getting subscription', e);
    });
}
function swReadyHandler(swReg){
	console.log("swReadyHandler called");
	console.log(':^)', swReg);

	
	swReg.pushManager.getSubscription().then(subscriptionAlreadyExists).catch(subscriptionNotAlreadyExists);
	
	
	reg = swReg;
	subscribeButton.addEventListener('click', swSubUnsubBtnClickHandler);
}

function subscriptionAlreadyExists(pushSubscription){
    if(!!pushSubscription) {
        //Send subscription to application server
//        sendSub(pushSubscription);
    	sub = pushSubscription;
    	  console.log("You are already subscribed..........", pushSubscription.endpoint);
//    	  var tokens = pushSubscription.endpoint.split("/");
//    	  alert(tokens[tokens.length - 1]);
    	  isSubscribed = true;
    	  subscribeButton.textContent = 'Unsubscribe';
      }
      else {
    	  console.log("You are NOT subscribed..........");
    	  isSubscribed = false;
    	  subscribeButton.textContent = 'Subscribe';
      }
}
function subscriptionNotAlreadyExists(error){
	console.error('Error getting existing subscription', error);
//	subscribeButton.disabled = false;
	isSubscribed = false;
	subscribeButton.textContent = 'Subscribe';
}
function swSubUnsubBtnClickHandler(event){
	  if (isSubscribed == true) {
		    unsubscribe();
		  } else {
		    subscribe();
		  }
}
function serviceWorkerRegisterFailureHandler(error){
	console.log("serviceWorkerRegisterFailureHandler called");
	console.log(':^(', error);
}
function subscribe() {
	  reg.pushManager.subscribe({userVisibleOnly: true}).then(serviceWorkerSubscribeSuccessHandler);
}
function serviceWorkerSubscribeSuccessHandler(pushSubscription){
	console.log("serviceWorkerSubscribeSuccessHandler called");
	console.log('Subscribed! Endpoint:', pushSubscription, pushSubscription.endpoint);
//	var tokens = pushSubscription.endpoint.split("/");
//    alert(tokens[tokens.length - 1]);
	
    sub = pushSubscription;
    subscribeButton.textContent = 'Unsubscribe';
    isSubscribed = true;
    
}
function unsubscribe() {
  sub.unsubscribe().then(swUnsubscribeSuccessHandler).catch(swUnsubscribeFailureHandler);
}
function swUnsubscribeSuccessHandler(event){
	console.log('Unsubscribed!', event);
	
    subscribeButton.textContent = 'Subscribe';
    isSubscribed = false;
	
}
function swUnsubscribeFailureHandler(error){
    console.log('Error unsubscribing', error);
    subscribeButton.textContent = 'Subscribe';
}