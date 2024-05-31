import express from "express" ;
import { Chess } from "chess.js";
import { Socket , Server}  from "socket.io";
import http from "http"
import path from "path";
import { fileURLToPath } from 'url';
import { log } from "console";

const app = express() ;
app.set("view engine" , "ejs") ;
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname , "public")))

const server = http.createServer(app) ;
const io = new  Server(server)

const chess = new Chess() ;
let players = {} ;
let currentplayer = "w";

app.get("/" , (req, res)=>{
    res.render("index")
})

io.on("connection" , (uniquesocket)=>{
console.log("Socket connect");
if(!players.white){
    players.white = uniquesocket.id ;
    uniquesocket.emit("Playerrole" , "w") ;
}
else if(!players.black){
    players.black = uniquesocket.id ;
    uniquesocket.emit("Playerrole" , "b") ;

}
else{
    uniquesocket.emit("SpectatorRole") ;

}

uniquesocket.on("disconnect" ,()=>{
    if(uniquesocket.id == players.white){
        delete players.white ;
    }
    else if(uniquesocket.id === players.black){
        delete players.black ;
    }
    
})
uniquesocket.on("move" , (move)=>{
    try {
        console.log(chess.turn());
        if(chess.turn() === 'w' && uniquesocket.id !== players.white ) return ;
        else if(chess.turn() === 'b' && uniquesocket.id !== players.black) return ;
        
        const result = chess.move(move) ;
        console.log(result);
        if(result){
            console.log(result);
            currentplayer = chess.turn() ;
            io.emit("move" , move) ;
            io.emit("boardstate" , chess.fen())
        }
        else{
            console.log("error");
            uniquesocket.emit("Invalid move" , move)
        }
    } catch (error) {
        
    }

})

})
server.listen(3000 , ()=> console.log("Connected"))