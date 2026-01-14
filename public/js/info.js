function showHidden(){
    // console.log("Hidden being fired!");
    document.getElementById("nextButton").style.display = "flex";
    document.getElementById("backButton").hidden = false;
    document.getElementById("nextPage").value = "info4";
    document.getElementById("hidden-answers").hidden = false;
    clear(); // clear form is user is living in US.
}


// Redirecting to inelgible page will require us to autofill the form with pseudo values
function hideInfo(){
    document.getElementById("hidden-answers").hidden = true;
    // Select by name and value
    // This line can help us.
    // document.querySelector('input[name="yourRadioName"][value="yourRadioValue"]').checked = true
    document.querySelector('input[name="zipCode"]').value = "00000";
    document.querySelector('input[name="birth-date"]').value = "2001-01-01";
    document.querySelector('input[name="gender"][value="Other"]').checked = true;
    document.querySelector('input[name="hispanic"][value="No"]').checked = true;
    document.querySelector('input[name="race"][value="White"]').checked = true;
}

function clear(){
    document.querySelector('input[name="zipCode"]').value = "";
    document.querySelector('input[name="birth-date"]').value = "";
    document.querySelector('input[name="gender"][value="Other"]').checked = false;
    document.querySelector('input[name="hispanic"][value="No"]').checked = false;
    document.querySelector('input[name="race"][value="White"]').checked = false;
}