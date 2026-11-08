CREATE TABLE "public"."materials" (
  "id"                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "title"             text                     NOT NULL,
  "description"       text,
  "topic"             text,
  "resource_type"     text,
  "discipline"        text,
  "intended_audience" text,
  "difficulty"        text,
  "author"            text,
  "source_name"       text,
  "source_url"        text,
  "license"           text,
  "tags"              text[]                   DEFAULT '{}'::text[],
  "storage_path"      text,
  "mime_type"         text,
  "file_size"         bigint,
  "version"           text,
  "status"            text                     NOT NULL DEFAULT 'draft'::text,
  "metadata"          jsonb                    DEFAULT '{}'::jsonb,
  "created_at"        timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at"        timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT "materials_pkey" PRIMARY KEY (id),
  CONSTRAINT "materials_status_check" CHECK ((status = ANY (ARRAY['draft'::text, 'under_review'::text, 'published'::text, 'archived'::text])))
);

ALTER TABLE "public"."materials"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read published materials" ON "public"."materials"
  FOR SELECT
  TO "anon", "authenticated"
  USING ((status = 'published'::text));

CREATE POLICY "Read published material files" ON "storage"."objects"
  FOR SELECT
  TO "anon", "authenticated"
  USING (((bucket_id = 'materials'::text) AND (EXISTS ( SELECT 1
   FROM public.materials
  WHERE ((materials.storage_path = objects.name) AND (materials.status = 'published'::text))))));

REVOKE ALL ON TABLE "public"."materials" FROM "anon";

GRANT SELECT ON TABLE "public"."materials" TO "anon";

REVOKE ALL ON TABLE "public"."materials" FROM "authenticated";

GRANT SELECT ON TABLE "public"."materials" TO "authenticated";

REVOKE ALL ON TABLE "public"."materials" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."materials" TO "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."materials" TO "service_role";

