function Stuff () {

    let zerked = false; // boolean to tell if we have berserked
    // what settings are on
    let autoBerserk = false;
    let berserkBack = false;
    let semiAuto = false;


    // gets the first element of a class. Used to save on typing later
    let getClassEl = (class_name) => {
        return document.getElementsByClassName( class_name )[0];
    }

    // get the berserk button
    let myButton = getClassEl("go-berserk");

    // I added parameter (t) for debugging why the berserk was triggered!
    // performs the berserk action and updates the zerked variable
    const Berserk = (t=0) => {
        myButton.click();
        zerked = true;
        switch(t) {
            case 0:
                console.log("Back!");
                break;
            case 1:
                console.log("Auto");
                break;
            case 2:
                console.log("Rated!");
        }
    }

    //// stores the ratings
    // get trating elements
    let ratingElements = document.getElementsByTagName("rating");
    // extract the numberal value from them
    let oppRating = Number.parseInt(ratingElements[0].innerText);
    let myRating = Number.parseInt(ratingElements[1].innerText);


    // round ratings to nearest 50 for simplicities sake
    oppRating = (( oppRating / 50 ) | 0) * 50;
    myRating = (( myRating / 50 ) | 0) * 50;



    // populate the booleans with properties from chrome local storage if it exsists
    // if not add the chrome local storage data as false
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
            if(semiAuto && oppRating <= myRating-500) {
                Berserk(2);
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
            Berserk(1);
        }
        if(semiAuto && oppRating <= myRating-500) {
            Berserk(2);
        }

        window.setTimeout(loop, 1000 / 80);
    }

    // if we are zerking back automatically start the loop
    if(berserkBack && !zerked) {
        loop();
    }
    
    // if we are berserking automatically
    if(autoBerserk && !zerked) {
        Berserk(1);
    }

    // if we are berserking when someone is less then 500 rated then us
    if(semiAuto && oppRating <= myRating-500 && !zerked) {
        Berserk(2);
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
                Berserk(1);
            }
        }
        if(changeKey == "semiBerserk") {
            semiAuto = changes[changeKey];
            if(semiAuto && oppRating <= myRating-500  && !zerked) {
                Berserk(2);
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

