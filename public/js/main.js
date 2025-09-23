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

// document.addEventListener('DOMContentLoaded', () => {
//   // capture phase so we catch any form on the page
//   document.addEventListener('submit', (e) => {
//     console.log('a form was submitted:', e.target.id || '(no id)');
//     e.preventDefault(); // keep page here while testing
//   }, true);
// });