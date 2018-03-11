var expect = chai.expect;

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
