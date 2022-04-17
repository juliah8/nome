class Form {
  constructor() {
    this.input = createInput("").attribute("placeholder", "Digite seu nome");
    this.playButton = createButton("Jogar");
    this.titleImg = createImg("./assets/TITULO.png", "nome do jogo");
    this.greeting = createElement("h2");
  }

  hide() {
    this.greeting.hide();
    this.playButton.hide();
    this.input.hide();
  }

  setElementPosition(){
    this.titleImg.position(120,50);
    this.input.position(width/2 -100 ,height/2 -100);
    this.playButton.position(width/2 -80,height/2 -50);
    this.greeting.position(width/2 - 180,height/2 -100);

  }

  setElementStyle(){
    this.titleImg.class("gameTitle");
    this.input.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting");

  }

  display(){
    this.setElementPosition();
    this.setElementStyle();
    this.buttonPressed();

  }

  buttonPressed(){
    this.playButton.mousePressed(()=>{
    this.input.hide()
    this.playButton.hide()
    var message = `Olá, ${this.input.value()}.</br>Aguarde o 2° jogador.`;
    this.greeting.html(message);
    playerCount += 1;
    player.name = this.input.value()
    player.index = playerCount;
    player.addPlayer();
    player.updateCount(playerCount);

    player.getDistance();
    
    })
  }
}

 