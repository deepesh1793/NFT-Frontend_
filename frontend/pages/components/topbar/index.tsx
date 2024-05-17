// svgs
import { ReactComponent as SunIcon } from "@/assets/svg/files/sun-icon.svg";
import { ReactComponent as RefreshIcon } from "@/assets/svg/files/refresh-ccw.svg";
//
import { Fragment} from "react";
import { ThemeHook } from "@hooks/themeHook";
import { clsx } from "clsx";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { AccountHook } from "@hooks/accountHook";
import { shortAddress } from "@/utils";
import { logout } from "@redux/CheckAuth";
import Modal from "@components/Modal";
import ThemeModal from "./themeModal";
import { useAppDispatch } from "@redux/Store";
import { setLoading } from "@redux/assets/AssetReducer";
import { CustomCopy } from "@components/CopyTooltip";
import { AssetHook } from "@pages/home/hooks/assetHook";

const TopBarComponent = () => {
  const dispatch = useAppDispatch();

  const { themeOpen, setThemeOpen } = ThemeHook();
  const { authClient } = AccountHook();
  const { reloadBallance, assetLoading } = AssetHook();

  return (
    <Fragment>
      <div className="flex flex-row justify-between min-h-[4.5rem] w-full bg-PrimaryColorLight dark:bg-PrimaryColor text-PrimaryTextColorLight dark:text-PrimaryTextColor border-b border-BorderColorFourthLight dark:border-BorderColorFourth">
        <div className="flex flex-row justify-start items-center pl-9 gap-24 text-md">
          <div className="flex flex-row justify-start items-center gap-3">
            <p className="opacity-50">{shortAddress(authClient, 12, 10)}</p>
            <CustomCopy size={"small"} copyText={authClient} />
            <RefreshIcon
              className={`h-4 w-4 cursor-pointer fill-PrimaryTextColorLight dark:fill-PrimaryTextColor ${assetLoading ? "do-spin" : ""
                }`}
              onClick={handleReloadButton}
            />
          </div>
        </div>
        <div className="flex flex-row justify-start items-center pr-9 gap-9">
          <DropdownMenu.Root
            modal={false}
            onOpenChange={() => {
            }}
          >
            <DropdownMenu.Trigger asChild>
              <button className="p-0 outline-none">
                <SunIcon className="fill-SvgColor dark:fill-SvgColor max-w-[2rem] h-auto"></SunIcon>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="text-lg bg-PrimaryColorLight rounded-lg dark:bg-SecondaryColor mr-4 z-[999] text-PrimaryTextColorLight dark:text-PrimaryTextColor shadow-sm shadow-BorderColorTwoLight dark:shadow-BorderColorTwo"
                sideOffset={5}
              >
                <DropdownMenu.Item
                  className={clsx(gearPopItem, "!justify-between", "rounded-b-lg")}
                  onSelect={() => {
                    logout();
                  }}
                >
                  <p className="text-LockColor">Logout</p>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
      <Modal open={themeOpen} top="top-[35%]">
        <ThemeModal setOpen={setThemeOpen} />
      </Modal>
    </Fragment>
  );

  function handleReloadButton() {
    dispatch(setLoading(true));
    reloadBallance();
  }

};
export default TopBarComponent;

// Tailwind CSS constants
const gearPopItem = clsx(
  "flex",
  "flex-row",
  "justify-start",
  "items-center",
  "py-2",
  "px-4",
  "bg-none",
  "w-full",
  "min-w-[13rem]",
  "cursor-pointer",
  "outline-none",
  "hover:bg-PopSelectColorLight",
  "dark:hover:bg-PopSelectColor",
);
