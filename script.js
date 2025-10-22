console.log("Bem-vindo ao site sobre o País de Gales!");

document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.style.background = "#f0f9f9";
            setTimeout(() => {
                card.style.background = "white";
            }, 500);
        });
    });
});
