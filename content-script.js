// console.log("content-script working! haha~");
addCssLinkToHead();
var selectItem;
document.body.addEventListener('click', function(e){
  // clear previous content
  clearPreviousPanel();

  var currentSelection = window.getSelection();
  if(currentSelection==null || currentSelection== undefined || currentSelection==''){
    return;
  }
  if(selectItem) {
    console.log("上次展示的翻译还没有隐藏，selectItem="+selectItem);
    return;
  }
  selectItem = currentSelection;
  console.log("selection: "+ currentSelection);
  translate(currentSelection, function(result){
    // console.log("data: " + JSON.stringify(result));
    // display result panel
    var x = e.clientX;
    var y = e.clientY;
    displayResult(x, y, result);
  });
}, true);
window.onscroll = function(){
  clearPreviousPanel();
}

function addCssLinkToHead(){
  var $head = $("head");
  var $headlinklast = $head.find("link[rel='stylesheet']:last");
  if($headlinklast&& $headlinklast.id == 'ranslate-panel'){
    console.log('already add css link, quit!');
  }
  var linkElement = "<link id='translate-panel' rel='stylesheet' href="+chrome.extension.getURL('/css/main.css')+" type='text/css' media='screen'>";
  $head.append(linkElement);
}

function clearPreviousPanel(){
  var $previousP = $('#translateP');
  if($previousP){
    $('#translateP').fadeOut(800, function() {
      $('#translateP').remove();
    });
  }
  selectItem = undefined;
}

function displayResult(x, y, data){
  var translateResult = "";
  if(data){
    // console.log(JSON.stringify(data));
    if(data.basic) {
      translateResult = data.basic.explains.join(", ");
    }
    if(data.web){
      translateResult += "<br />" + data.web.map(function(obj){
        return obj.value;
      }).join(", ");
    }
    translateResult += "<br />" + data.translation;
  }else{
    translateResult = "";
  }
  var $translateResultPanel = $("<div>", {id: "translateP", style:"left: "+ x +"px;top: "+ (y + 11) +"px;"}).html(translateResult);
  $('body').append($translateResultPanel);
  $("#translateP").slideDown(200);
}
