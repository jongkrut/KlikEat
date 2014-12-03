var cartitem = {};
var delinfo;
var rest_id;
var serviceURL = "http://m.klik-eat.com/";
var subtotal;


function getEcashRestaurantList() {
	var keyword = getUrlVars()["keyword"];
	var location = getUrlVars()["location"];
	if(location == null)
	    location = '';
	var datastring = "keyword="+keyword+"&location="+location;
	var serviceURL = "http://m.klik-eat.com/";
	var employees;
	$('#restaurantList').html("");
	$.getJSON(serviceURL + 'results-ecash.php?'+datastring+'&callback=?', function(data) {
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

