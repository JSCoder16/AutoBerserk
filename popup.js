// get are switch elements
const zerk_back = document.getElementById("zerk-back");
const auto_zerk = document.getElementById("auto-zerk");
const zerk_semi = document.getElementById("auto-500");
const semi_rng = document.getElementById("semi-rng");

// the element for display what the rating range is to berserk against in semi mode
const ratingRageEl = document.getElementById("rng-display");

// booleans to tell what is going on
let isZerkingBack = false,
    isAutoZerking = false,
    isSemiAuto = false,
    ratingRange = semi_rng.value;

// set based off what is stored in chrome local storage
chrome.storage.local.get("berserkBack").then((res) => {
    if(res.berserkBack !== undefined) {
        isZerkingBack = res.berserkBack;
        zerk_back.checked = isZerkingBack;
    }
});
chrome.storage.local.get("autoBerserk").then((res) => {
    if(res.autoBerserk !== undefined) {
        isAutoZerking = res.autoBerserk;
        auto_zerk.checked = isAutoZerking;
    }
});
chrome.storage.local.get("semiBerserk").then((res) => {
    if(res.semiBerserk !== undefined) {
        isSemiAuto = res.semiBerserk;
        zerk_semi.checked = isSemiAuto;
    }
});
chrome.storage.local.get("semiRange").then((res) => {
    if(res.semiRange !== undefined) {
        ratingRange = res.semiRange;
        semi_rng.value = ratingRange;
        console.log(ratingRange);
        ratingRageEl.innerHTML = "-" + ratingRange;
    }else {
        chrome.storage.local.set({ "semiRange": ratingRange });
    }
});


zerk_back.addEventListener("click", (e) => {
    isZerkingBack = !isZerkingBack;
    chrome.storage.local.set({ "berserkBack": isZerkingBack });
});

auto_zerk.addEventListener("click", (e) => {
    isAutoZerking = !isAutoZerking;
    chrome.storage.local.set({ "autoBerserk": isAutoZerking });
});

zerk_semi.addEventListener("click", (e) => {
    isSemiAuto = !isSemiAuto;
    chrome.storage.local.set({ "semiBerserk": isSemiAuto });
});

semi_rng.addEventListener("input", (e) => {
    ratingRange = semi_rng.value;
    ratingRageEl.innerHTML = "-" + ratingRange;
    chrome.storage.local.set({ "semiRange": ratingRange });
});



