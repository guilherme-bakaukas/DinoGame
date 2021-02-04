const dino = document.querySelector('.dino')
//criamos o elemento dino em js

const background = document.querySelector('.background')
//referencia ao nosso background


let isJumping = false
//variável que não permite que o dinossauro execute um pulo enquanto está no ar
let position = 0
//indica a posição vertical do dinossauro

let cactusPosition
let flyDino_position
let fly_dino
let cactus
let isDown=false//analisa quando o dinossauro está abaixado
let var_aceleration=0//variável que gera uma aceleração ao mapa
let time_map = 20//inicia a tempo do mapa em 20ms

function handleKeyDown(event){
    //enquanto tecla down estiver pressionada, dinossauro deve se manter down
    if (event.keyCode == 40){
        isDown = true
        down()
    }
}


function handleKeyUp(event){
    if (event.keyCode == 32){//32 é o códogo do espaço
        //pular apenas quando eles estiver no chão
        if (!isJumping){
            jump()
        }
    }
    if (event.keyCode == 40){
        //seta para baixo deixa de ser pressionada, o dinossauro deve retornar ao seu estado inicial vertical
        up()
        isDown=false
    }
}

//função que altera a imagem do dinossauro quando ele está na vertical
function up(){
    dino.style.width= '90px';
    dino.style.height= '100px';
    dino.style.backgroundImage = `url('images/dino.png')`;
}

//função que altera a imagem do dinossauro quando ele está na horizontal
function down(){
    dino.style.width = '120px'
    dino.style.height = '50px'
    dino.style.backgroundImage = `url('images/dino_down.png')`;
}

//função responsável pelo pulo do dinossauro

function jump(){
    isJumping = true
    let upInterval = setInterval(() => {
        //caso sua altura seja 160px, devemos parar de subir para iniciar a descida
        if (position>=160){
           
            clearInterval(upInterval)
            
            //descida na mesma proporção
            let downInterval = setInterval(() => {
                
                if (position>=10){
                    
                    position -= 10
                    dino.style.bottom = position + 'px'

                }else{
                    clearInterval(downInterval)
                    isJumping = false
                }

            }, 13);
        }else{
            
            position += 10
            dino.style.bottom = position + 'px'
        }
    },13);
}


//função recursiva que gera os obstáculos no cenário
function createObstacles(){
    
    var_aceleration++
    //a cada chamada dessa função devemos acelerar o mapa
    
    if(time_map>7){//limite para acelereação do mapa
        time_map -= var_aceleration/5//taxa de aceleração
    }
    
    //definimos o dinossauro voador como ainda não gerado
    flyDino_position=0
    flyDinoCreated=false
    
    //cactus ainda não removidos do cenário
    let cactusRemoved = false
    
    //criamos um cactus
    createCactus()

    //tempo de timeout até a proxima chamada da função recursiva pode ser de até 6 segundos (definido aleatoriamente)
    let Time = Math.random()*6000

    let count = 0
    //essa variável limita a proximidade entre a criação do cactus e do dinossauro

    //aqui a ideia é criar movimentar o cactus, e através de uma função de aleatorieade, criar e movimentar um dinossauro voador
    
    let leftInterval = setInterval(() => {

        count++

        //aqui determinamos uma aleatoriedade para a criação de um flyDino
        if (Math.random()>0.97 && !flyDinoCreated && count>=25){

            createFlyDino()
            flyDinoCreated = true
        }

        if(!cactusRemoved){
            //caso o cactus ainda não tenha sido removido, devemos movimentá-lo
            cactusPosition -= 10
            cactus.style.left = cactusPosition + 'px'
            
            //retiramos o cactus caso esteja inteiramente fora da tela
            //verificamos se há um flyDino criado, se houver, não devemos finalizar o setInterval para que ele se movimente até o final da tela
            if (cactusPosition< -60){

                cactusRemoved = true
                background.removeChild(cactus)

                if (!flyDinoCreated){

                    clearInterval(leftInterval)
                    setTimeout(createObstacles,Time)
                    //chama create obstacle recursivamente em um tempo definido
                }
            }
        }

        if (flyDinoCreated){

            flyDino_position-=10
            fly_dino.style.left = flyDino_position +'px'

            //retiramos o obstaculo caso ele esteja inteiramente fora da tela
            if(flyDino_position< -80){

                background.removeChild(fly_dino)
                clearInterval(leftInterval)
                setTimeout(createObstacles,Time)
                //chama create obstacle recursivamente em um tempo definido
            }

        }
        
        if((cactusPosition>0 && cactusPosition<60 && position<60)||(flyDino_position>0 && flyDino_position<80 && ((!isDown && position<140)||(isDown && position>30 && position<140)))){
            //game over pois o dinossauro está na mesma posição do cactus ou flyDino
            document.body.innerHTML = 
            '<h1 class="game-over">Fim de jogo</h1><img class="caixao" src ="images/caixao_meme.gif" alt="meme do caixao"></img>'  
            clearInterval(leftInterval)
        }
        
        
    }, time_map);
    //time_map vai decrescendo pela taxa determinada no início da função, deixando o mapa cada vez mais rápido

}

//função que cria o flyDino e o adciona ao background
function createFlyDino(){
    fly_dino = document.createElement('div')

    flyDino_position = 1500
    fly_dino.classList.add('fly_dino')
    background.appendChild(fly_dino)
    fly_dino.style.left=1500+'px'

}

//função que cria o cactus e o adcionda ao background
function createCactus(){
    cactus = document.createElement('div')

    cactusPosition = 1500
    cactus.classList.add('cactus')
    background.appendChild(cactus)
    cactus.style.left = 1500 +'px'

}

createObstacles()

//vinculamos os eventos aos seus listeners
document.addEventListener('keyup', handleKeyUp)
document.addEventListener('keydown', handleKeyDown)

