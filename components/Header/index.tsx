import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Avatar from "boring-avatars";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import DisconnectIcon from "@/components/icons/disconnect";
import { sliceAddress } from "@/shared/utils";
import styles from './index.module.scss';
import { useI18n } from '../ui/I18nProvider';

export default function Header() {

  const { lang } = useI18n()

  const changeLang = () => {
    const pathArr = location.pathname.split('/')
    pathArr[1] = lang === 'en' ? 'zh' : 'en'
    location.href = pathArr.join('/')    
    return
  }

  return (
    <header className={styles.header}>
      <Link className={styles.logo} href="/">
        <div className={styles.logoIcon}>
          <Image
            src="/logo.svg"
            alt="Broccoli NGP"
            width={32}
            height={32}
          />
        </div>
        <span className={styles.logoText}>BROCCOLI.BNB</span>
      </Link>

      <div className={styles.actions}>
        <div className={styles.socialIcons}>
          <Link title="broccoli CN" href="https://t.me/broccolicn" target="_blank" className={styles.socialIcon}>
            <Image src="/header-tg.svg" width={27} height={27} alt="tg"></Image>
          </Link>
          <Link href="https://t.me/broccoliportal_bsc" target="_blank" className={styles.socialIcon}>
            <Image src="/header-tg.svg" width={27} height={27} alt="tg"></Image>
          </Link>
          <Link href="https://x.com/Broccoli_NGO" target="_blank" className={styles.socialIcon}>
            <Image src="/header-x.svg" width={27} height={27} alt="x"></Image>
          </Link>
          <Link href="https://dexscreener.com/bsc/0x6d5ad1592ed9d6d1df9b93c793ab759573ed6714" target="_blank" className={styles.socialIcon}>
            <Image src="/header-dexscreener.svg" width={27} height={27} alt="ds"></Image>
          </Link>
        </div>

        <div className={styles.split}></div>

        <button className={styles.language} onClick={changeLang}>
          {lang.toUpperCase()}
        </button>

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
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (() => {
              if (!connected) {
                return (
                  <button className={styles.connectBtn} onClick={openConnectModal}>
                    <span>LOGIN</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button className={`${styles.connectBtn} ${styles.wrongNetwork}`} onClick={openChainModal}>
                    <span>WRONG NETWORK</span>
                  </button>
                );
              }

              return (
                <button className={styles.disconnectBtn} onClick={openAccountModal}>
                  <div className={styles.walletAvatar}>
                    <Avatar
                      name={account.address}
                      variant="beam"
                    />
                  </div>
                  <span>{sliceAddress(account.address)}</span>
                  <div className={styles.disconnect}><DisconnectIcon /></div>
                </button>
              );
            })();
          }}
        </ConnectButton.Custom>
      </div>
    </header>
  );
}
