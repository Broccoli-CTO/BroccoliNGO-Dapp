// app/api/tasks/[id]/route.ts
import { userAuth } from "@/shared/server/auth";
import { supabaseClient } from "@/shared/supabase";
import { obfuscateEmail } from "@/shared/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("lang") || "en";

    const { user } = await userAuth(false);

    // Get task with creator info
    const { data: task, error } = await supabaseClient
      .from("Task")
      .select(
        `
        *
      `
      )
      .eq("nftId", Number(id))
      .single();

    if (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task", { cause: 500 });
    }

    if (!task) {
      throw new Error("Task not found", { cause: 404 });
    }

    const { nftId, URI, approved, created_at, status, xHandle, metadata_en, metadata_zh, metadata, email, vote_start_date, vote_end_date } = task

    const isVoteEnabled =
      !!vote_start_date &&
      Date.now() >= new Date(vote_start_date).getTime();

    const isVoteEnded =
      isVoteEnabled &&
      new Date(vote_end_date || "0").getTime() <= Date.now();

    const voteLeftTime = Math.max(
      0,
      new Date(vote_end_date || "0").getTime() - Date.now()
    );

    const obfuscatedEmail = email ? obfuscateEmail(email) : "";

    const isAuthor = !!user && user.email === task.email;

    return NextResponse.json({
      code: 0,
      data: {
        nftId,
        URI,
        approved,
        created_at,
        status,
        xHandle,
        metadata: (lang === "zh" ? task.metadata_zh : task.metadata_en) || metadata,
        email: isAuthor ? task.email : obfuscatedEmail,
        isAuthor,
        isVoteEnabled,
        isVoteEnded,
        voteLeftTime,
        vote_start_date,
        vote_end_date,
        // voteLeftTime: 0,
      },
    });
  } catch (err: any) {
    console.error("Error:", err);
    return NextResponse.json(
      {
        code: err?.cause?.code || 500,
        message: err.message || "Internal Server Error",
      },
      { status: err?.cause?.code || 500 }
    );
  }
}
