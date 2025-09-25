function showNext(){
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("nextPage").value = "info";
}

function exit(){
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("back").hidden = true;
    document.getElementById("nextPage").value = "Exit";
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

module.exports = {
        loadData
};
// form.addEventListener('submit', function(e) {
//   e.preventDefault(); // This disables native validation unless you manually check
//   // You must validate inputs manually here
// });
