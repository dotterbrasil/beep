
var onboard = false;
var plugado = false;
var plugado_anterior = false;
var walking_monitor = false;
var walking_notification = 0;
var alerta = false;
var notification_id = 1;

var lat_anterior = 0;
var lon_anterior = 0;
var tempo_anterior = 0;
var velocidade_media = 0;
var speed_matrix = [0, 0, 0, 0, 0];


function onDeviceReady() {
				
		onboard = false;
		//plugado = false;
		//plugado_anterior = false;
		notification_id = 1;
		cordova.plugins.backgroundMode.enable();
		cordova.plugins.backgroundMode.onactivate = function() {notificacao_local('Background','Ativado.', 1);};
		cordova.plugins.notification.local.clearAll();

		monitora_bateria();
		speed_monitor();

}


function inicializacao(){

	onboard = false;
	//plugado = false;
	//plugado_anterior = false;
	walking_monitor = false;
	walking_notification = 0;
	
	//if (notification_id > 1) { cordova.plugins.notification.local.clearAll(); }
	notification_id = 1;

	lat_anterior = 0;
	lon_anterior = 0;
	tempo_anterior = 0;
	velocidade_media = 0;

	for (var limpa_matrix = 0; limpa_matrix <5; limpa_matrix++)
				{
				speed_matrix[limpa_matrix] = 0;
				}

				
	document.addEventListener("deviceready", onDeviceReady, false);
}



function home(){
	
	document.location.href='index.html';
	
}

function notificacao_local(tipo, mensagem_local, indice){
//notificacao_local(tipo, mensagem, badge)
//tipo: ALERTA, VELOCIDADE, BATERIA
//badge: 1, 2, 3

var som = "file://alerta.wav";
var icone = "file://icon.png";
var now = new Date().getTime();
var _5_sec_from_now = new Date(now + 5 * 1000); 
var agora = new Date(now);


cordova.plugins.notification.local.schedule({ 
                     id: notification_id, 
                     title: tipo, 
                     text: mensagem_local, 
                     at: agora, 
                     sound: som, 
					 icon: icone,
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

        navigator.geolocation.getCurrentPosition(showPosition, showError, {enableHighAccuracy: true});
    } else {
       document.getElementById("status").innerHTML = "Geolocation is not supported by this browser.";
    }
	
	
}



 function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
	
	notificacao_local('ALERTA','Crianca no Carro: ' + latlon, 1);
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(playsound,3000);
	
	document.getElementById("principal").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	     
	 document.getElementById("principal").innerHTML = "<br><br><iframe width=80% height=200px src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";
		  
 }

 
function speed_monitor(){

watchID = setInterval(function(){navigator.geolocation.getCurrentPosition(onSuccess, showError, {enableHighAccuracy: true});}, 3000);

}


function onSuccess(position){

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

	
	if (Math.round(tempo.getTime()/1000) == tempo_anterior)
		{
		velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) + 1 - tempo_anterior);
		}
		else { velocidade = distancia * 3.6 / (Math.round(tempo.getTime()/1000) - tempo_anterior); }
	
	if (isNaN(velocidade)) { velocidade = velocidade_media;}
	
	if (velocidade < 0) { velocidade = 0;}
	
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
	
	
	element.innerHTML = '<hr>Velocidade: ' + velocidade_media  + ' km/h <br />' +  '<hr />' + '<font size = 1>Coord: ' + latlon + '</font>';
	
		
	lat_anterior = position.coords.latitude*Math.PI/180;
	lon_anterior = position.coords.longitude*Math.PI/180;
	tempo_anterior = Math.round(tempo.getTime()/1000);
	
	speed_matrix[4] = speed_matrix[3];
	speed_matrix[3] = speed_matrix[2];
	speed_matrix[2] = speed_matrix[1];
	speed_matrix[1] = speed_matrix[0];

	if (velocidade_media < 5)
		{
		if (!plugado)
			{
			if (onboard == true)
				{
				if (walking_monitor == false)
					{
					if ( walking_notification < 1 ) { notificacao_local('VELOCIDADE BAIXA','Avaliando saida do carro.', 1); }
					element.innerHTML = '<hr>Avaliando saida do carro.';
					walking_monitor = true;
					walking_notification++;
					if (waking__notification > 10) { walking_notification = 0; }
					iswalking();
					}
				}
			}
		}

	if(velocidade_media > 20)
		{
		if (plugado)
			{
			if (onboard == false) {	notificacao_local('VELOCIDADE','Checkin Efetuado.', 1);}
			}
			else
				{
				if (onboard == false) 
					{ notificacao_local('VELOCIDADE','Checkin Efetuado. Conecte o carregador.', 1);	}
				}
		if (alerta == true) { home(); }
		onboard = true;
		check_in();		
		}

}


function showError(error){

    var element = document.getElementById('status');
notificacao_local('ERRO','Erro ao obter coordenadas.', 1);

}


// onError Callback receives a PositionError object
//
function onError(error) {

	var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		notificacao_local('ALERTA','Crianca presente no carro.', 1);
		document.getElementById("principal").innerHTML = "<img src='imagens/fundo_alerta.gif'align='center'>";
		onboard = false;
		alerta = true;
		setTimeout(localizacao,30000);
		}
		
}

function gera_alarme() {
	
var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		notificacao_local('ALERTA','Crianca presente no carro.', 1);
		document.getElementById("principal").innerHTML = "<img src='imagens/fundo_alerta.gif'align='center'>";
		onboard = false;
		alerta = true;
		setTimeout(localizacao,30000);
		}
	
}




//---------------------------------------------------------------------------- ALERTS  ----------------------------------------------------------------------------

 


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

function kids_ble(){

document.location.href = "kids_ble.html";
	
}
 
 
function lista_kids(){ 

var itens = ""; 
var indice = conta_kids(); 
 
if (typeof(Storage) !== "undefined") 
	{ 
 	if(localStorage.length) 
 		{ 
 		for ( var i = 0, len = localStorage.length; i < len; ++i )
 			{ 
 			if(localStorage.getItem("kid"+i) !== null) 
 				{ 
 				itens = itens + "<div onclick='qrcode("+i+");'>"+localStorage.getItem("kid"+i) + "  <img src='imagens/menos.png' class='icone' onclick='limpa_kid(" + i + ");'></div><br>"; 
 				} 
 			} 
 		if(indice>0)
			{
			document.getElementById("principal").innerHTML = "<img src='imagens/fundo.gif'align='center'>";
			document.getElementById("status").innerHTML = "<h3 align='center'>KIDS</h3><hr><font face='sans-serif'>" + itens + "</font><hr />";
			}
 		} 
 		else {	alert("Cadastre as criancas.");	} 
 	 
 	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
} 



function qrcode(i){

var qrcode = "<img src='http://chart.apis.google.com/chart?cht=qr&chl="+localStorage.getItem("kid"+i)+i+"&chs=200x200'>";

document.getElementById("status").innerHTML = "<h3 align='center'><font face='sans-serif'>" + localStorage.getItem("kid"+i)+" - QRCODE</h3><hr>";

document.getElementById("lista").innerHTML = qrcode + "<br> Este QRCODE deve ser impresso e colocado na cadeirinha. <div onclick='help_qrcode();'>SAIBA COMO</div>";

document.getElementById("links").innerHTML = "<a href='config.html' class='blue'><b>BACK</a> - </b><img src='imagens/menos.png' class='icone' onclick='limpa_kid(" + i + ");'><br><img src='imagens/virtualid.gif' class='assinatura'>"

//document.getElementById("principal").style.backgroundImage = "url('')";
//document.getElementById("principal").style.paddingTop = "0%";
//document.getElementById("principal").style.paddingBottom = "0%";

}

function limpa_kid(i){
	localStorage.removeItem("kid"+i);
	//lista_kids();
	location.reload();
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
	document.getElementById("principal").innerHTML = "<img src='imagens/fundo_verde.gif'align='center'>";
	document.getElementById("lista").innerHTML = "<h3 align='center'>ONBOARD</h3><hr><font face='sans-serif'>" + itens + "</font><hr />";
	}
	
}


function check_out(i){

if(localStorage.getItem("in"+i) !== null)
	{
	alert("Crianca "+localStorage.getItem("in"+i)+" retirada");
	localStorage.removeItem("in"+i);
	//location.reload();
	document.location.href = "index.html";
	}
	else {alert("Crianca ja saiu ou nao entrou no carro");}
	
var indice = conta_in();
if (indice==0) { home(); }
}

function total_checkout(){

var indice = conta_kids();

notificacao_local('ALERTA','Alerta desativado em modo manual. ATENCAO: este procedimento pode colocar a crianca em risco!', 1);
//var reaviso = setTimeout(localizacao,30000);
//onError();

for (var i=0; i<indice; ++i)
	{
	alert("Chekout Manual! Crianca "+localStorage.getItem("in"+i)+" retirada de forma insegura.");
	localStorage.removeItem("in"+i);
	//location.reload();
	document.location.href = "index.html";
	}
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


//---------------------------------------------------------------------------- SCANNER  ----------------------------------------------------------------------------

var aux = "";

function startScan() {

	var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	

	scanner.scan(
		function (result) {
						
			aux = result.text;
			if(result.format == 'QR_CODE')
				{
				identificador = aux.substring(aux.length-1);
				check_out(identificador);
				}
				else{	total_checkout();	}
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


//---------------------------------------------------------------------------- Conexao Bateria  ----------------------------------------------------------------------------

function monitora_bateria(){

window.addEventListener("batterystatus", onBatteryStatus, false);

}

function onBatteryStatus(info) {
	
		document.getElementById('status').innerHTML = "Level: " + info.level + " isPlugged: " + info.isPlugged;
		
		plugado = info.isPlugged;
		
		if (onboard == true)
			{
			if (!plugado)
				{
				notificacao_local('ALERTA','Recomenda-se o uso com o carregador conectado.', 1);
				if (plugado_anterior) { gera_alarme(); }
				}
				//else{	onboard = true;check_in();	}
			}
			else{ if (plugado){	document.location.href = "index.html";	}	}
			
		plugado_anterior = plugado;
			
	}
	
	
//---------------------------------------------------------------------------- Avaliacao de Caminhada  ----------------------------------------------------------------------------

	var loop = 0;	
	var contador = 0;
	var soma_eixo = 0;
	var media = 0;
	var array_eixo = new Array();
	var anterior = false;
	
	
	function iswalking(){ 

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
			
				
			if(frequencia > '1.2' && frequencia < '3.4') {	gera_alarme();	}


		}
	}
