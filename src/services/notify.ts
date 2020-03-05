import { window } from 'vscode';

const notify = (message: string, variant: 'information' | 'error' | 'warning') => {
  switch(variant) {
    case 'information':
      window.showInformationMessage(message);
      break;
    case 'warning':
      window.showWarningMessage(message);
      break;
    case 'error':
      window.showErrorMessage(message);
      break;
  }
};

export default notify;
