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
        "#FF0000", // Vermelho
        "#FF6B00", // Laranja
        "#FFD700", // Dourado
        "#32CD32", // Verde Lima
        "#1E90FF", // Azul Dodger
        "#8A2BE2", // Azul Violeta
        "#FF69B4", // Rosa Quente
        "#00CED1", // Turquesa Escuro
        "#9370DB", // Roxo Médio
        "#20B2AA"  // Verde Mar Claro
    ];
    let podeGirar = true;

    function desenharRoleta() {
        if (!ctx) return; 

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Define um gradiente para o brilho geral
        const brilhoGeral = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        brilhoGeral.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        brilhoGeral.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        brilhoGeral.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

        for(let i = 0; i < numSetores; i++) {
            // Desenhar setor
            ctx.beginPath();
            ctx.moveTo(200, 200);
            ctx.arc(200, 200, 200, anguloPorSetor * i, anguloPorSetor * (i + 1));
            
            // Criar gradiente para cada setor
            const gradient = ctx.createRadialGradient(200, 200, 50, 200, 200, 200);
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
            ctx.translate(200, 200);
            ctx.rotate(anguloPorSetor * i + anguloPorSetor / 2);
            ctx.textAlign = "right";
            ctx.font = "bold 18px Roboto Slab";
            
            // Sombra do texto
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            
            // Configurar texto
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            // Adicionar sombra e contorno para melhor legibilidade
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.lineWidth = 4;
            ctx.strokeStyle = "black";
            
            // Desenhar o número com contorno
            ctx.font = "bold 48px Roboto Slab";
            ctx.strokeText(i + 1, 150, 0);
            ctx.fillStyle = "white";
            ctx.fillText(i + 1, 150, 0);
            
            // Desenhar a palavra "Pergunta" com contorno
            ctx.font = "bold 16px Roboto Slab";
            ctx.strokeText("Pergunta", 150, -30);
            ctx.fillText("Pergunta", 150, -30);
            ctx.restore();
        }

        // Adicionar imagem central
        const centroImg = document.getElementById('centro-roleta');
        if (centroImg) {
            const centroSize = 80; // Tamanho da imagem central
            ctx.save();
            ctx.beginPath();
            ctx.arc(200, 200, centroSize/2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(centroImg, 200 - centroSize/2, 200 - centroSize/2, centroSize, centroSize);
            ctx.restore();
            
            // Adicionar borda decorativa
            ctx.beginPath();
            ctx.arc(200, 200, centroSize/2, 0, Math.PI * 2);
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
        
        // Som de giro (opcional)
        // OBS: O áudio está como um data URI vazio. Substitua pelo seu arquivo de som, se tiver.
        const somGiro = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//NFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        // somGiro.play(); 

        function animarGiro(tempoAtual){
            const progresso = Math.min((tempoAtual-inicio)/duracao,1);
            // Função de easing para movimento mais natural
            const easing = 1 - Math.pow(1 - progresso, 4);
            anguloAtual = (giroTotal * easing) % 360;
            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.translate(200,200);
            ctx.rotate((anguloAtual*Math.PI)/180);
            ctx.translate(-200,-200);
            desenharRoleta();
            ctx.restore();

            // Adiciona efeito de vibração sutil no início
            if(progresso < 0.2) {
                canvas.style.transform = "translateX(" + (Math.sin(progresso * 50) * 2) + "px)";
            } else {
                canvas.style.transform = 'none';
            }

            if(progresso<1) {
                requestAnimationFrame(animarGiro);
            } else {
                // Efeito de "bouncing" ao parar
                canvas.style.animation = 'stopSpin 0.5s ease-out'; // Uso do stopSpin (do styles.css)
                setTimeout(() => {
                    canvas.style.animation = '';
                    mostrarPergunta();
                }, 500);
            }
        }
        requestAnimationFrame(animarGiro);
    }

    function mostrarPergunta(){
        // Calcula o setor que está na posição do ponteiro
        // A flecha (seta) está no topo (ângulo 0).
        // Convertemos anguloAtual para um valor entre 0 e 360, e ajustamos a rotação para o índice correto.
        const rotacaoTotal = (anguloAtual % 360);
        const anguloNormalizado = (360 - rotacaoTotal) % 360; 
        const anguloSetor = 360 / numSetores;
        const indice = Math.floor(anguloNormalizado / anguloSetor);
        
        // Garante que o índice não exceda o tamanho do array
        const perguntaEscolhida = perguntas[indice % numSetores]; 

        // Prepara o container de pergunta
        setTimeout(() => {
            perguntaContainer.classList.remove("hidden");
            perguntaEl.textContent = perguntaEscolhida.pergunta;
            opcoesEl.innerHTML = "";
            feedbackEl.textContent = "";
            
            // Adiciona efeito de typing na pergunta
            perguntaEl.style.opacity = "0";
            perguntaEl.style.width = "0"; // Reset para a animação
            perguntaEl.style.overflow = "hidden"; // Necessário para o efeito 'typing'
            
            setTimeout(() => {
                perguntaEl.style.opacity = "1";
                perguntaEl.style.animation = "typing 1s steps(40, end) forwards";
                
                // Adiciona as opções com delay para efeito de cascata
                perguntaEscolhida.opcoes.forEach((op, i) => {
                    setTimeout(() => {
                        const btn = document.createElement("button");
                        btn.textContent = op;
                        btn.style.opacity = "0";
                        btn.onclick = () => {
                            // Desabilita todos os botões
                            Array.from(opcoesEl.children).forEach(b => b.disabled = true);
                            spinButton.disabled = false; // Permite girar novamente
                            
                            if(i === perguntaEscolhida.correta) {
                                // Efeito de resposta correta
                                btn.style.background = "#00b37e";
                                btn.style.transform = "scale(1.05)";
                                btn.classList.add('correct-answer');
                                feedbackEl.textContent = "🎉 Você acertou! Peça a algum integrante seu prêmio!";
                                feedbackEl.style.color = "#00b37e";
                                feedbackEl.style.animation = "bounce 0.5s ease";
                                podeGirar = false; // Desativa o giro após acertar (ganhou o prêmio)
                                
                                // Criar confetes
                                for(let i = 0; i < 50; i++) {
                                    const confetti = document.createElement('div');
                                    confetti.className = 'confetti';
                                    confetti.style.left = Math.random() * 100 + 'vw';
                                    confetti.style.top = Math.random() * -20 + 'vh'; // Começa fora da tela
                                    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                                    confetti.style.animationDelay = (Math.random() * 0.5) + 's';
                                    confetti.style.backgroundColor = ['#FFD700', '#00b37e', '#FF69B4', '#87CEEB'][Math.floor(Math.random() * 4)];
                                    document.body.appendChild(confetti);
                                    setTimeout(() => confetti.remove(), 5000);
                                }
                            } else {
                                // Efeito de resposta incorreta
                                btn.style.background = "#e74c3c";
                                btn.style.animation = "shake 0.5s ease";
                                
                                // Mostra a resposta correta
                                const corretaBtn = opcoesEl.children[perguntaEscolhida.correta];
                                corretaBtn.style.background = "#00b37e";
                                
                                feedbackEl.textContent = "❌ Resposta incorreta! Tente novamente girando a roleta.";
                                feedbackEl.style.color = "#e74c3c";
                                podeGirar = true;
                            }
                        };
                        opcoesEl.appendChild(btn);
                        
                        // Fade in do botão
                        setTimeout(() => {
                            btn.style.opacity = "1";
                            btn.style.animation = "slideIn 0.5s ease forwards";
                        }, 50);
                    }, i * 200); // Delay crescente para cada opção
                });
            }, 100);
        }, 500);
    }

    // A roleta deve ser desenhada ao carregar a página
    desenharRoleta();
    
    // O evento de clique deve ser adicionado após o botão ser inicializado
    spinButton.addEventListener("click", girarRoleta);
};