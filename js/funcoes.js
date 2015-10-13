function lista(){

var itens = "";

if (typeof(Storage) !== "undefined") {
    // Store
	if(localStorage.length)
		{
		for ( var i = 0, len = localStorage.length/2; i < len; ++i )
			{
			
			itens = itens + "Nome: " + localStorage.getItem("nome"+i) + " - f: " + localStorage.getItem("telefone"+i) + "<img src='imagens/menos.png' width=40px onclick='limpa_item(" + i + ");'> " + i +" <br>";
			}
			document.getElementById("principal").innerHTML = "<font size=6 face='sans-serif'>"+itens+"</font>";
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
{alert();
        navigator.geolocation.getCurrentPosition(showPosition);
alert();
if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
       document.getElementById("status").innerHTML = "Geolocation is not supported by this browser.";alert();
    }
	
	
}



 function showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
	alert(latlon);
	 document.getElementById("status").innerHTML = "Buscando localizacao no mapa...";
    
	//var teste = setInterval(playsound,3000);
	
	document.getElementById("mapa").style.backgroundImage = "url('imagens/fundo_alerta.gif')";
	
     document.getElementById("mapa").innerHTML = "<br><br><iframe width=450px height=450px src='https://www.google.com/maps/embed/v1/place?q="+latlon+"&key=AIzaSyAj6LuyubKgTA8wlfqsTzQHKkSlTO9ZMOc' allowfullscreen align='center'></iframe><br><img src='imagens/alert.gif' class='alerta' onclick='home();'>";
	 
	 document.getElementById("status").innerHTML = "Clique sobre o ALERT para desativar o alarme!";
	  
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
	
	
    return 'file://'+ s;
}


function mediaError(){
alert("Erro de Som");
}
