import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

import {
  Bot,
  webhookCallback,
} from "https://deno.land/x/grammy@v1.36.3/mod.ts";

const token = Deno.env.get("BOT_TOKEN");
if (!token) throw new Error("BOT_TOKEN is unset");

const bot = new Bot(token);

bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()}`));
bot.command("link", async (ctx) => {
  const user_id = ctx.match;

  if (!user_id) {
    return ctx.reply("Please provide a valid ID.");
  }

  // Send loading message
  const loadingMessage = await ctx.reply("🔄 Linking user account...");

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  try {
    // Get user data
    const { error, data: { user } } = await supabaseClient.auth.admin
      .getUserById(
        user_id,
      );

    if (error) {
      return ctx.api.editMessageText(
        ctx.chat!.id,
        loadingMessage.message_id,
        `❌ Error fetching user: ${error.message}`,
      );
    }

    if (!user) {
      return ctx.api.editMessageText(
        ctx.chat!.id,
        loadingMessage.message_id,
        "❌ User not found.",
      );
    }

    // Add chat ID to user metadata
    const { error: updateError } = await supabaseClient.auth.admin
      .updateUserById(
        user_id,
        {
          user_metadata: {
            chat_id: ctx.chat.id,
          },
        },
      );

    // Error reply
    if (updateError) {
      return ctx.api.editMessageText(
        ctx.chat!.id,
        loadingMessage.message_id,
        `❌ Error updating user: ${updateError.message}`,
      );
    }

    // Success reply
    return ctx.api.editMessageText(
      ctx.chat!.id,
      loadingMessage.message_id,
      `✅ User ${user.user_metadata.full_name} linked successfully!`,
    );
  } catch (err) {
    // Handle any unexpected errors
    const errorMessage = err instanceof Error
      ? err.message
      : "An unexpected error occurred";
    return ctx.api.editMessageText(
      ctx.chat!.id,
      loadingMessage.message_id,
      `❌ Unexpected error: ${errorMessage}`,
    );
  }
});

const handleUpdate = webhookCallback(bot, "std/http");

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url);
    if (url.searchParams.get("secret") !== bot.token) {
      return new Response("not allowed", { status: 405 });
    }
    return await handleUpdate(req);
  } catch (err) {
    console.error(err);
  }
  return new Response();
});
