function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
        rectangle2.position.x &&
      rectangle1.attackBox.position.x <=
        rectangle2.position.x + rectangle2.width &&
      rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
        rectangle2.position.y &&
      rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
  }
  function determinedWinner({player,enemy,timerId}){
      clearTimeout(timerId)
      document.querySelector("#displaytext").style.display = 'flex';
      if (player.health === enemy.health) {
        document.querySelector("#displaytext").innerHTML = "Tie";  
      }
      else if (player.health > enemy.health ) {
        document.querySelector("#displaytext").innerHTML = "Player1 Wins"  
      }
     else {
        document.querySelector("#displaytext").innerHTML = "Player2 Wins";
      }
    }
  //timer variable
  let timer = 60;
  let timerId
  function decreasedTimer() {
    if (timer > 0) {
      
      timerId =setTimeout(decreasedTimer,1000)
      timer--;
      document.querySelector("#timer").innerHTML = timer;
    }
    if ((timer === 0)) {
      
      determinedWinner({player,enemy,timerId})
    }
  }