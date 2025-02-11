alter table "public"."profiles" alter column "roles" drop default;

alter type "public"."roles" rename to "roles__old_version_to_be_dropped";

create type "public"."roles" as enum ('admin', 'developer', 'user', 'superadmin');

alter table "public"."profiles" alter column roles type "public"."roles" using roles::text::"public"."roles";       

alter table "public"."profiles" alter column "roles" set default 'user'::roles;

drop type "public"."roles__old_version_to_be_dropped";