/* =========================================================
   БАЗА ДАННЫХ КАРТ ТАРО
========================================================= */

const tarotCards = {
    "empress": {
        title: "Императрица",
        subtitle: "Аркан плодородия, созидания и жизненной силы...",
        image: "images/front.png", // оставляем front.png, так как Императрица у тебя уже загружена!
        prediction: "✨ Императрица сулит вам расцвет сил, изобилие и успех в любых начинаниях! ✨"
    },
    "star": {
        title: "Звезда",
        subtitle: "Аркан надежды, вдохновения и ясного будущего...",
        image: "images/star.png",
        prediction: "✨ Звезда освещает ваш путь. Доверьтесь интуиции, ваши мечты начинают сбываться! ✨"
    },
    "chariot": {
        title: "Колесница",
        subtitle: "Аркан победы, целеустремленности и контроля...",
        image: "images/chariot.png",
        prediction: "✨ Колесница несёт вас к триумфу. Возьмите бразды правления в свои руки и двигайтесь вперёд! ✨"
    }
};

// Алиасы (сопоставляем цифры 1, 2, 3 с названиями карт для удобства ссылок)
const aliases = {
    "1": "empress",
    "2": "star",
    "3": "chariot"
};


/* =========================================================
   ОПРЕДЕЛЕНИЕ КАРТЫ ПО ССЫЛКЕ (Query-параметры)
========================================================= */

const urlParams = new URLSearchParams(window.location.search);
let cardKey = urlParams.get('card') || "empress"; // По умолчанию открываем Императрицу

cardKey = cardKey.toLowerCase();

// Если в ссылке передали цифру (1, 2 или 3), заменяем её на название карты
if (aliases[cardKey]) {
    cardKey = aliases[cardKey];
}

// Если передали несуществующую карту, сбрасываем на Императрицу
if (!tarotCards[cardKey]) {
    cardKey = "empress";
}

const currentCard = tarotCards[cardKey];


/* =========================================================
   ELEMENTS & DYNAMIC FILL (Заполнение контента карты)
========================================================= */

const card = document.getElementById("card");
const button = document.getElementById("flipButton");
const message = document.getElementById("message");

// Динамически подменяем тексты и изображение лицевой стороны карты на сайте
document.querySelector("h1").innerText = currentCard.title;
document.querySelector(".subtitle").innerText = currentCard.subtitle;
document.querySelector(".front img").src = currentCard.image;

let opened = false;


/* =========================================================
   TOGGLE CARD (Переворот карты)
========================================================= */

function toggleCard(){
    if (opened) {
        opened = false;
        card.classList.remove("flipped");
        
        button.innerHTML = "✨ Открыть карту";
        message.innerHTML = "Ваше послание уже ждёт вас...";
    } else {
        opened = true;
        card.classList.add("flipped");
        card.style.transform = ""; 

        card.classList.add("flipping");
        setTimeout(() => {
            card.classList.remove("flipping");
        }, 1200);

        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        button.innerHTML = "🔮 Закрыть карту";

        setTimeout(() => {
            if (opened) { 
                // Выводим уникальное предсказание
                message.innerHTML = currentCard.prediction;
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
    if (opened) return;

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
