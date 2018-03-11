import lex from './lexer';
import parse from './parser';

export default function compile(template) {
  const tokens = lex(template);
  console.log('tokens', tokens);
  console.log('parse', parse(tokens));
  return tokens;
}
