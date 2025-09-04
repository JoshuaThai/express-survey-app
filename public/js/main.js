function showNext(){
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("exitButton").style.display = "none";
}

function exit(){
    document.getElementById("exitButton").style.display = "flex";
    document.getElementById("nextButton").style.display = "none";
}

function nextPage(link){
    window.location.href = link;
}