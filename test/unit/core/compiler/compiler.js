describe('Compiler', function() {
  it("should compile mustaches", function() {
    var el = createTestElement("compilerMustache", '{{msg}}');
    var app = new Yoa({
      el: "#compilerMustache",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!");

    var el2 = createTestElement("compilerMustache2", '{{  msg}}');
    var app = new Yoa({
      el: "#compilerMustache2",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!");

    var el3 = createTestElement("compilerMustache3", '{{msg   }}');
    var app = new Yoa({
      el: "#compilerMustache3",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!");

    var el4 = createTestElement("compilerMustache4", '{{   msg   }}');
    var app = new Yoa({
      el: "#compilerMustache4",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!");
  });

  it("should compile mustaches with whitespace", function() {
    var el = createTestElement("compilerMustacheWithWhitespace", '  {{msg}}');
    var app = new Yoa({
      el: "#compilerMustacheWithWhitespace",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("  Hello Yoa!!!");

    var el = createTestElement("compilerMustacheWithWhitespace2", '  {{msg}}  ');
    var app2 = new Yoa({
      el: "#compilerMustacheWithWhitespace2",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("  Hello Yoa!!!  ");

    var el = createTestElement("compilerMustacheWithWhitespace3", '{{msg}}  ');
    var app3 = new Yoa({
      el: "#compilerMustacheWithWhitespace3",
      data: {
        msg: "Hello Yoa!!!"
      }
    });
    expect(el.innerHTML).to.equal("Hello Yoa!!!  ");
  })
})
