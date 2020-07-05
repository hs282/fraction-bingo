var diffLevel = "";

function startGame() {
    // Get selected difficulty level                                                                                             
    diffLevel = $("input[name='difficulty']:checked").val();

    // If no difficulty level is selected, do not advance                                                                        
    if (!diffLevel) {
        return;
    }

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