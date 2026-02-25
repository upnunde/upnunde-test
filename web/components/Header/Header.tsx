"use client";

import Image from "next/image";
import Icon from "../Icon";
import { Button } from "../ui/index";
import styles from "./Header.module.css";

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export default function Header({
  title = "배경",
  onBack,
  showBackButton = true,
}: HeaderProps) {
  return (
    <div className={styles.header}>
      {/* Row 1: Logo and Profile */}
      <div className={styles.headerRow1}>
        <div className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <Image
              src="/icons/logo.svg"
              alt="RE:NOVEL Studio"
              width={192}
              height={20}
              className={styles.logoImage}
              priority
              onError={(e) => {
                // logo.svg가 없을 경우 fallback
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) {
                  fallback.style.display = "block";
                }
              }}
            />
            <div className={styles.logoFallback} style={{ display: "none" }}>
              <span className={styles.logoText}>
                <strong>RE:NOVEL</strong> Studio
              </span>
            </div>
          </div>
        </div>
        <button className={styles.profileButton} aria-label="Profile">
          <Icon name="profile_circle" size={24} />
        </button>
      </div>

      {/* Row 2: Back Button and Title */}
      <div className={styles.headerRow2}>
        <div className={styles.headerRow2Content}>
          <div className={styles.headerRow2Left}>
            {showBackButton && (
              <Button
                variant="outline"
                size="icon"
                onClick={onBack}
                className={styles.backButton}
                aria-label="Back"
              >
                <Icon name="arrow_back" size={20} />
              </Button>
            )}
            <h1 className={styles.pageTitle}>{title}</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
