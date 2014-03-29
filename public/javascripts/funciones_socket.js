var socket = io.connect();

jQuery(function ($) {
	var container1= $('#container1');
	var container2= $('#container2');
	nickName = $('#nickname');
	var setNicknameForm = $('#set-nickname');
	
	setNicknameForm.submit(function(event){
		var colors= $("#colors option:selected").text();
		event.preventDefault();
		if (NicknameValidation()){
			socket.emit('nickname',nickName.val(),function(data){
				if (data) {

						container2.hide();				
						container1.fadeIn(2000);
				
				} else {
					setNicknameForm.prepend('<p style="color:red;"> Ya esta cogido </p>');
				}
			socket.on('nicknames',function(data){
				$('#nicknames').empty().append($('<ul>'));
				for(var i=0; i<data.length; i++) {
					$('#nicknames ul').append('<li>' + data[i]);
				}
			});

			});
		}else{
			setNicknameForm.prepend('<p style="color:red;"> esta vacio </p>');

		};
	});

	/*sendMessage.submit(function(event){
		event.preventDefault();
		socket.emit('user message',$('#message').val());
		$('#message').val('');

	});*/
socket.on('start paint',function(data){
		if (data.name != nickName.val()){
			ctx.beginPath();
	    	ctx.moveTo(data.x,data.y);
	    };
	}); 

socket.on('paint',function(data){
		if (data.name != nickName.val()){
			ctx.lineTo(data.x,data.y);
	    	ctx.stroke();
	    };
	}); 

socket.on('clear',function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	}); 
	
// validacion

function NicknameValidation (){
 
  return !(nickName.val() == null || nickName.val().length == 0 || /^\s+$/.test(nickName.val()) );
};



});