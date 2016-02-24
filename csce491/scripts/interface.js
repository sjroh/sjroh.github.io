var app_path = "";
var protocol = "http://";

var request_count = 0;
var base_url = "http://localhost:8080/dcmservice/";
var sessionuser = null;

function update_paths()
{
	$("a").each(function() {
		var ref_path = $(this).attr("href");
		if(ref_path && ref_path[0] == "/")
		{
   			ref_path = render_application_path(ref_path);
   			$(this).attr("href", ref_path);
		}
	});
	
	$("img").each(function() {
		var src_path = $(this).attr("src");
		if(src_path && src_path[0] == "/")
		{
			src_path = render_application_path(src_path);
   			$(this).attr("src", src_path);
		}
	});
}

function render_application_path( path )
{
	if( app_path == "" )
	{
		return path;
	}
	else
	{
		if(path.indexOf(app_path) >= 0) //if the path has already been processed
		{
			return path;
		}
		return app_path + path;
	}
}

function redirect_to_login()
{	
	redirect_to( "/login.php" );	
}

function redirect_to_home()
{
	redirect_to( "/index.php" );
}

function redirect_to( path )
{
	window.location.href = protocol + window.location.hostname + render_application_path( path );	
}

function get_session_value(key)
{
	var url = base_url + "session/getvalue";
	var token = get_auth_token();
	if(token)
	{
		var data = 
		{
			"key" : key,
			"sessionid" : token
		};
		
		var response = send_sync_post_request(url, data);
		if(response.status)
		{
			return response.sessionValue;
		}
		else
		{
			redirect_to_login();
		}
	}
	redirect_to_login();
}

function set_session_value(key, value)
{
	var url = base_url + "session/setvalue";
	var token = get_auth_token();
	if(token)
	{
		var data = 
		{
			"key" : key,
			"sessionid" : token,
			"value" : value
		};
		
		var response = send_sync_post_request(url, data);
		if(response.status)
		{
			console.log(response.message);
			//return response.sessionValue;
		}
		else
		{
			redirect_to_login();
		}
	}
	else
	{
		redirect_to_login();
	}
}

function showGlassPane()
{
	if(request_count == 0)
	{
		$("#glass_pane").show();
	}
	request_count++;
}

function hideGlassPane()
{
	request_count--;
	if(request_count <= 0)
	{ 
		request_count = 0;
		$("#glass_pane").hide();
	}
}

function handle_request_error(jqXHR, textStatus, errorThrown)
{
	if(jqXHR.status == 403) 
	{
		//alert("Your session has expired.");
		show_error_message("Request Failure", "Your session has expired", clean_redirect_to_login);
	}
	else if(jqXHR.status == 401)
	{
		show_error_message("Request Failure", errorThrown, clean_redirect_to_login);
	}
	else
	{
		show_error_message("Request Failure", 'ERROR: Something went wrong. Please refresh the page. If the problem persists, contact the administrator.',
				clean_redirect_to_login);
	}	
//	hideGlassPane();
}

function send_form_request( _url, _data, success_callback, _no_glass_pane_)
{
	if(!_no_glass_pane_) 
		showGlassPane();
	
	$.ajax({
		type: "POST",
		url: _url,
		crossDomain : true,
        async: true,
        contentType: false,
        processData: false,
		data: _data,
        error: function(jqXHR, textStatus, errorThrown) {
        	//alert('error: ' + textStatus);
        	handle_request_error(jqXHR, textStatus, errorThrown);
        },
		success: function( data ) {
			success_callback( data );
			update_paths();
			
			if(!_no_glass_pane_) 
				hideGlassPane();
		},
	});
}

function send_post_request( _url, _data, success_callback, _no_glass_pane_ )
{
	if(!_no_glass_pane_) 	
		showGlassPane();
	
	$.ajax({
		type: "POST",
		url: _url,
		crossDomain : true,
        async: true,
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
		data: JSON.stringify(_data),
        error: function(jqXHR, textStatus, errorThrown) {
        	handle_request_error(jqXHR, textStatus, errorThrown);
        },
		success: function( data ) {
			success_callback( data );
			update_paths();
			
			if(!_no_glass_pane_) 
				hideGlassPane();
		},
	});
}

function send_get_request( _url, success_callback, _no_glass_pane_ )
{
	if(!_no_glass_pane_) 	
		showGlassPane();
	
	$.ajax({
		type: "GET",
		url: _url,
        async: true,
        contentType: "application/json",
        dataType: 'json',
        error: function(jqXHR, textStatus, errorThrown) {
        	//alert('error: ' + errorThrown);
        	handle_request_error(jqXHR, textStatus, errorThrown);        	
        },
		success: function( data ) {
			success_callback( data );
			update_paths();	
			
			if(!_no_glass_pane_) 
				hideGlassPane();
		},
	});
}

function send_auth_form_request( _url, _data, success_callback, _no_glass_pane_ )
{
	var _url_ = _url + "?token=" + get_auth_token();
	send_form_request( _url_, _data, success_callback, _no_glass_pane_ );
}

function send_auth_post_request( _url, _data, success_callback, _no_glass_pane_ )
{
	var _url_ = _url + "?token=" + get_auth_token();
	//alert(_url_);
	send_post_request( _url_, _data, success_callback, _no_glass_pane_ );
}

function send_auth_get_request( _url, success_callback, _no_glass_pane_ )
{
	var _url_ = _url + "?token=" + get_auth_token();
	send_get_request( _url_, success_callback, _no_glass_pane_ );
}

function send_sync_get_request( _url )
{
	var responseText = 
		$.ajax({
					type: "GET",
				    url: _url,
				    async: false
				}).responseText;
	
	return eval("(" + responseText + ")");	
}

function send_sync_form_request( _url, _data )
{
	var responseText = 
		$.ajax({
	        type: "POST",
	        contentType: false,
	        processData: false,        
	        url: _url,
			data: _data,
	        async: false
		}).responseText;
	
	return eval("(" + responseText + ")");
}

function send_sync_post_request( _url, _data )
{
	var responseText = 
		$.ajax({
					type: "POST",
				    url: _url,
				    data: JSON.stringify(_data),
				    async: false
				}).responseText;
	return eval("(" + responseText + ")");
}

function send_auth_sync_get_request( _url )
{
	var _url_ = _url + "?token=" + get_auth_token();
	return send_sync_get_request(_url_);
}

function send_auth_sync_form_request( _url, _data )
{
	var _url_ = _url + "?token=" + get_auth_token();
	return send_sync_form_request(_url_, _data);
}

function send_auth_sync_post_request( _url, _data )
{
	var _url_ = _url + "?token=" + get_auth_token();
	return send_sync_post_request(_url_, _data);
}


function get_auth_token()
{
	return $.cookie("token");
}

function set_auth_token(token)
{
	$.cookie("token", token, { expires: 1, path: "/" });
}

function delete_auth_token()
{
	$.removeCookie("token", { path: "/" });
}
