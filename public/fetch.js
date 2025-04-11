class DataFetcher extends HTMLElement {
	url;
	controller;
	signal;

	constructor() {
		super();
		this.url = this.getAttribute("url");
		this.controller = new AbortController();
		this.signal = this.controller.signal;
		// shadow DOM
		this.attachShadow({ mode: "open" });
		const style = document.createElement("style");
		style.textContent = `
		h2 {
			color: #333;
			font-size: 1.5em;
		}
		pre {
			background-color: #f4f4f4;
			padding: 10px;
			border-radius: 5px;
			max-height: 300px;
			overflow: auto;
			font-family: monospace;
		}
		p {
			color: #666;
			font-size: 1em;
		}
		`;
		this.shadowRoot.appendChild(style);
		const h2 = document.createElement("h2");
		h2.textContent = this.getAttribute("title");
		this.shadowRoot.appendChild(h2);
	}

	async fetchData() {
		const response = await fetch(this.url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			signal: this.signal,
		});
		const { results, elapsed } = await response.json();
		const pre = document.createElement("pre");
		pre.textContent = JSON.stringify(results, null, 2);
		this.shadowRoot.appendChild(pre);

		const p = document.createElement("p");
		p.textContent = `Elapsed time: ${elapsed} ms`;
		this.shadowRoot.appendChild(p);
	}

	connectedCallback() {
		console.log("Fetching data from:", this.url);
		this.fetchData();
	}

	disconnectedCallback() {
		console.log("Aborting fetch request");
		this.controller.abort();
	}
}

window.customElements.define("data-fetcher", DataFetcher);
