import * as fs from 'fs';
import { window } from 'vscode';
import notify from './notify';

enum Options {
  YES = 'Yes',
  NO = 'No'
};

const write = (title: string, content: string, path: string, extension: string) => {
  fs.mkdir(path, () => {
    fs.writeFile(`${path}/${title}.${extension}`, content, () => {
      notify('Written to file', 'information');
    });
  });
};

export default async (title: string, content: string, path: string, extension: string) => {
  if (fs.existsSync(`${path}/${title}.${extension}`)) {
    const selected = await window.showQuickPick([Options.YES, Options.NO], {
      placeHolder: 'This file already exists, are you sure you want to override it?',
    });

    if (selected === Options.YES) {
      write(title, content, path, extension);
    } else {
      notify('File not written', 'error');
    }
  } else {
    write(title, content, path, extension);
  }
};
