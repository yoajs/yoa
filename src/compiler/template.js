import { escapeString, error } from '../util/util';
import { expressionRE } from '../util/regex';

const concatenationSymbol = ' + ';

export function compileTemplate(template) {
  let output = '"';
  let dependencies = [];
  for (let i = 0; i < template.length; i++) {
    const char = template[i];
    const nextChar = template[i+1];

    if(char === '{' && nextChar === '{') {
      i += 2;
      const textTail = template.substr(i);
      const endIndex = textTail.indexOf('}}');
      if(endIndex === -1) {
        // no closed
        if(__ENV__ !== 'production') {
          error(('Expected closing delimiter "}}" after "' + textTail + '"'));
        }
        i = template.length;
        output += escapeString(textTail);
      }else {
        i += 2 + endIndex - 1;
        const variableName = textTail.substr(0, endIndex).trim();
        if(variableName.indexOf('(') >= 0) {
          // has expression
          dependencies.push(...getTemplateDependencies(variableName));
        }else {
          dependencies.push(variableName);
        }
        output += `" + (${variableName}) + "`;
      }
    }else {
      output += escapeString(char);
    }
  }

  output += '"';

  return {output, dependencies};
}

export function compileTemplateExpression(template) {
  let output = template;
  let dependencies = getTemplateDependencies(template);

  return { output, dependencies };
}

function getTemplateDependencies(template) {
  let dependencies = [];
  template.replace(expressionRE, function(match, reference) {
    if(reference !== undefined && dependencies.indexOf(reference) === -1) {
      dependencies.push(reference);
    }
  });

  return dependencies;
}
