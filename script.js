window.onload = function() {
    const comecarBtn = document.getElementById("comecar-btn");
    const topicsContainer = document.getElementById("topicos");
    const teamSection = document.getElementById("equipe");
    const splashScreen = document.getElementById("splash-screen"); 
    
    const splashMain = document.querySelector('.splash-main'); 

    const header = document.querySelector('.splash-header'); 
    const body = document.body;
    
    // NOTA: A função stickyHeader foi removida. O efeito shrink será aplicado diretamente.

    // Função auxiliar para esconder o conteúdo (acionada ao clicar em FECHAR ou INÍCIO)
    function hideContentAndScrollToTop() {
        topicsContainer.classList.add("hidden-content");
        teamSection.classList.add("hidden-content");
        
        // MOSTRA o conteúdo principal da splash
        if (splashMain) {
            splashMain.style.display = 'flex'; 
        }
        
        // CORREÇÃO CRÍTICA: Remove a classe de fixação e a classe shrink
        body.classList.remove('content-active'); 
        header.classList.remove('shrink'); 
        
        // Retorna o botão para o estado inicial
        comecarBtn.textContent = "COMEÇAR";
        comecarBtn.setAttribute('href', '#topicos');

        // Rola suavemente para o topo da splash screen
        splashScreen.scrollIntoView({ behavior: 'smooth' });
    }

    // Função auxiliar para mostrar o conteúdo (acionada ao clicar em COMEÇAR)
    function showContent() {
        topicsContainer.classList.remove("hidden-content");
        teamSection.classList.remove("hidden-content");
        
        // ESCONDE o conteúdo principal da splash
        if (splashMain) {
            splashMain.style.display = 'none';
        }

        // CORREÇÃO CRÍTICA: Adiciona a classe de fixação e o efeito shrink imediatamente
        body.classList.add('content-active'); 
        header.classList.add('shrink'); 
        
        // Transforma o botão em "FECHAR"
        comecarBtn.textContent = "FECHAR";
        comecarBtn.setAttribute('href', '#splash-screen');
        
        // Rola suavemente para a seção de tópicos
        setTimeout(() => {
            topicsContainer.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    // === Lógica principal do Botão 'COMEÇAR' / 'FECHAR' ===
    if (comecarBtn && topicsContainer && teamSection && splashMain) {
        comecarBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            const isContentVisible = !topicsContainer.classList.contains("hidden-content");
            
            if (isContentVisible) {
                // Se estiver visível (estado FECHAR), esconde
                hideContentAndScrollToTop();
            } else {
                // Se estiver escondido (estado COMEÇAR), mostra
                showContent();
            }
        });
    }

    // === Lógica para o Link 'INÍCIO' e outros links da navegação ===
    const navLinks = document.querySelectorAll('.splash-nav a');
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Se for o link 'INÍCIO' ou o link de voltar para a splash
                if (targetId === '#splash-screen') {
                    hideContentAndScrollToTop();
                } else {
                    // Para todos os outros links (Tópicos e Equipe), apenas rola
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
};