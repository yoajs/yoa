import lex from './lexer';
import parse from './parser';
import generate from './generator';

export default function compile(template) {
  const tokens = lex(template);
  const ast = parse(tokens);
  console.log(JSON.stringify(ast));
  return generate(ast);
}
