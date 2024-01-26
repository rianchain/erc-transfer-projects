import { Fragment, useEffect, useRef, useState } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ethers, providers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import { WebSocketProvider } from "@ethersproject/providers";
import { Bundler } from "@biconomy/bundler";
import { PaymasterMode } from "@biconomy/paymaster";
import { BiconomySmartAccount, BiconomySmartAccountConfig } from "@biconomy/account";
import { bundler, paymaster } from "@/constants";
import Transfer from "./Transfer";

export default function Wallet() {
    const sdkRef = useRef<SocialLogin | null>(null);
    const [smartAccount, setSmartAccount] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [interval, enableInterval] = useState<boolean>(false);

    async function login() {
        if (!sdkRef.current) {
            const socialLoginSDK = new SocialLogin();
            await socialLoginSDK.init({
                chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
                network: "testnet",
            });
            sdkRef.current = socialLoginSDK;
        }
    
        if (!sdkRef.current.provider) {
            sdkRef.current.showWallet();
            enableInterval(true);
        } else {
            console.log("hello");

        }
    
    }


    useEffect(() => {
        let configureLogin: NodeJS.Timeout | undefined;
        if (interval) {
            configureLogin = setInterval(() => {
                if (!!sdkRef.current?.provider) {
                    clearInterval(configureLogin);
                }
            }, 1000);
        }
    }, [interval]);

    async function logOut() {

        await sdkRef.current?.logout();

        sdkRef.current?.hideWallet();

        setSmartAccount(undefined);
        enableInterval(false);
    }

    return (
        <Fragment>
            {smartAccount && (
                <button
                onClick={logOut}
                className="absolute right-0 m-3 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium transition-all hover:from-green-500 hover:to-blue-600 "
              >
                Logout
              </button>
            )}

            <div className="m-auto flex h-screen flex-col items-center justify-center gap-10 bg-gray-950">
            <h1 className=" text-4xl text-gray-50 font-bold tracking-tight lg:text-5xl">
            Send ERC20 using ERC20
            </h1>

            {!smartAccount && !loading && (
          <button
            onClick={login}
            className="mt-10 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 font-medium  transition-colors hover:from-green-500 hover:to-blue-600"
          >
            Login
          </button>
        )}

        {/* Loading state */}
        {loading && <p>Loading account details...</p>}

        {smartAccount && (
          <Fragment>{ <Transfer smartAccount={smartAccount} /> }</Fragment>
        )}

            </div>

        </Fragment>
    );

}

