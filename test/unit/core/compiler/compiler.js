describe('Compiler', function() {
  it("should compile direct", function() {
    var render = new Yoa().compile(' ');
    console.log('render', render);
    // TODO
  })

  it("should compile mustaches", function() {
    var el = createTestElement("compilerMustache", '{{msg}}');
    var app = new Yoa({
      el: "#compilerMustache",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!");
  });
})
