import { window } from 'vscode';
import notify from './services/notify';
import createItems from './services/createItems';
import createContent from './services/createContent';
import createFile from './services/createFile';

class CommandConsole {
  public async generate() {
    try {
      const fileContent = window.activeTextEditor?.document.getText();
      const pathArray = window.activeTextEditor?.document.fileName.split('/');
      const fileName = pathArray ? pathArray.pop() || '' : '';
      const path = pathArray ? pathArray?.join('/') + '/' + fileName.split('.')[0] : undefined;

      if (!path) {
        throw new Error('Path unresolved');
      }

      if (fileName && fileName.split('.').slice(-1)[0] === 'feature') {
        const items = createItems((fileContent || '').split('\n'));
        const writeableContent = createContent(items);
        
        createFile(fileName.split('.')[0], writeableContent, path, 'ts');
      } else {
        throw Error('No feaure file selected');
      }
    } catch (error) {
      notify(error.message, 'error');
    }
  }
}

export default CommandConsole;
