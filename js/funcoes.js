function lista(){

var itens = "";

if (typeof(Storage) !== "undefined") {alert(typeof(Storage));
    // Store
	if(localStorage.length)
		{
		alert("ha dados");
		for ( var i = 1, len = localStorage.length + 1; i < len; i = i + 2 )
			{
			//itens = itens + localStorage.getItem( localStorage.key( i ) ) +"<br>";
			itens = itens + "Nome: " + localStorage.getItem("nome"+i) + "f: " + localStorage.getItem("telefone"+i) + " <img src='magens/menos.png' width=20px onclick='limpa_item(" + i + ");'> <br>";
			}
			document.getElementById("principal").innerHTML = itens;
		}
		else
		{
		alert("Cadastre contatos para receberem os alertas.");
		}
	localStorage.setItem("lastname", "Smith");
    // Retrieve
    //document.getElementById("principal").innerHTML = localStorage.getItem("lastname")+localStorage.getItem("nome");
} else {
    document.getElementById("principal").innerHTML = "Sorry, your browser does not support Web Storage...";
}


}

function localizacao()
{
if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
       document.getElementById("contatos").innerHTML = "Geolocation is not supported by this browser.";
    }
	
	
}



 function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
	
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	var teste = setInterval(PlaySound,3000);
	
	document.getElementById("mapa").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	
     document.getElementById("mapa").innerHTML = "<iframe width=450px height=250px src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' class='alerta' onclick='home();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";
	  
 }
 
 function contatos(){
 // Show Contact Picker
var successCallback = function(result){
    setTimeout(function(){alert(result.name + " " + result.phoneNumber);},0);
	localStorage.setItem("nome"+localStorage.length, result.name);
	localStorage.setItem("telefone"+localStorage.length, result.phoneNumber);
};
var failedCallback = function(result){
    setTimeout(function(){alert(result);},0);
}
window.plugins.contactNumberPicker.pick(successCallback,failedCallback);

 }
  
  function limpa_item(i){
	localStorage.removeItem("nome"+i);
	localStorage.removeItem("telefone"+i);
  }
  
  function limpa_contatos(){
  localStorage.clear();
  }
  function home(){
  document.location.href='index.html';
 }
 
 function PlaySound() {
  
  var url = getMediaURL("sons/alerta.wav");
  
  var my_media = new Media(url,null,mediaError);
  
  my_media.play();
  
}

function getMediaURL(s) {
    if(device.platform.toLowerCase() === "android") return "/android_asset/www/" + s;
	
	
    return 'file://'+ s;
}


function mediaError(){
alert("Erro de Som");
}
