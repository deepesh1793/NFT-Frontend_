import { defaultTokens } from "@/const";
import { useAppDispatch, useAppSelector } from "@redux/Store";
import { updateAllBalances } from "@redux/assets/AssetActions";
import { setAcordeonAssetIdx, setLoading, setSelectedAccount, setSelectedAsset } from "@redux/assets/AssetReducer";
import { Asset, SubAccount } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import { useEffect, useState } from "react";

export const AssetHook = () => {
  const dispatch = useAppDispatch();
  const { tokens, assets, assetLoading, selectedAsset, selectedAccount, acordeonIdx, tokensMarket } = useAppSelector(
    (state) => state.asset,
  );
  const { userAgent } = useAppSelector((state) => state.auth);

  const [searchKey, setSearchKey] = useState("");
  const setAcordeonIdx = (assetIdx: string) => dispatch(setAcordeonAssetIdx(assetIdx));
  const [assetInfo, setAssetInfo] = useState<Asset | undefined>();

  const [editNameId, setEditNameId] = useState("");
  const [name, setName] = useState("");
  const [newSub, setNewSub] = useState<SubAccount | undefined>();
  const [hexChecked, setHexChecked] = useState<boolean>(false);

  const reloadBallance = (tkns?: Token[]) => {
    dispatch(setLoading(true));
    updateAllBalances(true, userAgent, tkns ? tkns : tokens.length > 0 ? tokens : defaultTokens);
  };

  const getTotalAmountInCurrency = () => {
    let amount = 0;
    assets.map((tk) => {
      const market = tokensMarket.find((tm) => tm.symbol === tk.tokenSymbol);
      let assetTotal = 0;
      tk.subAccounts.map((sa) => {
        assetTotal = assetTotal + Number(sa.amount);
      });
      amount = amount + (market ? assetTotal * market.price : 0);
    });
    return Math.round(amount * 100) / 100;
  };

  useEffect(() => {
    const auxAssets = assets.filter((asset) => {
      let includeInSub = false;
      asset.subAccounts.map((sa) => {
        if (sa.name.toLowerCase().includes(searchKey.toLowerCase())) includeInSub = true;
      });

      return asset.name.toLowerCase().includes(searchKey.toLowerCase()) || includeInSub || searchKey === "";
    });

    if (auxAssets.length > 0)
      if (selectedAsset && !auxAssets.includes(selectedAsset)) {
        setAcordeonIdx(`asset-${auxAssets[0].sort_index}`);
        dispatch(setSelectedAsset(auxAssets[0]));
        auxAssets[0].subAccounts.length > 0 && dispatch(setSelectedAccount(auxAssets[0].subAccounts[0]));
      }
  }, [searchKey]);

  return {
    tokens,
    assets,
    assetLoading,
    selectedAsset,
    selectedAccount,

    searchKey,
    setSearchKey,
    acordeonIdx,
    setAcordeonIdx,
    assetInfo,
    setAssetInfo,
    tokensMarket,
    editNameId,
    setEditNameId,
    name,
    setName,
    newSub,
    setNewSub,
    hexChecked,
    setHexChecked,

    reloadBallance,
    getTotalAmountInCurrency,
  };
};