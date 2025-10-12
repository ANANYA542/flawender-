-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "bio" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Idea" (
    "id" SERIAL NOT NULL,
    "Description" TEXT NOT NULL,
    "Verdict" TEXT NOT NULL,
    "Positive" TEXT NOT NULL,
    "Negative" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Like" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "idea_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Follow" (
    "id" SERIAL NOT NULL,
    "follower_id" INTEGER NOT NULL,
    "following_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FollowRequest" (
    "id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Chat" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatParticipant" (
    "id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "receiver_id" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Idea_id_key" ON "public"."Idea"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_id_key" ON "public"."Like"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Like_user_id_idea_id_key" ON "public"."Like"("user_id", "idea_id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "public"."Comment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_id_key" ON "public"."Follow"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_follower_id_following_id_key" ON "public"."Follow"("follower_id", "following_id");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_id_key" ON "public"."FollowRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FollowRequest_sender_id_receiver_id_key" ON "public"."FollowRequest"("sender_id", "receiver_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_id_key" ON "public"."Chat"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_id_key" ON "public"."ChatParticipant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatParticipant_chat_id_user_id_key" ON "public"."ChatParticipant"("chat_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_id_key" ON "public"."Message"("id");

-- AddForeignKey
ALTER TABLE "public"."Idea" ADD CONSTRAINT "Idea_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "public"."Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_idea_id_fkey" FOREIGN KEY ("idea_id") REFERENCES "public"."Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Follow" ADD CONSTRAINT "Follow_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowRequest" ADD CONSTRAINT "FollowRequest_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FollowRequest" ADD CONSTRAINT "FollowRequest_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatParticipant" ADD CONSTRAINT "ChatParticipant_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatParticipant" ADD CONSTRAINT "ChatParticipant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "public"."Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
