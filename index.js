const BACKEND_API_HOST = "http://localhost:8080";
const DETECTION_URL = `${BACKEND_API_HOST}/api/detect`;

let cards = [];

document.addEventListener("DOMContentLoaded", function () {
    const dealBtn = document.getElementById("deal-btn");
    const detectBtn = document.getElementById("detect-btn");
    const resetBtn = document.getElementById("reset-btn");
    const cardContainer = document.getElementById("card-container");
    const resultContainer = document.getElementById("result-container");

    dealBtn.addEventListener("click", async function () {
        resultContainer.innerHTML = ``;

        // To simulate shuffling
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                cards = randomizeCards();
                cardContainer.innerHTML = `${cards.map((card) => `
                        <div class="card">
                            <img src="assets/cards/${card.suit}_${card.rank}.jpg" alt="">
                        </div>
                `).join('')}`
            }, 100 * i);
        }
    });

    detectBtn.addEventListener("click", async function () {
        console.log(cards);

        const patternResult = await detectCardsAsync(cards)

        resultContainer.innerHTML = `
                <img src="assets/patterns/${patternResult}.png"/>
        `
    });

    resetBtn.addEventListener("click", function () {
        cardContainer.innerHTML = ``;
        resultContainer.innerHTML = ``;
    });
})

async function detectCardsAsync(cards) {
    try {
        const response = await fetch(DETECTION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cards: cards
            }),
        });
        console.log(response);
        const jsonResponse = await response.json();
        return jsonResponse.result;
    } catch (error) {
        console.log(error)
    }
}

function randomizeCards() {
   const numOfCards = 5;
    const suits = ["SPADE", "HEART", "CLUB", "DIAMOND"];
    const ranks = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    let randomCards = [];
    let usedCards = new Set();

    while (randomCards.length < numOfCards) {
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        const randomRank = ranks[Math.floor(Math.random() * ranks.length)];

        const cardId = `${randomSuit}-${randomRank}`;

        if (!usedCards.has(cardId)) {
            randomCards.push({
                "suit": randomSuit,
                "rank": randomRank
            });
            usedCards.add(cardId);
        }
    }

    return randomCards;
}