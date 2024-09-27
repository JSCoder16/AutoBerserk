function Stuff () {

    let zerked = false; // boolean to tell if we have berserked
    // what settings are on
    let autoBerserk = false;
    let berserkBack = false;
    let semiAuto = false;
    let semiRange = 750;


    // gets the first element of a class. Used to save on typing later
    let getClassEl = (class_name) => {
        return document.getElementsByClassName( class_name )[0];
    }

    // get the berserk button
    let myButton = getClassEl("go-berserk");

    // performs the berserk action and updates the zerked variable
    const Berserk = () => {
        myButton.click();
        zerked = true;
    }

    //// stores the ratings
    // get trating elements
    let ratingElements = document.getElementsByTagName("rating");
    // extract the numberal value from them
    let oppRating = Number.parseInt(ratingElements[0].innerText);
    let myRating = Number.parseInt(ratingElements[1].innerText);



    // populate the booleans with properties from chrome local storage if it exsists
    // if not add the chrome local storage data as false
    // first get the rating range because it is used in one of the other storage get calls
    chrome.storage.local.get("semiRange").then((res) => {
        if(res.semiRange !== undefined) {
            ratingRange = res.semiRange;
        }
    });
    chrome.storage.local.get("berserkBack").then((res) => {
        if(res.berserkBack !== undefined) {
            berserkBack = res.berserkBack;
            if(berserkBack) {
                loop();
            }
        }else {
            chrome.storage.local.set("berserkBack", false);
        }
    });
    chrome.storage.local.get("autoBerserk").then((res) => {
        console.log(res);
        if(res.autoBerserk !== undefined) {
            autoBerserk = res.autoBerserk;
            if(res.autoBerserk) {
                Berserk(1);
            }
        }else {
            chrome.storage.local.set("autoBerserk", false);
        }
    });
    chrome.storage.local.get("semiBerserk").then((res) => {
        if(res.semiBerserk !== undefined) {
            semiAuto = res.semiBerserk;
            // if we are berserking when someone is less then 500 rated then us
            if(semiAuto && oppRating <= myRating-ratingRange) {
                Berserk();
            }
        }else {
            chrome.storage.local.set("semiBerserk", false);
        }
    });
   


    // loop for checking if one should berserk back
    // runs 80 times a second
    function loop () {
        if(zerked) return; // because we have already done it

        if(getClassEl("berserked") && getClassEl("top")) {
            Berserk();
        }
        if(autoBerserk) {
            Berserk();
        }
        if(semiAuto && oppRating <= myRating-ratingRange) {
            Berserk();
        }

        window.setTimeout(loop, 1000 / 80);
    }

    // if we are zerking back automatically start the loop
    if(berserkBack && !zerked) {
        loop();
    }
    
    // if we are berserking automatically
    if(autoBerserk && !zerked) {
        Berserk();
    }

    // if we are berserking when someone is less then 500 rated then us
    if(semiAuto && oppRating <= myRating-ratingRange && !zerked) {
        Berserk();
    }
    
    // listen for changes to the settings
    chrome.storage.local.onChanged.addListener((changes, namespace) => {
        let changeKey = Object.keys(changes)[0];
        
        if(changeKey == "berserkBack") {
            berserkBack = changes[changeKey];
            if(berserkBack && !zerked) {
                loop();
            }
        }
        if( changeKey ==  "autoBerserk") {
            autoBerserk = changes[changeKey];
            if(autoBerserk && !zerked) {
                Berserk();
            }
        }
        if(changeKey == "semiBerserk") {
            semiAuto = changes[changeKey];
            if(semiAuto && oppRating <= myRating-ratingRange  && !zerked) {
                Berserk();
            }
        }
    });

}

window.addEventListener("load", () => {
    // you are not playing a game it is a profile or a TV page or some other user created content
    if(window.location.pathname.includes("@")) return;

    // its a tourny page not a game so why waste time
    if(window.location.pathname.includes("tournament")) {
        return;
    }

    // now we call it
    Stuff();
});

