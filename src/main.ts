import { Hono } from "hono";

const app = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		sessionToken: string;
		dbWithReplica: D1DatabaseSession;
		dbWithoutReplica: D1Database;
	};
}>();

app.use((c, next) => {
	const token = c.req.header("x-d1-token") ?? "first-unconditional";
	c.set("sessionToken", token);
	c.set("dbWithReplica", c.env.DB_WITH_REPLICA.withSession(token));
	c.set("dbWithoutReplica", c.env.DB_WITHOUT_REPLICA);
	return next();
});

app.get("/replica", async (c) => {
	const db = c.get("dbWithReplica");
	const start = Date.now();
	const { results } = await db.prepare("SELECT * FROM orders").all();
	const end = Date.now();
	const elapsed = end - start;
	c.res.headers.set("x-d1-token", c.get("sessionToken"));
	return c.json({
		results,
		elapsed,
	});
});

app.get("/no-replica", async (c) => {
	const db = c.get("dbWithoutReplica");
	const start = Date.now();
	const { results } = await db.prepare("SELECT * FROM orders").all();
	const end = Date.now();
	const elapsed = end - start;
	c.res.headers.set("x-d1-token", c.get("sessionToken"));
	return c.json({
		results,
		elapsed,
	});
});

app.onError((err, c) => {
	console.error(err);
	return c.json({ error: "Internal Server Error" }, 500);
});

export default {
	fetch: app.fetch,
} satisfies ExportedHandler<CloudflareBindings>;
