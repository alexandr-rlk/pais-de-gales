// Elementos do DOM
let canvas, ctx, spinButton, perguntaContainer, perguntaEl, opcoesEl, feedbackEl;

window.onload = function() {
    // Inicializar elementos do DOM
    canvas = document.getElementById("wheelCanvas");
    ctx = canvas.getContext("2d");
    spinButton = document.getElementById("spinButton");
    perguntaContainer = document.getElementById("pergunta-container");
    perguntaEl = document.getElementById("pergunta");
    opcoesEl = document.getElementById("opcoes");
    feedbackEl = document.getElementById("feedback");

    const perguntas = [
        { numero: 1, pergunta: "Qual é a capital do País de Gales?", opcoes: ["Cardiff","Londres","Dublin","Edimburgo"], correta: 0 },
        { numero: 2, pergunta: "Qual idioma é falado no País de Gales?", opcoes: ["Inglês","Galês","Francês","Irlandês"], correta: 1 },
        { numero: 3, pergunta: "Símbolo principal da bandeira galesa?", opcoes: ["Leão","Dragão","Águia","Cavalo"], correta: 1 },
        { numero: 4, pergunta: "Prato tradicional do País de Gales?", opcoes: ["Cawl","Feijoada","Sushi","Tacos"], correta: 0 },
        { numero: 5, pergunta: "Qual é o nome do hino nacional galês?", opcoes: ["Hen Wlad Fy Nhadau","God Save the King","La Marseillaise","Flower of Scotland"], correta: 0 },
        { numero: 6, pergunta: "Qual o país vizinho de Gales?", opcoes: ["Escócia","Inglaterra","Irlanda","França"], correta: 1 },
        { numero: 7, pergunta: "Qual animal aparece na bandeira galesa?", opcoes: ["Dragão","Lobo","Urso","Águia"], correta: 0 },
        { numero: 8, pergunta: "Gales faz parte de qual país?", opcoes: ["Reino Unido","França","Espanha","Irlanda"], correta: 0 },
        { numero: 9, pergunta: "Qual esporte é mais popular em Gales?", opcoes: ["Rúgbi","Futebol","Tênis","Basquete"], correta: 0 },
        { numero: 10, pergunta: "Qual flor é símbolo nacional de Gales?", opcoes: ["Narciso","Rosa","Tulipa","Girassol"], correta: 0 }
    ];

    let anguloAtual = 0;
    const numSetores = perguntas.length;
    const anguloPorSetor = (2 * Math.PI) / numSetores;
    const cores = [
        "#FF0000", "#FF6B00", "#FFD700", "#32CD32", "#1E90FF",
        "#8A2BE2", "#FF69B4", "#00CED1", "#9370DB", "#20B2AA"
    ];
    let podeGirar = true;

    function desenharRoleta() {
        if (!ctx) return; 

        // CRÍTICO: Usa as dimensões INTERNAS ATUAIS do Canvas.
        // A função ajustarTamanhoCanvas garante que estas são iguais.
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = centerX; 

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define um gradiente para o brilho geral
        const brilhoGeral = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        brilhoGeral.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        brilhoGeral.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        brilhoGeral.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        for(let i = 0; i < numSetores; i++) {
            // Desenhar setor
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, anguloPorSetor * i, anguloPorSetor * (i + 1));
            
            // Criar gradiente para cada setor
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.25, centerX, centerY, radius);
            const corBase = cores[i];
            const corClara = clarearCor(corBase, 30);
            const corEscura = escurecerCor(corBase, 20);
            
            gradient.addColorStop(0, corClara);
            gradient.addColorStop(0.5, corBase);
            gradient.addColorStop(1, corEscura);
            
            ctx.fillStyle = gradient;
            ctx.fill();
            
            // Adicionar borda
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Adicionar texto com sombra
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(anguloPorSetor * i + anguloPorSetor / 2);
            
            // Posição e tamanho do texto proporcional ao raio
            const textRadius = radius * 0.75; 
            const fontSizeBig = radius * 0.12; 
            const fontSizeSmall = radius * 0.04; 
            const textOffset = radius * 0.075; 
            
            // Sombra do texto e contorno
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            // Desenhar o número com contorno
            ctx.font = `bold ${fontSizeBig}px Roboto Slab`;
            ctx.strokeText(i + 1, textRadius, 0);
            ctx.fillStyle = "white";
            ctx.fillText(i + 1, textRadius, 0);
            
            // Desenhar a palavra "Pergunta" com contorno
            ctx.font = `bold ${fontSizeSmall}px Roboto Slab`;
            ctx.strokeText("Pergunta", textRadius, -textOffset);
            ctx.fillText("Pergunta", textRadius, -textOffset);
            ctx.restore();
        }

        // Adicionar imagem central
        const centroImg = document.getElementById('centro-roleta');
        const centroSize = radius * 0.20; // Tamanho central proporcional
        if (centroImg) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(centerX, centerY, centroSize/2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(centroImg, centerX - centroSize/2, centerY - centroSize/2, centroSize, centroSize);
            ctx.restore();
            
            // Adicionar borda decorativa
            ctx.beginPath();
            ctx.arc(centerX, centerY, centroSize/2, 0, Math.PI * 2);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.stroke();
        }
    }

    // Funções auxiliares para manipulação de cores
    function clarearCor(cor, percent) {
        const hex = cor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const amount = Math.round(2.55 * percent);
        const newR = Math.min(r + amount, 255);
        const newG = Math.min(g + amount, 255);
        const newB = Math.min(b + amount, 255);
        
        return "#" + (newR.toString(16)).padStart(2, '0') + 
               (newG.toString(16)).padStart(2, '0') + 
               (newB.toString(16)).padStart(2, '0');
    }

    function escurecerCor(cor, percent) {
        const hex = cor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const amount = Math.round(2.55 * percent);
        const newR = Math.max(r - amount, 0);
        const newG = Math.max(g - amount, 0);
        const newB = Math.max(b - amount, 0);
        
        return "#" + (newR.toString(16)).padStart(2, '0') + 
               (newG.toString(16)).padStart(2, '0') + 
               (newB.toString(16)).padStart(2, '0');
    }

    function girarRoleta(){
        if(!podeGirar) return;
        spinButton.disabled = true;
        perguntaContainer.classList.add('hidden');
        
        const giroTotal = Math.random()*360+720+1440;
        const duracao = 4000;
        const inicio = performance.now();
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        function animarGiro(tempoAtual){
            const progresso = Math.min((tempoAtual-inicio)/duracao,1);
            const easing = 1 - Math.pow(1 - progresso, 4);
            anguloAtual = (giroTotal * easing) % 360;
            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            // Usa as variáveis dinâmicas centerX e centerY para a rotação
            ctx.translate(centerX, centerY);
            ctx.rotate((anguloAtual*Math.PI)/180);
            ctx.translate(-centerX, -centerY);
            desenharRoleta();
            ctx.restore();

            if(progresso < 0.2) {
                canvas.style.transform = "translateX(" + (Math.sin(progresso * 50) * 2) + "px)";
            } else {
                canvas.style.transform = 'none';
            }

            if(progresso<1) {
                requestAnimationFrame(animarGiro);
            } else {
                canvas.style.animation = 'stopSpin 0.5s ease-out';
                setTimeout(() => {
                    canvas.style.animation = '';
                    mostrarPergunta();
                }, 500);
            }
        }
        requestAnimationFrame(animarGiro);
    }

    function mostrarPergunta(){
        const rotacaoTotal = (anguloAtual % 360);
        const anguloNormalizado = (360 - rotacaoTotal) % 360; 
        const anguloSetor = 360 / numSetores;
        const indice = Math.floor(anguloNormalizado / anguloSetor);
        
        const perguntaEscolhida = perguntas[indice % numSetores]; 

        setTimeout(() => {
            perguntaContainer.classList.remove("hidden");
            perguntaEl.textContent = perguntaEscolhida.pergunta;
            opcoesEl.innerHTML = "";
            feedbackEl.textContent = "";
            
            perguntaEl.style.opacity = "0";
            perguntaEl.style.width = "0"; 
            perguntaEl.style.overflow = "hidden"; 
            
            setTimeout(() => {
                perguntaEl.style.opacity = "1";
                perguntaEl.style.animation = "typing 1s steps(40, end) forwards";
                
                perguntaEscolhida.opcoes.forEach((op, i) => {
                    setTimeout(() => {
                        const btn = document.createElement("button");
                        btn.textContent = op;
                        btn.style.opacity = "0";
                        btn.onclick = () => {
                            Array.from(opcoesEl.children).forEach(b => b.disabled = true);
                            spinButton.disabled = false; 
                            
                            if(i === perguntaEscolhida.correta) {
                                btn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)";
                                btn.style.transform = "scale(1.05)";
                                btn.classList.add('correct-answer');
                                feedbackEl.textContent = "🎉 Você acertou! Peça a algum integrante seu prêmio!";
                                feedbackEl.style.color = "#00b37e";
                                feedbackEl.style.animation = "bounce 0.5s ease";
                                podeGirar = false; 
                                
                                for(let i = 0; i < 50; i++) {
                                    const confetti = document.createElement('div');
                                    confetti.className = 'confetti';
                                    confetti.style.left = Math.random() * 100 + 'vw';
                                    confetti.style.top = Math.random() * -20 + 'vh'; 
                                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                                    confetti.style.animationDelay = (Math.random() * 0.5) + 's';
                                    confetti.style.backgroundColor = ['#FFD700', '#00b37e', '#FF69B4', '#87CEEB'][Math.floor(Math.random() * 4)];
                                    document.body.appendChild(confetti);
                                    setTimeout(() => confetti.remove(), 5000);
                                }
                            } else {
                                btn.style.background = "linear-gradient(45deg, #e74c3c, #c0392b)";
                                btn.style.animation = "shake 0.5s ease";
                                
                                const corretaBtn = opcoesEl.children[perguntaEscolhida.correta];
                                corretaBtn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)";
                                
                                feedbackEl.textContent = "❌ Resposta incorreta! Tente novamente girando a roleta.";
                                feedbackEl.style.color = "#e74c3c";
                                podeGirar = true;
                            }
                        };
                        opcoesEl.appendChild(btn);
                        
                        setTimeout(() => {
                            btn.style.opacity = "1";
                            btn.style.animation = "slideIn 0.5s ease forwards";
                        }, 50);
                    }, i * 200);
                });
            }, 100);
        }, 500);
    }

    // LÓGICA DE RESPONSIVIDADE DO CANVAS (CORREÇÃO FINAL)
    const roletaWrapper = document.querySelector(".roleta-wrapper");
    
    function ajustarTamanhoCanvas() {
        // Pega a largura do contêiner (ex: 90vw), que o CSS garante que é um quadrado
        const size = roletaWrapper.clientWidth; 
        
        // CORREÇÃO CRÍTICA: Define a resolução interna do Canvas (width/height) para ser um quadrado perfeito.
        // Isso remove o formato oval.
        canvas.width = size;
        canvas.height = size;
        desenharRoleta();
    }

    // Inicializa o Canvas com o tamanho correto e redesenha ao redimensionar
    ajustarTamanhoCanvas(); 
    window.addEventListener('resize', ajustarTamanhoCanvas);

    spinButton.addEventListener("click", girarRoleta);
};

