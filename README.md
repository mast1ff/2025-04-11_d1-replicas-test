# Cloudflare D1 Replica

This project is to experiment with the newly introduced Read Replica feature for D1 databases.

## Preparing the Database

```bash
$ wrangler d1 execute 2025-04-11-d1-replicas-test --file ./db/migrate.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test --file ./db/insert.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test-no-replica --file ./db/migrate.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test-no-replica --file ./db/insert.sql
