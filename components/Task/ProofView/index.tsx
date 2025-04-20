import { Icon, Spinner, Stack } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import { FiPlus, FiVideo } from "react-icons/fi";
import { uploadImage, uploadVideo } from "@/shared/upload";
import { addProof, fetchProofs, uploadJson } from "@/shared/api";
import { MAX_IMAGE_SIZE, MAX_VIDEO_SIZE } from "@/shared/constant";
import {
  CardContainer,
  CardTitle,
  CardTitleTip,
  SubmitButton,
} from "@/components/Task/Layout";
import styled from "@emotion/styled";
import { useTaskDetailsCtx } from "@/hooks/useTaskDetails";
import { toaster } from "@/components/ui/toaster";
import { useLogin } from "@privy-io/react-auth";
import { useGlobalCtx } from "@/hooks/useGlobal";
import { useI18n } from "@/components/ui/I18nProvider";

const createBlobUrl = (file: File | Blob): string => {
  const blobUrl = URL.createObjectURL(file);

  return blobUrl;
};

const cleanBlobUrl = (blobUrl: string) => {
  URL.revokeObjectURL(blobUrl);
};

interface Props {
  admin?: boolean;
  tokenId: string;
}
export const ProofView: FC<Props> = ({ admin, tokenId }) => {
  const { trans } = useI18n();
  const { profile } = useGlobalCtx();
  const { isAuthor } = useTaskDetailsCtx();
  const { login } = useLogin();

  const [uploadedProofs, setUploadedProofs] = useState<string[]>([]);
  const [parsedProofs, setParsedProofs] = useState<string[]>([]);
  const [proofLoading, setProofLoading] = useState(true);
  const [proofImages, setProofImages] = useState<string[]>([]);
  const [proofVideos, setProofVideos] = useState<string[]>([]);
  const [proofImagesBlobUrls, setProofImagesBlobUrls] = useState<string[]>([]);
  const [proofVideoBlobUrls, setProofVideoBlobUrls] = useState<string[]>([]);
  const [proofImagesLoading, setProofImagesLoading] = useState(false);

  const [isProofUploading, setIsProofUploading] = useState(false);
  const [isProofSubmitting, setIsProofSubmitting] = useState(false);

  const isProofDisabled =
    isProofUploading || isProofSubmitting || !proofImages.length;

  const handleAddProofs = async () => {
    if (isProofDisabled) return;
    if (!proofImages.length) {
      toaster.create({
        title: trans(_TL_("Please upload at least one proof")),
      });
      return;
    }
    if (!profile) {
      toaster.create({
        title: trans(_TL_("Please connect your X account")),
      });
      return;
    }
    setIsProofSubmitting(true);

    try {
      setIsProofUploading(true);
      const ipfsRes = await uploadJson(proofImages);
      setIsProofUploading(false);

      const ipfsLink = ipfsRes?.data?.url;

      if (!ipfsLink) {
        toaster.create({
          title: trans(_TL_("Failed to upload Proof")),
          description: trans(_TL_("Please try again later.")),
          type: "error",
        });
        return;
      }

      const res = await addProof(tokenId, ipfsLink);

      if (res.code !== 0) {
        toaster.create({
          title: res.message || "Failed to upload Proof",
          type: "error",
        });
        return;
      }
      toaster.create({
        title: trans(_TL_("Proof uploaded successfully")),
        description: trans(_TL_("Your proof has been uploaded successfully.")),
        type: "success",
      });
      location.reload();
    } catch (e) {
    } finally {
      setIsProofSubmitting(false);
      setIsProofUploading(false);
    }
  };

  const getUploadedProofs = async (tokenId: string) => {
    const res = await fetchProofs(tokenId);
    if (res.code === 0) {
      setUploadedProofs(res.data.map(({ URI }: any) => URI));
    }
    setProofLoading(false);
  };

  const handleProofFileSelect = async (e: any) => {
    const files = e.target.files;
    setProofImagesLoading(true);
    for (let i = 0; i < files.length; i++) {
      const isVideo = files[i].type === "video/mp4";
      const isImage = files[i].type.startsWith("image/");
      const isValid = isVideo || isImage;
      if (!isValid) {
        continue;
      }
      // if (isVideo) {
      //   setProofVideoBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
      //   const res = await uploadVideo({ file: files[i] }, MAX_VIDEO_SIZE);
      //   if (res) {
      //     onProofUploaded?.(res.data.url);
      //     setProofVideos((prev) => [...prev, res.data.url]);
      //   }
      //   continue;
      // }
      if (isImage) {
        setProofImagesBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
        const res = await uploadImage({ file: files[i] }, MAX_IMAGE_SIZE);
        if (res) {
          // onProofUploaded?.(res.data.url);
          setProofImages((prev) => [...prev, res.data.url]);
        }
        continue;
      }
    }
    setProofImagesLoading(false);
  };

  useEffect(() => {
    getUploadedProofs(tokenId);
    return () => {
      setUploadedProofs([]);
      setProofLoading(true);
      setParsedProofs([]);
    };
  }, [tokenId]);

  useEffect(() => {
    if (!uploadedProofs.length) return;
    async function loadFundRecords() {
      const parsedProofs = (
        await Promise.all(
          uploadedProofs.map(async (proof) => {
            return await fetch(proof).then((res) => res.json());
          })
        )
      ).flat();
      setParsedProofs(parsedProofs);
    }
    loadFundRecords();
  }, [uploadedProofs]);

  return (
    <CardContainer>
      <CardTitle>{trans(_TL_("Proofs"))}</CardTitle>
      {proofLoading ? (
        <Spinner />
      ) : (
        <ProofList
          data-duration="1"
          data-ease="elastic.out(0.5)"
          data-scale="3"
          data-max-rotation="20"
          data-spread="150"
          data-max-distance="700"
        >
          {parsedProofs.map((img, idx) => {
            return (
              <ProofItem key={idx}>
                <a key={idx} href={img} target="_blank">
                  <ProofItemImg
                    style={{ backgroundImage: `url(${img})` }}
                  ></ProofItemImg>
                </a>
              </ProofItem>
            );
          })}
          {proofImagesBlobUrls.map((img, idx) => {
            return (
              <ProofItem key={idx}>
                <a key={idx} href={img} target="_blank">
                  <ProofItemImg
                    new
                    style={{ backgroundImage: `url(${img})` }}
                  ></ProofItemImg>
                </a>
              </ProofItem>
            );
          })}
          <ProofItem
            key="upload"
            disabled={admin || (!!profile && !isAuthor)}
            onClick={(e) => {
              if (!profile) {
                e.stopPropagation();
                e.preventDefault();
                console.log("login");
                login();
              }
            }}
          >
            <UploadBox disabled={!profile} htmlFor="upload-record">
              {proofImagesLoading ? (
                <Spinner />
              ) : (
                <Icon as={FiPlus} fontSize="3xl" />
              )}

              <input
                id="upload-record"
                type="file"
                // accept="image/*,video/mp4"
                accept="image/*"
                multiple
                maxLength={20}
                onChange={handleProofFileSelect}
                disabled={proofImagesLoading}
              />
            </UploadBox>
          </ProofItem>
        </ProofList>
      )}
      {isAuthor ? (
        <SubmitButton
          loading={isProofSubmitting}
          disabled={isProofDisabled}
          onClick={handleAddProofs}
        >
          {trans(_TL_("Upload"))}
        </SubmitButton>
      ) : null}
    </CardContainer>
  );
};

const ProofList = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 12px;
  pointer-events: none;
  @media screen and (max-width: 768px) {
    width: 100%;
    grid-gap: 12px;
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProofItem = styled.div<{ disabled?: boolean }>`
  position: relative;
  margin: 0;
  will-change: transform;
  pointer-events: auto;
  display: ${(props) => (props.disabled ? "none" : "block")};
`;

const ProofItemImg = styled.div<{ new?: boolean }>`
  width: 100%;
  aspect-ratio: 1/1.25;
  cursor: pointer;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  border: ${(props) => (props.new ? "2px solid #21B66F" : "none")};
`;

const UploadBox = styled.label<{ disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 2px dashed #ccc;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  width: 100%;
  aspect-ratio: 1/1.25;
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};

  &:hover {
    border-color: #718096;
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const VideoWrap = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px solid #ccc;
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 24px;
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const ProofItemLink = styled.a<{ disabled?: boolean }>`
  pointer-events: ${(props) => (props.disabled ? "none" : "auto")};
`;
