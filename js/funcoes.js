function lista(){

if (typeof(Storage) !== "undefined") {alert(typeof(Storage));
    // Store
	if(localStorage.length)
		{
		alert("ha dados");
		}
		else
		{
		alert("nadinha");
		}
	localStorage.setItem("lastname", "Smith");
    // Retrieve
    document.getElementById("principal").innerHTML = localStorage.getItem("lastname");
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
	localStorage.setItem("nome", result.name);
	localStorage.setItem("telefone", result.phoneNumber);
};
var failedCallback = function(result){
    setTimeout(function(){alert(result);},0);
}
window.plugins.contactNumberPicker.pick(successCallback,failedCallback);

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
