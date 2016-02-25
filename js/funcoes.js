
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

		alert('2');
		//monitora_bateria();
		//speed_monitor();
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
	
	alert('1');
	
	walking_monitor = false;
	walking_notification = 0;
	battery_notification = 0;
	
	notification_id = 1;
				
	document.addEventListener("deviceready", onDeviceReady, false);
}



function home(){
	
	document.location.href='index.html';
	
}



