import React, { useState, useEffect } from 'react';
import mime from 'mime/lite';
import Carousel from '../components/Carousel'; // Ensure this is the React version of your Carousel component // Ensure this is the React version of your LocationTypeIcon component
import { isAuthorized } from '../nft'; // Ensure this function is correctly imported
import {
  Button,
  Tile,
  CopyButton,
} from 'carbon-components-react'; // Adjust according to actual package used

interface NFT {
  symbol: string;
  index: number;
  content: { locationType: string; contentType: string; value: string }[];
  icon: string;
  name: string;
  location: string;
  canister: string;
}

interface NFTViewProps {
  nft: NFT;
  current: number;
}

const NFTView: React.FC<NFTViewProps> = ({ nft, current }) => {
  const [currentIdx, setCurrentIdx] = useState(current || 0);
  const [locationTypes, setLocationTypes] = useState<string[]>([]);
  const [locationType, setLocationType] = useState<string | undefined>(undefined);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    setLocationTypes(nft.content.map((elem) => elem.locationType));
    setLocationType(locationTypes[currentIdx]);
  }, [nft, currentIdx, locationTypes]);

  useEffect(() => {
    (async () => {
      const auth = await isAuthorized();
      setAuthorized(auth);
    })();
  }, []);

  const currentElement = nft.content[currentIdx];
  const extension = mime.getExtension(currentElement.contentType);
  const filename = extension ? `${nft.symbol}_${currentIdx}.${extension}` : `${nft.symbol}_${currentIdx}`;

  return (
    <div className="NFT_view">
      <div id="tile">
        <Tile style={{ maxWidth: '350px', margin: 'auto' }}>
          <div className="badge">NFT</div>
          <h2>{nft.symbol} #{nft.index}</h2>
          <div className="media">
            <div style={{ position: 'relative' }} id="media_content">
              <Carousel content={nft.content} current={currentIdx} setCurrent={setCurrentIdx}>
                <a className="button" href={currentElement.value} download={filename}>
                  Download {extension ? extension.toUpperCase() : 'file'}
                </a>
              </Carousel>
            </div>
          </div>
        </Tile>
      </div>
      <div className="nft_info">
        <div className="info_title">Content Type</div>
        <hr />
        <div className="info_detail">{nft.content[0].contentType}</div>
        <div className="info_title">Detail</div>
        <hr />
        <div className="info_detail">
          <img src={nft.icon} alt={`${nft.name} NFT icon`} className="icon" />
          {nft.name}
          {locationType && (
            <a href={nft.location}>
            </a>
          )}
        </div>
        <div className="info_title">Canister ID</div>
        <hr />
        <div className="info_detail">
          {nft.canister}
          <CopyButton text={nft.canister} feedback="Copied to clipboard" style={{ left: '5px' }} />
        </div>
        <div id="action_calls">
          {authorized && (
            <Button
              href={`/${nft.canister}/${nft.index}/transfer`}
              style={{
                width: '100%',
                backgroundColor: 'rgb(114 48 145)',
                justifyContent: 'center',
                maxWidth: 'none',
                fontSize: '16px',
                color: 'white',
                padding: '0',
              }}
            >
              TRANSFER
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTView;
