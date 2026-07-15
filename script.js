/* =========================================================
   ELEMENTS
========================================================= */

const card = document.getElementById("card");
const button = document.getElementById("flipButton");
const message = document.getElementById("message");

let opened = false;


/* =========================================================
   TOGGLE CARD (Переключение карты туда-обратно)
========================================================= */

function toggleCard(){

    if (opened) {
        // --- ЗАКРЫВАЕМ КАРТУ ---
        opened = false;

        card.classList.remove("flipped");
        
        // Возвращаем исходные тексты
        button.innerHTML = "✨ Открыть карту";
        message.innerHTML = "Ваше послание уже ждёт вас...";

    } else {
        // --- ОТКРЫВАЕМ КАРТУ ---
        opened = true;

        card.classList.add("flipped");
        card.style.transform = ""; // Сбрасываем 3D-наклон от мышки

        // Эффект золотого блеска
        card.classList.add("flipping");

        setTimeout(() => {
            card.classList.remove("flipping");
        }, 1200);

        // Вибрация телефона
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Меняем текст на кнопке
        button.innerHTML = "🔮 Закрыть карту";

        // Меняем текст предсказания с задержкой
        setTimeout(() => {
            if (opened) { // Проверяем, не закрыл ли пользователь карту раньше времени
                message.innerHTML = "✨ Ваше послание открыто ✨";
            }
        }, 900);
    }
}


/* =========================================================
   CLICK LISTENERS
========================================================= */

card.addEventListener("click", toggleCard);
button.addEventListener("click", toggleCard);


/* =========================================================
   FLOATING PARTICLES
========================================================= */

const particles = document.getElementById("particles");

function createParticle(){
    const p = document.createElement("div");
    p.className = "particle";

    let size = Math.random() * 4 + 2;
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = (Math.random() * 15 + 10) + "s";
    p.style.animationDelay = Math.random() * 5 + "s";

    particles.appendChild(p);

    setTimeout(() => {
        p.remove();
    }, 25000);
}

setInterval(createParticle, 300);


/* =========================================================
   3D TILT EFFECT
========================================================= */

const scene = document.querySelector(".scene");

scene.addEventListener("mousemove", (e) => {
    if (opened) return; // Наклоны работают, только если карта закрыта

    const rect = scene.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 15;
    const rotateX = ((y / rect.height) - 0.5) * -15;

    card.style.setProperty("--rotateX", rotateX + "deg");
    card.style.setProperty("--rotateY", rotateY + "deg");
});

scene.addEventListener("mouseleave", () => {
    card.style.setProperty("--rotateX", "0deg");
    card.style.setProperty("--rotateY", "0deg");
});


/* =========================================================
   MOBILE TOUCH TILT
========================================================= */

scene.addEventListener("touchmove", (e) => {
    if (opened) return;

    const touch = e.touches[0];
    const rect = scene.getBoundingClientRect();

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((y / rect.height) - 0.5) * -18;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
});

scene.addEventListener("touchend", () => {
    if (opened) return;
    card.style.transform = "";
});
