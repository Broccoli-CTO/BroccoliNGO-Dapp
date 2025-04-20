export const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.matchMedia("(max-width: 768px)").matches
  );
};

export const formatDecimalNumber = (
  num: number | string,
  maximumFractionDigits = 4,
  minimumFractionDigits = 0
) => {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(Number(num));
};

export const formatVotes = (votes: number) => {
  votes = Math.floor(votes);
  if (votes >= 1_000_000) {
    return `${formatDecimalNumber(votes / 1_000_000, 2)}M`;
  } else if (votes >= 1_000) {
    return `${formatDecimalNumber(votes / 1_000, 2)}K`;
  } else {
    return formatDecimalNumber(votes, 0);
  }
};

type FlattenedData = {
  label: string;
  key: string;
  value: any;
};

export const flattenObject = (
  obj: any,
  detectKeys: string[] = [],
  parentKey = ""
): FlattenedData[] => {
  return Object.entries(obj).reduce<FlattenedData[]>((acc, [key, value]) => {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;

    if (value && typeof value === "object" && !Array.isArray(value)) {
      // Recursively flatten nested objects
      return [...acc, ...flattenObject(value, detectKeys, currentKey)];
    }

    // Skip keys that are not in the detectKeys array
    if (!detectKeys.includes(key)) {
      return acc;
    }

    return [
      ...acc,
      {
        // label:
        //   key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        label: key,
        key: currentKey,
        value: String(value) || "-",
      },
    ];
  }, []);
};

export const sliceAddress = (address: string, begin = 3, end = -3) => {
  if (!address) return "";
  return `${address.slice(0, begin)}...${address.slice(end)}`;
};

export const getISODateTimestamp = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours()
    )
  ).getTime();
};

/**
 * Format date to "YYYY/MM/DD HH:mm:ss" in UTC timezone
 *
 * @param date The date to format
 * @param includeSeparator Whether to include separators or not
 * @returns Formatted date string in UTC "YYYY/MM/DD HH:mm:ss" format
 */
export const formatDate = (
  date: Date | number | string | null | undefined,
  includeSeparator: boolean = true
): string => {
  if (date === null || date === undefined) return "";

  try {
    const dateObj = new Date(date);

    // Check for invalid date
    if (isNaN(dateObj.getTime())) {
      console.warn(`Invalid date provided to formatDate: ${date}`);
      return "";
    }

    // Get UTC components
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getUTCDate()).padStart(2, "0");
    const hours = String(dateObj.getUTCHours()).padStart(2, "0");
    const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getUTCSeconds()).padStart(2, "0");

    // Return formatted date in YYYY/MM/DD HH:mm:ss format
    return includeSeparator
      ? `${year}/${month}/${day} ${hours}:${minutes}:${seconds} UTC`
      : `${year}${month}${day}${hours}${minutes}${seconds} UTC`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

export const createBlobUrl = (file: File | Blob): string => {
  const blobUrl = URL.createObjectURL(file);

  return blobUrl;
};

export const cleanBlobUrl = (blobUrl: string) => {
  URL.revokeObjectURL(blobUrl);
};

export function obfuscateEmail(email: string): string {
  if (!email) return "";

  // split email into username and domain
  const [username, domain] = email.split("@");

  if (!username || !domain) return email; // if email is invalid, return as is

  // obfuscate username - keep first 2 and last 1 characters, replace the rest with stars
  let obfuscatedUsername = username;
  if (username.length > 3) {
    const firstChars = username.substring(0, 2);
    const lastChar = username.substring(username.length - 1);
    const middleStars = "*".repeat(username.length - 3);
    obfuscatedUsername = `${firstChars}${middleStars}${lastChar}`;
  }

  // obfuscate domain - keep first 1 and last 1 characters of the second-level domain, replace the rest with stars
  const domainParts = domain.split(".");
  let obfuscatedDomain = domain;

  if (domainParts.length > 1) {
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
    ];

    // if the domain is a common one, keep it as is
    if (commonDomains.includes(domain)) {
      obfuscatedDomain = domain;
    } else {
      // if the domain is not common, obfuscate it
      const tld = domainParts[domainParts.length - 1]; // top-level domain
      const sld = domainParts[domainParts.length - 2]; // second-level domain

      if (sld.length > 2) {
        const firstChar = sld.substring(0, 1);
        const middleStars = "*".repeat(sld.length - 2);
        const lastChar = sld.substring(sld.length - 1);
        const obfuscatedSld = `${firstChar}${middleStars}${lastChar}`;

        obfuscatedDomain = `${obfuscatedSld}.${tld}`;
      }
    }
  }

  return `${obfuscatedUsername}@${obfuscatedDomain}`;
}
