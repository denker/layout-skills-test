// datetimepicker settings
$.datetimepicker.setLocale('ru');
$('.datetimepicker').datetimepicker({
 i18n:{
  de:{
   months:[
    'Январь','Февраль','Март','Апрель',
    'Май','Июнь','Июль','Август',
    'Сентябрь','Октябрь','Ноябрь','Декабрь',
   ],
   dayOfWeek:[
    "Пн", "Вт", "Ср", "Чт", 
    "Пт", "Сб", "Вс",
   ]
  }
 },
 format:'d.m.Y H:i'
});


// check datetime for futureness
function parseTime(str) {
  if (!str.match(/^\d{2}\.\d{2}\.\d{4}\s\d{2}\:\d{2}$/)) return NaN;
  var a = str.split(" ");
  a[0] = a[0].split('.');
  var t1 = a[0][1]+"/"+a[0][0]+"/"+a[0][2]+" "+a[1];
  return Date.parse(t1);
}
function paintRed(element){
  var currentDate = new Date;
  if (parseTime(element.val()) > currentDate.getTime()) {
    element.removeClass("error");
  } else {
    element.addClass("error");
  }
}
$("#control-datetime").change( function() { paintRed( $("#control-datetime") ) } );
$("#next-datetime").change( function() { paintRed( $("#next-datetime") ) } );


// symbol counters
$('#done-area').keyup( function(){
  $('#done-counter').html($('#done-area').val().length);
});
$('#plan-area').keyup( function(){
  $('#plan-counter').html($('#plan-area').val().length);
});


// show/hide whole comment form
$("#add > a").click( function(e) {  
  $("form.comment-form").toggleClass("hidden");
  $("#add > a").html( function() {
    if ( $("form.comment-form").hasClass("hidden") ) {
      return "Добавить";
    } else {
      return "Свернуть";
    }
  });
  return false;
});


// switch comment field to summary field
$("#int-summary").click( function() { 
  if ( $("#int-summary").prop("checked") ) {
    $("#intermediate-summary-comment").css("display", "block");
    $("#comment-field").css("display", "none"); 
  } else {
    $("#intermediate-summary-comment").css("display", "none");
    $("#comment-field").css("display", "block");
  }
});


// show/hide previous summary text
$("#summary-control").click( function() {
  if ( $("#tab").hasClass("unfolded") ) {
    $("#summary").css("display", "none");    
  } else {
    $("#summary").css("display", "block");
  }
  $("#tab").toggleClass("unfolded");
  $("#tab").toggleClass("folded");
  return false;
});


// check if all required fields are filled
function ifAllFieldsFilled() {
  var isSummary = $("#int-summary").prop("checked");
  var commentFilled = $("#comment").val().length > 0;
  var doneFilled = $("#done-area").val().length > 0;
  var planFilled = $("#plan-area").val().length > 0;
  //filename inputs check
  var filled = true;
  $(".filename").each( function(i,e) { 
    filled = filled && $(e).val().length > 0;
  })
  if (isSummary) {
    return filled && doneFilled && planFilled;
  } else {    
    return filled && commentFilled;
  }
}
function setCanSave(canSave) {
  if (canSave) {
    $("#saveButton").removeClass("disabled");    
  } else {
    $("#saveButton").addClass("disabled");
  }
}
$("#int-summary").change( function() { setCanSave( ifAllFieldsFilled() ) } );
$("#comment").keyup( function() { setCanSave( ifAllFieldsFilled() ) } );
$("#done-area").keyup( function() { setCanSave( ifAllFieldsFilled() ) } );
$("#plan-area").keyup( function() { setCanSave( ifAllFieldsFilled() ) } );


// cancel button - restore defaults and fold comment form
$("#cancel").click( function() {
  $("#int-summary").prop("checked", false);
  $("#control-datetime").val('');
  $("#next-datetime").val('');
  $("#comment").val('');
  $("#done-area").val('');
  $('#done-counter').html('0');
  $("#plan-area").val('');
  $('#plan-counter').html('0');
  $("#tab").removeClass("unfolded");
  $("#tab").addClass("folded");
  $("#intermediate-summary-comment").css("display", "none");
  $("#comment-field").css("display", "block");
  $(".comment-form").addClass("hidden");
  $(".filerow").remove();
  return false;
});


// file rows add and remove
function testExtention(filename) {
  var exts = ['bmp', 'doc', 'docx', 'gif', 'jpeg', 'html', 'mht', 'mtt', 'mp3msg', 'pcap', 'pdf', 'png', 'rtf', 'tiff', 'txt', 'vsd', 'xls', 'xlxs', 'zip'];
  var result = false;
  exts.forEach( function(ext) {    
    if (filename.search(ext) == filename.length - ext.length ) { result = true; }
  });
  return result;
}


function addFileRow(filename) {
  if (!testExtention(filename)){
    alert('Данный тип файла не поддерживается системой. Пожалуйста, выберите другой файл.');
    return false;
  }
  var hash = md5(filename);  
  var parts = [
    '<div class="filerow" id="',
    hash,
    '"><input class="filename" type="text"/><label><span>',
    filename,
    '</span><a class="delete-filerow" id="delete-', 
    hash,
    '" href="#"><img src="css/images/red-cancel.png"/></a></label></div>'
  ]
  $( parts.join('') ).insertBefore(".files-controls");
  
  // (re)add delete function for file rows
  $(".delete-filerow").click( function(e) {    
    var element = document.getElementById( e.target.parentElement.id.substring(7) );
    if (element) element.remove();
    return false;
  });
  // make check for emptyness
  $(".filename").keyup( function() { setCanSave( ifAllFieldsFilled() ) } );
}

$("#addfile").change( function() {
  var files = document.getElementById("addfile").files;
  for (var i = 0; i < files.length; i++) {            
    addFileRow(files[i].name);        
  };
});

