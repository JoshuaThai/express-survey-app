function showNext(){
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("nextPage").value = "info";
}

function exit(){
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("nextPage").value = "Exit";
}

function nextPage(link){
    window.location.href = link;
}

form.addEventListener('submit', function(e) {
  e.preventDefault(); // This disables native validation unless you manually check
  // You must validate inputs manually here
});
