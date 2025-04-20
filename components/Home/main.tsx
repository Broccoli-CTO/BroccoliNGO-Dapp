"use client";

import { Suspense, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import Image from "next/image";
import Link from "next/link.js";
import { SpreadGrid } from "./grid";
import "./style.scss";
import React from "react";
import Fox from "./fox";
import DinateDialog from "./donate";
import RescueDialog from "@/components/Rescue";
import RescueSuccessfulDialog from "./rescue-successful";
import { useSearchParams, useRouter } from "next/navigation";
import { isBeta, mainChain } from "@/shared/constant";
import { BSC_RPC_URL } from "@/shared/constant";
import { Trading } from "./trading";
import { useI18n } from "../ui/I18nProvider";
import Header from "../Header";
// import { useDisclosure } from "@heroui/react";

const TOTAL_COUNT = 76 + 65 + 500 + 400;

function HomeMain() {
  const router = useRouter();
  const mode = useSearchParams().get("mode");
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const { trans } = useI18n()

  // const { isOpen, onOpen, onClose } = useDisclosure();
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const [showDonateDialog, changeDonateDialog] = useState<boolean>(false);
  const [shouldAutoOpen, setAutoOpenStatus] = useState<boolean>(false);
  const [showRescueSuccessfulDialog, setShowRescueSuccessfulDialog] =
    useState<boolean>(false);

  const dogs = Array.from({ length: 21 }, (_, i) => i + 1).map((i) => {
    return `/img/${i}.jpg`;
  });

  useEffect(() => {
    if (!isConnected || !connector) return;
    if (isBeta) return
    if (connector?.name === "MetaMask") {
      connector?.getProvider().then((provider: any) => {
        provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: mainChain.id.toString(16), // bsc
              chainName: `48club`,
              rpcUrls: [BSC_RPC_URL], // Broccoli 私有 Mempool RPC
              blockExplorerUrls: ["https://bscscan.com"],
              nativeCurrency: mainChain.nativeCurrency,
            },
          ],
        });
      });
    }
  }, [isConnected, connector]);

  useEffect(() => {
    if (isConnected && shouldAutoOpen) {
      changeDonateDialog(true);
      setAutoOpenStatus(false);
    }
  }, [isConnected, shouldAutoOpen]);

  useEffect(() => {
    [...document.querySelectorAll(".grid")].forEach(
      (grid) => new SpreadGrid(grid)
    );
  }, []);

  useEffect(() => {
    if (mode === "rescue") {
      onOpen();
      router.replace("/", { scroll: false });
    }
  }, [mode]);

  return (
    <>
      <div className="demo-fox">
        <div className="container-2">
          <header className="codrops-header">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              style={{ display: "none" }}
            >
              <defs>
                <filter id="squiggly-0">
                  <feTurbulence
                    id="turbulence"
                    baseFrequency="0.02"
                    numOctaves="3"
                    result="noise"
                    seed="0"
                  />
                  <feDisplacementMap
                    id="displacement"
                    in="SourceGraphic"
                    in2="noise"
                    scale="2"
                  />
                </filter>
                <filter id="squiggly-1">
                  <feTurbulence
                    id="turbulence"
                    baseFrequency="0.02"
                    numOctaves="3"
                    result="noise"
                    seed="1"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggly-2">
                  <feTurbulence
                    id="turbulence"
                    baseFrequency="0.02"
                    numOctaves="3"
                    result="noise"
                    seed="2"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
                </filter>
                <filter id="squiggly-3">
                  <feTurbulence
                    id="turbulence"
                    baseFrequency="0.02"
                    numOctaves="3"
                    result="noise"
                    seed="3"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
                </filter>
                <filter id="squiggly-4">
                  <feTurbulence
                    id="turbulence"
                    baseFrequency="0.02"
                    numOctaves="3"
                    result="noise"
                    seed="4"
                  />
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
                </filter>
              </defs>
            </svg>

            <h1>Broccoli</h1>
            <h2>{trans(_TL_('Is Helping Its Stray Animal Friends'))}</h2>
            {/* <h2>First Broccoli on BSC, $Broccoli token is managed and owned by its community, with love.</h2> */}
            {/* <Image
            className="header-h1"
            src="./h1.svg"
            width={400}
            height={60}
            alt="broccoli"
          ></Image>
          <Image
            className="header-h2"
            src="./h2.svg"
            width={600}
            height={42}
            alt="friends"
          ></Image> */}
            <div className="control-panel">
              {isConnected ? (
                <button
                  onClick={() => changeDonateDialog(true)}
                  className="donate-btn"
                >
                  {/* <Image
                  src="./donate.svg"
                  width={108}
                  height={34}
                  alt="donate"
                ></Image> */}
                  <span>{trans(_TL_('Donate Now'))}</span>
                </button>
              ) : (
                <div onClick={() => setAutoOpenStatus(true)}>
                  {
                    <ConnectButton.Custom>
                      {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                      }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready =
                          mounted && authenticationStatus !== "loading";
                        const connected =
                          ready &&
                          account &&
                          chain &&
                          (!authenticationStatus ||
                            authenticationStatus === "authenticated");

                        return (
                          <div>
                            {(() => {
                              if (!connected) {
                                return (
                                  <button
                                    onClick={openConnectModal}
                                    type="button"
                                    className="donate-btn"
                                  >
                                    {/* <Image
                                    src="./donate.svg"
                                    width={108}
                                    height={34}
                                    alt="donate"
                                  ></Image> */}
                                    <span>{trans(_TL_('Donate Now'))}</span>
                                  </button>
                                );
                              }

                              if (chain.unsupported) {
                                return (
                                  <button
                                    onClick={openChainModal}
                                    type="button"
                                    className="donate-btn"
                                  >
                                    <span>{trans(_TL_('Wrong network'))}</span>
                                  </button>
                                );
                              }

                              return (
                                <div>
                                  <button
                                    onClick={openAccountModal}
                                    type="button"
                                    className="donate-btn"
                                  >
                                    {/* <Image
                                    src="./donate.svg"
                                    width={108}
                                    height={34}
                                    alt="donate"
                                  ></Image> */}
                                    <span>{trans(_TL_('Donate Now'))}</span>
                                  </button>
                                </div>
                              );
                            })()}
                          </div>
                        );
                      }}
                    </ConnectButton.Custom>
                  }
                </div>
              )}
              <button type="button" className="request-btn" onClick={onOpen}>
                <span>{trans(_TL_("Rescue Request"))}</span>
                {/* <Image
                src="./request.svg"
                width={130}
                height={30}
                alt="reqquest"
              ></Image> */}
                {/* <Image
                  className="soon"
                  src="./soon.svg"
                  width={77}
                  height={20}
                  alt="soon"
                ></Image> */}
              </button>
            </div>
            <div className="treasury"><p>{trans(_TL_('Treasury address'))}(bsc):</p><a href="https://bscscan.com/address/0x0022dc116bed13ddb7635298723b45a582d50c2e#asset-multichain" target="_blank">0x0022dc116bed13ddb7635298723b45a582d50c2e</a></div>
          </header>
          <div className="ngo-dog">
            <Image src="/ngo-dog.png" width={400} height={400} alt="dog" />
          </div>
          <div className="content content--fox">{/* <Fox /> */}</div>
          {showDonateDialog && (
            <DinateDialog onClose={() => changeDonateDialog(false)} />
          )}
          <Image
            className="more-svg"
            src="./more.svg"
            width={16}
            height={32}
            alt="more"
          ></Image>
          <img className="wave wave-1" src="/wave-1.svg" alt="more" />
        </div>
        <div className="container-3">
          <Image
            className="star2"
            src="./star2.svg"
            width={200}
            height={200}
            alt="star2"
          ></Image>
          <div className="subtitle">
            <Image
              className="star"
              src="./star1.svg"
              width={168}
              height={151}
              alt="star"
            ></Image>
            {/* <Image
            src="./helping.svg"
            width={550}
            height={112}
            alt="helping"
          ></Image> */}
            <h2>BROCCOLI</h2>
            <h2>{trans(_TL_('Rescued Stray Animals'))}</h2>
            <div className="counter-wrap">
              {trans(_TL_('A total of {{count}} adorable souls rescued'), {
                count: <span>{TOTAL_COUNT}</span>,
              })}
            </div>
          </div>
          <Image
            className="wave1"
            src="./wave1.svg"
            width={530}
            height={520}
            alt="wave1"
          ></Image>
          <Image
            className="wave2"
            src="./wave2.svg"
            width={530}
            height={520}
            alt="wave2"
          ></Image>
          <div
            className="grid grid--narrow"
            data-duration="1"
            data-ease="elastic.out(0.5)"
            data-scale="3"
            data-max-rotation="20"
            data-spread="150"
            data-max-distance="700"
          >
            {dogs.map((dog, idx) => {
              return (
                <div key={idx} className="grid__item">
                  <div
                    className="grid__item-img"
                    style={{ backgroundImage: `url(${dog})` }}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
        <Trading />
        <div className="shim-height"></div>
        <Image
          className="star3"
          src="./star3.svg"
          width={465}
          height={474}
          alt="star3"
        ></Image>
        <div className="container-4">
          <img className="wave wave-2" src="/wave-2.svg" />
          <div className="container-4-content">
            <div className="social">
              <Link
                title="broccoli CN"
                href="https://t.me/broccolicn"
                target="_blank"
              >
                <Image src="./tg.svg" width={34} height={34} alt="tg"></Image>
              </Link>
              <Link
                title="broccoli EN"
                href="https://t.me/broccoliportal_bsc"
                target="_blank"
              >
                <Image src="./tg.svg" width={34} height={34} alt="tg"></Image>
              </Link>
              <Link href="https://x.com/Broccoli_NGO" target="_blank">
                <Image src="./x.svg" width={30} height={30} alt="x"></Image>
              </Link>
              <Link
                href="https://dexscreener.com/bsc/0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714"
                target="_blank"
              >
                <Image src="./ds.svg" width={30} height={30} alt="ds"></Image>
              </Link>
            </div>
            <div className="story">
              <Link
                href="https://x.com/cz_binance/status/1890071433214038103"
                target="_blank"
              >
                <p>{trans(_TL_("Broccoli Dog's story"))}</p>
                {/* <Image
              src="./dog-story.svg"
              width={334}
              height={52}
              alt="dog-story"
            ></Image> */}
              </Link>
              <Image
                src="./line-1.svg"
                width={21}
                height={52}
                alt="line"
              ></Image>
              <Link href="https://cz.dog" target="_blank">
                <p>{trans(_TL_("$Broccoli PFP Generator"))}</p>
                {/* <Image
              src="./coin-story.svg"
              width={350}
              height={52}
              alt="coin-story"
            ></Image> */}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <RescueDialog
        open={isOpen}
        onClose={onClose}
        onSuccess={() => {
          setShowRescueSuccessfulDialog(true);
        }}
      />
      {showRescueSuccessfulDialog && (
        <RescueSuccessfulDialog
          onClose={() => {
            setShowRescueSuccessfulDialog(false);
          }}
        />
      )}
    </>
  );
}

export default function WrappedHomeMain() {
  return (
    <Suspense>
      <Header />
      <HomeMain />
    </Suspense>
  );
}
