var compartilhe = 'Compartilhe sua experiencia e nos ajude a salvar vidas.';
var alarme = 'Crianca no Carro: ';
var aviso = 'Crianca presente no carro.';
var avaliando = 'Avaliando saida do carro.';
var avaliando_status = "Avaliação de movimento";
var ativado = 'Checkin Efetuado.';
var ativado_bateria = 'Checkin Efetuado. Conecte o carregador.';
var status_alerta = "<strong>Alerta:</strong> Saída do veículo";
var cadastro_kid = "Entre com nome ou apelido da criança: ";
var cadastro_follow = "Entre com o nome da pessoa a seguir: ";
var status_passageiros = "Passageiros Registrados";
var passageiros_abordo = "Passageiros a bordo";
var mensagem_cadastro = "Cadastre as criancas.";
var mensagem_reset = 'Confirmar o RESET apagara todas as configuracoes, incluindo cadastros de criancas, carros e alertas';
var mensagem_checkout = " saiu do veiculo.";
var mensagem_unkown = "Crianca ja saiu ou nao entrou no carro.";
var mensagem_unsafe = 'Alerta desativado em modo manual. ATENCAO: este procedimento pode colocar a crianca em risco!';
var mensagem_unsafe_checkout = " saiu do veiculo de forma insegura.  ATENCAO: este procedimento pode colocar a crianca em risco!";
var battery_recomendation = 'Recomenda-se o uso com o carregador conectado.';

function define_idioma(){

var idioma = localStorage.getItem("idioma");

if (idioma != 'pt')
	{navigator.notification.alert("Going to English.", function(){}, "Piuui");

	compartilhe = 'Share your Piuui experience and help us saving lives.';
	alarme = 'Kid still onboard: ';
	aviso = 'Kid still onboard.';
	avaliando = 'Evaluating.';
	avaliando_status = "Movement Evaluation";
	ativado = 'Checkin Done.';
	ativado_bateria = 'Checkin Done. Please, connect your charger.';
	status_alerta = "<strong>Alert:</strong> Chekout";
	cadastro_kid = "Enter kids name or nickname: ";
	cadastro_follow = "Enter the name of the person to follow: ";
	status_passageiros = "Registered Passengers";
	passageiros_abordo = "Passengers Onboard";
	mensagem_cadastro = "Please Add your Kids.";
	mensagem_reset = 'This action will delete all app configuration, including kids, cars and alerts';
	mensagem_checkout = " exited the vehicle.";
	mensagem_unkown = "Unknownd Passenger.";
	mensagem_unsafe = 'Manual deactivation. WARNING: this procedure may put your kid under risk!';
	mensagem_unsafe_checkout = " unsafe checkout. WARNING: this procedure may put your kid under risk!";
	battery_recomendation = 'We recomend using this app with your charger connected.';
	}
	
	
}
