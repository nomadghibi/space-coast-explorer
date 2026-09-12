# CMS

Admin CMS begins in M3. M3 adds server-authorized tour editorial workflows: `draft`, `in_review`, `published`, and `archived`. Publishing records `published_at`; public content remains a separate read model until the content API is database-backed.

The API requires `X-CMS-Token` matching `CMS_ADMIN_TOKEN`. This is a local/internal boundary for M3, not a substitute for user accounts or organization membership, which belong in the later auth and merchant work.
