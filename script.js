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
        
        // CORREÇÃO: Variáveis dinâmicas para o centro e o raio (crucial para a responsividade)
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY); 

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
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.125, centerX, centerY, radius); 
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
            ctx.textAlign = "right";
            
            // Posição e tamanho do texto proporcional ao raio
            const textRadius = radius * 0.75; 
            const fontSizeBig = radius * 0.12; 
            const fontSizeSmall = radius * 0.04; 
            const textOffset = radius * 0.075; 
            
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

        // Adicionar borda decorativa (no Canvas, mas o elemento HTML com a imagem é posicionado por CSS)
        const centroImg = document.getElementById('centro-roleta');
        if (centroImg) {
            const centroSize = 80; // Tamanho do elemento HTML (deve estar sincronizado com o CSS)
            
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
        
        // Define o centro dinâmico para a animação
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        function animarGiro(tempoAtual){
            const progresso = Math.min((tempoAtual-inicio)/duracao,1);
            // Função de easing para movimento mais natural
            const easing = 1 - Math.pow(1 - progresso, 4);
            anguloAtual = (giroTotal * easing) % 360;
            
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.translate(centerX, centerY); 
            ctx.rotate((anguloAtual*Math.PI)/180);
            ctx.translate(-centerX, -centerY); 
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
                canvas.style.animation = 'stopSpin 0.5s ease-out'; // stopSpin deve ser definido no CSS
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
        const rotacaoTotal = (anguloAtual % 360);
        const anguloNormalizado = (360 - rotacaoTotal) % 360; 
        const anguloSetor = 360 / numSetores;
        const indice = Math.floor(anguloNormalizado / anguloSetor);
        
        const perguntaEscolhida = perguntas[indice % numSetores]; 

        // Prepara o container de pergunta
        setTimeout(() => {
            perguntaContainer.classList.remove("hidden");
            perguntaEl.textContent = perguntaEscolhida.pergunta;
            opcoesEl.innerHTML = "";
            feedbackEl.textContent = "";
            
            // Adiciona efeito de typing na pergunta
            perguntaEl.style.opacity = "0";
            perguntaEl.style.width = "0"; 
            perguntaEl.style.overflow = "hidden"; 
            
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
                                // ACERTO: SÓ A CERTA FICA VERDE
                                btn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)"; // Verde
                                btn.style.transform = "scale(1.05)";
                                feedbackEl.textContent = "🎉 Você acertou! Peça a algum integrante seu prêmio!";
                                feedbackEl.style.color = "#00b37e";
                                feedbackEl.style.animation = "bounce 0.5s ease";
                                podeGirar = false; 
                                
                                // Criar confetes (se o CSS tiver a classe .confetti)
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
                                // ERRO: CLICADA FICA VERMELHA E CERTA FICA VERDE
                                btn.style.background = "linear-gradient(45deg, #e74c3c, #c0392b)"; // Vermelho
                                btn.style.animation = "shake 0.5s ease";
                                
                                // Mostra a resposta correta (fica verde)
                                const corretaBtn = opcoesEl.children[perguntaEscolhida.correta];
                                corretaBtn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)"; // Verde
                                
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

    // CORREÇÃO: LÓGICA DE RESPONSIVIDADE
    const roletaWrapper = document.querySelector(".roleta-wrapper");
    
    function ajustarTamanhoCanvas() {
        // Redefine a resolução interna (em pixels) do Canvas para corresponder ao tamanho de exibição (CSS)
        canvas.width = roletaWrapper.clientWidth;
        canvas.height = roletaWrapper.clientHeight;
        desenharRoleta();
    }

    // Chama o ajuste de tamanho inicial e redesenha a roleta
    ajustarTamanhoCanvas(); 

    // Opcional: Redesenha se o tamanho da tela mudar (ex: girar o celular)
    window.addEventListener('resize', ajustarTamanhoCanvas);
    
    spinButton.addEventListener("click", girarRoleta);
};