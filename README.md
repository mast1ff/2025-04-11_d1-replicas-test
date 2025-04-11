# Cloudflare D1 レプリカ


## データベースの準備

```
$ wrangler d1 execute 2025-04-11-d1-replicas-test --file ./db/migrate.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test --file ./db/insert.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test-no-replica --file ./db/migrate.sql
$ wrangler d1 execute 2025-04-11-d1-replicas-test-no-replica --file ./db/insert.sql
```

```
npm install
npm run dev
```

```
npm run deploy
```
