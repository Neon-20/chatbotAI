CREATE TYPE "public"."roles" AS ENUM ('admin', 'developer', 'user');

ALTER TABLE "public"."profiles" ADD COLUMN "roles" "public"."roles" NOT NULL DEFAULT 'user';
