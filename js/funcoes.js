
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
var local;
var last_latlon;


function onDeviceReady() {
				
		onboard = false;
		
		notification_id = 1;
		cordova.plugins.backgroundMode.enable();
		//cordova.plugins.backgroundMode.onactivate = function() {notificacao_local('WARNING','Este aplicativo e apenas uma ferramenta e nao substitui a atencao e a supervisao de maior responsavel pela saude e seguranca da crianca.', 1);};
		
		//cordova.plugins.backgroundMode.onactivate = le_publicidade();
		cordova.plugins.notification.local.clearAll();

		
		//monitora_bateria();
		speed_monitor();
		//movimentoID = navigator.accelerometer.watchAcceleration(despertar, error, {frequency: 1000});
		//alertasID = setInterval(busca_alertas, 180000);
		
				
		//var x = Math.floor((Math.random() * 10) + 1);
		//if ((x == 3)&&(!onboard))
		//	{
		//		notificacao_local('CONVITE','Compartilhe sua experiencia para continuar usando o aplicativo.', 1);
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
	
	
	notificacao_local('ALERTA','Crianca no Carro: ' + latlon, 1);
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(playsound,3000);
	
	//envia dados do alerta para o servidor
	registra_alerta();
	
	     
	 document.getElementById("principal").innerHTML = "<br><br><iframe width=80% height=200px src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='desativa();'>";
	 
	 document.getElementById("status").innerHTML = "<h4 align='center'>ALERT</h4>";
		  
 }
 
 

function showError(error){

    var element = document.getElementById('status');
notificacao_local('ERRO','Erro ao obter coordenadas.', 1);

}

 
function speed_monitor(){
alert('1');
gps_on = true;
watchID = navigator.geolocation.watchPosition(nova_posicao, erro_posicao, { enableHighAccuracy: true, timeout: 180000, maximumAge: 1000 });

}

function nova_posicao(position){

alert('2');

var velocidade = Math.round(position.coords.speed * 3.6);
var latlon = position.coords.latitude + "," + position.coords.longitude;

//atualiza ultima_localizacao para registro no servidor
localStorage.setItem("latlon", latlon);

if(localStorage.getItem("local") === null) { define_local(); }

	if (isNaN(velocidade)) { velocidade = 0;}
	
	if (velocidade < 0) { velocidade = 0;}
	
	alert('3');
	
	texto_velocidade =   velocidade.toString();
	
	texto_velocidade =  texto_velocidade + " km/h";
	
	
	alert(texto_velocidade);
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
		//notificacao_local('AVISO','Inatividade detectada.', 1);
		navigator.geolocation.clearWatch(watchID);
		}
		
}

function despertar(acceleration){



var movimento = modulo(Math.pow(acceleration.x,2) + Math.pow(acceleration.y,2) + Math.pow(acceleration.z,2) - 97);

if ((movimento > 10)&&(!gps_on)&&(!onboard))
	{
	gps_on = true;
	//notificacao_local('AVISO','Monitoramento Acionado.', 1);
	home();
	}

	
}

function gera_alarme() {
	
var qtde_in = conta_in();
	
	if (qtde_in > 0)
		{
		notificacao_local('ALERTA','Crianca presente no carro.', 1);
		document.getElementById("principal").innerHTML = "<img src='imagens/checkout.png' align='center'>";
		document.getElementById("status").innerHTML = "<h4 align='center'>ALERT</h4>";
		onboard = false;
		alerta = true;
		setTimeout(localizacao,30000);
		}
	
}



