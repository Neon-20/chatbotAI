alter table "public"."workspaces" add column "public" boolean not null default false;
alter table "public"."workspaces" disable row level security;