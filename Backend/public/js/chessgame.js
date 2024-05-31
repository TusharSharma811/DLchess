const socket = io();

const chess = new Chess();

const chessboard = document.querySelector(".boardElement");
let draggedpiece = null;
let playerrole = null;
let sourcesquare = null;

const renderBoard = () => {
  const Board = chess.board();
  chessboard.innerHTML = "";
  console.log(Board);
  Board.forEach((element, indx) => {
    element.forEach((square, squareindx) => {
      const squareelement = document.createElement("div");
      squareelement.classList.add(
        "piece" , "square",
        (indx + squareindx) % 2 === 0 ? "light" : "dark"
      );
      squareelement.dataset.row = indx;
      squareelement.dataset.col = squareindx;
      if (square) {
        console.log("square");
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        pieceElement.innerText = getPieceUnicode(square);
        console.log(playerrole);
        if(playerrole === square.color){
            pieceElement.draggable = true ;
        }
        else{
            pieceElement.draggable = false ;
        }
        pieceElement.addEventListener("dragstart", (e) => {
            console.log("drag start");
          if (pieceElement.draggable) {
            draggedpiece = pieceElement;
            sourcesquare = {
              row: indx,
              col: squareindx,
            };
          }
          e.dataTransfer.setData("text/plain" , "")
        });
        pieceElement.addEventListener("dragend" , (e)=>{
            draggedpiece = null ;
            sourcesquare = null ;
        })
        squareelement.appendChild(pieceElement)
      }
      squareelement.addEventListener("dragover" , (e)=>{
        e.preventDefault();
      })
      squareelement.addEventListener("drop" , (e)=>{
        console.log("drop");
        e.preventDefault() ;
        if(draggedpiece){
            const targetsource = {
                row : parseInt(squareelement.dataset.row) ,
                col : parseInt(squareelement.dataset.col)

            }
            HandleMove(sourcesquare , targetsource);
        }
      })
      chessboard.appendChild(squareelement)
    });
  });
  if(playerrole === 'b'){
    chessboard.classList.add("flipped") ;
  }else{
    chessboard.classList.remove("flipped")
  }
 
};

const HandleMove = (source , target) => {
    const move = {
        from : `${String.fromCharCode(97+source.col)}${8 - source.row}`,
        to : `${String.fromCharCode(97+target.col)}${8 - target.row}` ,
        promotion:'q' ,
    }
   
    socket.emit("move" , move)
};
const getPieceUnicode = (piece) => {
    const pieceunicode = {
        p:"♙",
        r:"♜",
        n:"♞",
        b:"♝",
        q:"♛",
        k:"♚",
        R:"♖",
        N:"♘",
        B:"♗",
        Q:"♕",
        K:"♔",
    }
    return pieceunicode[piece.type] || ""
};

socket.on("Playerrole" , (role)=>{
    playerrole = role ;
    renderBoard() ;

})
socket.on("SpectatorRole" , ()=>{
    playerrole = null ;
    renderBoard() ;
})
socket.on("boardstate" , (fen)=>{
    console.log(fen);
    chess.load(fen) ;
    renderBoard() ;
})
socket.on("move" , (move)=>{
    console.log(move);
    chess.move(move) ;
    renderBoard() ;
})
renderBoard() ;