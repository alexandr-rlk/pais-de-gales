// Elementos do DOM (inicializados depois)
let canvas, ctx, spinButton, perguntaContainer, perguntaEl, opcoesEl, feedbackEl;
let splashScreen, mainContent, comecarBtn;

window.onload = function() {
    splashScreen = document.getElementById("splash-screen");
    mainContent = document.getElementById("main-content");
    comecarBtn = document.getElementById("comecar-btn");

    if (comecarBtn && splashScreen && mainContent) {
        comecarBtn.addEventListener("click", () => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
            inicializarRoleta();
        });
    } else {
         if (splashScreen) splashScreen.style.display = 'none';
         if (mainContent) mainContent.style.display = 'block';
         inicializarRoleta();
    }

    const perguntas = [ { numero: 1, pergunta: "Qual é a capital do País de Gales?", opcoes: ["Cardiff","Londres","Dublin","Edimburgo"], correta: 0 }, { numero: 2, pergunta: "Qual idioma é falado no País de Gales?", opcoes: ["Inglês","Galês","Francês","Irlandês"], correta: 1 }, { numero: 3, pergunta: "Símbolo principal da bandeira galesa?", opcoes: ["Leão","Dragão","Águia","Cavalo"], correta: 1 }, { numero: 4, pergunta: "Prato tradicional do País de Gales?", opcoes: ["Cawl","Feijoada","Sushi","Tacos"], correta: 0 }, { numero: 5, pergunta: "Qual é o nome do hino nacional galês?", opcoes: ["Hen Wlad Fy Nhadau","God Save the King","La Marseillaise","Flower of Scotland"], correta: 0 }, { numero: 6, pergunta: "Qual o país vizinho de Gales?", opcoes: ["Escócia","Inglaterra","Irlanda","França"], correta: 1 }, { numero: 7, pergunta: "Qual animal aparece na bandeira galesa?", opcoes: ["Dragão","Lobo","Urso","Águia"], correta: 0 }, { numero: 8, pergunta: "Gales faz parte de qual país?", opcoes: ["Reino Unido","França","Espanha","Irlanda"], correta: 0 }, { numero: 9, pergunta: "Qual esporte é mais popular em Gales?", opcoes: ["Rúgbi","Futebol","Tênis","Basquete"], correta: 0 }, { numero: 10, pergunta: "Qual flor é símbolo nacional de Gales?", opcoes: ["Narciso","Rosa","Tulipa","Girassol"], correta: 0 } ];
    let anguloAtual = 0; const numSetores = perguntas.length; const anguloPorSetor = (2 * Math.PI) / numSetores;
    const cores = ["#FF0000", "#FF6B00", "#FFD700", "#32CD32", "#1E90FF", "#8A2BE2", "#FF69B4", "#00CED1", "#9370DB", "#20B2AA"];
    let podeGirar = true;

    function inicializarRoleta() {
        canvas = document.getElementById("wheelCanvas"); if (!canvas) { console.error("Canvas 'wheelCanvas' não encontrado!"); return; } ctx = canvas.getContext("2d"); spinButton = document.getElementById("spinButton"); perguntaContainer = document.getElementById("pergunta-container"); perguntaEl = document.getElementById("pergunta"); opcoesEl = document.getElementById("opcoes"); feedbackEl = document.getElementById("feedback");
        ajustarTamanhoCanvas(); window.addEventListener('resize', ajustarTamanhoCanvas);
        if (spinButton) { spinButton.addEventListener("click", girarRoleta); } else { console.error("Botão 'spinButton' não encontrado!"); }
    }

    function desenharRoleta() {
        if (!ctx) return; const centerX = canvas.width / 2; const centerY = canvas.height / 2; const radius = centerX; ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(let i = 0; i < numSetores; i++) {
            ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.arc(centerX, centerY, radius, anguloPorSetor * i, anguloPorSetor * (i + 1)); const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.25, centerX, centerY, radius); const corBase = cores[i]; const corClara = clarearCor(corBase, 30); const corEscura = escurecerCor(corBase, 20); gradient.addColorStop(0, corClara); gradient.addColorStop(0.5, corBase); gradient.addColorStop(1, corEscura); ctx.fillStyle = gradient; ctx.fill(); ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 2; ctx.stroke();
            ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(anguloPorSetor * i + anguloPorSetor / 2); const textRadius = radius * 0.75; const fontSizeBig = radius * 0.12; const fontSizeSmall = radius * 0.04; const textOffset = radius * 0.075; ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2; ctx.lineWidth = 4; ctx.strokeStyle = "black"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = `bold ${fontSizeBig}px Roboto Slab`; ctx.strokeText(i + 1, textRadius, 0); ctx.fillStyle = "white"; ctx.fillText(i + 1, textRadius, 0); ctx.font = `bold ${fontSizeSmall}px Roboto Slab`; ctx.strokeText("Pergunta", textRadius, -textOffset); ctx.fillText("Pergunta", textRadius, -textOffset); ctx.restore();
        }
        ctx.beginPath(); const centroRaio = Math.min(40, radius * 0.4); ctx.arc(centerX, centerY, centroRaio, 0, Math.PI * 2); ctx.fillStyle = '#f4f4f9'; ctx.fill(); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.stroke();
    }

    function clarearCor(cor, percent) { const hex = cor.replace('#', ''); const r = parseInt(hex.substr(0, 2), 16); const g = parseInt(hex.substr(2, 2), 16); const b = parseInt(hex.substr(4, 2), 16); const amount = Math.round(2.55 * percent); const newR = Math.min(r + amount, 255); const newG = Math.min(g + amount, 255); const newB = Math.min(b + amount, 255); return "#" + (newR.toString(16)).padStart(2, '0') + (newG.toString(16)).padStart(2, '0') + (newB.toString(16)).padStart(2, '0'); }
    function escurecerCor(cor, percent) { const hex = cor.replace('#', ''); const r = parseInt(hex.substr(0, 2), 16); const g = parseInt(hex.substr(2, 2), 16); const b = parseInt(hex.substr(4, 2), 16); const amount = Math.round(2.55 * percent); const newR = Math.max(r - amount, 0); const newG = Math.max(g - amount, 0); const newB = Math.max(b - amount, 0); return "#" + (newR.toString(16)).padStart(2, '0') + (newG.toString(16)).padStart(2, '0') + (newB.toString(16)).padStart(2, '0'); }

    function girarRoleta(){
        if(!podeGirar || !canvas) return; spinButton.disabled = true; perguntaContainer.classList.add('hidden'); const giroTotal = Math.random()*360+720+1440; const duracao = 4000; const inicio = performance.now(); const centerX = canvas.width / 2; const centerY = canvas.height / 2; function animarGiro(tempoAtual){ if (!canvas || !ctx) return; const progresso = Math.min((tempoAtual-inicio)/duracao,1); const easing = 1 - Math.pow(1 - progresso, 4); anguloAtual = (giroTotal * easing) % 360; ctx.clearRect(0,0,canvas.width,canvas.height); ctx.save(); ctx.translate(centerX, centerY); ctx.rotate((anguloAtual*Math.PI)/180); ctx.translate(-centerX, -centerY); desenharRoleta(); ctx.restore(); if(progresso < 0.2) canvas.style.transform = "translateX(" + (Math.sin(progresso * 50) * 2) + "px)"; else canvas.style.transform = 'none'; if(progresso<1) requestAnimationFrame(animarGiro); else { canvas.style.animation = 'stopSpin 0.5s ease-out'; setTimeout(() => { if(canvas) canvas.style.animation = ''; mostrarPergunta(); }, 500); } } requestAnimationFrame(animarGiro); }
    function mostrarPergunta(){ const rotacaoTotal = (anguloAtual % 360); const anguloNormalizado = (360 - rotacaoTotal) % 360; const anguloSetor = 360 / numSetores; const indice = Math.floor(anguloNormalizado / anguloSetor); const perguntaEscolhida = perguntas[indice % numSetores]; setTimeout(() => { if (!perguntaContainer || !perguntaEl || !opcoesEl || !feedbackEl) return; perguntaContainer.classList.remove("hidden"); perguntaEl.textContent = perguntaEscolhida.pergunta; opcoesEl.innerHTML = ""; feedbackEl.textContent = ""; perguntaEl.style.opacity = "0"; perguntaEl.style.width = "0"; perguntaEl.style.overflow = "hidden"; setTimeout(() => { perguntaEl.style.opacity = "1"; perguntaEl.style.animation = "typing 1s steps(40, end) forwards"; perguntaEscolhida.opcoes.forEach((op, i) => { setTimeout(() => { const btn = document.createElement("button"); btn.textContent = op; btn.style.opacity = "0"; btn.onclick = () => { Array.from(opcoesEl.children).forEach(b => b.disabled = true); if(spinButton) spinButton.disabled = false; if(i === perguntaEscolhida.correta) { btn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)"; btn.style.transform = "scale(1.05)"; btn.classList.add('correct-answer'); feedbackEl.textContent = "🎉 Você acertou! Peça a algum integrante seu prêmio!"; feedbackEl.style.color = "#00b37e"; feedbackEl.style.animation = "bounce 0.5s ease"; podeGirar = false; for(let k = 0; k < 50; k++) { const confetti = document.createElement('div'); confetti.className = 'confetti'; confetti.style.left = Math.random() * 100 + 'vw'; confetti.style.top = Math.random() * -20 + 'vh'; confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'; confetti.style.animationDelay = (Math.random() * 0.5) + 's'; confetti.style.backgroundColor = ['#FFD700', '#00b37e', '#FF69B4', '#87CEEB'][Math.floor(Math.random() * 4)]; document.body.appendChild(confetti); setTimeout(() => confetti.remove(), 5000); } } else { btn.style.background = "linear-gradient(45deg, #e74c3c, #c0392b)"; btn.style.animation = "shake 0.5s ease"; const corretaBtn = opcoesEl.children[perguntaEscolhida.correta]; corretaBtn.style.background = "linear-gradient(45deg, #00b37e, #007f5f)"; feedbackEl.textContent = "❌ Resposta incorreta! Tente novamente girando a roleta."; feedbackEl.style.color = "#e74c3c"; podeGirar = true; } }; opcoesEl.appendChild(btn); setTimeout(() => { btn.style.opacity = "1"; btn.style.animation = "slideIn 0.5s ease forwards"; }, 50); }, i * 200); }); }, 100); }, 500); }

    // LÓGICA DE RESPONSIVIDADE DO CANVAS
    const roletaWrapper = document.querySelector(".roleta-wrapper");
    function ajustarTamanhoCanvas() {
        if (!canvas || !roletaWrapper) return; const size = roletaWrapper.clientWidth;
        if (canvas.width !== size || canvas.height !== size) { canvas.width = size; canvas.height = size; if (size > 0 && ctx) { desenharRoleta(); } }
        else if (size > 0 && ctx && ctx.getImageData(1,1,1,1).data.reduce((a, b) => a + b, 0) === 0) { if (size > 0 && ctx) { desenharRoleta(); } }
    }

}; // FIM DO window.onload