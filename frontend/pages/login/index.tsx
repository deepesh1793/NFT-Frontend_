// svgs
import { ReactComponent as CheckIcon } from "@assets/svg/files/edit-check.svg";
//
import { LoginHook } from "./hooks/loginhook";
import { useTranslation } from "react-i18next";
import { ChangeEvent, Fragment } from "react";
import { handleAuthenticated, handleSeedAuthenticated } from "@/redux/CheckAuth";
import { AuthNetworkTypeEnum } from "@/const";
import { AuthNetwork } from "@redux/models/TokenModels";
import { CustomInput } from "@components/Input";

const Login = () => {
  const { t } = useTranslation();
  const { loginOpts, seedOpen, setSeedOpen, seed, setSeed } = LoginHook();

  return (
    <Fragment>
      <div className="flex flex-row w-full h-full bg-PrimaryColorLight dark:bg-PrimaryColor">
        <div className="relative flex flex-col justify-center items-center w-full h-full">
          <div className="flex flex-col justify-center items-center w-full h-full">
            <h2 className="text-[2rem] font-bold text-PrimaryTextColorLight dark:text-PrimaryTextColor">
              Welcome
            </h2>
            <div className="flex flex-col justify-start items-start w-[70%] mt-8">
              <p className="font-light text-PrimaryTextColorLight dark:text-PrimaryTextColor text-left">
                Please click to proceed to login:
              </p>
              {loginOpts.map((opt, k) => {
                return (
                  <div className="flex flex-col justify-start items-start w-full" key={k}>
                    <div
                      className="flex flex-row justify-between items-center w-full mt-4 p-3 rounded-[5%] cursor-pointer bg-SecondaryColorLight dark:bg-SecondaryColor"
                      onClick={async () => {
                        handleLogin(opt);
                      }}
                    >
                      <h3 className="font-medium text-PrimaryTextColorLight dark:text-PrimaryTextColor">
                        {opt.name} <span className="text-md opacity-60">{opt.extra ? `(${t(opt.extra)})` : ""}</span>
                      </h3>
                      {opt.icon}
                    </div>
                    {seedOpen && opt.type === AuthNetworkTypeEnum.Enum.NONE && (
                      <CustomInput
                        sizeInput={"medium"}
                        intent={"secondary"}
                        compOutClass=""
                        value={seed}
                        onChange={onSeedChange}
                        autoFocus
                        sufix={
                          <div className="flex flex-row justify-start items-center gap-2">
                            <CheckIcon
                              onClick={() => {
                                handleSeedAuthenticated(seed);
                              }}
                              className={`w-4 h-4 ${seed.length > 0
                                ? "stroke-BorderSuccessColor"
                                : "stroke-PrimaryTextColorLight dark:stroke-PrimaryTextColor"
                                } opacity-50 cursor-pointer`}
                            />
                            <p className="text-sm text-PrimaryTextColorLight dark:text-PrimaryTextColor">Max 32</p>
                          </div>
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSeedAuthenticated(seed);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="absolute right-8 top-6 bg-none flex flex-row justify-center items-center">

          </div>
        </div>
      </div>
    </Fragment>
  );

  async function handleLogin(opt: AuthNetwork) {
    if (opt.type === AuthNetworkTypeEnum.Values.IC || opt.type === AuthNetworkTypeEnum.Values.NFID) {
      setSeedOpen(false);
      localStorage.setItem("network_type", JSON.stringify({ type: opt.type, network: opt.network, name: opt.name }));
      handleAuthenticated(opt);
    } else if (opt.type === AuthNetworkTypeEnum.Enum.NONE) {
      setSeedOpen((prev) => !prev);
      setSeed("");
    }
  }
  function onSeedChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value.length <= 32) setSeed(e.target.value);
  }
};

export default Login;
