const concatenationSymbol = ' + '

export default function compileTemplate(template, state) {
  const length = template.length;
  let current = 0;
  let dynamic = false;
  let output = '';

  if(length === 0) {
    output = '""';
  } else {
    while(current < length) {
      const textTail = template.substring(current);
      const textMatch = textTail.match(/\{\{\s*/);

      if(textMatch === null) {
        // only static text
        output += `"${textTail}"`;
        break;
      }

      const textIndex = textMatch.index;
      if(textIndex !== 0) {
        // add static text and move to template expression
        output += `"${textTail.substring(0, textIndex)}"`;
        current += textIndex;
      }

      // mark as dynamic
      dynamic = true;

      // Concatenate if not at the start
      if(current !== 0) {
        output += concatenationSymbol;
      }

      current += textMatch[0].length;

      const expressionTail = template.substring(current);
      const expressionMatch = expressionTail.match(/\s*\}\}/);

      if(__ENV__ !== "production" && expressionMatch === null) {
        error(`Expected closing delimiter after "${expressionTail}"`);
      } else {
        // add expression
        const expressionIndex = expressionMatch.index;
        const expression = expressionTail.substring(0, expressionIndex);
        compileTemplateExpression(expression, state);
        output += `(${expression})`;
        current += expression.length + expressionMatch[0].length;

        // concatenate if not at the end
        if(current !== length) {
          output += concatenationSymbol;
        }
      }
    }
  }

  return {
    output: output,
    dynamic: dynamic
  };
}

function compileTemplateExpression(expression, state) {
  const dependencies = state.dependencies;
  let props = dependencies.props;
  let methods = dependencies.methods;

  const exclude = state.exclude;
  const locals = state.locals;

  let dynamic = false;
  let info;

  const expressionRE = /"[^"]*"|'[^']*'|\d+[a-zA-Z$_]\w*|\.[a-zA-Z$_]\w*|[a-zA-Z$_]\w*:|([a-zA-Z$_]\w*)(?:\s*\()?/g;
  while((info = expressionRE.exec(expression)) !== null) {
    let match = info[0];
    let name = info[1];
    if(name !== undefined && exclude.indexOf(name) === -1) {
      if(match[match.length - 1] === "(") {
        if(methods.indexOf(name) === -1) {
          methods.push(name);
        }
      } else {
        if(locals.indexOf(name) === -1 && props.indexOf(name) === -1) {
          props.push(name);
        }

        dynamic = true;
      }
    }
  }

  return dynamic;
}
