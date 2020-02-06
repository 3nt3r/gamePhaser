var game = new Phaser.Game(1350, 650, Phaser.AUTO, '', {preload: dados, create: cenario, update: atualiza});

var inimigo, jogador, plataformas, teclas, somColeta, somExplosao;
var pontos = 0;
var vidas = 3;
var inimigoEsquerda = false;

function mataJogador(jog, ini){
    somExplosao.play("", 0, 1, false);
    jog.kill();
    vidas -= 1;
    textoVidas.setText('LIFE: ' + vidas);
    if (vidas == 0){
    	alert("Você Perdeu!");
    	window.location.href = '../gameover.html';
    } else {
    	jog.reset(0, 0);
    }
}


function coletaEstrela(jog, est){
	est.kill();
	pontos += 10;
	textoPontos.setText('SCORE: ' + pontos);
	somColeta.play("", 0, 1, false);
	if (pontos == 160){
		inimigo.kill();
		alert("Você Venceu!");
		window.location.href = '../index.html';
	}
}

//////////////////////////////////////////////////////////////////////////

function dados(){
	game.load.image('planodefundo', 'imagens/background7.png');
	game.load.image('chao', 'imagens/plataforma.png');
	game.load.image('plataforma', 'imagens/plataforma2.png');
	game.load.spritesheet('jogador', 'imagens/robo.png', 71,96);
	game.load.spritesheet('inimigo', 'imagens/player.png', 66, 96);
	game.load.image('estrela', 'imagens/star.png');
	game.load.audio('som-explosao', 'audio/lose.ogg');
	game.load.audio('som-coleta', 'audio/coleta.ogg');
	game.load.image('fase1', 'imagens/fase1.png');
}

//////////////////////////////////////////////////////////////////////////

function cenario(){

	game.physics.startSystem(Phaser.Physics.ARCADE);
	somExplosao = game.add.audio('som-explosao', 1, true);
	somColeta = game.add.audio('som-coleta', 1, true);
	game.add.sprite(0, 0, 'planodefundo');
	game.add.sprite(580, 16, 'fase1');
	jogador = game.add.sprite(0, 0, 'jogador');
	inimigo = game.add.sprite(1230, 0, 'inimigo');
	plataformas = game.add.group();

	var chao = plataformas.create(0, 620, 'chao');
	var chao1 = plataformas.create(200, 500, 'plataforma');
	var chao2 = plataformas.create(750, 500, 'plataforma');
	var chao3 = plataformas.create(1000, 300, 'plataforma');
	var chao4 = plataformas.create(0, 300, 'plataforma');

	game.physics.arcade.enable(jogador);
	game.physics.arcade.enable(inimigo);
	game.physics.arcade.enable(plataformas);

	plataformas.enableBody = true;
	jogador.enableBody = true;
	inimigo.enableBody = true;

	chao.body.immovable = true;
	chao1.body.immovable = true;
	chao2.body.immovable = true;
	chao3.body.immovable = true;
	chao4.body.immovable = true;

	teclas = game.input.keyboard.createCursorKeys();

	jogador.animations.add('left', [0,1,2,3,4,5,6], 15, true);
	jogador.animations.add('right', [8,9,10,11,12,13,14], 15, true);

	inimigo.animations.add('left', [0,1,2,3,4,5], 15, true);
	inimigo.animations.add('right', [7,8,9,10,11,12], 15, true);

	jogador.animations.stop();
	jogador.frame = 7;

	inimigo.animations.stop();
	inimigo.frame = 6;

	jogador.body.gravity.y = 300;
	inimigo.body.gravity.y = 300;

	jogador.body.bounce.y = 0.2;
	inimigo.body.bounce.y = 0.2;

	jogador.body.collideWorldBounds = true;
	inimigo.body.collideWorldBounds = true;

	estrelas = game.add.group();
	estrelas.enableBody = true;

	for(var i=0; i<16; i++){
		var estrela = estrelas.create(i*90,0,'estrela');
		estrela.body.gravity.y=300;
		estrela.body.bounce.y = 0.3;
		estrela.body.collideWorldBounds = true;
	}

	setInterval(function () { 
        if(inimigo.body.touching.down){
        	inimigo.body.velocity.y = -300;
         }
 	}, 2000);
 	
	setInterval(function(){
		if (inimigoEsquerda || inimigo.body.blocked.left){
			inimigo.body.velocity.x= 150;
			inimigo.animations.play('right');
		} else if (!inimigoEsquerda || inimigo.body.blocked.right) {
			inimigo.body.velocity.x= -150;
			inimigo.animations.play('left');
		}

	inimigoEsquerda = !inimigoEsquerda;

	},10000);

	textoPontos = game.add.text(1200, 16,'SCORE: 0',{fontSize: '25px', fill: 'black'});
	textoVidas = game.add.text(10, 16,'LIFE: 3',{fontSize: '25px', fill: 'black'});
}

//////////////////////////////////////////////////////////////////////////

function atualiza(){

game.physics.arcade.collide(jogador, plataformas);
game.physics.arcade.collide(estrelas, plataformas);
game.physics.arcade.collide(inimigo, plataformas);

game.physics.arcade.overlap(jogador, inimigo, mataJogador);
game.physics.arcade.overlap(jogador, estrelas, coletaEstrela);

jogador.body.velocity.x = 0;

//Esquerda
if (teclas.left.isDown){    
    jogador.body.velocity.x = -150;   
	jogador.animations.play('left');           
}

//Direita
if (teclas.right.isDown)    {    
    jogador.body.velocity.x = 150; 
	jogador.animations.play('right');       
}

//Cima
if (teclas.up.isDown && jogador.body.touching.down){    
	jogador.body.velocity.y = -350;
}

//Parado
if (jogador.body.velocity.x == 0){    
	jogador.animations.frame = 7;
}

}
//////////////////////////////////////////////////////////////////////////
