var Translapu = (function() {
  var createPanel = function(x, y) {
    return $("<div>", {
      id: "translateP",
      style: "left: " + (+x) + "px;top: " + (+y + 11) + "px;"
    });
  }
  // 创建翻译model
  var create = function(text, x, y) {
    return {
      text: text,
      panel: createPanel(x, y)
    }
  }

  // 获取被选中的字符
  var getSelected = function(e) {
    var currentSelection = window.getSelection();
    if (!currentSelection || currentSelection == '') {
      console.info("currentSelection == nil");
      return;
    }
    console.info('selection: ' + currentSelection);
    return create(currentSelection, e.clientX, e.clientY);
  }

  // 展示翻译
  var display = function(item, translateResult) {
    $translateResultPanel = $(item.panel.html(translateResult));
    $('body').append($translateResultPanel);
    $("#translateP").slideDown(200);
  }

  // 消除页面上上一次的翻译
  var clearPreviousPanel = function() {
    var $previousP = $('#translateP');
    if ($previousP) {
      $('#translateP').fadeOut(800, function() {
        $('#translateP').remove();
      });
    }
  }

  // 翻译
  var trans = function(item) {
    if (!item || !item.text || !item.panel) {
      console.info("获取选中失败，跳过");
      return;
    }
    translate(item.text, function(data) {
      // TODO check data empty
      var translateResult;
      if (data.translation) {
        // console.log(JSON.stringify(data));
        if (data.basic) {
          translateResult = data.basic.explains.join(", ");
        }
        if (data.web) {
          translateResult += "<br />" + data.web.map(function(obj) {
            return obj.value;
          }).join(", ");
        }
        translateResult += "<br />" + data.translation;
      } else {
        translateResult = "<br />" + "翻译失败";
      }

      display(item, translateResult);
    });
  }

  var addCssLinkToHead = function() {
    var $head = $("head");
    var $headlinklast = $head.find("link[rel='stylesheet']:last");
    if ($headlinklast && $headlinklast.id == 'ranslate-panel') {
      console.log('already add css link, quit!');
    }
    var linkElement = "<link id='translate-panel' rel='stylesheet' href=" + chrome.extension.getURL('/css/main.css') + " type='text/css' media='screen'>";
    $head.append(linkElement);
  }

  return {
    init: function() {
      var currKey = null;
      $(window).keydown(function(event) {
        currKey = event.key;
      });
      $(window).keyup(function(event) {
        currKey = null;
      });

      addCssLinkToHead();

      $(document.body).bind('mouseup', function(e) {
        clearPreviousPanel();

        trans(getSelected(e))
      });

      $(document.body).bind('click', function(e) {
        clearPreviousPanel();
        if (currKey == 'Meta' || currKey == 'Control' || currKey == 'Alt') {
          trans(getSelected(e))
        } else {
          console.info('not press key , ignore');
        }
      }, true);
    }
  }
});

Translapu().init();
