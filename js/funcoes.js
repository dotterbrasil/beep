function lista(){

var itens = "";

document.getElementById("principal").innerHTML = itens+"<img src='imagens/fundo.gif' width=100% align='center' >";

if (typeof(Storage) !== "undefined") {
    // Store
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
		else
		{
		alert("Cadastre contatos para receberem os alertas.");
		}
	
} else {
    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";
}


}

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
	
     document.getElementById("mapa").innerHTML = "<br><br><iframe width=80% height=80% src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' width=100% align='center' class='alerta' onclick='home();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";

	envia_sms(latlon);
	  
 }
 
 function contatos(){
 // Show Contact Picker
	var successCallback = function(result){
				
		indice = localStorage.length / 2;
		localStorage.setItem("nome"+indice, result.name);
		localStorage.setItem("telefone"+indice, result.phoneNumber);
		lista();
	};
	
	var failedCallback = function(result){
		setTimeout(function(){alert(result);},0);
	}
window.plugins.contactNumberPicker.pick(successCallback,failedCallback);

 }

function kids(){

var crianca = prompt("Nome: ","");
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
		else {	alert("Cadastre as criancas.");	}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

localStorage.setItem("kid"+indice,crianca);
}

function lista_kids(){

var itens = "";

if (typeof(Storage) !== "undefined")
	{
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length; i < len; ++i )
			{
			if(localStorage.getItem("kid"+i) !== null)
				{
				itens = itens + localStorage.getItem("kid"+i) + "<img src='imagens/menos.png' width=5% onclick='limpa_item(" + i + ");'> <br>";
				}
			}
		document.getElementById("principal").innerHTML = "<br><br><font face='sans-serif'>"+itens+"</font>";
		}
		else {	alert("Cadastre as criancas.");	}
	
	} else {    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";}

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
