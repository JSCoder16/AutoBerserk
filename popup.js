// get are switch elements
const zerk_back = document.getElementById("zerk-back");
const auto_zerk = document.getElementById("auto-zerk");
const zerk_five = document.getElementById("auto-500");

// booleans to tell what is going on
let isZerkingBack = false,
    isAutoZerking = false,
    isSemiAuto = false;

// set based off what is stored in chrome local storage
chrome.storage.local.get("berserkBack").then((res) => {
    if(res.berserkBack !== undefined) {
        isZerkingBack = res.berserkBack;
        zerk_back.checked = isZerkingBack;
        console.log("Berserking back")
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
        zerk_five.checked = isSemiAuto;
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

zerk_five.addEventListener("click", (e) => {
    isSemiAuto = !isSemiAuto;
    chrome.storage.local.set({ "semiBerserk": isSemiAuto });
});



