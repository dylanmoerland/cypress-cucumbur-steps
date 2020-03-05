const LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
const TYPES = ['Given', 'When', 'Then', 'And', 'But'];

type Item = {
  label: string;
  type: string
  parameters?: string[];
};

const pipe = (...fns: any) => (x: any) => fns.reduce((v: any, f: any) => f(v), x);

const withType = (line: string) => {
  const type = TYPES.find((type: string) => {
    return line.trim().toLowerCase().indexOf(type.toLowerCase()) === 0;
  });

  if (type) {
    return {
      label: line.trim(),
      type,
    };
  }

  return null;
};

const getItems = (lines: string[]) => {
  return lines.reduce((accumulator: Item[], currentValue: string) => {
    const item = withType(currentValue);

    if (item) {
      accumulator.push(item);
    }

    return accumulator;
  }, []);
};

const cleanParameters = (lines: string[]) => {
  return lines.map((item) => {
    while (new RegExp('"(.*?)"').test(item)) {
      item = item.replace(new RegExp('"(.*?)"'), `{string}`);
    }
    return item;
  });
};

const resolveTypes = (items: Item[]) => {
  return items.map((item, index) => {
    if (item.type !== 'And' && item.type !== 'But') {
      item.label = item.label.substring(item.type.length + 1);
    } else {
      item.type = items[index - 1].type;
      item.label = item.label.substring(4);
    }
    return item;
  });
};

const orderByType = (items: Item[]) => {
  return items.sort((a, b) => {
    return TYPES.indexOf(a.type) - TYPES.indexOf(b.type);
  });
};

const withParameters = (items: Item[]) => {
  return items.map((item) => {
    const parameters = item.label.match(/{\w*}/g) || [];

    return {
      ...item,
      parameters: parameters.map((_, index) => LETTERS[index]),
    };
  });
};

const withoutDuplicates = (items: Item[]) => {
  return items.reduce((accumulator: Item[], currentValue: Item) => {
    if (!accumulator.find((item) => item.label === currentValue.label && item.type === currentValue.type)) {
      return [...accumulator, currentValue];
    }

    return accumulator;
  }, []);
};

export default (lines: string[]): Item[] => {
  return pipe(
    cleanParameters,
    getItems,
    resolveTypes,
    withoutDuplicates,
    orderByType,
    withParameters,
  )(lines);
};
