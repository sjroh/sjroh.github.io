/**
 * 
 */

function grid_load(settings, columns, data, onloaded_callback, delete_request)
{
	var oTable = $('#' + settings.datatable).DataTable({
			"retrieve" : true,
			"data": data, 
			"columns": columns,
			"order": [],
			"pagingType": "simple_numbers",
			"drawCallback" : function() {
				if(settings.onTableRedrawn)
				{
					settings.onTableRedrawn();
				}
			},
			"oLanguage": { "sEmptyTable" : settings.emptytablemessage },
		    "searching"   : settings.filterable == null || settings.filterable ? true : false,
		    "info"	    : settings.showInfo == null || settings.showInfo ? true : false,
		    "paging" : settings.paginate == null || settings.paginate ? true : false
	});
	    
    if(onloaded_callback) onloaded_callback(oTable);
    
    oTable.on('order', function () { 
    	console.log("sort fired"); 
    	if(settings.onSort) { settings.onSort(oTable); }
    });
	
    oTable.on('search', function () { 
    	console.log("filter fired");
    	if(settings.onFilter) { settings.onFilter(oTable); }
    });
    
    oTable.on('page', function () { 
    	console.log("page fired"); 
    	if(settings.onPaging) { settings.onPaging(oTable); }
    });
 
    if(settings.selectable)
    {
    	var row_selected_css = settings.row_selected_css;
    	oTable.rows().nodes().to$().on("click", function() {
    		$(this).toggleClass(row_selected_css);
    		if(settings.onRowClicked)
			{
    			settings.onRowClicked(this);
			}
    	});
    }    
}

function highlight_row(datatable, row_index, highlight_class)
{
	var table = $('#' + datatable).DataTable();
	table.row( row_index ).nodes().to$().addClass( highlight_class );
}

function unhighlight_row(datatable, row_index, highlight_class)
{
	var table = $('#' + datatable).DataTable();
	table.row( row_index ).nodes().to$().removeClass( highlight_class );
}


function grid_toggleSelection_whenViewed(dtable, i, selected_style)
{
	var oTable = $('#' + dtable).DataTable();
	var rows  = oTable.rows().nodes();
	
	if(!$(rows[i]).hasClass(selected_style))
	{
		$(rows[i]).addClass(selected_style);
	}
	else
	{
		$(rows[i]).removeClass(selected_style);
	}
}

function grid_get_selected_rows_by_id(datatable, selected_style)
{
	var oTable = $('#' + datatable).DataTable();
	return grid_get_selected_rows(oTable, selected_style);
}


function grid_get_selected_rows(oTable, selected_style)
{
	var all_rows = oTable.rows().nodes();
	var rows = new Array();
	for(var i = 0; i < all_rows.length; i++)
	{
		if($(all_rows[i]).hasClass(selected_style))
		{
			rows.push(all_rows[i]);
		}
	}
	return rows;
}


//function delete_selected_record( tname, selected_style, display_name_index, oTable,  delete_msg, delete_request)
function grid_delete_selected_rows_by_id( settings, delete_request, post_delete_callback)
{
	var oTable = $('#' + settings.datatable).DataTable();
	grid_delete_selected_record(settings, oTable, delete_request, post_delete_callback);
}

function grid_delete_selected_record(settings, oTable, delete_request, post_delete_callback)
{
	var selected_rows = grid_get_selected_rows( oTable, settings.row_selected_css );
	
	if(selected_rows.length == 0)
	{
		BootstrapDialog.alert('No record is selected for deletion!');
		return;
	}
	
	var indices = [];
	var data = {
			candidates : []
	};
	
	for(var i = 0; i < selected_rows.length; i++)
	{
		var row_data = oTable.row(selected_rows[i]).data();
		data.candidates[i] = row_data[0];
		indices.push(selected_rows[i]);
	}
	
	var success = function( response )
	{
		if(response.status)
		{
			for(var i = 0; i < indices.length; i++)
			{
				oTable.row(indices[i]).remove();
			}
        	if(post_delete_callback)
    		{
        		post_delete_callback();
    		}
			oTable.draw();
		}
	};
	
	BootstrapDialog.show({
        type: BootstrapDialog.TYPE_DANGER,
        title: settings.delete_msg,
        message: selected_rows.length + " records will deleted. Do you want to proceed?",        //friendly_name
        buttons: 
        [
         {
	            label: 'No',
	            cssClass: 'btn-primary',
	            action: function(dialog)
	            {
	            	dialog.close();	            	
	            }
	      },
         
         {
	            label: 'Yes',
	            cssClass: 'btn-danger',
	            action: function(dialog)
	            {
	            	delete_request(settings.deleteurl, data, success);
	            	dialog.close();	            	
	            }
	      }
        ]
    }); 
	
}
