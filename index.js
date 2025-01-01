const validOfferPath = "/offers/eligible";
const allOfferBtnId = "all-offer-btn";

async function getOffers() {
  // Find all the "Add to Card" buttons on the page
  var offerButtons = Array.from(document.querySelectorAll(".offer-cta")).filter(
    (btn) => btn.title == "Add to Card"
  );
  console.log(offerButtons.length);
  var index;
  for (index = 0; index < offerButtons.length; ++index) {
    console.log(`Clicking offer button ${index}`);
    offerButtons[index].click();
    // Wait 0.5 seconds to be nice to AMEX servers
    await new Promise((r) => setTimeout(r, 500));
  }
}

class OfferButtonManager {
  constructor() {
    this.button = null;
    this.handleUrlChange();
    this.setupUrlChangeListener();
  }

  setupUrlChangeListener() {
    console.log("Setting up URL change listener");

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList" || mutation.type === "subtree") {
          this.handleUrlChange();
          break;
        }
      }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  handleUrlChange() {
    console.log("Handling URL change");
    const currentPath = window.location.pathname;

    if (currentPath === validOfferPath) {
      console.log("Showing button");
      this.showButton();
    } else {
      console.log("Removing button");
      this.removeButton();
    }
  }

  createButton() {
    console.log("Creating button");
    if (this.button) {
      console.log("Button already exists");
      return this.button;
    }
    console.log("Button does not exist, creating new one");

    const allOfferBtn = document.createElement("button");
    // amex css
    allOfferBtn.classList.add("btn");
    allOfferBtn.classList.add("btn-primary");
    allOfferBtn.classList.add("btn-size-md");
    // custom css
    allOfferBtn.id = allOfferBtnId;
    allOfferBtn.innerText = "Get All Offers";
    allOfferBtn.onclick = getOffers;

    this.button = allOfferBtn;
    return allOfferBtn;
  }

  showButton() {
    if (!this.button) {
      this.button = this.createButton();
    }
    const currentOfferBtn = document.getElementById(allOfferBtnId);
    if (currentOfferBtn) {
      console.log("Button already exists");
      return;
    }
    const targetElement = document.querySelector(
      "#offers > div > section > span > div"
    );
    if (!targetElement) {
      console.log("Target element not found");
      return;
    }
    targetElement.insertBefore(this.button, targetElement.firstChild);
  }

  removeButton() {
    if (this.button && document.getElementById(allOfferBtnId)) {
      this.button.remove();
    }
  }
}

new OfferButtonManager();

console.log("OfferButtonManager initialized");
