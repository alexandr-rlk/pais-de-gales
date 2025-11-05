window.onload = function() {
    const comecarBtn = document.getElementById("comecar-btn");
    const topicsContainer = document.getElementById("topicos");
    const teamSection = document.getElementById("equipe");
    const splashScreen = document.getElementById("splash-screen"); 
    
    const splashMain = document.querySelector('.splash-main'); 

    const header = document.querySelector('.splash-header'); 
    const body = document.body;
    
    const quizSection = document.getElementById('quiz-interativo'); 
    const startQuizBtn = document.getElementById('start-quiz-btn'); 
    const quizContentWrapper = document.getElementById('quiz-content-wrapper'); 
    const quizContainer = document.getElementById('quiz-container');
    const quizResults = document.getElementById('quiz-results');
    const resultsMessage = document.getElementById('results-message');
    const resultsScore = document.getElementById('results-score');
    
    const feedbackForm = document.getElementById('feedback-form');
    const feedbackMessage = document.getElementById('feedback-message');
    
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const sliderItems = document.querySelectorAll('.slider-item');
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    let currentIndex = 0;
    const totalSlides = sliderItems.length;

    const quizQuestions = [
        {
            question: "Qual é o símbolo nacional do País de Gales, presente em sua bandeira?",
            options: ["A Flor-de-lis", "O Dragão Vermelho", "O Trevo", "A Rosa"],
            correctAnswer: 1 
        },
        {
            question: "Qual instrumento musical é considerado o instrumento nacional do País de Gales?",
            options: ["Violino", "Gaita de Foles", "Harpa", "Guitarra"],
            correctAnswer: 2 
        },
        {
            question: "Qual destes é um prato tradicional da culinária galesa?",
            options: ["Fish and Chips", "Haggis", "Cawl (ensopado de carne e legumes)", "Bangers and Mash"],
            correctAnswer: 2 
        },
        {
            question: "Qual é o nome do festival cultural galês que celebra música, poesia e arte, conhecido como o maior festival literário do Reino Unido?",
            options: ["Glastonbury", "Eisteddfod", "Fringe", "Notting Hill Carnival"],
            correctAnswer: 1 
        }
    ];
    
    
    function startQuiz() {
        quizSection.scrollIntoView({ behavior: 'smooth' });
        startQuizBtn.style.display = 'none';
        quizContentWrapper.style.display = 'block';
    }
    
    function renderQuiz() {
        quizResults.style.display = 'none';
        quizContainer.style.display = 'block';
        quizContainer.innerHTML = '';
        
        quizQuestions.forEach((q, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('quiz-question');
            questionElement.setAttribute('data-question-index', index);
            
            const title = document.createElement('h3');
            title.textContent = `Pergunta ${index + 1}: ${q.question}`;
            questionElement.appendChild(title);
            
            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('quiz-options');
            
            q.options.forEach((option, optionIndex) => {
                const label = document.createElement('label');
                
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question-${index}`;
                radio.value = optionIndex;
                radio.required = true;
                
                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                optionsContainer.appendChild(label);
            });
            
            questionElement.appendChild(optionsContainer);
            quizContainer.appendChild(questionElement);
        });
        
        const submitButton = document.createElement('button');
        submitButton.id = 'submit-quiz-btn';
        submitButton.classList.add('cta');
        submitButton.textContent = 'Ver Resultados';
        quizContainer.appendChild(submitButton);
        
        submitButton.addEventListener('click', checkAnswers);
    }
    
    function checkAnswers() {
        let score = 0;
        const allQuestions = document.querySelectorAll('.quiz-question');
        let allAnswered = true;
        
        const submitButton = document.getElementById('submit-quiz-btn');
        if (submitButton) {
            submitButton.removeEventListener('click', checkAnswers);
        }
        
        allQuestions.forEach((qElement, qIndex) => {
            const selectedOption = qElement.querySelector(`input[name="question-${qIndex}"]:checked`);
            const options = qElement.querySelectorAll('label');
            const correctAnswerIndex = quizQuestions[qIndex].correctAnswer;
            
            if (!selectedOption) {
                allAnswered = false;
                return; 
            }
            
            qElement.classList.add('answered');
            options.forEach(label => {
                label.style.pointerEvents = 'none';
            });
            
            const selectedValue = parseInt(selectedOption.value);
            
            options.forEach((label, oIndex) => {
                if (oIndex === correctAnswerIndex) {
                    label.classList.add('correct');
                }
                
                if (oIndex === selectedValue && oIndex !== correctAnswerIndex) {
                    label.classList.add('incorrect');
                }
            });
            
            if (selectedValue === correctAnswerIndex) {
                score++;
            }
        });
        
        if (!allAnswered) {
            alert('Por favor, responda a todas as perguntas antes de ver os resultados.');
            if (submitButton) {
                submitButton.addEventListener('click', checkAnswers);
            }
            return;
        }
        
        displayResults(score, quizQuestions.length);
        quizSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    function displayResults(score, total) {
        quizContainer.style.display = 'none';
        resultsScore.textContent = `Você acertou ${score} de ${total} perguntas.`;
        
        let message = '';
        if (score === total) {
            message = 'Parabéns! Você é um Mestre Galês!';
        } else if (score >= total / 2) {
            message = 'Muito bom! Você conhece bem o País de Gales.';
        } else {
            message = 'Você pode melhorar! Tente ler um pouco mais.';
        }
        resultsMessage.textContent = message;
        
        quizResults.style.display = 'block';
        
        document.getElementById('restart-quiz-btn').addEventListener('click', restartQuiz);
    }
    
    function restartQuiz() {
        document.getElementById('restart-quiz-btn').removeEventListener('click', restartQuiz);
        renderQuiz(); 
        quizSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const form = e.target;
            const data = new FormData(form);
            
            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json' 
                    }
                });

                if (response.ok) {
                    form.style.display = 'none';
                    feedbackMessage.style.display = 'block';
                    feedbackMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert("Ops! Houve um erro ao enviar seu feedback. Por favor, tente novamente mais tarde.");
                    console.error("Erro de submissão do Formspree:", response.status);
                }
            } catch (error) {
                alert("Erro de conexão. Por favor, verifique sua rede e tente novamente.");
                console.error("Erro de rede:", error);
            }
        });
    }
    
    function updateSlider() {
        const offset = -currentIndex * 100;
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(${offset}%)`;
        }
    }

    function prevSlide() {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : totalSlides - 1;
        updateSlider();
    }

    function nextSlide() {
        currentIndex = (currentIndex < totalSlides - 1) ? currentIndex + 1 : 0;
        updateSlider();
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    function hideContentAndScrollToTop() {
        topicsContainer.classList.add("hidden-content");
        teamSection.classList.add("hidden-content");
        
        if (splashMain) {
            splashMain.style.display = 'flex'; 
        }
        
        body.classList.remove('content-active'); 
        header.classList.remove('shrink'); 
        
        comecarBtn.textContent = "COMEÇAR";
        comecarBtn.setAttribute('href', '#topicos');

        splashScreen.scrollIntoView({ behavior: 'smooth' });
    }

    function showContent() {
        if (splashMain) {
            splashMain.style.display = 'none'; 
        }
        
        topicsContainer.classList.remove("hidden-content");
        teamSection.classList.remove("hidden-content");
        
        body.classList.add('content-active');
        
        comecarBtn.textContent = "FECHAR";
        comecarBtn.setAttribute('href', '#splash-screen');

        topicsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function handleScroll() {
        if (body.classList.contains('content-active')) {
            if (window.scrollY > 0) {
                header.classList.add('shrink');
            } else {
                header.classList.remove('shrink');
            }
        }
    }
    
    window.addEventListener("scroll", handleScroll);
    
    if (comecarBtn && topicsContainer && teamSection && splashMain) {
        comecarBtn.addEventListener("click", (e) => {
            e.preventDefault(); 
            
            const isContentVisible = !topicsContainer.classList.contains("hidden-content");
            
            if (isContentVisible) {
                hideContentAndScrollToTop();
            } else {
                showContent();
            }
        });
    }

    const navLinks = document.querySelectorAll('.splash-nav a');
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                if (targetId === '#splash-screen') {
                    hideContentAndScrollToTop();
                } else {
                    if (topicsContainer.classList.contains("hidden-content")) {
                         showContent();
                         setTimeout(() => {
                            targetElement.scrollIntoView({ behavior: 'smooth' });
                         }, 100);
                    } else {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });

    renderQuiz();
    startQuizBtn.addEventListener('click', startQuiz);

}; 