var watchID = "";
var watchIN = "";
var onboard = false;
var plugado = "false";

    
function onDeviceReady() {
		onboard = false;
		speedup_monitor();
		bluetoothle.initialize(initializeSuccess, initializeError, {request: false, statusReceiver: true});
		window.plugins.backgroundjs.lockBackgroundTime();
		//monitora_bateria();
		//window.plugin.notification.local.add({ message: 'Great app!' });
		alert("hey");
    }


function inicializacao(){
	document.addEventListener("deviceready", onDeviceReady, false);
}

function home(){

	onboard = false;
	bluetoothle.stopScan(initializeError, initializeSuccess);
	document.location.href='index.html';
	
}


function notificacao(){

alert("vai");

cordova.plugins.notification.local.schedule({
    title: "New Message",
    message: "Hi, are you ready? We are waiting.",
    
});

alert("foi");

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
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(playsound,3000);
	
	document.getElementById("mapa").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	
     document.getElementById("mapa").innerHTML = "<br><br><iframe width=80% height=80% src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";

	envia_sms(latlon);
	  
 }

 
function speed_monitor(){

// Options: throw an error if no update is received every 5 minutes.
//
watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 300000 });

}

function speedup_monitor(){

// Options: throw an error if no update is received every 30 seconds.
//
//watchIN = navigator.geolocation.watchPosition(onSuccessIN, onError, { frequency: 1000 });

watchIN = navigator.geolocation.watchPosition(onSuccessIN,onError, { enableHighAccuracy: true });

}

function onSuccessIN(position) {
    var element = document.getElementById('status');
	
	var qtde_in = conta_in();
	
    element.innerHTML = 'Velocidade: ' + Math.round(position.coords.speed*3.6)     + ' km/h <br />' +  '<hr />';
	
	if(position.coords.speed > 5)
		{
		if (plugado == "true")
			{
			document.location.href="checkin.html";
			}
			else
				{
				playsound();
				element.innerHTML = "<b> Conecte o Carregador </b>";
				document.location.href = "checkin.html";
				}
		}
	
}


// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess(position) {
    var element = document.getElementById('status');
	
	var qtde_in = conta_in();
	
    element.innerHTML = 'Velocidade: ' + Math.round(position.coords.speed*3.6)     + ' km/h <br />' +  '<hr />'  ;
	
	if (position.coords.speed < 2)
		{
		temporizador = setTimeout(onError, 300000); //faz checkout forcado apos 5 minutos de baixa velocidade
		}
		else{
			if (position.coords.speed > 5) {clearTimeout(temporizador);} //cancela checkout forcado se velocidade subir
			}
	
}

// onError Callback receives a PositionError object
//
function onError(error) {

	var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		document.location.href = "desativar.html";
		}
		else{
			document.location.href = "index.html"; 
			}

    //alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
}




function stop_monitor(){

navigator.geolocation.clearWatch(watchID);

}


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
alert("Erro de Som");
}

function mensagem_local(mensagem_texto){

//var som = getMediaURL("sons/alerta.wav");

window.plugin.notification.local.add({ message: 'alerta'  });

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

alert("BLE on");
}

function initializeError(){
alert("BLE off");
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
				document.location.href = "desativar.html";
				}
				else{ document.location.href = "checkin.html";}
			}
			else{
				if (plugado == true) { document.location.href = "index.html"; }
				}
			
	}