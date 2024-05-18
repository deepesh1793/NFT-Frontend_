import React, { useEffect, useState } from 'react';
import NFTGrid from '../components/NFTGrid';
import { fetchAllOwnedNftsForCollection, fetchCollectionInfo } from '../nft';

interface Collection {
  icon: string;
  name: string;
  symbol: string;
}

interface NFT {
  // Define the NFT properties based on your data structure
}

interface CollectionViewProps {
  canister: string;
}

const CollectionView: React.FC<CollectionViewProps> = ({ canister }) => {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loadingCollection, setLoadingCollection] = useState(true);
  const [loadingNfts, setLoadingNfts] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      const collectionData = await fetchCollectionInfo(canister);
      setCollection(collectionData);
      setLoadingCollection(false);
    };

    const fetchNfts = async () => {
      const nftsData = await fetchAllOwnedNftsForCollection(canister);
      setNfts(nftsData);
      setLoadingNfts(false);
    };

    fetchCollection();
    fetchNfts();
  }, [canister]);

  if (loadingCollection) {
    return <div>Loading collection...</div>;
  }

  return (
    <div className="collectionView">
      {collection && (
        <>
          <h2>
            <img src={collection.icon} alt={`${collection.name} icon`} className="icon" />
            <p text={canister}>
              {collection.name} ({collection.symbol})
            </p>
          </h2>
          {loadingNfts ? (
            <div>Loading NFTs...</div>
          ) : (
            <NFTGrid nfts={nfts} />
          )}
        </>
      )}
    </div>
  );
};

export default CollectionView;
