describe('#Compiler', function() {
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

  it("should not compile comments", function() {
    var el = createTestElement("compilerComment", '<!-- comment -->');
    var app = new Yoa({
      el: "#compilerComment"
    });
    expect(el.innerHTML).to.equal("");
  });

  it.skip("should not compile comments mix with text", function() {
    var el = createTestElement("compilerCommentMixText", '<!-- comment -->\ntest text');
    var app = new Yoa({
      el: "#compilerCommentMixText"
    });
    expect(el.innerHTML).to.equal("test text");
  })

  it("should compile self closing elements", function() {
    var el = createTestElement("compilerSelfClosing", '<self-closing />');
    var app = new Yoa({
      el: "#compilerSelfClosing",
      template: "<div><self-closing/></div>"
    });
    expect(app.$dom.childrens[0].type).to.equal("self-closing");
  });

  it("should compile self closing elements without slash", function() {
    var el = createTestElement("compilerSelfClosingNoSlash", '');
    var app = new Yoa({
      el: "#compilerSelfClosingNoSlash",
      template: "<div><self-closing></div>"
    });
    expect(app.$dom.childrens[0].type).to.equal("self-closing");
  });

  it("should compile self closing elements without a slash and consume children", function() {
    var el = createTestElement("compilerSelfClosingNoSlashConsumeChildren", '');
    var app = new Yoa({
      el: "#compilerSelfClosingNoSlashConsumeChildren",
      template: "<div><self-closing>hi</div>"
    });
    expect(app.$dom.childrens[0].childrens[0].val).to.equal("hi");
  });

  it("should ignore just closing elements", function() {
    var el = createTestElement("compilerJustClosing", '');
    var app = new Yoa({
      el: "#compilerJustClosing",
      template: "<div></h1></div>"
    });
    expect(app.$dom.childrens[0]).to.equal(undefined);
  });

  it("should ignore just closing custom elements", function() {
    var el = createTestElement("compilerJustClosingCustom", '');
    var app = new Yoa({
      el: "#compilerJustClosingCustom",
      template: "<div></custom></div>"
    });
    expect(app.$dom.childrens[0]).to.equal(undefined);
  });

  it.skip("should compile only text", function() {
    var el = createTestElement("compilerOnlyText", '');
    var compilerCommentApp = new Yoa({
      el: "#compilerOnlyText",
      template: "<div>text</div>"
    });
    expect(el.innerHTML).to.equal("text");
  });

  it("should compile double quotes in text", function() {
    var el = createTestElement("compilerDoubleQuote", '"Hello Yoa!"');
    var compilerCommentApp = new Yoa({
      el: "#compilerDoubleQuote"
    });
    expect(el.innerHTML).to.equal('"Hello Yoa!"');
  });

  it("should compile an unclosed comment", function() {
    var el = createTestElement("compilerUnclosedComment", '');
    var compilerCommentApp = new Yoa({
      el: "#compilerUnclosedComment",
      template: "<div><!-- unclosed</div>"
    });
    expect(el.innerHTML).to.equal("");
  });

  it("should compile an unclosed tag", function() {
    var el = createTestElement("compilerUnclosedTag", '');
    var compilerUnclosedTagApp = new Yoa({
      el: "#compilerUnclosedTag",
      template: "<div><h1>Yoa</div>"
    });
    expect(el.firstChild.textContent).to.equal("Yoa");
  });
})
