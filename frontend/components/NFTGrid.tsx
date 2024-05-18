import React from 'react';
import NFTBox from './NFTBox';
import { useHistory } from 'react-router-dom';

interface NFT {
  canister: string;
  index: number;
  preview?: {
    value: string;
    contentType: string;
  };
  symbol: string;
  icon: string;
  name: string;
}

interface Props {
  nfts: NFT[];
}

const CollectionView: React.FC<Props> = ({ nfts }) => {
  const history = useHistory();

  const navigateToRegister = () => {
    history.push('/register');
  };

  return (
    <div>
      <div id="action">
        <button className="button1" onClick={navigateToRegister}>
          + REGISTER
        </button>
        <p>Please add NFTs to your wallet by registering if you haven't already done so.</p>
      </div>
      <div className="collection">
        {!nfts.length ? (
          <div className="section" id="no_collection">
            There is currently no collection.
          </div>
        ) : (
          <div>
            <div className="section">Collection</div>
            <p>
              <div className="container">
                {nfts.map((nft) => (
                  <div key={nft.canister + nft.index} className="paper-container box">
                    <NFTBox nft={nft} />
                  </div>
                ))}
              </div>
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          list-style: none;
          display: flex;
          flex-flow: row wrap;
        }
        .box {
          padding: 1em;
        }
        .collection {
          width: inherit;
          padding-top: 10px;
          text-align: center;
        }
        .section {
          font-family: 'Roboto Mono', monospace;
          font-family: 'Noto Sans', sans-serif;
          font-weight: 700;
          font-size: 26px;
          padding-bottom: 1em;
        }
        #no_collection {
          font-size: 18px;
        }
        #action {
          padding-bottom: 1em;
          display: flex;
          align-items: center;
        }
        @media (max-width: 375px) {
          #action {
            flex-direction: column;
          }
          p {
            text-align: center;
          }
        }
        @media (max-width: 744px) {
          .button1 {
            margin-right: 1em;
            min-width: 100px;
          }
          p {
            font-size: 12px;
          }
        }
        @media (min-width: 651px) {
          p {
            font-size: 15px;
            display: inline;
          }
          .button1 {
            margin-right: 3em;
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default CollectionView;
