import lex from './lexer';

export default function compile(template) {
  const tokens = lex(template);
  console.log('tokens', tokens);
  return tokens;
}
