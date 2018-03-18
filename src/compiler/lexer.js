// lexer
export default function lex(template) {
  const length = template.length;
  let tokens = [];
  let current = 0;
  let char = '';
  while(current < length) {
    char = template[current];
    if(char === '<') {
      // tag
      current++;
      if(template.substring(current, current+3) === '!--') {
        // Handle comment, ignore
        const endOfCommentIndex = template.indexOf('-->', current); // from postion current to end to find -->
        if(endOfCommentIndex === -1) {
          current = length;// to end
        }else {
          current = 3 + endOfCommentIndex;
        }
      } else {
        // Handle tag
        let tagToken = {
          type: 'tag',
          value: '',
        };
        let tagType = '';
        let attributes = [];
        let closeStart = false;
        let closeEnd = false;

        char = template[current];
        // tag end
        if(char === '/') {
          char = template[++current];
          closeStart = true;
        }

        // get tag name
        while(current < length && char !== '>' && char !== '/' && char !== '\n' && char !== ' ') {
          tagType += char;
          char = template[++current];
        }

        while(current < length && char !== '>' && (char !== '/' || template[current + 1] !== '>')) {
          if(char === ' ' || char === '\n') {
            // skip
            char = template[++current];
          }else {
            // Find attribute name
            let attrName = '';
            let attrValue = '';

            while(current < length && char !== '=' && char !== '\n' && char !== ' ' && char !== '>' && (char !== '/' || template[current + 1] !== '>')) {
              attrName += char;
              char = template[++current];
            }

            // Find attribute value
            if(char === '=') {
              char = template[++current];

              let quoteType = ' ';
              if(char === '"' || char === '\'' || char === ' ' || char === '\n') {
                quoteType = char;
                char = template[++current];
              }

              while(current < length && char !== '>' && (char !== '/' || template[current + 1] !== '>')) {
                if(char === quoteType) {
                  char = template[++current];
                  break;
                } else {
                  attrValue += char;
                  char = template[++current];
                }
              }
            }

            attrName = attrName.split(':');
            attributes.push({
              name: attrName[0],
              value: attrValue,
              argument: attrName[1],
              data: {}
            });
          }
        }

        if(char === '/') {
          current += 2;
          closeEnd = true;
        }else {
          current += 1;
        }

        tagToken.value = tagType;
        tagToken.attributes = attributes;
        tagToken.closeStart = closeStart;
        tagToken.closeEnd = closeEnd;
        tokens.push(tagToken);
      }
    } else {
      // text
      const textTail = template.substring(current);
      const endOfTextIndex = textTail.search(/<\/?(?:[A-Za-z]+\w*)|<!--/);
      let text;
      if(endOfTextIndex === -1) {
        text = textTail;
        current = length;
      }else {
        text = textTail.substring(0, endOfTextIndex);
        current += endOfTextIndex;
      }

      if(text.trim() !== '') {
        tokens.push({
          type: 'text',
          value: text
        });
      }
    }
  }

  return tokens;
}
