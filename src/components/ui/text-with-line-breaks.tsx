import { Fragment } from 'react';

/**
 * Component to render line breaks in any content string, ignoring the last line break if it's unnecessary.
 */
const TextWithLineBreaks = ({ text }: { text: string | undefined }) => {
  if (!text) return null;

  // Удаляем ненужный символ `\n` в конце строки
  const cleanedText = text.trimEnd();

  return cleanedText.split('\n').map((line, index) => (
    <Fragment key={index}>
      {line}
      {index < cleanedText.split('\n').length - 1 && <br />}
    </Fragment>
  ));
};

export default TextWithLineBreaks;
