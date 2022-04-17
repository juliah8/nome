class Player {
  constructor() {
    this.name = null;
    this.index = null;
    this.posX = 0;
    this.posY = 0;

    this.rank = 0;
    this.score = 0;

    this.fuel = 190;
    this.life = 190;
  }
  getCount(){
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on('value', (data)=>{
      playerCount = data.val();
    });

  }
  updateCount(count){
    database.ref('/').update({
      playerCount:count
    })
  }
  addPlayer(){
    var playerIndex = 'players/player' + this.index;
    if(this.index === 1){
      this.posX = width / 2 - 130;
    }
    else{
      this.posX = width / 2 + 130;
    }

    database.ref(playerIndex).set({
      name: this.name,
      posX:this.posX,
      posY:this.posY,
      rank:this.rank, 
      score:this.score
    })

  }

  static getPlayersInfo(){
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", (data)=>{
      allPlayers = data.val()
    });
  }
  update(){
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      posX:this.posX,
      posY:this.posY,
      rank:this.rank,
      score:this.score,
      life:this.life
    })     
  }
  getDistance(){
    var playerDistanceRef = database.ref("players/player" + this.index)
    playerDistanceRef.on("value",(data)=>{
      var data = data.val()
      this.posX = data.posX;
      this.posY = data.posY;
    })
  }

  getCarsAtEnd(){
    database.ref('carsAtEnd').on('value', (data)=>{
      this.rank = data.val()

    })
  }

  static updateCarsAtEnd(rank){
    database.ref('/').update({getCarsAtEnd:rank})
  }
}
