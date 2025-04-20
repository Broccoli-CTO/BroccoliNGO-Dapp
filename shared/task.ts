import { HelpRequest2, NFTMetaData2 } from "./types/help";
import {
  HelpRequest,
  NFTMetaData,
  RescueRequest,
  RescueNFTMetaData,
} from "./types/rescue";

export const requestToNFTMetadata = (request: HelpRequest) => {
  return {
    name: `Broccoli Act for ${request.organization.name}`,
    description: request.request.assistanceRequired,
    image: "https://arweave.net/YFTeWRwYu0Ax1Fm354VJIjBU2heP0l5cEXTf7zyoGyA",
    attributes: [
      {
        trait_type: "version",
        value: request.v,
      },
      {
        trait_type: "organization",
        value: request.organization.name,
      },
      {
        trait_type: "email",
        value: request.organization.contact.email,
      },
      {
        trait_type: "twitter",
        value: request.organization.contact.twitter,
      },
      {
        trait_type: "link",
        value: request.request.helpPostLink,
      },
      {
        trait_type: "location",
        value: request.request.location,
      },
      {
        trait_type: "costAmount",
        value: request.request.costEstimate.totalAmount,
      },
      {
        trait_type: "budgetPlan",
        value: request.request.costEstimate.budgetPlan,
      },
      {
        trait_type: "costBreakdown",
        value: request.request.costEstimate.breakdown,
      },
      {
        trait_type: "impactAfterAssistance",
        value: request.request.impactAfterAssistance,
      },
      {
        trait_type: "canProvideInvoice",
        value: request.request.canProvideInvoice,
      },
      {
        trait_type: "canProvidePublicThankYouLetter",
        value: request.request.canProvidePublicThankYouLetter,
      },
    ],
  } as NFTMetaData;
};

export const nftMetaDataToHelpRequest = (nftMetaData: NFTMetaData) => {
  return {
    v: nftMetaData.attributes.find((attr) => attr.trait_type === "version")
      ?.value,
    organization: {
      name: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "organization"
      )?.value,
      contact: {
        email: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "email"
        )?.value,
        twitter: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "twitter"
        )?.value,
      },
    },
    request: {
      helpPostLink: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "link"
      )?.value,
      assistanceRequired: nftMetaData.description,
      location: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "location"
      )?.value,
      costEstimate: {
        totalAmount: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "costAmount"
        )?.value,
        budgetPlan: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "budgetPlan"
        )?.value,
        breakdown: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "costBreakdown"
        )?.value,
      },
      impactAfterAssistance: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "impactAfterAssistance"
      )?.value,
      canProvideInvoice: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvideInvoice"
      )?.value,
      canProvidePublicThankYouLetter: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvidePublicThankYouLetter"
      )?.value,
    },
  } as HelpRequest;
};

export const requestToNFTMetadata2 = (request: HelpRequest2) => {
  return {
    name: `Broccoli Act for Human`,
    // description: request.request.assistanceRequired,
    description: `Broccoli Act for ${request.request.address}`,
    image: "https://arweave.net/YFTeWRwYu0Ax1Fm354VJIjBU2heP0l5cEXTf7zyoGyA",
    attributes: [
      {
        trait_type: "version",
        value: request.v,
      },
      {
        trait_type: "address",
        value: request.request.address,
      },
      {
        trait_type: "email",
        value: request.organization.contact.email,
      },
      {
        trait_type: "twitter",
        value: request.organization.contact.twitter,
      },
      // {
      //   trait_type: "link",
      //   value: request.request.helpPostLink,
      // },
      {
        trait_type: "location",
        value: request.request.location,
      },
      // {
      //   trait_type: "costAmount",
      //   value: request.request.costEstimate.totalAmount,
      // },
      {
        trait_type: "budgetPlan",
        value: request.request.costEstimate.budgetPlan,
      },
      // {
      //   trait_type: "costBreakdown",
      //   value: request.request.costEstimate.breakdown,
      // },
      // {
      //   trait_type: "impactAfterAssistance",
      //   value: request.request.impactAfterAssistance,
      // },
      {
        trait_type: "canProvideInvoice",
        value: request.request.canProvideInvoice,
      },
      {
        trait_type: "canProvidePublicThankYouLetter",
        value: request.request.canProvidePublicThankYouLetter,
      },
    ],
  } as NFTMetaData2;
};

export const nftMetaDataToHelpRequest2 = (nftMetaData: NFTMetaData2) => {
  return {
    v: nftMetaData.attributes.find((attr) => attr.trait_type === "version")
      ?.value,
    organization: {
      // name: nftMetaData.attributes.find((attr) => attr.trait_type === "organization")?.value,
      contact: {
        email: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "email"
        )?.value,
        twitter: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "twitter"
        )?.value,
      },
    },
    request: {
      address: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "address"
      )?.value,
      // helpPostLink: nftMetaData.attributes.find((attr) => attr.trait_type === "link")?.value,
      // assistanceRequired: nftMetaData.description,
      location: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "location"
      )?.value,
      costEstimate: {
        // totalAmount: nftMetaData.attributes.find((attr) => attr.trait_type === "costAmount")?.value,
        budgetPlan: nftMetaData.attributes.find(
          (attr) => attr.trait_type === "budgetPlan"
        )?.value,
        // breakdown: nftMetaData.attributes.find((attr) => attr.trait_type === "costBreakdown")?.value,
      },
      // impactAfterAssistance: nftMetaData.attributes.find((attr) => attr.trait_type === "impactAfterAssistance")?.value,
      canProvideInvoice: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvideInvoice"
      )?.value,
      canProvidePublicThankYouLetter: nftMetaData.attributes.find(
        (attr) => attr.trait_type === "canProvidePublicThankYouLetter"
      )?.value,
    },
  } as HelpRequest2;
};

export type VoteOnchainMetadata = {
  v: string;
  type: "vote";
  metadata: {
    tokenId: string;
    yes: number;
    no: number;
    list: {
      address: string;
      signature: string;
      result: number;
      tickets: number;
      time: string;
    }[];
  };
};

export const checkIsVoteOnchainMetadata = (data: any) => {
  if (data.type === "vote") {
    return true;
  }
  return false;
};

type VoteOnchainMetadataParams = {
  yes: number;
  no: number;
  tokenId: string;
  startDate: string;
  endDate: string;
  votes: {
    address: string;
    signature: string;
    result: number;
    tickets: number;
    time: string;
  }[];
};
export const formatToVoteOnchainMetadata = (
  params: VoteOnchainMetadataParams
) => {
  const { yes, no, startDate, endDate, tokenId, votes } = params;
  return {
    v: "1",
    type: "vote",
    metadata: {
      yes,
      no,
      tokenId,
      startDate,
      endDate,
      list: votes,
    },
  } as VoteOnchainMetadata;
};

export const formatToRescueNFTMetadata = (
  request: RescueRequest
): RescueNFTMetaData => {
  return {
    name: `Broccoli Act for ${request.contact.organization}`,
    description: request.background.context,
    image: "https://arweave.net/YFTeWRwYu0Ax1Fm354VJIjBU2heP0l5cEXTf7zyoGyA",
    attributes: [
      {
        trait_type: "version",
        value: request.v,
      },
      {
        trait_type: "organization",
        value: request.contact.organization,
      },
      {
        trait_type: "email",
        value: request.contact.email,
      },
      {
        trait_type: "location",
        value: `${request.contact.country}, ${request.contact.city}`,
      },
      {
        trait_type: "attachment",
        value: request.background.attachment,
      },
      {
        trait_type: "suppliesRequest",
        value: request.request.suppliesRequest,
      },
      {
        trait_type: "additionalInfo",
        value: request.request.additionalInfo,
      },
      {
        trait_type: "canProvideInvoices",
        value: request.request.canProvideInvoices,
      },
      {
        trait_type: "canProvidePublicAcknowledgments",
        value: request.request.canProvidePublicAcknowledgments,
      },
    ],
  } as RescueNFTMetaData;
};

export const NFTMetaDataToRescueRequestForms = (
  metadata: RescueNFTMetaData
) => {
  const contactForm = {
    organization: metadata.attributes.find(
      (attr) => attr.trait_type === "organization"
    )?.value,
    email: metadata.attributes.find((attr) => attr.trait_type === "email")
      ?.value,
    country: metadata.attributes
      .find((attr) => attr.trait_type === "location")
      ?.value.split(/\,|\，/)[0],
    city: metadata.attributes
      .find((attr) => attr.trait_type === "location")
      ?.value.split(/\,|\，/)[1],
  } as RescueRequest["contact"];
  const backgroundForm = {
    context: metadata.description,
    attachment: metadata.attributes.find(
      (attr) => attr.trait_type === "attachment"
    )?.value,
  } as RescueRequest["background"];
  const requestForm = {
    suppliesRequest:
      metadata.attributes.find((attr) => attr.trait_type === "suppliesRequest")
        ?.value || "",
    additionalInfo:
      metadata.attributes.find((attr) => attr.trait_type === "additionalInfo")
        ?.value || "",
    canProvideInvoices:
      metadata.attributes.find(
        (attr) => attr.trait_type === "canProvideInvoices"
      )?.value || false,
    canProvidePublicAcknowledgments:
      metadata.attributes.find(
        (attr) => attr.trait_type === "canProvidePublicAcknowledgments"
      )?.value || false,
  } as RescueRequest["request"];
  const request = {
    v: metadata.attributes.find((attr) => attr.trait_type === "version")?.value,
    contact: contactForm,
    background: backgroundForm,
    request: requestForm,
  } as RescueRequest;
  return {
    contactForm,
    backgroundForm,
    requestForm,
    request,
  } as {
    contactForm: RescueRequest["contact"];
    backgroundForm: RescueRequest["background"];
    requestForm: RescueRequest["request"];
    request: RescueRequest;
  };
};

export const getVersionOfMetaData = (
  metadata: NFTMetaData | NFTMetaData2 | RescueNFTMetaData
) => {
  return metadata.attributes.find((attr) => attr.trait_type === "version")
    ?.value;
};

export const formatNFTMetadataToTaskRequest = async ({
  tokenUri,
  metadata,
}: {
  tokenUri?: string;
  metadata?: NFTMetaData | NFTMetaData2 | RescueNFTMetaData;
}) => {
  const NFTMetaData: NFTMetaData | NFTMetaData2 | RescueNFTMetaData =
    metadata || (await fetch(tokenUri!).then((res) => res.json()));
  console.log("-- NFTMetaData", NFTMetaData);
  const version = getVersionOfMetaData(NFTMetaData);
  switch (version) {
    case "1.0": {
      return {
        v: version,
        NFTMetaData,
        formatedData: NFTMetaDataToRescueRequestForms(
          NFTMetaData as RescueNFTMetaData
        ).request,
      };
    }
    case "0.2": {
      return {
        v: version,
        NFTMetaData,
        formatedData: nftMetaDataToHelpRequest2(NFTMetaData as NFTMetaData2),
      };
    }
    case "0.1": {
      return {
        v: version,
        NFTMetaData,
        formatedData: nftMetaDataToHelpRequest(NFTMetaData as NFTMetaData),
      };
    }
    default: {
      return null;
    }
  }
};
