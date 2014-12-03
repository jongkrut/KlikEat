var cartitem = {};
var delinfo;
var rest_id;
var serviceURL = "http://m.klik-eat.com/";
var subtotal;
var refBrowser;

function populateList(rest_id)
{
    var stotal = 0;
    cartitem = JSON.parse(localStorage.getItem("cart-"+rest_id));
    $('#cartList').html("");
    $('#cartList').append('<li class="list-summary">You have '+cartitem.count+' item(s) in the cart</li>');
    $.each(cartitem.items,function(index,val) {
	var datastring = "menu_id="+val.menu_id+"&size_id="+val.size_id;
	var attr_price = 0;
	var attr_id = [];
	if(val.attr) {
	    $.each(val.attr,function(indexs,vals){
		attr_price = attr_price + vals.charge;
		attr_id.push(vals.attr_id);
	    });
	    if(attr_id.length != 0)
		datastring = datastring + "&attr_id=" + attr_id.join(',');
	}
	var menu;
	stotal = stotal + val.price + attr_price;
	$.getJSON(serviceURL + 'menuprice.php?'+datastring+'&callback=?', function(data) {
		menu = data.menu;
		var items = "<li><a href='#'>";
		items = items + '<div class="cart_left"><div style="font-size:15px;height:30px;overflow:hidden;">'+val.qty + "x " + menu.menu_name+'</div>'; 
		items = items + "Rp "+numeral(val.price).format('0,0')+".-";
		if(menu.attributes) {
		    $.each(menu.attributes,function(i,v) {
			items = items + '<br/><span style="font-size:12px">+ ' + v.attribute_name + ' Rp ' +numeral(val.qty*v.charge).format('0,0') + '</span>';
		    });
		}
		items = items + '</a></div><div class="cart_right"><a href="" onclick="removeItem(\''+rest_id+'\',\''+index+'\')"><i class="icon-remove"></i></a></div>';
		items = items + '</li>';
		
		$('#cartList').append(items);
	});
    });
    $('#cartList').append('<li style="border:1px solid #333;line-height:60px;width:95%;margin:5px auto;font-size:20px;-moz-box-sizing:border-box;"><a href="restaurant.html?id='+rest_id+'" style="margin-left:20px"><i class="icon-plus-sign"></i>&nbsp;&nbsp;Add More Item</a></li>');
    return stotal;
}

function getAnnouncement(page) {
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$.getJSON(serviceURL + 'motd.php?callback=?', function(data) {
		employees = data.motd;
		if(page==1 && employees.value != '')
		{ 
		    $('.banner_home').append('<div style="position:absolute;bottom:10px;width:100%;background-color:#fcf8e3;color:#c09853;font-size:16px;padding:5px 0px">'+employees.value+'</div>');
		}
	});
}

function getRegionList() {
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$.getJSON(serviceURL + 'region.php?callback=?', function(data) {
		employees = data.region;
		$('#regionList').html('');
		$('#regionList').append('<option value="" disabled selected>Select a Region First</option>');
		$.each(employees, function(index, employee) {
			$('#regionList').append('<option value="' + employee.region_id + '">' + employee.region_name + '</option>');
		});
	});
}


function getLocationList(region_id) {
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$('#locationList').html("");
	$.getJSON(serviceURL + 'location.php?region_id='+region_id+'&callback=?', function(data) {
		employees = data.location;
		$('#locationList').html('');
		$('#locationList').append('<option value="" disabled selected>Now Select a Location</option>');
		$.each(employees, function(index, employee) {
			$('#locationList').append('<option value="' + employee.location_id + '">' + employee.location_name + '</option>');
		});
	});
	$('#locationList').prepend('<option value="#" checked>Now Select a Location</option>');
}

function loadPanel() {
	
	var c = '';
	if(localStorage.getItem("customer_name"))
	{
		c = c + '<a href="account.html" class="sign_a"><i class="icon-user"></i> ' + localStorage.getItem("customer_name") + '</a>';
	}
	else
	{	
		c = c + "<a class='sign_a' href='signin.html'>Account</a>";		
	}
	
	$('#signin_container').prepend(c);
}

function getBannerList() {
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	var s = $.getJSON(serviceURL + 'banner.php?callback=?', function(data) {
		employees = data.banner;
		$.each(employees, function(index, employee) {
			$('#bannerList').append('<li><img src="http://backend.klik-eat.com/inc/images/promo/' + employee.image + '">' +
					'</li>');
		});
	});
	s.done(function() {
		$('.flexslider').flexslider({
			animation : "slide",
			start: function(slider){
				$('body').removeClass('loading');
			}
		});	
	});
}

function getRestaurantList() {
	var keyword = getUrlVars()["keyword"];
	var location = getUrlVars()["location"];
	if(location == null)
	    location = '';
	var datastring = "keyword="+keyword+"&location="+location;
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$('#restaurantList').html("");
	$.getJSON(serviceURL + 'results.php?'+datastring+'&callback=?', function(data) {
		$('#restaurantList').append("<span style='font-weight:bold;font-size:18px;font-family:Helvetica,Arial;float:left;margin:10px 10px'>" + data.restaurant_count + " restaurants available</span>");
		employees = data.restaurant;
		$.each(employees, function(index, employee) {	
			var restosplit = employee.restaurant_name.split("@");
			var resto = '<div class="search_item_new"><a href="restaurant.html?id='+employee.restaurant_id+'">';
			resto = resto + '<div class="search_item_l">';
			resto = resto + '<div class="helper" style="background-image:url(http://117.102.249.127/inc/upload/'+employee.top_menu_image+')">';
			resto = resto + '</div></div>';
			resto = resto + '<div class="search_item_r">';
			resto = resto + '<span style="color:black;font-size:16px;font-weight:bold">'+restosplit[0]+'</span>';
    		if(restosplit.length > 1)
			    resto = resto + '<br/><span style="color:#555052;font-size:13px;font-weight:bold">@ '+restosplit[1]+'</span>';
			resto = resto + '<div class="basic" style="margin-top:5px" data-average="'+employee.rate+'" data-id="'+employee.restaurant_id+'"></div>';
			resto = resto + '<div style="margin-top:5px;line-height:16px;float:left;width:100%;font-size:13px;color:black">';
			resto = resto + '<span style="font-weight:700;">' + employee.foodtype+'</span><br/>Hours: '+employee.hours+'</span></div>';
			resto = resto + '</div>';
			resto = resto + '</a></div>';
			$('#restaurantList').append(resto);
		});
		$('.basic').jRating({
		    isDisabled : true
		});
	});
}

function getMenuCategoryList() {
	var rest_id = getUrlVars()["id"];
	var datastring = "rest_id="+rest_id;
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$('#menuList').html("<br/>");
	$.getJSON(serviceURL + 'category.php?'+datastring+'&callback=?', function(data) {
		employees = data.menu_category;
		$.each(employees, function(index, employee) {
			var m = '<div style="margin-bottom:20px;;width:100%;float:left;cursor:pointer;position:relative" class="menu_load" id="'+employee.menucategory_id+'">';
			m = m + '<h4 class="menu_cat" id="header_'+employee.menucategory_id+'">'+employee.category_name+' <i class="icon-plus-sign icon-large" id="icon_'+employee.menucategory_id+'" style="float:right;"></i></h4>';
			m = m + '<ul  id="category_'+employee.menucategory_id +'" class="menu_ul">';
			m = m + '</ul></div>';
			$('#menuList').append(m);
		});	
	});
	
}

function getMenus(category_id) {
	var serviceURL = "http://m.klik-eat.com/";
	var datastring = "category_id="+category_id;
	var employees;
	
	$.ajax({
	    type  : "GET",
	    url   : serviceURL + 'menu_new.php?',
	    data  : datastring, 
	    dataType : "json",
	    beforeSend: function() {
		$('#'+category_id).append('<div class="loader">Loading</div>');
	    },
	    success :function(data) {
		employees = data.menus;
		$.each(employees, function(index, employee) {
			var mprice = employee.menu_price;
			
			var popz = '<div class="modal fade" id="popup_'+employee.menu_id+'">';
			popz = popz + '<div class="modal-dialog"><div class="modal-body"><div class="modal-content">';
			popz = popz + '<form id="add_'+employee.menu_id+'" method="get">';
			popz = popz + '<div style="padding:10px 20px;font-family:Helvetica,Arial">';
			popz = popz + '<h3>' + employee.menu_name + '</h3>';
			popz = popz + '<label for="qty">Qty </label><input name="qty" id="qty" type="text" value="1" class="input1"><br/>';
			popz = popz + '<label for="inst">Instruction</label><textarea id="inst" name="inst" class="textarea"></textarea><br/>';
			if(employee.size == 0)
			{
				popz = popz + '<input type="hidden" name="size" value="0">';
				popz = popz + '<input type="hidden" name="size_price" value='+mprice+'>';
			}
			else
			{
				popz = popz + '<label for="size" class="select">Option</label><br/>';
				popz = popz + '<select name="size" id="size" class="select1">';
				$.each(employee.size, function(index,val){
					if(mprice == 0)
						mprice = val.size_price;
					popz = popz + '<option value="'+val.size_id+'" data-price="'+val.size_price+'">' + val.size_name + ' - ' + numeral(val.size_price).format('0,0') + '</option>';
				});
				popz = popz + '</select><br/>';
			}
			if(employee.attr == 0)
			{
			}
			else 
			{
			    popz = popz + '<div style="font-size:14px">';
			    $.each(employee.attr, function(index,val){
				popz = popz + '<input type="checkbox" name="attr_id" value="'+val.attribute_id+'" data-price="'+val.charge+'"> ' + val.attribute_name + '<br/>';
			    });
			    popz = popz + '</div>';
			}
			popz = popz + '<input type="hidden" name="menu_id" value="'+employee.menu_id+'">';
			popz = popz + '<input type="hidden" name="id" value="'+employee.restaurant_id+'">';
			popz = popz + '<br/><button id="btn" class="add_cart_btn" onclick="addItem(\'#add_'+employee.menu_id+'\');return false;">Add to Cart</button>';
			popz = popz + '</div></form>';
			popz = popz + '</div></div></div></div>';		
			
			$('#divsList').append(popz);
			
			var m = '<li><a data-toggle="modal" href="#popup_'+employee.menu_id+'">';
			m = m + '<div class="menu_name">' +employee.menu_name + '</div>';
			m = m + '<div class="menu_price">Rp ' + numeral(mprice).format('0,0') + '</div>';
			m = m + '<div class="menu_desc">' + employee.menu_description + '</div>';			
			m = m + '</a></li>';
			$('#category_'+category_id).append(m);
		});
	    },
	    complete : function(){
		$('.loader').remove();
	    }
	});
}

function getRestoInfo() {
	var rest_id = getUrlVars()["id"];
	var datastring = "rest_id="+rest_id;
	var serviceURL = "http://m.klik-eat.com/";
	var restaurant;
	
	$.getJSON(serviceURL + 'restaurantInfoNew.php?'+datastring+'&callback=?', function(data) {
		restaurant = data.restaurant;
		if(restaurant.status == 0)
		    $('#openingHour').html("<span style='color:red;font-size:16px'>Restaurant is Closed</span>");
		else
		    $('#openingHour').html("<span style='color:green;font-size:16px'>Restaurant Hours : " + restaurant.hours_start.substring(0,5) + " - " + restaurant.hours_end.substring(0,5)+"</span><br/>Any order placed outside the hours will be processed as soon as possible.");
		$('#restaurantLogo').html('<div style="height:100%;background:url(http://117.102.249.127/inc/upload/' + restaurant.logo_image2 + ') no-repeat;background-position:center center;background-size:100% auto"></div>');
		var restosplit = restaurant.restaurant_name.split("@");
		if(restosplit.length > 1) {
		    $('#restaurantName').html('<span style="font-size:100%;font-weight:bold;">'+restosplit[0]+'</span><br/><span style="font-size:75%">@ '+restosplit[1]+'</span>');
		}
		else
		    $('#restaurantName').html('<span style="font-size:100%;font-weight:bold;">'+restosplit[0]+'</span>');
		if(restaurant.delivery_by == 1)
		    $('#restaurantInfo').prepend("<strong>Delivery By :</strong><br/>Restaurant for Rp " + numeral(restaurant.delivery_charge2).format('0,0') + ".-<br/>");
		else
		    $('#restaurantInfo').prepend("<strong>Delivery By :</strong><br/>Klik-Eat for Rp " + numeral(restaurant.delivery_charge2).format('0,0') + ".-<br/>");
	});
}
function getDeliveryArea(){
	var rest_id = getUrlVars()["id"];
	var datastring = "rest_id="+rest_id;
	var serviceURL = "http://m.klik-eat.com/";
	var restaurant;
	
	$.getJSON(serviceURL + 'deliveryarea.php?'+datastring+'&callback=?', function(data) {
		restaurant = '<br/><strong>Delivery Area :</strong><br/>' + data.deliveryarea;
		$('#restaurantInfo').append(restaurant);
		
	});
}

function getInfoTab() {
	var rest_id = getUrlVars()["id"];
	var datastring = "rest_id="+rest_id;
	var serviceURL = "http://m.klik-eat.com/";
	var restaurant;
	
	$.getJSON(serviceURL + 'restaurantTabs.php?'+datastring+'&callback=?', function(data) {
	    $('#info_table').html("<div style='font-weight:bold;font-size:18px;margin-bottom:10px'>Opening Hours</div>");
	    $.each(data.hours,function(index,hour){
		var day = '<tr><td style="font-weight:bold">';
		if(hour.day == 1)
		    day = day + 'Monday';
		else if(hour.day == 2)
		    day = day +'Tuesday';
		else if(hour.day == 3)
		    day = day +'Wednesday';
		else if(hour.day == 4)
		    day = day +'Thursday';
		else if(hour.day == 5)
		    day = day +'Friday';
		else if(hour.day == 6)
		    day = day +'Saturday';
		else
		    day = day +'Sunday';
		if(hour.status == 0)
		    day = day + '<td style="text-align:center;padding:0 25px">Closed';
		else
		    day = day + '<td style="text-align:center;padding:0 25px">' + hour.hours_start.substring(0,5) + ' - ' + hour.hours_end.substring(0,5);
		$('#info_table').append(day);
	    });
	});

	$.getJSON(serviceURL + 'deliveryarea.php?'+datastring+'&callback=?', function(data) {
		restaurant = '<div style="font-weight:bold;margin:10px 0px;font-size:18px">Delivery Area :</div>' + data.deliveryarea;
		$('#info').append(restaurant);
	});

	$.getJSON(serviceURL + 'restaurantReview.php?'+datastring+'&callback=?', function(data) {
		$.each(data.reviews,function(index,hour){
		    var review = '<li><br/>' + hour.comment;
		    review = review + '<div style="position:absolute;top:3px;right:3px;font-size:85%">' + hour.customer_name + '</div>';
		    review = review + '<div style="position:absolute;top:3px;left:3px;font-size:85%">' + hour.datetime + '</div>';
		    review = review + '</li>';
		    $('#review_list').append(review);
		});
	});
}


function login(form_id) {
	var serviceURL = "http://m.klik-eat.com/";
	var pwd = sha1($(form_id+" input[name=c_password]").val());
	var cst = $(form_id+" input[name=c_email]").val();
	var datastring = "c_email="+cst+"&c_password="+pwd;
	var status;
	localStorage.clear();
	$('.modal_loading').show();
	$.getJSON(serviceURL + 'login.php?'+datastring+'&callback=?', function(data) {
		status = data.login;
		if(status == 0)
		{
			console.log("Error");
		}
		else
		{
			var info = data.info;			
			localStorage.setItem("balance",info.balance);
			localStorage.setItem("customer_name",info.customer_name);
			localStorage.setItem("customer_id",info.customer_id);
			localStorage.setItem("customer_email",cst);
			localStorage.setItem("address",JSON.stringify(data.address));
			console.log(localStorage.getItem("address"));
			$('.modal_loading').hide();
			window.location.href= "index.html";
		}
	});
	$('.modal_loading').hide();
}

function signin(form_id) {
	var pwd = sha1($(form_id+" input[name=c_password]").val());
	var cst = $(form_id+" input[name=c_email]").val();
	var datastring = "c_email="+cst+"&c_password="+pwd;
	var status;
	$.getJSON(serviceURL + 'login.php?'+datastring+'&callback=?', function(data) {
		status = data.login;
		if(status == 0)
		{
		    $('#error_container').html("<div style='font-family:Helvetica,Arial;padding:10px 5px;color:#e82329;font-size:17px;font-weight:bold'>Invalid Email or Password</div>");
		}
		else
		{
			var info = data.info;			
			localStorage.setItem("balance",info.balance);
			localStorage.setItem("customer_name",info.customer_name);
			localStorage.setItem("customer_id",info.customer_id);
			localStorage.setItem("customer_email",cst);
			localStorage.setItem("address",JSON.stringify(data.address));
			window.location.reload();
		}
	});	
}

function register(form_id) {
    $(form_id).validate({
	    rules : {
		username : 'required',
		passwd : 'required',
		conf_passwd : {
		    required : true,
		    equalTo : '#passwd'
		},
		name : 'required',
		phone : 'required',
		mobile : 'required',
		address : 'required'
	    
	    }
    }).form();
    if($(form_id).valid()) {
	var pwd = sha1($(form_id+" input[name=c_password]").val());
	var cst = $(form_id+" input[name=c_email]").val();
	var name = $(form_id+" input[name=c_name]").val();
	var phn = $(form_id+" input[name=c_phone]").val();
	var mbl = $(form_id+" input[name=c_mobile]").val();
	var building = $(form_id+" input[name=c_building]").val();
	var address = $(form_id+" textarea[name=c_address]").val();
	var tag = $(form_id+" select[name=c_tag] option:selected").val();

	var datastring = {"c_email" : cst, "c_password" : pwd, "c_name" : name, "c_building" : building, "c_phone" : phn , "c_mobile" : mbl , "c_address" : address, "c_tag" : tag };

	var url = 'http://m.klik-eat.com/register.php';

	$.post(url, datastring,function(data){
	    var data = JSON.parse(data);
	    if(data.register > 0 )
	    {
			localStorage.setItem("balance", 0);
			localStorage.setItem("customer_name", name);
			localStorage.setItem("customer_id", data.customer_id);
			localStorage.setItem("customer_email",cst);
			localStorage.setItem("address",JSON.stringify(data.address));
			window.location.href= "index.html";
	    }
	    else
	    {
			$('#error_signin').html("Error! Your email address is already registered");
	    }
	});
    }
    return false;
}

function addItem(frm_id) {
	var menu_id = $(frm_id+" input[name=menu_id]").val();
	var qty = $(frm_id+" input[name=qty]").val();
	var index = Math.floor((Math.random()*10000)+1);
	var inst = $(frm_id+" textarea[name=inst]").val();
	var size_id = $(frm_id+ " select[name=size]").val();
	var price_each = $(frm_id+' select[name=size]>option:selected').attr('data-price');
	if(size_id == null) {
		size_id = 0;
		price_each = $(frm_id+" input[name=size_price]").val();
	}
	var attr_ar = [];
	$(frm_id+" input[type=checkbox]:checked").each(function(){
	    var attr_charge = $(this).attr('data-price') * qty;
	    attr_ar.push(
		{"attr_id": $(this).val(), "charge": attr_charge}
	    );
	});
	
	var total_price = price_each * qty;
	cartitem.items.push(
		{"index": index,"menu_id" : menu_id, "qty" : qty, "instruction" : inst, "size_id": size_id, "price" : total_price, "attr" : attr_ar}
	);
	cartitem.count = cartitem.count + parseInt(qty,10);
	$('#cart_count').html("("+cartitem.count+")");
	if(cartitem.count > 0)
		$('#cart_a').attr("href","cart.html?id="+rest_id);
	localStorage.setItem("cart-"+rest_id,JSON.stringify(cartitem));
	$('#popup_'+menu_id).modal('hide');
}

function removeItem(rest_id,index) {
	var qty = cartitem.items[index].qty;
	cartitem.items.splice(index,1);
	cartitem.count = cartitem.count - parseInt(qty,10);
	localStorage.setItem("cart-"+rest_id,JSON.stringify(cartitem));
	if(cartitem.count == 0)
	    window.location.href="restaurant.html?id="+rest_id;
	populateList(rest_id);
}

function getCartList() {
	var rest_id = getUrlVars()["id"];
	var cartitem  = JSON.parse(localStorage.getItem("cart-"+rest_id));
	var payment = JSON.parse(localStorage.getItem("payment-"+rest_id));
	
	var add = "<tr><th colspan=2>You have " + cartitem.count  + " item(s) in your cart.";
	add = add + "<tr><td>&nbsp;<td>";
	add = add + "<tr><td>Subtotal<td>" + numeral(payment.subtotal).format('0,0') + "</li>";
	add = add + "<tr><td>Discount<td>" + numeral(payment.discount).format('0,0') + "</li>";
	var processing_fee = payment.grandtotal - (payment.subtotal+payment.tax_service_charge+payment.delivery_fee+payment.tax) + payment.discount;
	if(processing_fee > 0)
	    add = add + "<tr><td>Processing Fee<td>" + numeral(processing_fee).format('0,0');
	add = add + "<tr><td>Delivery Fee<td>" + numeral(payment.delivery_fee).format('0,0') + "</li>";
	add = add + "<tr><td>T&S Charge<td>" + numeral(payment.tax_service_charge+payment.tax).format('0,0') + "</li>";
	add = add + "<tr style='font-weight:bold;font-size:110%'><td>GrandTotal<td>" + numeral(payment.grandtotal).format('0,0') + "</li>";
	$('#cartSummary').append(add);
	$('#add_more_id').attr("href","cart.html?id="+rest_id);
}

function getPromoList() {
	var rest_id = getUrlVars()["id"];
	var payment = localStorage.getItem("payment_method");
	var payment_item = JSON.parse(localStorage.getItem("payment-"+rest_id));
	var cartitem  = JSON.parse(localStorage.getItem("cart-"+rest_id));
	var subtotal = payment_item.subtotal;
	var datastring = "subtotal="+subtotal+"&rest_id="+rest_id+"&payment_method="+payment;
	$.getJSON(serviceURL + 'discountPromo.php?'+datastring+'&callback=?', function(data) {
	    var itemz = data.delivery;
	    var paymentitem = {"subtotal" : subtotal, "discount" : itemz.discount,"tax_service_charge" : itemz.tax_service_charge, "delivery_fee" : itemz.delivery_fee , "tax" : itemz.tax, "grandtotal" : itemz.grandtotal};
	    localStorage.setItem("payment-"+rest_id,JSON.stringify(paymentitem));
	    $('#cartSummary').html("");
	    getCartList();
	});

}

function toCheckout() {
	var payment_method = $("input[name=payment_method]:checked").val();
	var rest_id = getUrlVars()["id"];
	localStorage.setItem("payment_method",payment_method);
	window.location.href="checkout.html?id="+rest_id;
}

function checkout() {
	var rest_id = getUrlVars()["id"];
	var addr_id = $("input[name=addr_id]:checked").val();
	var payment_method = localStorage.getItem("payment_method");
	var cartitem  = JSON.parse(localStorage.getItem("cart-"+rest_id));
	var payment = JSON.parse(localStorage.getItem("payment-"+rest_id));
	var cust_id = localStorage.getItem("customer_id");

	var datastring = {"cust_id" : cust_id, "rest_id" : rest_id, "addr_id" : addr_id, "payment_method" : payment_method , "items" : cartitem.items };
	datastring.tax_service_charge = payment.tax_service_charge;
	datastring.discount = payment.discount;
	datastring.processing_fee = payment.processing_fee;
	datastring.delivery_fee = payment.delivery_fee;
	datastring.tax = payment.tax;
	datastring.grandtotal = payment.grandtotal;

	var url = 'http://m.klik-eat.com/orderApp.php';

	$('#placeorder_id').html("Loading");
	$('#placeorder_id').removeAttr("onclick");
	$('body').append('<div class="loader">Loading</div>');

	$.post(url, datastring,function(data){
	    if(data>0) {
			localStorage.removeItem("cart-"+rest_id);
			localStorage.removeItem("payment-"+rest_id);
			window.location.href="confirmation.html?order_id="+data;
	    }
	});
}

function checkPayment() {
	var order_id = getUrlVars()["order_id"];
	var datastring = "order_id="+order_id;
	$.getJSON(serviceURL + 'checkPayment.php?'+datastring+'&callback=?', function(data) {
	    var payStatus = data.payment;
	    if(payStatus.online == 1){
			$('#payment_container').html('<div class="checkout_header">Online Payment</div>');
			if(payStatus.paid == 1) {
				$('#payment_container').append('<span style="font-size:16px;font-family:Helvetica,Arial">Order Paid! Thank You for Your Payment!</span>');
			} else {
				$('#payment_container').append('<span style="font-size:16px;font-family:Helvetica,Arial">Click the button below to proceed to the payment page.<br/><br/></span>');
				$('#payment_container').append('<div class="add_cart_btn" onclick="inBrowser(\''+payStatus.url+'\')">Pay Now</div>');
			}
	    }
	});

}


function loadInfo() {
	var info = '<tr><td>Name<td>' + localStorage.getItem("customer_name");
	info = info + '<tr><td>Email<td>' + localStorage.getItem("customer_email");
	info = info + '<tr><td>Cash Balance<td>' + localStorage.getItem("balance");
	$('#infoList').append(info);
}

function loadAddress(){
    var addresses = JSON.parse(localStorage.getItem("address"));
    var add;
    $.each(addresses,function(index,val){
		add = '<div class="addr_tag">';
		add = add + val.tag;
		add = add + '</div><div class="addr_cont">';
		add = add + val.address_content;
		add = add + '</div>';
		$('#addressList').append(add);
    });
}

function refreshAddress(){
    var cust_id = "cust_id="+localStorage.getItem("customer_id");
    $.getJSON(serviceURL + 'refreshAddress.php?'+cust_id+'&callback=?', function(data) {
		localStorage.setItem("address",JSON.stringify(data.address));
		window.location.href= "account.html";
    });
}

function signout() {
    localStorage.clear();
    window.location.href="index.html";
}

function addAddress(frm_id){
    var datastring = $(frm_id).serialize();
    var cust_id = localStorage.getItem("customer_id");
    datastring = datastring+"&cust_id="+cust_id;

    $.getJSON(serviceURL + 'address.php?'+datastring+'&callback=?', function(data) {
		localStorage.setItem("address",JSON.stringify(data.address));
		window.location.href= "account.html";
    });
}

function getUrlVars()
{
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            if($.inArray(hash[0], vars)>-1)
            {
                vars[hash[0]]+=","+hash[1];
            }
            else
            {
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
}

function inBrowser(url) {
	try {
		refBrowser = window.open(encodeURI(url),'_blank','location=yes'); //encode is needed if you want to send a variable with your link if not you can use ref = window.open(url,'_blank','location=no');
		refBrowser.addEventListener('loadstop', function(event){
			if(event.url == "http://117.102.249.127/closeBrowser.html" || event.url == "http://117.102.249.127/closeBrowser.php" ){
				refBrowser.close();
			}  
		});
		refBrowser.addEventListener('exit', function(event){
			if(refBrowser) {
				refBrowser.removeEventListener('loadstop', LoadStop);
				refBrowser.removeEventListener('exit', Close);
				refBrowser = null;
			}
		});
	}
	catch (err)    
	{
		alert(err);
	}
}

function initPushwoosh()
{
    //get pushwoosh plugin
    var pushNotification = window.plugins.pushNotification;
	if(device.platform == "Android")
	{
		//notify plugin that device is ready, this is VERY important as it will dispatch on start push notification
		document.addEventListener('push-notification', function(event) {
			var title = event.notification.title;
			var userData = event.notification.userdata;
									 
			if(typeof(userData) != "undefined") {
				console.warn('user data: ' + JSON.stringify(userData));
			}
			//alert(event.notification);
		});
		pushNotification.onDeviceReady({ projectid: "146155066544", appid : "26D23-A1DE4" });
		//register for push notifications
		pushNotification.registerDevice(
			function(status) {
				//this is push token
				var pushToken = status;
				//alert('push token: ' + pushToken);
			},
			function(status) {
				//alert(JSON.stringify(['failed to register ', status]));
			}
		);
	}
	if(device.platform == "iPhone" || device.platform == "iOS")
	{
		document.addEventListener('push-notification', function(event) {
									var notification = event.notification;
	 								//display alert to the user for example
									//alert(notification.aps.alert);				   
									//clear the app badge
									pushNotification.setApplicationIconBadgeNumber(0);
								});
	 
		//initialize the plugin
		pushNotification.onDeviceReady({pw_appid:"26D23-A1DE4"});
		 
		//register for pushes
		pushNotification.registerDevice(
			function(status) {
				var deviceToken = status['deviceToken'];
				//console.warn('registerDevice: ' + deviceToken);
			},
			function(status) {
				//console.warn('failed to register : ' + JSON.stringify(status));
				//alert(JSON.stringify(['failed to register ', status]));
			}
		);
		//reset badges on app start
		pushNotification.setApplicationIconBadgeNumber(0);
	}
}