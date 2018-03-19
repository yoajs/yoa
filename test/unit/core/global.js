var expect = chai.expect;

Yoa.config.silent = true;

// wrapper
var yoaContainer = document.createElement("div");
yoaContainer.id = "yoa-container";
document.body.appendChild(yoaContainer);

var createTestElement = function(id, html) {
  var el = document.createElement("div");
  el.innerHTML = html;
  el.id = id;
  yoaContainer.appendChild(el);
  return el;
}

var then = function(cb) {
  return new Promise(function(resolve, reject) {
    Yoa.nextTick(function() {
      try {
        if(cb.toString().indexOf("done") !== -1) {
          cb(resolve);
        } else {
          cb();
          resolve();
        }
      } catch(err) {
        reject(err);
      }
    });
  });
}
