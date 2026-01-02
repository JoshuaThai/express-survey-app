function showNext(){
    document.getElementById("nextButton").style.display = "flex";
    // document.getElementById("proceedButton").value = "info";
}

function exit(){
    document.getElementById("nextButton").style.display = "flex";
    let backButton = document.getElementById("backButton")
    if (backButton){
        backButton.hidden = true;
    }
    document.getElementById("submitButton").formAction = "/survey/unsuccessful";
    console.log(document.getElementById("nextPage").value);
}

function loadData(myData){
    console.log("LOADING DATA");
    for(const key in myData){
        // let element = document.getElementById(key);
        const input = document.querySelector(`[name="${key}"]`);
        if(!input) continue;
        if (input && input.type == 'radio'){
             let element = document.querySelector(`input[name="${key}"][value="${myData[key]}"]`);
             if(element) element.checked = true;
        } else if(input && input.type == 'text'){
            input.value = myData[key];
        } else if(input && input.type == 'date'){

        }
    }
}

function nextPage(link){
    window.location.href = link;
}

function showRobloxBox(trueOrFalse){
    let robloxBox = document.getElementById("robloxYes");
    let noRobloxBox = document.getElementById("robloxNo");
    if (robloxBox){
        robloxBox.hidden = trueOrFalse;
    }
    if(trueOrFalse){// Show box that ask why survey player does not play Roblox
        noRobloxBox.hidden = false;
    }else{
        noRobloxBox.hidden = true;
    }
}
