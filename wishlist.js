// ------ Wishlist functions ------

// adds item to wishlist and toggle color of heart
function like(img) {
    var src = img.getAttribute('src');
    
    if(src === "icons/unlike.png") {
        img.setAttribute('src', "icons/like.png");
    }
    else {
        img.setAttribute('src', "icons/unlike.png");
    }
};