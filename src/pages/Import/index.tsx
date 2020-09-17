import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

interface ImportResponse {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category_id: string;
  category: {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
  };
  id: string;
  created_at: string;
  updated_at: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    try {

      const promises = uploadedFiles.map<Promise<ImportResponse[]>>(fileProps => {
        const data = new FormData();
        data.append('file', fileProps.file);
        return api.post('/transactions/import', data);
      });

      const result = await Promise.all(promises);

      history.push('/');
    } catch (err) {
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {

    setUploadedFiles(files.map((file):FileProps => {
      return {
        file: file,
        name: file.name,
        readableSize: filesize(file.size)
      }
    }));
    
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />

          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
