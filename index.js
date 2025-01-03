const validOfferPath = "/offers/eligible";
const allOfferBtnId = "all-offer-btn";

async function getOffers() {
  // Find all the "Add to Card" buttons on the page
  var offerButtons = Array.from(document.querySelectorAll(".offer-cta")).filter(
    (btn) => btn.title == "Add to Card"
  );

  var index;
  for (index = 0; index < offerButtons.length; ++index) {
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
    const currentPath = window.location.pathname;

    if (currentPath === validOfferPath) {
      this.showButton();
    } else {
      this.removeButton();
    }
  }

  createButton() {
    if (this.button) {
      return this.button;
    }

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
      return;
    }
    const targetElement = document.querySelector(
      "#offers > div > section > span > div"
    );
    if (!targetElement) {
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
