import React from "react";
import Content from './content'
import { TaskDetailsProvider } from "@/hooks/useTaskDetails";
import Header from "@/components/Header";
import { Metadata, ResolvingMetadata } from "next";
import { fetchTaskDetail } from "@/shared/api";
import { isBeta } from "@/shared/constant";

type Props = {
  params: Promise<{ id: string; lang: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id, lang } = (await params)

  const res = await fetchTaskDetail(id, lang, {
    BaseURI: isBeta ? 'https://dev.broccoli.ngo' : 'https://www.broccoli.ngo',
  });

  const task = res?.data

  if (!task) return {}

  const metadata = task.metadata

  const title = metadata?.name || `Broccoli Act #${task.nftId}`
  const description = metadata?.description || "Broccoli Act Description"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.broccoli.ngo/task/${task.nftId}`,
      images: [
        {
          url: "/details/og-img.png",
          width: 1200,
          height: 628,
        },
      ],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      images: [
        {
          url: "/details/og-img.png",
          width: 1200,
          height: 628,
        },
      ],
    },
  }
}

type tParams = Promise<{ id: string; lang: string }>;

export default async function TaskDetailPage(props: { params: tParams }) {
  const { id } = await props.params;

  return (
    <TaskDetailsProvider tokenId={String(id)}>
      <Header />
      <Content id={id} />
    </TaskDetailsProvider>
  );
}
