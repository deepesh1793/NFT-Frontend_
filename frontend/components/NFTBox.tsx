import React from 'react';
import ContentBox from './ContentBox';

interface NFT {
    canister: string;
    index: number;
    preview: {
        value: string;
        contentType: string;
    };
    symbol: string;
    name: string;
    icon: string;
}

interface Props {
    nft: NFT;
}

const NFTCard: React.FC<Props> = ({ nft }) => {
    return (
        <div>
            <a className="ui" href={`/${nft.canister}/${nft.index}`}>
                <div className="preview">
                    <ContentBox src={nft.preview?.value} contentType={nft.preview?.contentType} />
                </div>
            </a>
            <div className="card">
                <a className="ui" href={`/${nft.canister}/${nft.index}`}>
                    <p>{nft.symbol} #{nft.index}</p>
                </a>
                <div>
                    <a className="ui" href={`/${nft.canister}`}>
                        <img className="icon" src={nft.icon} alt="icon" />{nft.name}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
