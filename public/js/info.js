function showHidden(){
    console.log("Hidden being fired!");
    document.getElementById("hidden-answers").hidden = false;
    showNext();
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