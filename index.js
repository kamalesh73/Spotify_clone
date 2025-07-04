

function addit(color1,color2){
  document.getElementById("body1").style.background=`linear-gradient(to bottom ,${color1},${color2},#121212)`;
  
}
function reset(){
    document.getElementById("body1").style.backgroundColor="linear-gradient(to bottom ,#3A1C71,#2F0743,#121212)";
}
window.onload = () => {
  const allBtns = document.querySelectorAll(".btn");

  // Reset all buttons to default styling
  allBtns.forEach(btn => {
    btn.style.backgroundColor = "rgb(40, 39, 39)";
    btn.style.color = "white";
  });

  // Highlight the first button (index 0)
  allBtns[0].style.backgroundColor = "white";
  allBtns[0].style.color = "rgb(40, 39, 39)";
};

function reverse(id){
  const k= document.querySelectorAll(".btn");
  k.forEach( item =>{
    item.style.backgroundColor="rgb(40, 39, 39)";
    item.style.color="white";
  })
  k[id].style.backgroundColor="white";
  k[id].style.color="rgb(40, 39, 39)";
}