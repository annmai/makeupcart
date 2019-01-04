function toggle_filter(obj) {
    var element = document.getElementById("filter");
    
    if(element.innerHTML === "FILTER") {
        element.innerHTML = "HIDE FILTER";
    }
    else {
        element.innerHTML = "FILTER";
    }
    
    obj.classList.toggle("change");

}