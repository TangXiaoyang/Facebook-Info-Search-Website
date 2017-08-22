

display_favorite();
var pre_url = [];
var latitude = 10000;
var longitude = 10000;
var first_load = true;
getLocation();
// sendRequest();


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(get_position);
    } else { 
        alert("Geolocation is not supported by this browser.");
    }
}

function get_position(position){
	latitude = position.coords.latitude;
	longitude = position.coords.longitude;
}




function change_tabs(id){
	for(var i = 1; i < 7; i++){
		document.getElementById("tab" + i).style.backgroundColor = "white";
				document.getElementById("tab" + i).style.color = "black";
	}
	document.getElementById("tab" + id).style.backgroundColor = "#3B5998";
	document.getElementById("tab" + id).style.color = "white";
}


	function hide_tooltip(){
		$('#keyword').tooltip('hide');
	}

	function destroy_tooltip(){
		$('#keyword').tooltip('destroy');
	}


function sendRequest(){
	if(document.getElementById("keyword").value == ""){
		$('#keyword').tooltip({placement:"bottom", title: "Please type a keyword"});
        $('#keyword').tooltip("show");
        window.setTimeout(hide_tooltip, 2000);
        window.setTimeout(destroy_tooltip, 2000);
		return;
	}
	if(!first_load){
		// document.getElementById("tabs").className = "tab-content slide_out_init";
		// document.getElementById("detail_panel").className = "slide_in_init";
		var scope = angular.element(document.getElementById('detail_panel')).scope();
		scope.$apply(scope.selected = false);
	}
	first_load = false;


	$("#user_tab").html("<div style='height: 200px;'><div class='progress' style='position:relative; top: 100px; margin: auto; width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div></div>");
	$("#page_tab").html("<div style='height: 200px;'><div class='progress' style='position:relative; top: 100px; margin: auto; width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div></div>");
	$("#event_tab").html("<div style='height: 200px;'><div class='progress' style='position:relative; top: 100px; margin: auto; width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div></div>");
	$("#place_tab").html("<div style='height: 200px;'><div class='progress' style='position:relative; top: 100px; margin: auto; width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div></div>");
	$("#group_tab").html("<div style='height: 200px;'><div class='progress' style='position:relative; top: 100px; margin: auto; width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div></div>");

	var key = $("#keyword").val();
	var aws_url = "http://sample-env.faxdxi3ggd.us-west-2.elasticbeanstalk.com/getInfo.php";
	$.ajax({
		url: aws_url,
		data: {q: key, lat: latitude, log: longitude},
		type: 'GET',
		success: function(response, status, xhr){
			display_all(response);
		},
		error: function(response, status, xhr){
			alert(xhr.statusText);
		}
	});
}

function display_all(response){

	var json_strs = response.split("---");
	

	display(json_strs[0], "user_tab");
	display(json_strs[1], "page_tab");
	display(json_strs[2], "event_tab");
	display(json_strs[3], "place_tab");
	display(json_strs[4], "group_tab");

}


function display(response, tab_id){
	document.getElementById(tab_id).innerHTML = "";
	var tab_table = "<table class='table table-hover' style='width: 100%;'><tr><th class='col-sm-1'>#</th><th class='col-sm-3'>Profile photo</th><th class='col-sm-4'>Name</th><th class='col-sm-2'>Favorite</th><th class='col-sm-2'>Details</th></tr>";
	var user_obj = jQuery.parseJSON(response);
	if(user_obj.hasOwnProperty('data') && user_obj.data.length > 0){
		for(var i = 0; i < user_obj.data.length; i++){
			var row = user_obj.data[i];
			tab_table += "<tr>" + "<td style='vertical-align: middle;'>" + (i + 1) + "</td>";
			tab_table += "<td class='" + tab_id + "" + row.id + "'><img class='img-circle profile_img' id='head_img" + row.id + "' src='" + row.picture.data.url + "'></td>";
			tab_table += "<td style='vertical-align: middle;' style='vertical-align: middle;' class='" + tab_id + "" + row.id + "' id='name" + row.id + "'>" + row.name + "</td>";
			tab_table += "<td style='vertical-align: middle;'><button class='btn btn-default' onclick='change_star(\"" + tab_id + "" + row.id + "\")'><span id='" + tab_id + "" + row.id + "' class='glyphicon glyphicon-star-empty'></span></button></td>";
			tab_table += "<td><button class='btn btn-default' onclick='getDetail(\"" + tab_id + "" + row.id + "\");'><i class='glyphicon glyphicon-chevron-right'></i></button><div style='display:none' class='" + tab_id + "" + row.id + "'>" + tab_id + "</div></tr>";
		}
		tab_table += "</table>";
		document.getElementById(tab_id).innerHTML = tab_table;
	}
	else{
		document.getElementById(tab_id).innerHTML = "<table class='table table-hover style='width: 100%;'><tr><th class='col-sm-12' style='text-align:center;'>No data found</th></tr></table>";
	}

	renew_star(tab_id);

	var page_button = "";
	// var temp = 0;
	if(user_obj.hasOwnProperty('paging') && user_obj.paging.hasOwnProperty('previous')){
		page_button += "<button class='btn btn-default' style='margin: 10px;' onclick='change_page(\"" + user_obj.paging.previous + "\",\"" + tab_id + "\")'>Previous</button>";
		pre_url[tab_id] = user_obj.paging.previous;
		// temp++;
	}
	if(user_obj.hasOwnProperty('paging') && user_obj.paging.hasOwnProperty('next')){
		page_button += "<button class='btn btn-default' style='margin: 10px;' onclick='change_page(\"" + user_obj.paging.next + "\",\"" + tab_id + "\")'>Next</button>";
		// temp++;
	}
	document.getElementById(tab_id).innerHTML += "<div style='text-align: center;'>" + page_button + "</div>";
	// if(temp == 0){
	// 	document.getElementById(tab_id).innerHTML += "<div style='text-align: center;'><button class='btn btn-default' style='margin: 10px;' onclick='change_page(\"" + pre_url[tab_id] +"\",\"" + tab_id + "\")'>Previous</button></div>";
	// }

}


function change_page(page_url, tab_id){
	renew_star(tab_id);
	if(page_url == "undefined"){
		sendRequest();
	}else{
		$.ajax({
			url: page_url,
			type: "GET",
			success: function(response, status, xhr){
				display(xhr.responseText, tab_id);
			},
			error: function(response, status, xhr){
				alert(xhr.statusText);
			}
		});
	}
	
}





function getDetail(item_id){
	$("#albums_panel").html("<div class='progress' width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div>");
	$("#posts_panel").html("<div class='progress' width: 70%'><div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuemin='0' aria-valuemax='100' style='width:50%'></div></div>");

	var pure_id = item_id.replace(/\D/g,'');
	var tab_name = item_id.replace(/[0-9]/g,'');

	// slide in detial panel
	var scope = angular.element(document.getElementById('detail_panel')).scope();
	scope.$apply(scope.slide_in());

	var aws_url = "http://sample-env.faxdxi3ggd.us-west-2.elasticbeanstalk.com/getInfo.php";
	$.ajax({
		url: aws_url,
		data: {id: pure_id, type: tab_name},
		type: 'GET',
		success: function(response, status, xhr){
			display_detail(response, item_id);
		},
		error: function(response, status, xhr){
			alert(xhr.statusText);
		}
	});
}






function display_detail(response, item_id){
	// document.getElementById("demo").innerHTML = response;
	try{
		detail_json = JSON.parse(response);
	}catch(err){
		alert("something went wrong");
		document.getElementById("albums_panel").innerHTML = "<div class='alert alert-warning'>No data found.</div>";
		document.getElementById("posts_panel").innerHTML = "<div class='alert alert-warning'>No data found.</div>";
		return;
	}
	var detail_table = $("#detail_panel");

	// clear panel
	document.getElementById("albums_panel").innerHTML = "";
	document.getElementById("posts_panel").innerHTML = "";

	// var head_img_url = document.getElementById(head_pic_id).src;
	// var head_name = document.getElementById(name_id).innerHTML;
	var head_img_url = detail_json.picture.data.url;
	var head_name = detail_json.name;




	// generate detail buttons
	var this_star_class = "glyphicon glyphicon-star-empty";
	for(var i = 0; i < localStorage.length; i++){
		if(localStorage.key(i) == item_id){
			this_star_class = "glyphicon glyphicon-star";
			break;
		}
	}

	var tab_id = item_id.replace(/[0-9]/g,'');
	
	var detail_buttons_html = "<div class='col-sm-12'><button class='btn btn-default' style='float: left; display: inline-block; margin-top: 15px; margin-bottom: 15px;' ng-click='slide_out()' onclick='call_slide_out(); renew_star(\"" + tab_id + "\")'><i class='glyphicon glyphicon-chevron-left'></i><strong>Back</strong></button>";
	detail_buttons_html += "<button class='btn btn-default' onclick='share(\"" + head_img_url+ "\",\"" + head_name + "\")' style='float: right; margin-top: 15px; margin-bottom: 15px; margin-right: 1%;'><img style='width: 20px;' src='http://cs-server.usc.edu:45678/hw/hw8/images/facebook.png'></button>";
	detail_buttons_html += "<button class='btn btn-default' onclick='change_detail_star(\"" + item_id + "\")' style='float: right; margin-top: 15px; margin-bottom: 15px; margin-right: 3%;'><span id='detail_star' class='" + this_star_class + "'></span></button></div>";
	

	$("#detail_buttons").html(detail_buttons_html);





	// generate albums
	var count = 0;
	var pic_ids = [];
	if(detail_json.hasOwnProperty("albums") && detail_json.albums.data.length > 0){
		for(var i = 0; i < detail_json.albums.data.length; i++){
			var albums_unit = "<div class='panel panel-default'><div class='panel-heading'><p class='panel-title'><a data-toggle='collapse' data-parent='#albums_panel' href='#unit" + i + "'>";
			var row = detail_json.albums.data[i];
			if(row.hasOwnProperty("name")){
				albums_unit += row.name + "</a></p></div>"
			}
			if(row.hasOwnProperty("photos") && row.photos.data.length > 0){
				albums_unit += "<div id='unit" + i + "' class='panel-collapse collapse " + (count == 0 ? "in" : "") + "'><div class='panel-body'>";
				for(var j = 0; j < row.photos.data.length; j++){
					albums_unit += "<img class='img-rounded' src='' style='width: 100%; margin: 5px;'>";
					pic_ids.push(row.photos.data[j].id);
				}
			}
			albums_unit += "</div></div></div>";
			count++;
			document.getElementById("albums_panel").innerHTML += albums_unit;
		}
		get_high_resolution(pic_ids);
	}else{
		document.getElementById("albums_panel").innerHTML = "<div class='alert alert-warning'>No data found.</div>";
	}

	// generate posts
	if(detail_json.hasOwnProperty("posts") && detail_json.posts.data.length > 0){
		for(var i = 0; i < detail_json.posts.data.length; i++){
			var posts_unit = "<div class='panel panel-default'><div class='panel-body'>";
			var row = detail_json.posts.data[i];
			var created_time = row.created_time;
			var date = created_time.substring(0, 10);
			var time = created_time.substring(11, 19);
			posts_unit += "<div class='media'><div class='media-left'><img class='media-object' style='width: 40px;' src='" + head_img_url + "'></div>";
			posts_unit += "<div class='media-body'><h5 class='media-heading'><strong>" + head_name + "</strong></h5><p style='color: grey;'>" + date + " " + time + "</p></div></div>";
			posts_unit += "<p>" + (row.hasOwnProperty("message") ? row.message : "N/A.") + "</p></div></div>";
			document.getElementById("posts_panel").innerHTML += posts_unit;
		}
	}else{
		document.getElementById("posts_panel").innerHTML = "<div class='alert alert-warning'>No data found.</div>";
	}

}



function change_detail_star(id){
	var star = document.getElementById("detail_star");
	if(star.className == "glyphicon glyphicon-star-empty"){
		star.className = "glyphicon glyphicon-star";
		store_item(id);
	}else{
		star.className = "glyphicon glyphicon-star-empty";
		delete_item(id);
	}
}




function get_high_resolution(ids){
	$.ajax({
		url: "http://sample-env.faxdxi3ggd.us-west-2.elasticbeanstalk.com/getInfo.php",
		type: 'GET',
		data: {pic_ids: ids},
		success: function(response, status, xhr){
			var urls = response.split("---");
			var imgs = document.getElementById("albums_panel").getElementsByTagName("img");
			for(var i = 0; i < urls.length - 1; i++){
				imgs[i].src = urls[i];
			}
		},
		error: function(response, status, xhr){
			alert(xhr.statusText);
		}
	});
}


function display_favorite(){
	var favorite_table = "<table id='f_table' class='table table-hover' style='width: 100%;'><tr><th class='col-sm-1'>#</th><th class='col-sm-2'>Profile photo</th><th class='col-sm-6'>Name</th><th class='col-sm-1'>Type</th><th class='col-sm-1'>Favorite</th><th class='col-sm-1'>Details</th></tr>";
	for(var i = 0; i < localStorage.length; i++){
		favorite_table += "<tr>";
		var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
		favorite_table += "<td style='vertical-align: middle;'>" + (i + 1) + "</td>";
		favorite_table += "<td><img src='" + item[0] + "' class='img-circle profile_img'></td>";
		favorite_table += "<td style='vertical-align: middle;'>" + item[1] + "</td>";
		favorite_table += "<td style='vertical-align: middle;'>" + favorite_type(item[2]) + "</td>";
		favorite_table += "<td style='vertical-align: middle;'><button class='btn btn-default' onclick='delete_item(\"" + localStorage.key(i) + "\")'><i class='glyphicon glyphicon-trash'></i></button></td>";
		favorite_table += "<td style='vertical-align: middle;'><button class='btn btn-default' onclick='getDetail(\"" + localStorage.key(i) + "\")'><i class='glyphicon glyphicon-chevron-right'></i></button></td>"
	}
	document.getElementById("favorite_tab").innerHTML = favorite_table;
}



function favorite_type(tab_name){
	if(tab_name == "user_tab"){
		return "users";
	}else if(tab_name == "page_tab"){
		return "pages";
	}else if(tab_name == "event_tab"){
		return "events";
	}else if(tab_name == "place_tab"){
		return "places";
	}else if(tab_name == "group_tab"){
		return "groups";
	}
}



function change_star(id){
	var star = document.getElementById(id);
	if(star.className == "glyphicon glyphicon-star-empty"){
		star.className = "glyphicon glyphicon-star";
		store_item(id);
	}else{
		star.className = "glyphicon glyphicon-star-empty";
		delete_item(id);
	}
}



function store_item(id){
	var data = [];
	var elements = document.getElementsByClassName(id);
	data.push(elements[0].firstChild.src);
	data.push(elements[1].innerHTML);
	data.push(elements[2].innerHTML);
	localStorage.setItem(id, JSON.stringify(data));
	var new_row = "<tr>";
	new_row += "<td>" + localStorage.length + "</td>";
	new_row += "<td><img src='" + data[0] + "' class='img-circle profile_img'></td>";
	new_row += "<td>" + data[1] + "</td>";
	new_row += "<td>" + favorite_type(data[2]) + "</td>";
	new_row += "<td><button class='btn btn-default' onclick='delete_item(\"" + id + "\")'><i class='glyphicon glyphicon-trash'></i></button></td>";
	new_row += "<td><button class='btn btn-default' onclick='getDetail(\"" + id + "\")'><i class='glyphicon glyphicon-chevron-right'></i></button></td>"
	document.getElementById("f_table").innerHTML += new_row;
}


function delete_item(id){
	localStorage.removeItem(id);
	if(document.getElementById(id) != null){
		document.getElementById(id).className = "glyphicon glyphicon-star-empty";
	}
	display_favorite();
}


function renew_star(tab_id){
	var set = new Set();
	for(var i = 0; i < localStorage.length; i++){
		set.add(localStorage.key(i));
	}
	var tab = document.getElementById(tab_id);
	var stars = tab.getElementsByTagName("span");
	for(var i = 0; i < stars.length; i++){
		if(set.has(stars[i].id)){
			stars[i].className = "glyphicon glyphicon-star";
		}else{
			stars[i].className = "glyphicon glyphicon-star-empty";
		}
	}
}


function share(pic_url, obj_name){
	FB.init({
		appId      : '129202960931512',
		status     : true,
		xfbml      : true,
		version    : 'v2.7'
	});
	FB.ui({
		app_id: '129202960931512',
		method: 'feed',
		link: window.location.href,
		picture: pic_url,
		name: obj_name,
		caption: "FB SEARCH FROM USC CSCI571",
		}, function(response){
		if (response && !response.error_message)
			alert("Posted Successfully");
		else
			alert("Not Posted");
	});
}



function call_slide_out(){
	var scope = angular.element(document.getElementById('detail_panel')).scope();
	scope.$apply(scope.slide_out());
}



function clear_all(){
	document.getElementById("user_tab").innerHTML = "";
	document.getElementById("page_tab").innerHTML = "";
	document.getElementById("event_tab").innerHTML = "";
	document.getElementById("place_tab").innerHTML = "";
	document.getElementById("group_tab").innerHTML = "";
	document.getElementById("keyword").value = "";
	document.getElementById("albums_panel").innerHTML = "";
	document.getElementById("posts_panel").innerHTML = "";
	document.getElementById("detail_buttons").innerHTML = "";
	// document.getElementById("tabs").className = "tab-content slide_out_init";
	// document.getElementById("detail_panel").className = "slide_in_init";
	var scope = angular.element(document.getElementById('detail_panel')).scope();
	scope.$apply(scope.selected = false);
}

var app = angular.module("myApp", ['ngAnimate']);
app.controller("myController", function($scope){
	$scope.selected = false;
	$scope.slide_in = function(){
		$scope.selected = true;
	};
	$scope.slide_out = function(){
		$scope.selected = false;
	};
});