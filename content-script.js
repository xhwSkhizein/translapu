// console.log("content-script working! haha~");
addCssLinkToHead();
document.body.addEventListener('click', function(e){
  // clear previous content
  clearPreviousPanel();

  var currentSelection = window.getSelection();
  if(currentSelection==null || currentSelection== undefined || currentSelection==''){
    return;
  }
  // TODO invoke translate api
  console.log("selection: "+ currentSelection);
  translate(currentSelection, function(result){
    console.log("data: " + JSON.stringify(result));
    // display result panel
    var x = e.clientX;
    var y = e.clientY;
    displayResult(x, y, result);
  });
}, true);


function addCssLinkToHead(){
  var $head = $("head");
  var $headlinklast = $head.find("link[rel='stylesheet']:last");
  if($headlinklast&& $headlinklast.id == 'ranslate-panel'){
    console.log('already add css link, quit!');
  }
  var linkElement = "<link id='translate-panel' rel='stylesheet' href="+chrome.extension.getURL('/css/translate-panel.css')+" type='text/css' media='screen'>";
  $head.append(linkElement);
}

function clearPreviousPanel(){
  var $previousP = $('#translateP');
  if($previousP){
    $('#translateP').remove();
  }
}

function displayResult(x, y, data){
  //百度 {"from":"en","to":"zh","trans_result":[{"src":"Save","dst":"保存"}]}
  //有道 {"translation":["keyfrom"],"query":"keyfrom","errorCode":0}
  // {
  //   "translation":["类型"],
  //   "basic":{
  //     "us-phonetic":"taɪp",
  //     "phonetic":"taɪp",
  //     "uk-phonetic":"taɪp",
  //     "explains":["n. 类型，品种；模范；样式","vt. 打字；测定（血等）类型","vi. 打字","n. (Type)人名；(英)泰普"]
  //   },
  //   "query":"type",
  //   "errorCode":0,
  //   "web":[
  //     {
  //       "value":["类型","型号","型式"],
  //       "key":"Type"
  //     },
  //     {
  //       "value":["80式冲锋手枪","80式坦克","80式机枪"],
  //       "key":"Type 80"
  //     },
  //     {
  //       "value":["发动机类型","发动机型号","发动机型式"],
  //       "key":"Engine Type"
  //     }
  //     ]
  //   }
  // FIXME
  var translateResult;
  if(data){
    console.log(JSON.stringify(data));
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
}
