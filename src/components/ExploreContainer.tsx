import React, { useEffect, useState } from 'react';
import './ExploreContainer.css';
import Pubnub from "pubnub";

const channelId = 'my_channel';
const pubnubConfig = {
  publishKey: 'pub-c-10921688-79ed-4759-b6e2-4388eed57ffe',
  subscribeKey: 'sub-c-bc7c86ac-8ff9-11ea-9dd4-caf89c7998a9',
};

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [fileMessage, setFileMessage] = useState("Choose a file to upload to PubNub");
  const [fileId, setFileId] = useState("");
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File>();

  const uploadFile = async (file: File) => {
    const pubnub = new Pubnub(pubnubConfig);

    setFileMessage("uploading ...");
    setFileId("");
    setFileName("");
    setFile(undefined);
    
    const result = await pubnub.sendFile({
      channel: channelId,
      file: file,
    });

    setFileId(result.id);
    setFileName(result.name);
  };

  const downloadFile = async () => {
    const pubnub = new Pubnub(pubnubConfig);

    const imgdata = await pubnub.downloadFile({
      channel: 'my_channel',
      id: fileId,
      name: fileName
    });

    const file = await imgdata.toFile();

    setFile(file);
  };

  useEffect(() => {
    const input: HTMLInputElement | null = document.querySelector('input[type="file"]');

    if (input) {
      input.addEventListener('change', async () => {
        if (input.files) {
            const file = input.files[0];
            uploadFile(file);
        }
      });
    }

  }, []);

  useEffect(() => {
    const imghere: HTMLImageElement | null = document.querySelector('#imghere');

    if (imghere) {
      const reader = new FileReader();

      reader.addEventListener("load", function () {
        // convert image file to base64 string
        if (typeof reader.result === "string") {
          console.log('yaay')
          imghere.src = reader.result;
        }
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  }, [ file ]);

  return (
    <div className="container">
      <div>
        <input type="file" />
      </div>
        { fileId ? 
          <div>
            <button onClick={downloadFile}>Download File {fileName}</button>
            <div>
              { file ? 
                <img style={{width: '25%'}} id="imghere" src="#" />
              :
                <div> Click above to download the file!  </div>
              }
            </div>
          </div>
        :
          <div> {fileMessage} </div>
        }
    </div>
  );
};

export default ExploreContainer;
