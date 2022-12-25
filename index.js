async function getOffers() {
    // Find all the "Add to Card" buttons on the page
    var offerButtons = Array.from(document.querySelectorAll(".offer-cta")).filter(btn => btn.title == "Add to Card");
    console.log(offerButtons.length)
    var index;
    for (index = 0; index < offerButtons.length; ++index) {
        console.log(`Clicking offer button ${index}`);
        offerButtons[index].click();
        // Wait 0.5 seconds to be nice to AMEX servers
        await new Promise(r => setTimeout(r, 500));
    }
}

const findHeaderDiv = setInterval(() => {
    const headerDiv = document.querySelector("#offers > div > section.shadow-1.dls-white-bg > span > div")

    const allOfferBtn = document.createElement("button")
    allOfferBtn.classList.add("all-offer-btn")
    allOfferBtn.innerText = "Get All Offers"
    allOfferBtn.onclick = getOffers
    if (headerDiv) {
        headerDiv.appendChild(allOfferBtn)
        clearInterval(findHeaderDiv)
    } else {
        console.error("header div not found")
    }
}, 1000)

