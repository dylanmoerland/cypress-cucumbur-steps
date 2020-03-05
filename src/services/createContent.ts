type Item = {
  label: string;
  type: string;
  parameters?: string[];
};

const capitalize = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const getBlock = (item: Item, last: boolean) => {
  let string = '';

  string += `${capitalize(item.type)}(\'${item.label}\', (`;

  if (item.parameters) {
    for (let i = 0; i < item.parameters.length; i++) {
      string += `${item.parameters[i]}: string${i < item.parameters.length - 1 ? ', ' : ''}`;
    }
  }

  string += `) => {\n`;
  string += `  // TODO: implement step\n`;
  string += `});${last ? '\n' : '\n\n'}`;

  return string;
};

export default (items: Item[]) => {
  return items.reduce((accumulator: string, currentValue: Item, currentIndex: number) => {
    accumulator += getBlock(currentValue, currentIndex >= items.length - 1);

    return accumulator;
  }, 'import { Given, When, Then } from \'cypress-cucumber-preprocessor/steps\';\n\n');
};
