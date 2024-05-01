import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';

import { showError } from './utils/utils';
import { rawFileAtom, messagesAtom } from './stores/global';
import Dropzone from './components/Dropzone/Dropzone';
import MessageViewer from './components/MessageViewer/MessageViewer';
import Sidebar from './components/Sidebar/Sidebar';
import * as S from './style';

import latestChat from './assets/whatsapp-chat-with-shahd.zip';

function App() {
  const messages = useAtomValue(messagesAtom);
  const setRawFile = useSetAtom(rawFileAtom);

  const processFile = (file: File) => {
    if (!file) return;

    const reader = new FileReader();

    reader.addEventListener('loadend', e => {
      if (e.target) {
        setRawFile(e.target.result);
      }
    });

    if (/^application\/(?:x-)?zip(?:-compressed)?$/.test(file.type)) {
      reader.readAsArrayBuffer(file);
    } else if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      showError(`File type ${file.type} not supported`);
    }
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) =>
      document.documentElement.classList.toggle('ctrl-down', e.ctrlKey);

    document.addEventListener('keydown', keyHandler);
    document.addEventListener('keyup', keyHandler);

    return () => {
      document.removeEventListener('keydown', keyHandler);
      document.removeEventListener('keyup', keyHandler);
    };
  }, []);

  return (
    <>
      <S.GlobalStyles />
      <S.Container>
        <S.Header>
          <Dropzone onFileUpload={processFile} id="dropzone" />
          <span>OR</span>
          <a href={latestChat} download>
            Download latest chat backup
          </a>
        </S.Header>
        <MessageViewer />
        {messages.length > 0 && <Sidebar />}
      </S.Container>
    </>
  );
}

export default App;
