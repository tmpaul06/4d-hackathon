// Originally from the material-ui project
class DomEvents {

  once(el, type, callback) {
    let typeArray = type.split(" ");
    let recursiveFunction = function(e) {
      e.target.removeEventListener(e.type, recursiveFunction);
      return callback(e);
    };

    for(let i = typeArray.length - 1; i >= 0; i--) {
      this.on(el, typeArray[i], recursiveFunction);
    }
  }

  // IE8+ Support
  on(el, type, callback) {
    if(el.addEventListener) {
      el.addEventListener(type, callback);
    } else {
      el.attachEvent("on" + type, function() {
        callback.call(el);
      });
    }
  }

  // IE8+ Support
  off(el, type, callback) {
    if(el.removeEventListener) {
      el.removeEventListener(type, callback);
    } else {
      el.detachEvent("on" + type, callback);
    }
  }

  // Needed for preventing text selection during drag.
  pauseEvent(e) {
    if(e.stopPropagation) {
      e.stopPropagation();
    }
    if(e.preventDefault) {
      e.preventDefault();
    }
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }
}

export default new DomEvents();