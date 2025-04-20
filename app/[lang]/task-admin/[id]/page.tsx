import React from "react";
import Content from "./content";
import { TaskDetailsProvider } from "@/hooks/useTaskDetails";
import Header from "@/components/Header";

type tParams = Promise<{ id: string }>;

export default async function TaskDetailPage(props: { params: tParams }) {
  const { id } = await props.params;
  return (
    <TaskDetailsProvider tokenId={String(id)}>
      <Header />
      <Content id={id} />
    </TaskDetailsProvider>
  );
}
