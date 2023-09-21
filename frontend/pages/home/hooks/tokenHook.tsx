import {
  AddingAssets,
  AddingAssetsEnum,
  ICRC1systemAssets,
  TokenNetwork,
  TokenNetworkEnum,
  AccountDefaultEnum,
} from "@/const";
import { useAppSelector } from "@redux/Store";
import { Asset } from "@redux/models/AccountModels";
import { Token } from "@redux/models/TokenModels";
import { useEffect, useState } from "react";

export const TokenHook = (asset: Asset | undefined) => {
  const { assetLoading } = useAppSelector((state) => state.asset);
  const [manual, setManual] = useState(false);
  const [network, setNetwork] = useState<TokenNetwork>(TokenNetworkEnum.enum["ICRC-1"]);
  const [newAssetList, setNewAssetList] = useState<Array<Token>>(ICRC1systemAssets);
  const [networkTOpen, setNetworkTOpen] = useState(false);
  const [assetTOpen, setAssetTOpen] = useState(false);
  const [errToken, setErrToken] = useState("");
  const [newToken, setNewToken] = useState<Token>({
    address: "",
    symbol: "",
    name: "",
    decimal: "",
    subAccounts: [{ numb: "0x0", name: AccountDefaultEnum.Values.Default }],
    index: "",
    id_number: 999,
  });
  const [validToken, setValidToken] = useState(false);
  const [addAssetOpen, setAddAssetOpen] = useState<boolean>(false);
  const [modal, showModal] = useState(false);
  const [addStatus, setAddStatus] = useState<AddingAssets>(AddingAssetsEnum.Enum.none);

  useEffect(() => {
    if (asset) {
      setNewToken({
        address: asset.address,
        symbol: asset.symbol,
        name: asset.name,
        decimal: asset.decimal,
        subAccounts: asset.subAccounts.map((ast) => {
          return { name: ast.name, numb: ast.sub_account_id };
        }),
        index: asset.index,
        id_number: asset.sort_index,
      });
      setErrToken("");
      setValidToken(false);
    }
  }, [asset]);

  useEffect(() => {
    if (!assetLoading) setAddStatus(AddingAssetsEnum.Enum.done);
  }, [assetLoading]);

  return {
    manual,
    setManual,
    addAssetOpen,
    setAddAssetOpen,
    validToken,
    setValidToken,
    errToken,
    setErrToken,
    modal,
    showModal,
    addStatus,
    setAddStatus,
    networkTOpen,
    setNetworkTOpen,
    assetTOpen,
    setAssetTOpen,
    network,
    setNetwork,
    newAssetList,
    newToken,
    setNewToken,
    setNewAssetList,
  };
};