class Game {
  constructor() {

    this.reset = createElement("h2");
    this.resetButton = createButton("");
    this.placar = createElement("h2");
    this.lider1 = createElement("h2");
    this.lider2 = createElement("h2");
    this.isMoving = false;
    this.keyActive = false;
    this.isBlast = false;
  }

  start() {
    form = new Form();
    form.display();
    player = new Player();
    player.getCount();

    car1 = createSprite(width / 2 -130, height - 100);
    car1.addImage(car1Img);
    car1.scale = 0.07;

    car2 = createSprite(width / 2 +130, height - 100);
    car2.addImage(car2Img);
    car2.scale = 0.07;

    car1.addImage('blast', blast);
    car2.addImage('blast', blast);

    cars = [car1, car2];
    

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    fuels = new Group();
    coins = new Group();
    obstacles = new Group();
    this.addSprites(fuels, 10, fuel_image, 0.02)
    this.addSprites(coins, 20, coin_image, 0.09)
    this.addSprites(obstacles, obstaclesPositions.length, obstacle1Image, 0.04, obstaclesPositions);
    this.addSprites(obstacles, obstaclesPositions.length, obstacle2Image, 0.04, obstaclesPositions);
  }
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val()
    });
  }
  update(state){
    database.ref("/").update({
      gameState:state
    })
  }
  play(){
    

    Player.getPlayersInfo();
    player.getCarsAtEnd();
    form.hide();
    form.titleImg.position(40,50);
    form.titleImg.class("gameTitleAfterEffect");

    this.showElements();
    this.resetGame();

    if(allPlayers !==undefined){
      image(track, 0, - height *5, width, height *6);
      var index = 0;
      this.leaderBoard();

      this.showLife();
      this.showFuel();
      for(var plr in allPlayers){

        index+=1;

        var x = allPlayers[plr].posX;
        var y = height - allPlayers[plr].posY;
        cars[index - 1].position.x = x;
        cars[index - 1].position.y = y;

        var life = allPlayers[plr].life;

        if(life <= 0){
          cars[index-1].changeImage('blast');
          cars[index-1].scale = 0.3;
          this.isBlast = true;
          //player.posY = 0;
          //player.update();

        }

        if(index === player.index){
          fill('green');
          ellipse(x, y, 60, 60);

          camera.position.x = cars[index-1].position.x;
          camera.position.y = cars[index-1].position.y;
          if(this.isMoving&&!this.isBlast){
            player.posY +=5;
            player.update();
          }

          this.addFuel(index);
          this.addCoins(index);
          this.carsCollision(index);
          this.collision(index);
        }



      }
     
        this.controls();
      

      drawSprites();

      const finish = height*6 - 100;
      if(player.posY > finish){
        gameState = 2;
        player.rank += 1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }
    }
  } 
  controls(){
    if(!this.isBlast){
      if(keyIsDown(UP_ARROW)){
        player.posY +=10;
        player.update();
        this.isMoving = true;
      }
      if(keyIsDown(LEFT_ARROW)){
        player.posX -=10;
        this.keyActive = true;
        player.update();
  
      }
      if(keyIsDown(RIGHT_ARROW)){
        player.posX +=10;
        this.keyActive = false;
        player.update();
      }
  
    }
  }
  showElements(){
    this.reset.html("Resetar");
    this.reset.class("resetText");
    this.reset.position(width / 2 + 200, 40);
    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100 )
    this.placar.html("Placar");
    this.placar.class("resetText");
    this.placar.position(width /3 - 60, 40)
    this.lider1.class("leadersText");
    this.lider1.position(width / 3 - 50, 80);

    this.lider2.class("leadersText");
    this.lider2.position(width / 3 - 50, 120);
  }

  resetGame(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        carsAtEnd:0,
        players: {},
        carsAtEnd:0
      })
      location.reload();
    })

  }
  leaderBoard(){
    var lider1
    var lider2
    var players = Object.values(allPlayers);
    if((players[0].rank===0 && players[1].rank===[0])||players[0].rank===1){
      lider1 = players[0].rank + '&emsp;' + players[0].name + '&emsp;'  + players[0].score
      lider2 = players[1].rank + '&emsp;' + players[1].name + '&emsp;'  + players[1].score
    }
    if(players[1].rank === 1){
      lider1 = players[1].rank + '&emsp;' + players[1].name + '&emsp;'  + players[1].score
      lider2 = players[0].rank + '&emsp;' + players[0].name + '&emsp;'  + players[0].score
    }
    this.lider1.html(lider1);
    this.lider2.html(lider2);
  }

  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []){

    for(var i = 0;i < numberOfSprites;i++){
      var x;
      var y;
      if(positions.length > 0){
        x = positions[i].x
        y = positions[i].y

        spriteImage = positions[i].image;
      }
      else{
        x = random(width / 2 + 150, width / 2 - 150);
        y = random(- height * 4.5, height - 400);
      }
      var sprite = createSprite(x, y, );
      sprite.addImage('sprite', spriteImage)
      sprite.scale = scale;
      spriteGroup.add(sprite);
    }

  }

  addFuel(index){
    cars[index -1].overlap(fuels, function(colector, collected){
      player.fuel = 190;
      collected.remove()
    })
    if(this.isMoving && player.fuel > 0){
      player.fuel -= 0.3;
    }
    if(player.fuel <= 0){
      gameState = 2;
      this.gameOver()
    }

  }

  addCoins(index){
    cars[index -1].overlap(coins, function(colector, collected){
      player.score= 10;
      player.update()
      collected.remove();
    })
  }

  showRank(){
    swal({
      title:'Você terminou a corrida em ' + player.rank + 'º lugar :)',
      imageUrl:"https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize:'100x100',
      confirmButtonText:'Ok'
    })    
  }

  showLife(){
    push();
    image(lifeImg, width / 2 -130, height - player.posY - 400, 20, 20);
    fill('white');
    rect(width / 2 - 100, height -player.posY - 400, 190, 20);
    fill('red');
    rect(width / 2 - 100, height -player.posY - 400, player.life, 20);
    pop();
  }

  showFuel(){
    push();
    image(fuel_image, width / 2 -130, height - player.posY - 100, 20, 20);
    fill('white');
    rect(width / 2 - 100, height -player.posY - 100, 190, 20);
    fill('yellow');
    rect(width / 2 - 100, height -player.posY - 100, player.fuel, 20);
    pop();
  }

  gameOver(){
    swal({
      title:'Opa, você perdeu',
      imageUrl:"https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize:'100x100',
      confirmButtonText:'Ok'
    })    

  }

  collision(index){
    
    if(cars[index -1].collide(obstacles)){
      if(player.life > 0){
        player.life -= 190 / 4;
      }

      if(this.keyActive){
        player.posX += 100;
      }
      else{
        player.posX -=100;
      }
      player.update();
    }
  }

  carsCollision(index){
    if(index === 1){
      if(cars[index -1].collide(cars[1])){
        if(this.keyActive){
          player.posX += 100;
        }
        else{
          player.posX -=100;
        }

        if(player.life > 0 ){
          player.life -= 190 / 4;
        }
        player.update();
      }
    }

    if(index === 2){
      if(cars[index -1].collide(cars[0])){
        if(this.keyActive){
          player.posX += 100;
        }
        else{
          player.posX -=100;
        }

        if(player.life > 0 ){
          player.life -= 190 / 4;
        }
        player.update();
      }
    }


  }

}
