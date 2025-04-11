import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

const app = new Hono<{
	Bindings: CloudflareBindings;
	Variables: {
		bookmark: string;
		dbWithReplica: D1DatabaseSession;
		dbWithoutReplica: D1Database;
	};
}>();

app.use((c, next) => {
	const bookmark = getCookie(c, "bookmark") || "first-unconstrained";
	c.set("bookmark", bookmark);
	c.set("dbWithReplica", c.env.DB_WITH_REPLICA.withSession(bookmark));
	c.set("dbWithoutReplica", c.env.DB_WITHOUT_REPLICA);
	return next();
});

app.get("/replica", async (c) => {
	const db = c.get("dbWithReplica");
	const start = Date.now();
	const { results } = await db.prepare("SELECT * FROM orders").all();
	const end = Date.now();
	const elapsed = end - start;

	const latestBookmark = db.getBookmark();
	if (latestBookmark) {
		setCookie(c, "bookmark", latestBookmark, {
			maxAge: 60 * 60, // 1 hour
		});
	}
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
