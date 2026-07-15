/* =========================================================
   БАЗА ДАННЫХ КАРТ ТАРО (Только картинки и предсказания)
========================================================= */

const tarotCards = {
    "empress": {
        image: "images/front.png", // Императрица
        prediction: "✨ Вам выпала Императрица: вас ожидает период расцвета сил, изобилия и успеха в делах! ✨"
    },
    "star": {
        image: "images/star.png", // Звезда
        prediction: "✨ Вам выпала Звезда: впереди время надежды, вдохновения и ясного пути. Мечты начинают сбываться! ✨"
    },
    "chariot": {
        image: "images/chariot.png", // Колесница
        prediction: "✨ Вам выпала Колесница: впереди триумф и победа. Возьмите бразды правления в свои руки! ✨"
    }
};

// Сопоставляем цифры из ссылки с картами
const aliases = {
    "1": "empress",
    "2": "star",
    "3": "chariot"
};


/* =========================================================
   ОПРЕДЕЛЕНИЕ КАРТЫ ПО ССЫЛКЕ
========================================================= */

const urlParams = new URLSearchParams(window.location.search);
let cardKey = urlParams.get('card') || "empress"; 

cardKey = cardKey.toLowerCase();

if (aliases[cardKey]) {
    cardKey = aliases[cardKey];
}

if (!tarotCards[cardKey]) {
    cardKey = "empress"; // Если карта не найдена, показываем Императрицу
}

const currentCard = tarotCards[cardKey];


/* =========================================================
   ДИНАМИЧЕСКАЯ ПОДМЕНА КАРТИНКИ
========================================================= */

const card = document.getElementById("card");
const button = document.getElementById("flipButton");
const message = document.getElementById("message");

// Меняем ТОЛЬКО картинку лицевой стороны. Заголовки h1 и subtitle НЕ трогаем!
document.querySelector(".front img").src = currentCard.image;

let opened = false;


/* =========================================================
   ЛОГИКА ПЕРЕВОРОТА
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
                // Показываем предсказание только после переворота
                message.innerHTML = currentCard.prediction;
            }
        }, 900);
    }
}


/* =========================================================
   ОБРАБОТЧИКИ СОБЫТИЙ
========================================================= */

card.addEventListener("click", toggleCard);
button.addEventListener("click", toggleCard);


/* =========================================================
   ФОНОВЫЕ ЧАСТИЦЫ
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
   3D ЭФФЕКТ НАКЛОНА (МЫШЬ)
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
   3D ЭФФЕКТ НАКЛОНА (СЕНСОР)
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
