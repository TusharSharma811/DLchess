import express from "express" ;
import { Chess } from "chess.js";
import { Socket } from "socket.io";
import http from "http"
import path from "path";
import { log } from "console";

const app = express() ;
app.set("view engine" , "ejs") ;
app.use(express.static(path.join(__dirname , "public")))

const server = http.createServer(app) ;
const io = Socket(server)

const chess = new Chess() ;
let players = {} ;
let currentplayer = "W";

app.get("/" , (req, res)=>{
    res.render("index")
})

io.on("connection" , (uniquesocket)=>{
console.log("Socket connect");

})
server.listen(3000 , ()=> console.log("Connected"))