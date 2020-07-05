var addLevel = "",
    subLevel = "",
    multLevel = "",
    divLevel = "";

function operationDiffDisplay(operationId, difficultyId) {
    var checkBox = document.getElementById(operationId);
    if (checkBox.checked == true) {
        document.getElementById(difficultyId).style.display = "";
    } else {
        document.getElementById(difficultyId).style.display = "none"; 
    }
}

function startGame() {
    // If there are no operations selected, do not advance
    if ($("input[type='checkbox']:checked").length == 0) {
        return;
    }

    // Get operation difficulty levels
    addLevel = $("input[name='addLevel']:checked").val();
    subLevel = $("input[name='subLevel']:checked").val();
    multLevel = $("input[name='multLevel']:checked").val();
    divLevel = $("input[name='divLevel']:checked").val();

    // Get selected board size
    if (document.getElementById("three").checked) {
        document.getElementsByName("board3")[0].style.display = ""; 
    } else if (document.getElementById("four").checked) {
	document.getElementsByName("board4")[0].style.display = "";
    } else if (document.getElementById("five").checked) {
	document.getElementsByName("board5")[0].style.display = "";
    } else {
	return;
    }

    document.getElementById("start").style.display = "none";
    document.getElementById("game").style.display = "";
}