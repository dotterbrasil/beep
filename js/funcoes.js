
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
			document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>"+itens+"</font>";
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

//---------------------------------------------------------------------------- KIDS  ----------------------------------------------------------------------------

function kids(){

var crianca = prompt("Nome: ","").toUpperCase();
var indice = conta_kids();

if (typeof(Storage) !== "undefined")
	{
	localStorage.setItem("kid"+indice,crianca);
	if(localStorage.getItem("kids") !== null)
		{
		localStorage.setItem("kids",Number(localStorage.getItem("kids"))+1);
		} else {localStorage.setItem("kids",1);}
		
	alert(localStorage.getItem("kids");
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

	localStorage.setItem("kid"+indice,crianca);
}


function lista_kids(){

var itens = "";

alert(localStorage.getItem("kids"));

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.getItem("kids") !== null)
		{
		for ( var i = 0; i < localStorage.getItem("kids"); ++i )
			{
			if(localStorage.getItem("kid"+i) !== null)
				{
				itens = itens + "<div onclick='qrcode("+i+");'>"+localStorage.getItem("kid"+i) + "</div><br>";
				}
			}
		document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>" + itens + "</font>";
		}
		else {	alert("Cadastre as criancas.");	}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

}


function qrcode(i){

var qrcode = "<img src='http://chart.apis.google.com/chart?cht=qr&chl="+localStorage.getItem("kid"+i)+"&chs=200x200'>";

document.getElementById("principal").innerHTML = "<font face='sans-serif'>" + localStorage.getItem("kid"+i)+"<img src='imagens/menos.png' width=10% onclick='limpa_kid(" + i + ");'> <br>" + qrcode + "<br> Este QRCODE deve ser impresso e colocado na cadeirinha ou bebe conforto. <div onclick='help_qrcode();'>SAIBA COMO</div>";

}

function limpa_kid(i){
	localStorage.removeItem("kid"+i);
	localStorage.setItem("kids",localStorage.getItem("kids")-1);
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


function check_in(){

var indice = conta_kids();
var itens = "";

for (var i=o; i<indice; ++i)
	{
	localStorage.setItem("in"+i,localStorage.getItem("kid"+i));
	itens = itens + "<div onclick='qrcode("+i+");'>"+localStorage.getItem("in"+i) + "</div><br>";
	}

document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>" + itens + "</font>";

}

//---------------------------------------------------------------------------- MEDIA  ----------------------------------------------------------------------------


function home(){
  document.location.href='index.html';
}
 

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

function startScan() {

	var scanner = cordova.require("cordova/plugin/BarcodeScanner");
	var aux = "";

	scanner.scan(
		function (result) {
						
			aux = result.text;
			if(result.format == 'DATA_MATRIX')
				{
				separa(aux);
				}
				else
					{
					return aux;
					}
		}, 
		function (error) {
			alert("Scanning failed: " + error);
		}
	);

}

function desativa(){

var indice = conta_kids();
var aux = "";

alert(indice);

	aux = startScan();
	alert("Crianca "+aux+" retirada");


home();

}