
var onboard = false;
var plugado = false;
var plugado_anterior = false;
var walking_monitor = false;
var gps_on = false;
var walking_notification = 0;
var battery_notification = 0;
var alerta = false;
var notification_id = 1;

var watchID;
var movimentoID;
var alertasID;

var idioma;
var cogido_local;
var last_latlon;


function onDeviceReady() {
				
		onboard = false;
		
		notification_id = 1;
		cordova.plugins.backgroundMode.enable();
		//cordova.plugins.backgroundMode.onactivate = function() {notificacao_cogido_local('WARNING','Este aplicativo e apenas uma ferramenta e nao substitui a atencao e a supervisao de maior responsavel pela saude e seguranca da crianca.', 1);};
		
		//cordova.plugins.backgroundMode.onactivate = le_publicidade();
		cordova.plugins.notification.local.clearAll();

		
		monitora_bateria();
		speed_monitor();
		movimentoID = navigator.accelerometer.watchAcceleration(despertar, error, {frequency: 1000});
		//alertasID = setInterval(busca_alertas, 180000);
		
				
		//var x = Math.floor((Math.random() * 10) + 1);
		//if ((x == 3)&&(!onboard))
		//	{
		//		notificacao_cogido_local('CONVITE','Compartilhe sua experiencia para continuar usando o aplicativo.', 1);
		//		divulgue();
		//	}
			
		//ultima_localizacao();

}


function inicializacao(){

	onboard = false;
	
	
	
	walking_monitor = false;
	walking_notification = 0;
	battery_notification = 0;
	
	notification_id = 1;
				
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

//---------------------------------------------------------------------------- SERVER COMUNICATION  ----------------------------------------------------------------------------



function ultima_localizacao(){

var virtualid = localStorage.getItem("virtualid");
var cogido_local = localStorage.getItem("cogido_local");

last_latlon = localStorage.getItem("latlon");


var dados = {id: virtualid, pais: cogido_local, latlon: last_latlon}

						jQuery.ajax({
						type: "POST",
						url: "http://piuui.com/location.php",
						data: dados,
						success: function(data){
							//alert('Enviado');
						},
						error: function(e){
							//alert(JSON.stringify(e));
						}
					}); 
}



function assinatura(){
//Cria pasta de usuario no servidor



var virtualid = localStorage.getItem("virtualid");
var cogido_local = localStorage.getItem("cogido_local");

var dados = {id: virtualid, pais: cogido_local}

						jQuery.ajax({
						type: "POST",
						url: "http://piuui.com/assinatura.php",
						data: dados,
						success: function(data){
							//alert('Enviado');
						},
						error: function(e){
							//alert(JSON.stringify(e));
						}
					}); 
}






function define_local(){
	
	
	
var tempo = new Date();

var virtualid = "";

var tempo_base_36 = tempo.getTime().toString(36).toUpperCase();


navigator.globalization.getPreferredLanguage(function(language){idioma = language.value;}, function () {alert('Error getting language\n');}
);



navigator.globalization.getLocaleName(function(locale){cogido_local = locale.value;}, function () {alert('Error getting locale\n');}
);

alert(idioma);
alert(codigo_local);

//idioma = idioma.substring(0, 2);



//cogido_local = cogido_local.substr(cogido_local.indexOf("-") + 1);



virtualid = cogido_local+idioma+device.uuid+tempo_base_36;

//mensagem("idioma: "+idioma+"<br>cogido_local: "+cogido_local);
//alert("Um novo usuário foi definido para este aparelho: "+virtualid+".<br>Este código identifica você em todo o sistema e assegura a sua privacidade.<br> Se você compartilhava alertas com outras pessoas, faça a sincronização novamente para este novo usuário.");



if(localStorage.getItem("cogido_local") === null) 
 		{ 
		localStorage.setItem("cogido_local", cogido_local);
		localStorage.setItem("idioma", idioma);
		localStorage.setItem("virtualid", virtualid);
		assinatura();
		}
	
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
	
	//atualiza ultima_localizacao para registro no servidor
	localStorage.setItem("latlon", latlon);
	
	
	notificacao_cogido_local('ALERTA','Crianca no Carro: ' + latlon, 1);
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(playsound,3000);
	
	//envia dados do alerta para o servidor
	registra_alerta();
	
	     
	 document.getElementById("principal").innerHTML = "<br><br><iframe width=80% height=200px src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("status").innerHTML = "<h4 align='center'>ALERT</h4>";
		  
 }
 
 

function showError(error){

    var element = document.getElementById('status');
notificacao_cogido_local('ERRO','Erro ao obter coordenadas.', 1);

}

 
function speed_monitor(){

gps_on = true;
watchID = navigator.geolocation.watchPosition(nova_posicao, erro_posicao, { enableHighAccuracy: true, timeout: 180000, maximumAge: 1000 });

}

function nova_posicao(position){



var velocidade = Math.round(position.coords.speed * 3.6);
var latlon = position.coords.latitude + "," + position.coords.longitude;

//atualiza ultima_localizacao para registro no servidor
localStorage.setItem("latlon", latlon);



//if(localStorage.getItem("cogido_local") === null) { define_local(); }

	if (isNaN(velocidade)) { velocidade = 0;}
	
	if (velocidade < 0) { velocidade = 0;}
	
	
	
	texto_velocidade =   velocidade.toString();
	
	texto_velocidade =  texto_velocidade + " km/h";
	
	
	
	document.getElementById("walkspeed").textContent = texto_velocidade;
	
	if (velocidade < 5)
		{
		document.getElementById("walkspeed").textContent = texto_velocidade;
		if (!plugado)
			{
			if (onboard == true)
				{
				if (walking_monitor == false)
					{
					if ( walking_notification < 1 ) { notificacao_local('VELOCIDADE BAIXA','Avaliando saida do carro.', 1); }
					document.location.href = "avaliacao.html";
					walking_monitor = true;
					walking_notification++;
					if (walking_notification > 10) { walking_notification = 0; }
					iswalking();
					}
				}
			}
		}

	if(velocidade > 20)
		{
		document.getElementById("carspeed").textContent = texto_velocidade;
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
		document.location.href = "onboard.html";
		}
}


// onError Callback receives a PositionError object
//
function erro_posicao(error) {
	
	if ((error.code == 3)&&(gps_on)&&(!onboard))
		{
		gps_on = false;
		//notificacao_cogido_local('AVISO','Inatividade detectada.', 1);
		navigator.geolocation.clearWatch(watchID);
		}
		
}

function despertar(acceleration){



var movimento = modulo(Math.pow(acceleration.x,2) + Math.pow(acceleration.y,2) + Math.pow(acceleration.z,2) - 97);

if ((movimento > 10)&&(!gps_on)&&(!onboard))
	{
	gps_on = true;
	//notificacao_cogido_local('AVISO','Monitoramento Acionado.', 1);
	home();
	}

	
}

function gera_alarme() {
	
var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		notificacao_cogido_local('ALERTA','Crianca presente no carro.', 1);
		document.getElementById("principal").innerHTML = "<img src='imagens/checkout.png' align='center'>";
		document.getElementById("status").innerHTML = "<h4 align='center'>ALERT</h4>";
		onboard = false;
		alerta = true;
		setTimeout(localizacao,30000);
		}
	
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

function kids_ble(){

document.location.href = "kids_ble.html";
	
}
 
 
function lista_kids(){ 

var itens = ""; 
var indice = conta_kids(); 
 
if (typeof(Storage) !== "undefined") 
	{ 
 	//if(localStorage.length) 
	if(indice > 0)
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
			document.getElementById("status").innerHTML = "<hr><font face='sans-serif'>" + itens + "</font><hr />";
			}
 		} 
 		else {	alert("Cadastre as criancas.");	} 
 	 
 	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";} 
 
} 



function qrcode(i){

var qrcode = "<img src='http://chart.apis.google.com/chart?cht=qr&chl="+localStorage.getItem("kid"+i)+i+"&chs=200x200'>";

document.getElementById("status").innerHTML = "<h3 align='center'><font face='sans-serif'>" + localStorage.getItem("kid"+i)+" - QRCODE</h3><hr>";

document.getElementById("lista").innerHTML = qrcode + "<br> Este QRCODE deve ser impresso e colocado na cadeirinha. <div onclick='help_qrcode();'>SAIBA COMO</div>";

document.getElementById("links").innerHTML = "<a href='config.html' class='blue'><b>BACK</a> - </b><img src='imagens/menos.png' class='icone' onclick='qr_print(qrcode);'>"

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
var ul = document.getElementById("lista");
var li = document.createElement("li");

onboard = true;

for (var i=0; i<indice; ++i)
	{
	var kid = localStorage.getItem("kid"+i);
	localStorage.setItem("in"+i,localStorage.getItem("kid"+i));
	
	itens = itens + "<div>"+localStorage.getItem("in"+i) + " <a href='javascript:startScan();' class='green'><b>CHECK OUT</b></a></div><br>";
	
		
	var conteudo = "<li class='children--item'><input type='checkbox' class='children--item-checkbox' id='"+kid+"_check' checked onclick='startScan();'/><label for='"+kid+"_check' class='children--item-label light'>"+kid+"</label></li>";
	document.getElementById(kid).innerHTML = conteudo;
	
	
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
var i = 0;

notificacao_local('ALERTA','Alerta desativado em modo manual. ATENCAO: este procedimento pode colocar a crianca em risco!', 1);
//var reaviso = setTimeout(localizacao,30000);
//onError();

for (i=0; i<indice; ++i)
	{
	alert("Chekout Manual! Crianca "+localStorage.getItem("in"+i)+" retirada de forma insegura.");
	localStorage.removeItem("in"+i);
	//location.reload();
	//document.location.href = "index.html";
	}
	
if (!(i<indice)) { setTimeout(home,2000); }
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
					seguidor = aux.substring(0, 6);
					alert(seguidor);
					if (seguidor == "follow")
						{
							seguidor = seguidor.replace("follow", "");
							uuid_follow(seguidor);
						}
						else{
							identificador = aux.substring(aux.length-1);
							check_out(identificador);
						}
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
	
		//document.getElementById('status').innerHTML = "Level: " + info.level + " isPlugged: " + info.isPlugged;
		
		plugado = info.isPlugged;
		
		if (onboard == true)
			{
			if (!plugado)
				{
				if ( battery_notification < 1 ) { notificacao_local('ALERTA','Recomenda-se o uso com o carregador conectado.', 1); }
				battery_notification++;
				if ( battery_notification >10 ) { battery_notification = 0; }
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
		mensagem('Error!');
		home();
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
			//var xyz = modulo(Math.pow(accel_x,2) + Math.pow(accel_y,2) + Math.pow(accel_z,2) - 97);
			var xyz = Math.pow(accel_x,2) + Math.pow(accel_y,2) + Math.pow(accel_z,2);
			//var xyz = accel_x + accel_y + accel_z;
			var xyzSqrt = Math.sqrt(xyz);
			//var eixo = Math.round(xyzSqrt);
			var eixo = xyzSqrt;
			array_eixo.push(eixo);
			
			soma_eixo = soma_eixo + eixo;
			loop++;
			setTimeout(accelerometer, 100);	
		}
		else
		{		
			var m = soma_eixo / 50;
			media = Math.round(m);
			//walking_monitor = false;
			
			for (i = 0; i < 50; i++){	
				var v = array_eixo[i] - media;
				var vetor = Math.round(v);
				
				if(!anterior){
					if(vetor > 1){
						contador++;
						anterior = true;					
					}
					//else if (vetor <= '-2')
					else if (vetor <= '-1')
					{
						anterior = false;
					}
				}
				else 
				{
					//if(vetor <= '-2') {
					if(vetor <= '-1') {
						anterior = false; 
					}
				}  
			} 
			frequencia = contador / 5;
			
				
			//if(frequencia > '1.2' && frequencia < '3.4') {	gera_alarme();	} else { walking_monitor = false;}
			if(frequencia > '1.2' && frequencia < '3.4') {	gera_alarme();	} else { walking_monitor = false;}


		}
	}



