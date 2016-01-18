
var onboard = false;
var plugado = "false";
var walking_monitor = false;
var notification_id = 1;

var lat_anterior = 0;
var lon_anterior = 0;
var tempo_anterior = 0;
var velocidade_media = 0;
var speed_matrix = [0, 0, 0, 0, 0];
var leitura = 0;

var xspeed = 0;
var yspeed = 0;
var zspeed = 0;
var xyzspeed = 0;
var pre_accX = 0;
var pre_accY = 0;
var pre_accZ = 0;

function onDeviceReady() {
		//window.plugins.backgroundjs.lockBackgroundTime();
		//onboard = false;
		//speedup_monitor();
				
		bluetoothle.initialize(initializeSuccess, initializeError, {request: false, statusReceiver: true});
		
		
		
		//monitora_bateria();
			
		//cordova.plugins.notification.local.hasPermission(function (granted) { 
        //          if(granted == true)
		//			{
		//			notificacao_local('VELOCIDADE',' TESTE', 1);
		//			}
         //      }); 
		 //cordova.plugins.notification.local.clearAll();
		 //navigator.geolocation.clearWatch(watchID);
		
		onboard = false;
plugado = "false";
notification_id = 1;
	//window.plugins.backgroundjs.lockBackgroundTime();
	cordova.plugins.backgroundMode.enable();
	
	//alert('Habilitado: ' + cordova.plugins.backgroundMode.isEnabled());
		
	cordova.plugins.backgroundMode.onactivate = function() {notificacao_local('Background','Ativado.', 1);};
	
cordova.plugins.notification.local.clearAll();

monitora_bateria();

speed_monitor();

//geoback();

}


function inicializacao(){

onboard = false;
plugado = "false";
walking_monitor = false;
notification_id = 1;

lat_anterior = 0;
lon_anterior = 0;
tempo_anterior = 0;
velocidade_media = 0;
leitura = 0;

xspeed = 0;
yspeed = 0;
zspeed = 0;
xyzspeed = 0;
pre_accX = 0;
pre_accY = 0;
pre_accZ = 0;

	document.addEventListener("deviceready", onDeviceReady, false);
}

function inicio(){

onboard = false;
plugado = "false";
notification_id = 1;

//setInterval(window.plugins.backgroundjs.lockBackgroundTime(), 1000);

window.plugins.backgroundjs.lockBackgroundTime();

monitora_bateria();
		//onboard = false;
		
		cordova.plugins.notification.local.clearAll();
		 //navigator.geolocation.clearWatch(watchID);
		 //speedup_monitor();
		 speed_monitor();
}

function home(){

	//onboard = false;
	bluetoothle.stopScan(initializeError, initializeSuccess);
	document.location.href='index.html';
	
}

function notificacao_local(tipo, mensagem_local, indice){
//notificacao_local(tipo, mensagem, badge)
//tipo: ALERTA, VELOCIDADE, BATERIA
//badge: 1, 2, 3

var som = "file://alerta.wav";
var now = new Date().getTime();
var _5_sec_from_now = new Date(now + 5 * 1000); 
var agora = new Date(now);


//var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf'; 

cordova.plugins.notification.local.schedule({ 
                     id: notification_id, 
                     title: tipo, 
                     text: mensagem_local, 
                     at: agora, 
                     sound: som, 
                     badge: notification_id 
                 }); 

notification_id++;

}

function modulo(argumento){

var resultado = Math.sqrt(Math.pow(argumento,2));

return resultado;
	
}

//---------------------------------------------------------------------------- COORDENADAS  ----------------------------------------------------------------------------

function localizacao()
{

if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
       document.getElementById("status").innerHTML = "Geolocation is not supported by this browser.";
    }
	
	
}



 function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
	
	notificacao_local('ALERTA','Crianca no Carro: ' + latlon, 1);
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(playsound,3000);
	
	//document.getElementById("mapa").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	document.getElementById("principal").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	
     //document.getElementById("mapa").innerHTML = "<br><br><iframe width=80% height=80% src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("principal").innerHTML = "<br><br><iframe width=80% height=80% src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";

	//envia_sms(latlon);
	  
 }

 
function speed_monitor(){

// Options: throw an error if no update is received every 5 minutes.
//
//watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 300000 });


//watchID = navigator.geolocation.watchPosition(onSuccess, onError, { enableHighAccuracy: true });
//watchID = setInterval(function(){navigator.geolocation.getCurrentPosition(teste, showError);}, 3000);

//navigator.geolocation.getCurrentPosition(teste, showError);

//var isbackground = false;

//watchID = setInterval(function(){
//							isbackground = cordova.plugins.backgroundMode.isActive(); 
//							notificacao_local('Background',isbackground, 1);
//							if (isbackground == true)
//								{notificacao_local('Background','agora em back', 1);navigator.geolocation.getCurrentPosition(teste_background, showError);}
//								else
//									{navigator.geolocation.getCurrentPosition(teste, showError);}
//							}, 3000);


//xyz = navigator.accelerometer.watchAcceleration(XSuccess, XError, Xoptions);

xyz = navigator.accelerometer.watchAcceleration(ac_media, XError, Xoptions);

}

function ac_media(acceleration){

if (leitura < 10)
	{
		pre_accX = pre_accX + acceleration.x;
		pre_accY = pre_accY + acceleration.y;
		pre_accZ = pre_accZ + acceleration.z;
		leitura++;
	}
	else{
		leitura = 0;
		pre_accX = pre_accX / 10;
		pre_accY = pre_accY / 10;
		pre_accZ = pre_accZ / 10;
		accxyz = Math.sqrt(modulo(Math.pow(pre_accX ,2) + Math.pow(pre_accY, 2) + Math.pow(pre_accZ, 2) - 95.90447) );
		acctes(accxyz);
		pre_accX = 0;
		pre_accY = 0;
		pre_accZ = 0;
		}
	
	
}

function acctes(accxyz){

var soma = 0;


//accxyz = Math.sqrt(modulo(Math.pow(acceleration.x ,2) + Math.pow(acceleration.y, 2) + Math.pow(acceleration.z, 2) - 95.90447) );

//if (accxyz > 1) { xyzspeed = xyzspeed + accxyz * 0.1; } else { xyzspeed = xyzspeed / 2;}

if (accxyz > 1) { xyzspeed = xyzspeed + accxyz * 1; } else { xyzspeed = xyzspeed / 2;}


speed_matrix[0] = xyzspeed;
	
			for (var varredura = 0; varredura <5; varredura++)
				{
				soma = soma + speed_matrix[varredura];
				}
	
			velocidade_media = Math.round(soma / 5);
			
			speed_matrix[4] = speed_matrix[3];
			speed_matrix[3] = speed_matrix[2];
			speed_matrix[2] = speed_matrix[1];
			speed_matrix[1] = speed_matrix[0];
	   
	   
	   var element = document.getElementById('status');
	   //element.innerHTML = 'Velocidade XYZ: ' + xyzspeed + ' velocidade media: ' + velocidade_media + ' sX: ' + xspeed + ' sY: ' + yspeed + ' sZ: ' + zspeed;
	   element.innerHTML = 'Velocidade XYZ: ' + xyzspeed + ' velocidade media: ' + velocidade_media + ' Acc: ' + accxyz;

	   if(velocidade_media > 30)
		{
		if (plugado == "true")
			{
			if (onboard == false) {	element.innerHTML = 'Checkin Efetuado. Conectado.';}
			}
			else
				{
				if (onboard == false) 
					{ notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);	}
				}
		onboard = true;
		check_in();		
		}
		
		if (velocidade_media < 3)
		{
		if (plugado == "false")
			{
			if (onboard == true)
				{
				element.innerHTML = 'Avaliando saida do carro.';
if (walking_monitor == false){
				notificacao_local('VELOCIDADE','Avaliando saida do carro.', 1);
walking_monitor = true;
				iswalking();
}
				}
			}
		}

}


function XSuccess(acceleration) {
    //alert('Acceleration X: ' + acceleration.x + '\n' +
     //     'Acceleration Y: ' + acceleration.y + '\n' +
      //    'Acceleration Z: ' + acceleration.z + '\n' +
       //   'Timestamp: '      + acceleration.timestamp + '\n');

	   	   	   		   
	   var soma = 0;
	   var componentes = "";
	   var accX = 0;
	   var accY = 0;
	   var accZ = 0;

		if ((modulo(acceleration.x)>2)&&(modulo(acceleration.x - pre_accX)<2))
			{componentes = componentes + "x";
			accX = 0;
			}
			else {
				if (modulo(acceleration.x)>0){accX = acceleration.x;}
				if ((modulo(acceleration.y)>2)&&(modulo(acceleration.y - pre_accY)<2))
					{componentes = componentes + "y";
					accY = 0;
					}
					else {
						if (modulo(acceleration.y)>0){accY = acceleration.y;}
						if ((modulo(acceleration.z)>2)&&(modulo(acceleration.z - pre_accZ)<2)) {componentes = componentes + "z";accZ = 0; }
							else { if (modulo(acceleration.z)>0){accZ = acceleration.z;} }
						}
				}
		
		
		   
	   pre_accX = acceleration.x;
	   pre_accY = acceleration.y;
	   pre_accZ = acceleration.z;
	   
	   if (accX == 0) {xspeed = xspeed / 2;} else { xspeed = xspeed + accX * 0.1; } // simula o efeito do atrito sobre a velocidade do carro
	   if (accY == 0) {yspeed = yspeed / 2;} else { yspeed = yspeed + accY * 0.1; } // exigindo que exista aceleracao para manter a velocidade
	   if (accZ == 0) {zspeed = zspeed / 2;} else { zspeed = zspeed + accZ * 0.1; } // caso contrario, a velocidade comeca a cair
	   
	   //xyzspeed = Math.round(Math.sqrt(Math.sqrt(Math.pow(Math.pow(xspeed, 2) + Math.pow(yspeed, 2) + Math.pow(zspeed, 2) - 97.0225, 2))) * 3.6);
	   xyzspeed = Math.round(Math.sqrt(Math.pow(xspeed, 2) + Math.pow(yspeed, 2) + Math.pow(zspeed, 2)) * 3.6);
	   //notificacao_local('Velocidade X',xspeed, 1);
	   
	    
	   speed_matrix[0] = xyzspeed;
	
			for (var varredura = 0; varredura <5; varredura++)
				{
				soma = soma + speed_matrix[varredura];
				}
	
			velocidade_media = Math.round(soma / 5);
			
			speed_matrix[4] = speed_matrix[3];
			speed_matrix[3] = speed_matrix[2];
			speed_matrix[2] = speed_matrix[1];
			speed_matrix[1] = speed_matrix[0];
	   
	   
	   var element = document.getElementById('status');
	   //element.innerHTML = 'Velocidade XYZ: ' + xyzspeed + ' velocidade media: ' + velocidade_media + ' sX: ' + xspeed + ' sY: ' + yspeed + ' sZ: ' + zspeed;
	   element.innerHTML = 'Velocidade XYZ: ' + xyzspeed + ' velocidade media: ' + velocidade_media;
	   
	   if(velocidade_media > 30)
		{
		if (plugado == "true")
			{
			if (onboard == false) {	element.innerHTML = 'Checkin Efetuado. Conectado.';}
			}
			else
				{
				if (onboard == false) 
					{ notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);	}
				}
		onboard = true;
		check_in();		
		}
		
		if (velocidade_media < 3)
		{
		if (plugado == "false")
			{
			if (onboard == true)
				{
				element.innerHTML = 'Avaliando saida do carro.';
				notificacao_local('VELOCIDADE','Avaliando saida do carro.', 1);
				iswalking();
				}
			}
		}
   

}

function XError() {
	var element = document.getElementById('status');
    element.innerHTML = 'Erro de Deteccao de Velocidade';
}

var Xoptions = { frequency: 100 };  // Update every 3 seconds



function geoback(){

var bgGeo = window.plugins.backgroundGeoLocation;

 //var yourAjaxCallback = function(response) {
        ////
        // IMPORTANT:  You must execute the #finish method here to inform the native plugin that you're finished,
        //  and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        //
        //
 //       bgGeo.finish();
 //   };

	var callbackFn = function(location, taskId) {
		notificacao_local('VELOCIDADE',location.latitude, 1);
        //alert('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
        // Do your HTTP request here to POST location to your server.
        //
        //
		
		navigator.geolocation.getCurrentPosition(teste_background, showError);
		//navigator.geolocation.getCurrentPosition(teste, showError);
		
        setTimeout(function() {
			bgGeo.finish(taskId); // <-- execute #finish when your work in callbackFn is complete
        }, 1000);

    };
 
    var failureFn = function(error) {
        alert('BackgroundGeoLocation error');
    }

	// BackgroundGeoLocation is highly configurable.
    bgGeo.configure(callbackFn, failureFn, {
        desiredAccuracy: 10,
        stationaryRadius: 10,
        distanceFilter: 10,
        activityType: 'Fitness'
    });
 
 // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
    bgGeo.start();

    
}

function teste_background(position){

var element = document.getElementById('status');
var tempo = new Date();	
var velocidade = 0;
var soma = 0;

		
	var latlon = location.latitude + "," + location.longitude;
	
	
	if (lat_anterior == 0)
		{
		lat_anterior = location.latitude*Math.PI/180;
		lon_anterior = location.longitude*Math.PI/180;
		tempo_anterior = Math.round(tempo.getTime()/1000)-1;
		}
	
	
	var distancia = 6371795.477598 * Math.acos(Math.sin(lat_anterior) * Math.sin(location.latitude*Math.PI/180) + Math.cos(lat_anterior) * Math.cos(location.latitude*Math.PI/180) * Math.cos(lon_anterior - location.longitude*Math.PI/180));
	
	
	if (Math.round(tempo.getTime()/1000) == tempo_anterior)
		{
		velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) + 1 - tempo_anterior);
		}
		else { velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) - tempo_anterior); }
	
	if (isNaN(velocidade)) { velocidade = velocidade_media;}
	
	if (velocidade < 0) { velocidade = 0;}
	
	//if (velocidade < (velocidade_media + 30))
	//	{
			speed_matrix[0] = velocidade;
	
			if ((speed_matrix[1]>speed_matrix[0])&&(speed_matrix[1]>speed_matrix[2]))
					{
					speed_matrix[1] = (speed_matrix[0] + speed_matrix[2]) / 2;
					}
	
			for (var varredura = 0; varredura <5; varredura++)
				{
				soma = soma + speed_matrix[varredura];
				}
	
			velocidade_media = Math.round(soma / 5);
	
	
			element.innerHTML = 'Velocidade: ' + velocidade_media  + ' km/h <br />' +  '<hr />' + 'Coord: ' + latlon + '<br>';
	notificacao_local('VELOCIDADE',velocidade_media, 1);
	
			lat_anterior = position.coords.latitude*Math.PI/180;
			lon_anterior = position.coords.longitude*Math.PI/180;
			tempo_anterior = Math.round(tempo.getTime()/1000);
	
			speed_matrix[4] = speed_matrix[3];
			speed_matrix[3] = speed_matrix[2];
			speed_matrix[2] = speed_matrix[1];
			speed_matrix[1] = speed_matrix[0];
	//	}
		
		
	
	if (velocidade_media < 2)
		{
		if (plugado == "false")
			{
			if (onboard == true)
				{
				element.innerHTML = 'Avaliando saida do carro.';
				//notificacao_local('VELOCIDADE','Avaliando saida do carro.', 1);
				iswalking();
				}
			}
		}

	if(velocidade_media > 20)
		{
		if (plugado == "true")
			{
			if (onboard == false) {	element.innerHTML = 'Checkin Efetuado. Conectado.'; }
			}
			else
				{
				if (onboard == false) 
					{ notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);	}
				}
		onboard = true;
		check_in();		
		}
		
		bgGeo.stop(finaliza, failureFn);

}



function teste(position){

var element = document.getElementById('status');
var tempo = new Date();	
var velocidade = 0;
var soma = 0;

		
	var latlon = position.coords.latitude + "," + position.coords.longitude;
	
	
	if (lat_anterior == 0)
		{
		lat_anterior = position.coords.latitude*Math.PI/180;
		lon_anterior = position.coords.longitude*Math.PI/180;
		tempo_anterior = Math.round(tempo.getTime()/1000)-1;
		}
	
	
	var distancia = 6371795.477598 * Math.acos(Math.sin(lat_anterior) * Math.sin(position.coords.latitude*Math.PI/180) + Math.cos(lat_anterior) * Math.cos(position.coords.latitude*Math.PI/180) * Math.cos(lon_anterior - position.coords.longitude*Math.PI/180));
	
	//var distancia = 6371 * Math.acos(Math.sin(lat_anterior) * Math.sin(latitude_x) + Math.cos(lat_anterior) * Math.cos(latitude_x) * Math.cos(lon_anterior - longitude_x));
	
	if (Math.round(tempo.getTime()/1000) == tempo_anterior)
		{
		velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) + 1 - tempo_anterior);
		}
		else { velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) - tempo_anterior); }
	
	if (isNaN(velocidade)) { velocidade = velocidade_media;}
	
	if (velocidade < 0) { velocidade = 0;}
	
	//if (velocidade < (velocidade_media + 30))
	//	{
			speed_matrix[0] = velocidade;
	
			if ((speed_matrix[1]>speed_matrix[0])&&(speed_matrix[1]>speed_matrix[2]))
					{
					speed_matrix[1] = (speed_matrix[0] + speed_matrix[2]) / 2;
					}
	
			for (var varredura = 0; varredura <5; varredura++)
				{
				soma = soma + speed_matrix[varredura];
				}
	
			velocidade_media = Math.round(soma / 5);
	
	
			element.innerHTML = 'Velocidade: ' + velocidade_media  + ' km/h <br />' +  '<hr />' + 'Coord: ' + latlon + '<br>';
	//notificacao_local('VELOCIDADE',velocidade_media, 1);
	
			lat_anterior = position.coords.latitude*Math.PI/180;
			lon_anterior = position.coords.longitude*Math.PI/180;
			tempo_anterior = Math.round(tempo.getTime()/1000);
	
			speed_matrix[4] = speed_matrix[3];
			speed_matrix[3] = speed_matrix[2];
			speed_matrix[2] = speed_matrix[1];
			speed_matrix[1] = speed_matrix[0];
	//	}
		
		
	
	if (velocidade_media < 2)
		{
		if (plugado == "false")
			{
			if (onboard == true)
				{
				element.innerHTML = 'Avaliando saida do carro.';
				//notificacao_local('VELOCIDADE','Avaliando saida do carro.', 1);
				iswalking();
				}
			}
		}

	if(velocidade_media > 20)
		{
		if (plugado == "true")
			{
			if (onboard == false) {	element.innerHTML = 'Checkin Efetuado. Conectado.'; }
			}
			else
				{
				if (onboard == false) 
					{ notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);	}
				}
		onboard = true;
		check_in();		
		}

}


function showError(error){

    var element = document.getElementById('status');
notificacao_local('ERRO','Erro ao obter coordenadas.', 1);

}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess(position) {
    var element = document.getElementById('status');
	
	var qtde_in = conta_in();
	
	var latlon = position.coords.latitude + "," + position.coords.longitude;
	
	 element.innerHTML = 'Velocidade: ' + Math.round(position.coords.speed*3.6)     + ' km/h <br />' +  '<hr />' + 'Coords: ' + latlon + '<br>';
	
	
	if (position.coords.speed < 0)
		{
		if (plugado == "false")
			{
			if (onboard == true)
				{
				element.innerHTML = 'Avaliando saida do carro.';
				notificacao_local('VELOCIDADE','Avaliando saida do carro.', 1);
				iswalking();
				}
			}
		}
		//else{
		//	if (position.coords.speed > 5) {clearTimeout(temporizador);} //cancela checkout forcado se velocidade subir
		//	}
	if(position.coords.speed > 1)
		{
		if (onboard == false)
			{
			if (plugado == "true")
				{
				notificacao_local('VELOCIDADE','Checkin Efetuado. Conectado.', 1);
				//document.location.href="checkin.html";
				}
				else
					{
					//playsound();
					//element.innerHTML = "<b> Conecte o Carregador </b>";
					notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);
					//document.location.href = "checkin.html";
					//onboard = true;check_in();navigator.geolocation.clearWatch(watchIN);speed_monitor();monitora_bateria();
					}
			onboard = true;check_in();
			}
		}
}

// onError Callback receives a PositionError object
//
function onError(error) {

	var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		notificacao_local('ALERTA','Crianca presente no carro.', 1);
		//document.location.href = "desativar.html";
		onboard = false;setTimeout(localizacao,5000);
		}
		//else{ speed_monitor(); 
		//	document.location.href = "index.html"; 
		//	}

    //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}




//function stop_monitor(){

//navigator.geolocation.clearWatch(watchID);

//}


//---------------------------------------------------------------------------- ALERTS  ----------------------------------------------------------------------------

 
 function contatos(){

var indice = 0;

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("nome"+i) !== null)
				{
				++indice;
				}
			}
		}
		else {	alert("Cadastre contatos.");	}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}


 // Show Contact Picker
	var successCallback = function(result){
				
		localStorage.setItem("nome"+indice, result.name);
		localStorage.setItem("telefone"+indice, result.phoneNumber);
		lista();
	};
	
	var failedCallback = function(result){
		setTimeout(function(){alert(result);},0);
	}
window.plugins.contactNumberPicker.pick(successCallback,failedCallback);

 }



function lista(){

var itens = "";
var indice = conta_contatos();

document.getElementById("principal").innerHTML = itens+"<img src='imagens/fundo.gif' width=100% align='center' >";

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("nome"+i) !== null)
				{
				itens = itens + localStorage.getItem("nome"+i) + " - " + localStorage.getItem("telefone"+i) + "<img src='imagens/menos.png' width=5% onclick='limpa_item(" + i + ");'> <br>";
				}
			}
			if(indice>0){ document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>"+itens+"</font>"; }
		}
		else {	alert("Cadastre contatos para receberem os alertas.");	}
	
	} else {  document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}


}


function limpa_item(i){
	localStorage.removeItem("nome"+i);
	localStorage.removeItem("telefone"+i);
	lista();
  }
  

function limpa_contatos(){
  localStorage.clear();
  lista();
}

function conta_contatos(){

var indice = 0;

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("nome"+i) !== null)
				{
				++indice;
				}
			}
		}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

return indice;
}

//---------------------------------------------------------------------------- KIDS  ----------------------------------------------------------------------------

function kids(){ 
 
var crianca = prompt("Nome: ","").toUpperCase(); 
var indice = conta_kids(); 
 
if (typeof(Storage) !== "undefined") 
	{ 
	localStorage.setItem("kid"+indice,crianca); 
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
localStorage.setItem("kid"+indice,crianca); 

lista_kids();

}
 
 
function lista_kids(){ 

var itens = ""; 
var indice = conta_kids(); 
 
if (typeof(Storage) !== "undefined") 
	{ 
 	if(localStorage.length) 
 		{ 
 		//for ( var i = 0; i < indice; ++i ) 
		for ( var i = 0, len = localStorage.length; i < len; ++i )
 			{ 
 			if(localStorage.getItem("kid"+i) !== null) 
 				{ 
 				itens = itens + "<div onclick='qrcode("+i+");'>"+localStorage.getItem("kid"+i) + "</div><br>"; 
 				} 
 			} 
 		if(indice>0)
			{
			document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>" + itens + "</font>";
			document.getElementById("principal").style.backgroundImage = "url('imagens/fundo.gif')";
			
			proporcao = (35 - indice*4).toString()+"%";
			document.getElementById("principal").style.paddingTop = proporcao;
			document.getElementById("principal").style.paddingBottom = proporcao;
			}
 		} 
 		else {	alert("Cadastre as criancas.");	} 
 	 
 	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
} 



function qrcode(i){

var qrcode = "<img src='http://chart.apis.google.com/chart?cht=qr&chl="+localStorage.getItem("kid"+i)+i+"&chs=200x200'>";

document.getElementById("principal").innerHTML = "<font face='sans-serif'>" + localStorage.getItem("kid"+i)+"<img src='imagens/menos.png' width=10% onclick='limpa_kid(" + i + ");'> <br>" + qrcode + "<br> Este QRCODE deve ser impresso e colocado na cadeirinha. <div onclick='help_qrcode();'>SAIBA COMO</div>";

document.getElementById("principal").style.backgroundImage = "url('')";
document.getElementById("principal").style.paddingTop = "0%";
document.getElementById("principal").style.paddingBottom = "0%";

}

function limpa_kid(i){
	localStorage.removeItem("kid"+i);
	lista_kids();
  }


function conta_kids(){

var indice = 0;

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("kid"+i) !== null)
				{
				++indice;
				}
			}
		}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

return indice;

}

function conta_in(){

var indice = conta_kids();
var indice_in = 0;


if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0; i < indice; ++i )
			{
			if(localStorage.getItem("in"+i) !== null)
				{
				++indice_in;
				}
			}
		}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

return indice_in;

}

function check_in(){

var indice = conta_kids();
var itens = "";

for (var i=0; i<indice; ++i)
	{
	localStorage.setItem("in"+i,localStorage.getItem("kid"+i));
	
	itens = itens + "<div>"+localStorage.getItem("in"+i) + " <a href='javascript:startScan();' class='green'>CHECK OUT</a></div><br>";
	
	}

if(indice>0)
	{
	document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>" + itens + "</font>";
	document.getElementById("principal").style.backgroundImage = "url('imagens/fundo_verde.gif')";
	
	proporcao = (35 - indice*4).toString()+"%";
	
	document.getElementById("principal").style.paddingTop = proporcao;
	document.getElementById("principal").style.paddingBottom = proporcao;
	}
	
}

function check_out(i){

if(localStorage.getItem("in"+i) !== null)
	{
	alert("Crianca "+localStorage.getItem("in"+i)+" retirada");
	localStorage.removeItem("in"+i);
	location.reload();
	}
	else {alert("Crianca ja saiu ou nao entrou no carro");}
	
var indice = conta_in();
if (indice==0) { home(); }
}


//---------------------------------------------------------------------------- MEDIA  ----------------------------------------------------------------------------


function playsound() {
  
  var url = getMediaURL("sons/alerta.wav");
  
  var my_media = new Media(url,null,mediaError);
  
  my_media.play();
  
}

function getMediaURL(s) {


    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
	if(device.platform.toLowerCase() === "ios") return "/" + s;
	
    return 'file://'+ s;
}


function mediaError(){
	var element = document.getElementById('status');
	
	element.innerHTML = 'Erro de Som';

}



//---------------------------------------------------------------------------- SMS  ----------------------------------------------------------------------------

function envia_sms(latlon){

var mensagem = "teste"+latlon;

if (typeof(Storage) !== "undefined") {
    // Store
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("telefone"+i) !== null)
				{
				app.sendSms(localStorage.getItem("telefone"+i),mensagem);
				}
			}
		}
		else
		{
		alert("Cadastre contatos para receberem os alertas.");
		}
	
} else {
    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";
}


}


var app = {
    sendSms: function(telefone,mensagem) {
        var number = telefone;
        var message = mensagem;
        alert(number);
        alert(message);

        //CONFIGURATION
        var options = {
            replaceLineBreaks: false, // true to replace \n by a new line, false by default
            android: {
                intent: 'INTENT'  // send SMS with the native android SMS messaging
                //intent: '' // send SMS without open any other app
            }
        };

        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send(number, message, options, success, error);

    }
};

//---------------------------------------------------------------------------- SCANNER  ----------------------------------------------------------------------------

var aux = "";

function startScan() {

	var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	

	scanner.scan(
		function (result) {
						
			aux = result.text;
			if(result.format == 'DATA_MATRIX')
				{
				separa(aux);
				}
				else
					{
					identificador = aux.substring(aux.length-1);
					check_out(identificador);
					}
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

		
}

function desativa(){

var indice = conta_in();

if (indice==0)	{	home();	}
	else{	startScan();	}

}

//---------------------------------------------------------------------------- CARROS  ----------------------------------------------------------------------------


function carros(item){

var carro = prompt("Nome: ","").toUpperCase(); 
var indice = conta_carros(); 
var endereco = document.getElementById(item).innerHTML;
 
 alert(endereco);
 
if (typeof(Storage) !== "undefined") 
	{ 
	localStorage.setItem("car"+indice,carro); 
	localStorage.setItem("car_address"+indice,endereco);
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
localStorage.setItem("car"+indice,carro); 

lista_carros();

}


function conta_carros(){
var indice = 0;

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("car"+i) !== null)
				{
				++indice;
				}
			}
		}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

return indice;
}

function lista_carros(){

var itens = ""; 
var indice = conta_carros(); 
 
if (typeof(Storage) !== "undefined") 
	{ 
 	if(localStorage.length) 
 		{ 
 		//for ( var i = 0; i < indice; ++i ) 
		for ( var i = 0, len = localStorage.length; i < len; ++i )
 			{ 
 			if(localStorage.getItem("car"+i) !== null) 
 				{ 
 				itens = itens + "<div onclick='beacar("+i+");'>"+localStorage.getItem("car"+i) + "</div><br>"; 
 				} 
 			} 
 		if(indice>0)
			{
			document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>" + itens + "</font>";
			document.getElementById("principal").style.backgroundImage = "url('imagens/fundo.gif')";
			
			proporcao = (35 - indice*4).toString()+"%";
			document.getElementById("principal").style.paddingTop = proporcao;
			document.getElementById("principal").style.paddingBottom = proporcao;
			}
 		} 
 		else {	alert("Cadastre seus carros.");	} 
 	 
 	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
}

function beacar(i){

var beacon = "<img src='imagens/fundo_verde.gif' width='20%'>";

document.getElementById("principal").innerHTML = "<font face='sans-serif'>" + beacon + localStorage.getItem("car"+i)+"<img src='imagens/menos.png' width=10% onclick='limpa_car(" + i + ");'> <br>" + localStorage.getItem("car_address"+i) + "<br> Este BEACON identifica o seu carro. <div onclick='help_beacar();'>SAIBA COMO</div>";

document.getElementById("principal").style.backgroundImage = "url('')";
document.getElementById("principal").style.paddingTop = "0%";
document.getElementById("principal").style.paddingBottom = "0%";

}

function limpa_car(i){
	localStorage.removeItem("car"+i);
	localStorage.removeItem("car_address"+i);
	document.getElementById("principal").innerHTML = "";
	lista_carros();
  }
  
 

//---------------------------------------------------------------------------- BLUETOOTH  ----------------------------------------------------------------------------
function scanBLE(tipo){

var indice = 0;
var itens = "";

document.getElementById("status").innerHTML = "Escaneando dispositivos BLE";

document.getElementById("principal").innerHTML = "";

	bluetoothle.startScan(
		function(obj){
			if (obj.status == "scanResult")
				{
				//Device found
				indice++;
				//document.getElementById("principal").innerHTML = document.getElementById("principal").innerHTML+obj.address+" - "+indice+"<br>";
				//document.getElementById("principal").innerHTML = document.getElementById("principal").innerHTML + "<div onclick='"+tipo+"("+obj.address+");'>" + obj.address+" - "+indice+"</div><br><hr/>";
				
				document.getElementById("principal").innerHTML += "<div id="+indice+" onclick='"+tipo+"("+indice+");'>" + obj.address+"</div><br><hr/>";
				
				if (indice > 3) {bluetoothle.stopScan(initializeError, initializeSuccess);}
				}
				else if (obj.status == "scanStarted")
					{
					//Scan started
					if (indice>3) {bluetoothle.stopScan(initializeError, initializeSuccess);}
					}
		},startScanError,{allowDuplicates: false});

}


function initializeSuccess(){

notificacao_local('VELOCIDADE','BLE on', 1);
}

function initializeError(){

notificacao_local('VELOCIDADE','BLE off', 1);

}

function startScanSuccess(){

alert("BLE sucesso");
}

function startScanError(){
alert("BLE erro");
}


function erro_carros(){
alert("Erro ao listar BLEs");
}


//---------------------------------------------------------------------------- Conexao Bateria  ----------------------------------------------------------------------------

function monitora_bateria(){

window.addEventListener("batterystatus", onBatteryStatus, false);

}

function onBatteryStatus(info) {
	
		document.getElementById('status').innerHTML = "Level: " + info.level + " isPlugged: " + info.isPlugged;
		
		plugado = info.isPlugged;
		
		if (onboard == true)
			{
			if (plugado == false)
				{
				notificacao_local('ALERTA','Crianca presente no carro. Bateria.', 1);
				//document.location.href = "desativar.html";
				//onboard = false;setTimeout(localizacao,5000);speedup_monitor();monitora_bateria();
				onboard = false;setTimeout(localizacao,5000);
				}
				else{
					//document.location.href = "checkin.html";
					onboard = true;check_in();
					}
			}
			else{
				if (plugado == true)
					{
					document.location.href = "index.html";
					//inicio();
					}
				}
			
	}
	
	
//---------------------------------------------------------------------------- Avaliacao de Caminhada  ----------------------------------------------------------------------------

	var loop = 0;	
	var contador = 0;
	var soma_eixo = 0;
	var media = 0;
	var array_eixo = new Array();
	var anterior = false;
	
	
	function iswalking(){ 
	//	document.getElementById("status").innerHTML = "";
		//navigator.geolocation.clearWatch(watchID);
		//clearInterval(watchID);
		loop = 0;	
		contador = 0;
		soma_eixo = 0;
		media = 0;
		array_eixo = [];
		anterior = false;
		
		accelerometer();
	}		
	function accelerometer(){ 
		navigator.accelerometer.getCurrentAcceleration(motion, error);
	}
	function error(){
		alert('Error!');
	}
	function motion(acceleration){
		var x = acceleration.x;
		var x_int = Math.round(x);
		var accel_x = Math.pow(x_int, 2);
		
		var y = acceleration.y;
		var y_int = Math.round(y);
		var accel_y = Math.pow(y_int, 2);
		
		var z = acceleration.z;
		var z_int = Math.round(z);
		var accel_z = Math.pow(z_int, 2);
		
		if(loop < 50){			
		//	document.getElementById("status").innerHTML = "<br><h2>"+loop+"</h2>"; 		
	
			var xyz = accel_x + accel_y + accel_z;
			var xyzSqrt = Math.sqrt(xyz);
			var eixo = Math.round(xyzSqrt);
			array_eixo.push(eixo);
			
			soma_eixo = soma_eixo + eixo;
			loop++;
			setTimeout(accelerometer, 100);	
		}
		else
		{		
			var m = soma_eixo / 50;
			media = Math.round(m);
walking_monitor = false;
			
			for (i = 0; i < 50; i++){	
				var v = array_eixo[i] - media;
				var vetor = Math.round(v);
				
				if(!anterior){
					if(vetor > 1){
						contador++;
						anterior = true;					
					}
					else if (vetor <= '-2')
					{
						anterior = false;
					}
				}
				else 
				{
					if(vetor <= '-2') {
						anterior = false; 
					}
				}  
			} 
			frequencia = contador / 5;
			
			//document.getElementById("status").innerHTML += "<br><h2>Result</h2><br>Frequência "+ frequencia; 	
		
		
			if(frequencia > '1.2' && frequencia < '3.4')
				{
			//	document.getElementById("status").innerHTML += "<br><h2>Is Walking</h2>"; 	
			//	notificacao_local('VELOCIDADE','Motorista esta andando a pe.', 2);
				onError();
				//return true;
				}
			//else {speed_monitor();}
			//	document.getElementById("status").innerHTML += "<br><h2>Is not Walking</h2>"; 
			
			
			//speed_monitor();

		}
	}
