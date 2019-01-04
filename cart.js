'use strict';

// Product object constructor
function Product(pid, brand, name, price) {
    this.pid = pid;
    this.brand = brand;
    this.name = name;
    this.price = price;
    this.img_src = "none";
	this.qty_in_cart = 0;
    this.print = function() {
        console.log(pid + " " + brand + " " + name + " " + " " + price);
    };
};

var productsDOM = document.querySelectorAll('.product');

//Build catalog with products' information and default qty_in_cart to 0.
let catalogArray = []; 
productsDOM.forEach(productDOM => {
    var pid = productDOM.getAttribute('data-pid');
    var brand = productDOM.querySelector('.product_brand').innerHTML;
    var name = productDOM.querySelector('.product_name').innerHTML;
    var price = productDOM.querySelector('.product_price').innerHTML;
    var myProduct = new Product(pid, brand, name, price);
    catalogArray.push(myProduct);  
});

catalogArray[0].img_src = "product_images/ud_naked_cherry.png";
catalogArray[1].img_src = "product_images/papapeach.png";
catalogArray[2].img_src = "product_images/mufe.png";
catalogArray[3].img_src = "product_images/ysllip.png";
catalogArray[4].img_src = "product_images/chaneleye.png";
catalogArray[5].img_src = "product_images/stilaliqeye.png";
catalogArray[6].img_src = "product_images/dioreye.png";
catalogArray[7].img_src = "product_images/kvdpowder.png";


// ------ Cart functions ------

var total_num_items = 0;
var subtotal = 0;
var cartDOM = document.querySelector('.cart_content_bubble');
var itemCountDOM = document.getElementById('items_count');

// adds item to shopping cart
// parameter btn: the button that was clicked to invoke this action
function addToCart(btn) {
    var productDOM = btn.parentNode;
    var pid = productDOM.getAttribute('data-pid');
    
	// if cart is empty clear innerHTML, but keep close cart button
    if(total_num_items == 0) {
        cartDOM.innerHTML = "";
		closeCartBtnHTML();
       
    }

	// update product catalog with the product's current 
	// quantity in cart
	var product = catalogArray[pid - 1];
    var product_qty = product.qty_in_cart;
	catalogArray[pid - 1].qty_in_cart = ++product_qty;
	
	// adds price of product to current subtotal
	subtotal = subtotal + parseInt(product.price, 10);
	
	// fixes subtotal value to two decimal places
	var subTotal = subtotal.toFixed(2);
	
	// update total item count on screen
	itemCountDOM.innerHTML = ++total_num_items;
    
	// if adding item for first time, insert item into cartDOM (the html cart)
	if(product_qty === 1) {
		cartDOM.insertAdjacentHTML('beforeend', `
			<div class="cart_item" data-pid="${pid}">
                <img class="cart_item_img" src="${product.img_src}">
                <h7>${product.brand}</h7>
                <h10 data-pid="${pid}" onclick="showSelectQtyBox(${pid})">
                    <p class="qty">qty ${product_qty}</p>
                    <i class="qty_in_cart_carrot" onclick="showSelectQtyBox(${pid})"></i>
                    <select class="edit_qty_box" onchange="updateQty(this.value, ${pid})">
                        <option value-"1">1</option>
                        <option value-"2">2</option>
                        <option value-"3">3</option>
                        <option value-"4">4</option>
                        <option value-"5">5</option>
                        <option value-"6">6</option>
                        <option value-"7">7</option>
                        <option value-"8">8</option>
                        <option value-"9">9</option>
                        <option value-"10">10</option>
                        <option value-"11">11</option>
                        <option value-"12">12</option>
                        <option value-"13">13</option>
                    </select>
                </h10>
                <br>
                <h8>${product.name}</h8>
                <h9>$${product.price}</h9>
                <br>
                <h12 style="display:none"><button id="remove_btn" onclick="removeFromCart(${pid})">remove</button></h12>
                <hr>
			</div>
		`);
	} // if the item is already in the cart, update only the quantity
	  // of the item
	else {
		var cartItemsQtyDOM = cartDOM.querySelectorAll("h10");
        
        var i;
        for(i = 0; i < cartItemsQtyDOM.length; ++i) {
            var itemQtyDOM = cartItemsQtyDOM[i];
            var hid = itemQtyDOM.getAttribute('data-pid');
			if(hid == pid) {
                itemQtyDOM.querySelector('.qty').innerHTML = "qty " + product_qty;
                break;
			}
            
        }
	}
	
	// remove previous subtotal on screen
	if(total_num_items > 1) {
		var toBeRemoved = cartDOM.querySelector('.subtotal_container');
		toBeRemoved.remove();
	}
	
	// display new subtotal on screen after the appended item in cart
	subtotalAndCheckoutBtnHTML(subTotal);

	// dynamically modifies the cartDOM height to fit items in block
	updateCartHeight();
    
	cartDOM.style.display = 'block';
	itemCountDOM.style.display = 'block';
	
	// change text of add to bag button to "Added to Bag"
	btn.innerHTML = "Added to Bag";
	btn.style.backgroundColor = "gray";
    btn.style.opacity = .5;
    btn.style.cursor = 'progress';

	setTimeout(hideCart, 2000);
	setTimeout(function () { resetAddToCartBttn(btn); }, 1000);
};

// show cart bubble
function displayCart() {
    cartDOM.style.display = 'block';
}

// hide cart bubble
function hideCart() {
	cartDOM.style.display = 'none';
    
    // must also make sure qty select box gets closed if it is opened
    var editQtyDOM = document.querySelector('.edit_qty_box');
    if(editQtyDOM != null) {
        editQtyDOM.style.display = 'none';    
    }

    // and item qty must be toggled back to displayed
    var qtyDOM = document.querySelector('.qty');
    if(qtyDOM != null) {
        qtyDOM.style.display = 'block';    
    }
}

// toggles between showing and hiding the cart bubble
function toggleCartDisplay() {
    
    var currentState = cartDOM.style.display;

    if(currentState === 'none') {
        displayCart();
    }
    else {
        hideCart();
    }
    
}

// dynamically modifies the cartDOM height to fit items in block
function updateCartHeight() {	
	var num_unique_items = cartDOM.querySelectorAll('.cart_item').length;
    var newHeight = (num_unique_items * 25) + 350;
    cartDOM.style.minHeight = newHeight + "px";
}

// rest addToCart button
function resetAddToCartBttn(btn) {
	btn.innerHTML = "Add to Bag";
	btn.style.backgroundColor = "#FEE7F6";
	btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
}

// remove product from cart 
function removeFromCart(pid) {
	var cartItemDOM = cartDOM.querySelectorAll('.cart_item');

	// update total number of items in cart
	var qty = parseInt(catalogArray[pid - 1].qty_in_cart);
	total_num_items = total_num_items - qty;
	
	// update total number of items in cart on screen
	var itemCountDOM = document.getElementById('items_count');
	itemCountDOM.innerHTML = total_num_items;
	
	// if cart is now empty, hide itemCountDOM
	if(total_num_items === 0) {
		itemCountDOM.style.display = 'none';
	}

	var i; // iterate through all cart_item class elements
	for(i = 0; i < cartItemDOM.length; ++i) {
		var item_pid = cartItemDOM[i].getAttribute('data-pid');

		// if product id of item to be removed is equal to pid of cart_item
		// remove that product from cartDOM
		if(parseInt(item_pid) === pid) {
			cartDOM.removeChild(cartItemDOM[i]);
			
			// calculate new subtotal
			var item_price = parseInt(catalogArray[pid-1].price);
			subtotal = subtotal - (qty * parseInt(item_price));
			var newSubTotal = subtotal.toFixed(2);
			
			// reset qty_in_cart to 0
			catalogArray[pid - 1].qty_in_cart = 0;
            
            updateCartHeight();
				
			// update subtotal on screen
			if(total_num_items === 0) {
				var toBeRemoved = cartDOM.querySelector('.subtotal_container');
				toBeRemoved.remove();
				cartDOM.innerHTML = "Your Shopping Bag is empty."		
				closeCartBtnHTML();
                
			}
			else {
				cartDOM.querySelector('h11').innerHTML = "Subtotal: $" + newSubTotal;
			}
		}
	}
}

// displays the select quantity box
function showSelectQtyBox(pid) {
    
    var cartItemsQtyDOM = document.querySelectorAll("h10");
    
    var i;
    for(i = 0; i < cartItemsQtyDOM.length; ++i) {
        
        var hid = cartItemsQtyDOM[i].getAttribute('data-pid');
        
        if(hid == pid) {
            var itemQtySelectBoxDOM = cartItemsQtyDOM[i].querySelector('.edit_qty_box');
            itemQtySelectBoxDOM.style.display = 'block';
            
            var qtyDOM = cartItemsQtyDOM[i].querySelector('.qty');
            qtyDOM.style.display = 'none';
            break;
        }
    }

}


// updates the item quantity per customer's new selection as a result 
// the subtotal & total number of items is cart is updated as well
function updateQty(newQty, pid) {
        
    var cartItemsQtyDOM = document.querySelectorAll("h10");
    
    var i;
    for(i = 0; i < cartItemsQtyDOM.length; ++i) {
        
        var hid = cartItemsQtyDOM[i].getAttribute('data-pid');
        
        if(hid == pid) {
            
            var qtyDOM = cartItemsQtyDOM[i].querySelector('.qty');
            qtyDOM.innerHTML = "qty " + newQty;
            
            var product = catalogArray[pid - 1];
            var price = product.price;
            var oldQty = product.qty_in_cart;
            product.qty_in_cart = newQty;
            
            // update total number of items in cart
            total_num_items -= parseInt(oldQty);
            total_num_items += parseInt(newQty);
            document.getElementById('items_count').innerHTML = total_num_items;
            
            // update the subtotal
            subtotal -= (parseInt(oldQty) * parseInt(price));
            subtotal += (parseInt(newQty) * parseInt(price));
            var newSubTotal = subtotal.toFixed(2);
            document.querySelector('h11').innerHTML = "Subtotal: $" + newSubTotal;

            
            qtyDOM.style.display = 'block';
            
            if(newQty > 9) {
                qtyDOM.style.width = '40px';
            }
            else {
                qtyDOM.style.width = '35px';
            }
            
            var itemQtySelectBoxDOM = cartItemsQtyDOM[i].querySelector('.edit_qty_box');
            itemQtySelectBoxDOM.style.display = 'none';
            break;
        }
    }
}

function closeCartBtnHTML() {
	cartDOM.insertAdjacentHTML('afterbegin', `
        <div id="close_cart_btn" onclick="hideCart()">
            <div id="close_cart_bar1"></div>
            <div id="close_cart_bar2"></div>
        </div>   
    `);
}

function subtotalAndCheckoutBtnHTML(subTotal) {
		cartDOM.insertAdjacentHTML('beforeend', `
		<div class="subtotal_container">
			<h11>Subtotal: $${subTotal}</h11><br>
			<button id="checkout_btn">Checkout</button>
		</div>
		
	`);
}



