/**
 * All the authentication scripts 
 */

var authentication_base_url = base_url + "auth/";

function clean_redirect_to_login()
{
		delete_auth_token();
 		$.removeCookie("password", { path: "/" });
 		redirect_to_login();
}

function logout_request()
{	
	var url = authentication_base_url + "logout"; 
	var success = function ( response ) 
	{
		if(response.status)
		{
			clean_redirect_to_login();
		}
		else
		{
			show_error_message( response.message );
		}
	};
	send_auth_get_request(url, success);
}

function login_request( redirecturl )
{
	var email = $("#email").val();
	var password = $("#password").val();
	
	var onloggedin = function( ) 
	{
		var rememberme = $("#rememberme").prop("checked");
		if(rememberme)
		{
			$.cookie("username", email, { expires: 365, path: "/" });
			$.cookie("password", password, { expires: 365, path: "/" });
		}
		else
		{
			//alert("cleaning the cookie");
			$.removeCookie("username", { path: "/" });
			$.removeCookie("password", { path: "/" });
		}
	};
	login(email, password, onloggedin, redirecturl);
}

function login(_username, _password, loggedin_callback, redirecturl)
{
	var url = authentication_base_url + "login";
	var data = 
	{
		username : _username,
		password : sha256_digest(_password)
	};
	
	var success = function ( response ) 
	{
		if(response.status)
		{
			set_auth_token(response.token);
			if(loggedin_callback)
			{
				loggedin_callback();
			}
			if( !redirecturl || redirecturl == '' )
			{
				redirect_to_home();
			}
			else
			{
				redirect_to( redirecturl );
			}
		}
		else
		{
			show_error_message( response.message );
		}
	};
	send_post_request(url, data, success);
}

function try_auto_login()
{
	var email = $.cookie("username");
	var password = $.cookie("password");
	if(email) $("#email").val(email);
	if(password) $("#password").val(password);

	if(email && password)
	{
		login(email, password);
	}
}

function register_request()
{
	var url = authentication_base_url + "register";
	var _firstname = $("#firstname").val();
	var _lastname = $("#lastname").val();
	var _email = $("#email").val();
	var _password = sha256_digest($("#password").val());
	
	var data = 
	{
		firstname : _firstname,
		lastname : _lastname,
		email : _email,
		password : _password
	};
		
	var success = function ( response ) 
	{
		if(response.status)
		{
			set_auth_token(response.token);
			show_success_message( 'Registration Confirmation', 'Your new account has been created successfully.', '/index.php' );
		}
		else
		{
			show_error_message( 'Registration Failure', response.message );
		}
	};
	
	send_auth_post_request(url, data, success);
}

function retrieve_session_user()
{
	var url = authentication_base_url + "sessionuser";
	
	var response = send_auth_sync_get_request(url);
    if(response == null || !response.status)
	{
    	clean_redirect_to_login();    	
	}
    return response;
}

function show_success_message( _title, _message, _redirect_url, onClose)
{
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_SUCCESS,
        closable: false,
        title: _title,
        message: _message,
        onhide: function(dialog)
        {
        	if(onClose)
    		{
        		onClose();
    		}
        },
        buttons: 
        [
         {
            label: 'Ok',
            cssClass: 'btn-success',
            icon : 'glyphicon glyphicon-ok',
            action: function(dialog)
            {
            	dialog.close();
            	if(_redirect_url)
            	{
            		redirect_to(_redirect_url);
            	}
            }
         }
        ]
    });     		
}

function show_warning_message( _title, _message, onClose)
{
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_WARNING,
        title: _title,
        message: _message,
        onhide: function(dialog)
        {
        	if(onClose)
    		{
        		onClose();
    		}
        },
        buttons: 
        [
         {
            label: 'Ok',
            cssClass: 'btn-warning',
            icon : 'glyphicon glyphicon-warning-sign',
            action: function(dialog)
            {
            	dialog.close();
            }
         }
        ]
    });     		
} 

function show_error_message( _title, _message, onClose )
{
    BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        title: _title,
        message: _message,
        onhide: function(dialogRef)
        {
        	//alert("I fired!");
        	if(onClose)
    		{
        		onClose();
    		}
        },
        buttons: 
        [
         {
            label: 'Close',
            cssClass: 'btn-danger',
            icon : 'glyphicon glyphicon-remove',
            action: function(dialog)
            {
            	dialog.close();
            }
         }
        ]
    });     		
} 
