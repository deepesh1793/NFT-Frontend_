// svgs
import { ReactComponent as CloseIcon } from "@assets/svg/files/close.svg";
import UpAmountIcon from "@assets/svg/files/up-amount-icon.svg";
import DownAmountIcon from "@assets/svg/files/down-amount-icon.svg";
import { ReactComponent as DownBlueArrow } from "@assets/svg/files/down-blue-arrow.svg";
//
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { GeneralHook } from "../hooks/generalHook";
import { getAddress, getAssetSymbol, getICRC1Acc, hexToUint8Array, shortAddress, toFullDecimal } from "@/utils";
import { AssetSymbolEnum, TransactionTypeEnum } from "@/const";
import { Principal } from "@dfinity/principal";
import { AccountHook } from "@pages/hooks/accountHook";
import { IcrcAccount } from "@dfinity/ledger";
import { AssetHook } from "../hooks/assetHook";
import { CustomCopy } from "@components/CopyTooltip";

interface DrawerTransactionProps {
  setDrawerOpen(value: boolean): void;
}

const DrawerTransaction = ({ setDrawerOpen }: DrawerTransactionProps) => {
  const { t } = useTranslation();

  const { authClient } = AccountHook();
  const { assets } = AssetHook();
  const { ICPSubaccounts, selectedTransaction, selectedAccount, changeSelectedTransaction } = GeneralHook();

  const isTo = getAddress(
    selectedTransaction?.type || TransactionTypeEnum.Enum.NONE,
    selectedTransaction?.from || "",
    selectedTransaction?.fromSub || "",
    selectedAccount?.address || "",
    selectedAccount?.sub_account_id || "",
  );

  const assetSymbol = getAssetSymbol(selectedTransaction?.symbol || "", assets);

  const hasSub = (to: boolean) => {
    return (
      selectedTransaction?.symbol !== AssetSymbolEnum.Enum.ICP ||
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  };

  const isICPWithSub = (to: boolean) => {
    return (
      selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP &&
      ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
    );
  };

  const getIdentifier = (to: boolean) => {
    return selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP
      ? to
        ? selectedTransaction?.to || ""
        : selectedTransaction?.from || ""
      : Principal.fromHex(
          to ? selectedTransaction?.identityTo || "" : selectedTransaction?.identityFrom || "",
        ).toString();
  };

  const getPrincipal = (to: boolean) => {
    return isICPWithSub(to) ? authClient : to ? selectedTransaction?.to || "" : selectedTransaction?.from || "";
  };

  const getSub = (to: boolean) => {
    return isICPWithSub(to)
      ? ICPSubaccounts.find((sub) => sub.legacy === (to ? selectedTransaction?.to : selectedTransaction?.from))
          ?.sub_account_id || "0x0"
      : to
      ? selectedTransaction?.toSub || "0x0"
      : selectedTransaction?.fromSub || "0x0";
  };

  const getICRCAccount = (to: boolean) => {
    try {
      return getICRC1Acc({
        owner: Principal.fromText(getPrincipal(to)),
        subaccount: hexToUint8Array(getSub(to)),
      } as IcrcAccount);
    } catch {
      return getPrincipal(to);
    }
  };

  return (
    <Fragment>
      <div className="flex flex-col justify-start items-center bg-PrimaryColorLight dark:bg-SideColor w-full h-full pt-8 text-md text-PrimaryTextColorLight/70 dark:text-PrimaryTextColor/70">
        {/* TITLE SECTION */}
        <div className="flex flex-row justify-between items-center w-full mb-4 px-6">
          <div className="flex flex-row justify-start items-center gap-7">
            <p className="font-semibold text-lg text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              {selectedTransaction?.type === TransactionTypeEnum.Enum.RECEIVE
                ? t("transaction.received")
                : t("transaction.sent")}
            </p>
            <img src={isTo ? UpAmountIcon : DownAmountIcon} alt="" />
          </div>
          <CloseIcon
            className="cursor-pointer stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
            onClick={() => {
              setDrawerOpen(false);
              changeSelectedTransaction(undefined);
            }}
          />
        </div>

        {/* FROM SECTION */}
        <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-FromBoxColorLight dark:bg-FromBoxColor">
          <div className="flex flex-row justify-between items-center w-full">
            <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor font-medium">{t("from")}</p>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("acc.principal")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(false) ? shortAddress(getPrincipal(false), 12, 12) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={getPrincipal(false)}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("acc.subacc")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(false) ? getSub(false) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={getSub(false).substring(2)}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("icrc.acc")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(false) ? shortAddress(getICRCAccount(false), 12, 12) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={hasSub(false) ? getICRCAccount(false) : ""}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
            <div className="flex flex-row justify-between items-center w-full font-normal">
              <p>{`${t("acc.identifier")}`}</p>
              <div className="flex flex-row justify-start items-center gap-2">
                <p>{`${shortAddress(getIdentifier(false), 12, 12)}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getIdentifier(false)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
          )}

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{t("transaction.amount")}</p>
            <p className="">{`${toFullDecimal(
              Number(selectedTransaction?.amount) / Math.pow(10, selectedAccount?.decimal || 8) +
                Number(selectedAccount?.transaction_fee),
              selectedAccount?.decimal || 8,
            )} ${assetSymbol}`}</p>
          </div>
        </div>

        {/* ARROW SECTION */}
        <DownBlueArrow className="my-3"></DownBlueArrow>

        {/* TO SECTION */}
        <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 p-4 bg-FromBoxColorLight dark:bg-FromBoxColor rounded-md">
          <div className="flex flex-row justify-between items-center w-full">
            <p className="text-PrimaryTextColorLight dark:text-PrimaryTextColor font-medium">{t("to")}</p>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("acc.principal")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(true) ? shortAddress(getPrincipal(true), 12, 12) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={getPrincipal(true)}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("acc.subacc")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(true) ? getSub(true) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={getSub(true).substring(2)}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{`${t("icrc.acc")}`}</p>
            <div className="flex flex-row justify-start items-center gap-2">
              <p>{`${hasSub(true) ? shortAddress(getICRCAccount(true), 12, 12) : t("unknown")}`}</p>
              <CustomCopy
                size={"small"}
                copyText={getICRCAccount(true)}
                copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                isTransaction={true}
              />
            </div>
          </div>

          {selectedTransaction?.symbol === AssetSymbolEnum.Enum.ICP && (
            <div className="flex flex-row justify-between items-center w-full font-normal">
              <p>{`${t("acc.identifier")}`}</p>
              <div className="flex flex-row justify-start items-center gap-2">
                <p>{`${shortAddress(getIdentifier(true), 12, 12)}`}</p>
                <CustomCopy
                  size={"small"}
                  copyText={getIdentifier(true)}
                  copyStroke="cursor-pointer max-w-[0.7rem] h-auto"
                  isTransaction={true}
                />
              </div>
            </div>
          )}

          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p>{t("transaction.amount")}</p>
            <p className="">{`${toFullDecimal(
              Number(selectedTransaction?.amount) / Math.pow(10, selectedAccount?.decimal || 8),
              selectedAccount?.decimal || 8,
            )} ${assetSymbol}`}</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4 w-[calc(100%-3rem)] mx-6 mt-5 p-4 bg-FromBoxColorLight dark:bg-FromBoxColor rounded-md">
          <div className="flex flex-row justify-between items-center w-full font-normal">
            <p className="font-bold">{t("fee")}</p>
            <p className="font-bold">{`${toFullDecimal(
              Number(selectedAccount?.transaction_fee),
              selectedAccount?.decimal || 8,
            )} ${assetSymbol}`}</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default DrawerTransaction;