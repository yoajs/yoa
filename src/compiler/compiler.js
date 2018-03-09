import lex from './lexer';

export default function compileMixin(Yoa) {
  Yoa.prototype.compile = function(template) {
    return lex(template)
  }
}
