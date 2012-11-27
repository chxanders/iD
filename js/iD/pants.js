if (typeof pants === 'undefined') var pants = {};

pants.ddmenuitem = 0;
pants.menutimeout = 500;
pants.newFilename = '';
pants.curentFilename = '';
pants.DoOnFrameLoad = function(){};
pants.onOk = {};

pants.OkDialog = function() {
	pants.CancelDialog();
	if(typeof(pants.onOk) !== 'undefined') {
		pants.onOk();
	}
};

pants.CancelDialog = function() {
	document.getElementById('popup').style.visibility = 'hidden';	
	document.getElementById('yesno').style.visibility = 'hidden';
	$('#uploadfile').change(function() {
	});
};

pants.Dialog = function(onOk, content, okText, cancelText) {
	if(typeof(cancelText) === 'undefined') {
		cancelText = 'Cancel';
	}
		
	pants.jsddm_close();
	pants.onOk = onOk;
	document.getElementById('dialog_text').innerHTML = content;
	document.getElementById('ok').innerHTML = okText;
	document.getElementById('cancel').innerHTML = cancelText;
	document.getElementById('popup').style.visibility = 'visible';
	document.getElementById('yesno').style.visibility = 'visible';
};

pants.OnFrameLoad = function() {
	pants.DoOnFrameLoad();
	pants.DoOnFrameLoad = function() {};	
};

pants.LoadOsm = function() {
	pants.newFileName = '';
	pants.Dialog(function() {
	 				document.getElementById('load_osm').submit();
 				},
 				'<form id="load_osm" action="/pants/upload/upload" enctype="multipart/form-data" method="post" target="hiddenFrame">'
				 +'<input id="uploadfile" name="uploadfile" type="file" />' 				
				 +'<input id="filename" name="filename" type="hidden" /></form>​',
				 '');

	$('#uploadfile').change(function() {
		var tmp = $(this).val();
		var lastIndex = tmp.lastIndexOf("\\");
		if (lastIndex >= 0) {
			pants.newFileName = tmp.substring(lastIndex + 1);
		}
		$('#filename').val(pants.newFileName);
		if(pants.newFileName.length > 0) {
			document.getElementById('ok').innerHTML = 'Open';	
		}
	});
	
	pants.DoOnFrameLoad = function() {
		iD.format('/pants/upload/download/' + pants.newFileName);
		pants.curentFilename = pants.newFilename;
	};
};


pants.PrintMap = function() {
	void window.open('/pants/print/','1353361531668',
			'width=400,height=400,toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=0,top=100,left=100');
};

pants.EraseMap = function() {
	pants.Dialog(function() {
					document.getElementById('erase_form').submit();
				},
				'<form id="erase_form" action="/pants/setup/clean" method="post">'
				 +'<input type="hidden"/></form>'
				 +'Do you really want to erase all map information?', 
				 'Yes, I do.');
};

pants.Shutdown = function() {
	pants.Dialog(function() {
					document.getElementById('shudown_form').submit();
				},
				'<form id="shudown_form" action="/pants/setup/shutdown" method="post">'
           	 	+'<input type="hidden"/></form>'
           	 	+'Do you really want to Shutdown?', 
           	 	'Yes, Shutdown.');
};

pants.jsddm_canceltimer = function() {
	 if(pants.closetimer) {  
		 window.clearTimeout(pants.closetimer);
		 pants.closetimer = null;
	 }
};

pants.jsddm_timer = function (){  
	pants.closetimer = window.setTimeout(pants.jsddm_close, pants.menutimeout);
};

pants.jsddm_open = function() { 
	pants.jsddm_close();
	pants.ddmenuitem = $(this).find('ul').css('visibility', 'visible');
};

pants.jsddm_close = function() {
	d3.selectAll('button').classed('active', false);
	pants.jsddm_canceltimer();
	if(pants.ddmenuitem) {
		pants.ddmenuitem.css('visibility', 'hidden');
	}
};

// For convenience when merging from iD
pants.menuInit = function(container, pantsjsddm, map) {
	pants.map = map;
    pantsjsddm.append('li').append('a')
		.attr('href', 'javascript:pants.LoadOsm()')
		.text('Load XML');

    pantsjsddm.append('li').append('a')
    	.attr('href', 'javascript:pants.SaveOsm()')
    	.text('Save XML');

    pantsjsddm.append('li').append('a')
		.attr('href', 'javascript:pants.Print()')
		.text('Print');

    pantsjsddm.append('li').append('a')
    	.attr('href', 'javascript:pants.EraseMap()')
   		.text('Erase All Data');

    pantsjsddm.append('li').append('a')
		.attr('href', 'javascript:pants.Shutdown()')
		.text('Shutdown');

    var table = container.append('div')
    	.attr('id', 'popup')
		.attr('class', 'overlay').append('div')
			.attr('id', 'yesno')
			.attr('class', 'dialog').append('table')
				.attr('width', '100%')
				.attr('border', '0');
    
    table.append('pre')
    	.attr('id', 'dialog_text');
    var row = table.append('tr');
    row.append('td')
    	.attr('style', 'text-align: left;').append('a')
    		.attr('id','ok')
    		.attr('href', 'javascript:pants.OkDialog();');
    	
    row.append('td')
    	.attr('style', 'text-align: right;').append('a')
		.attr('id','cancel')
		.attr('href', 'javascript:pants.CancelDialog();');
    
    $('<iframe id="hiddenFrame" width="0" height="0" />').appendTo('body');
    
    $('#hiddenFrame').load(pants.OnFrameLoad);
    $('#jsddm > li').bind('mouseover', pants.jsddm_open);
	$('#jsddm > li').bind('mouseout',  pants.jsddm_timer);
};
