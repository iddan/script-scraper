const rp = require("request-promise");
const { JSDOM } = require("jsdom");
const { toJSON } = require("./json-dom");

const { URL: url, USER_AGENT: userAgent } = process.env;

function handleScript(script) {
  process.send({ type: "data", payload: toJSON(script) });
}

function handleMutations(mutations) {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === "SCRIPT") {
          handleScript(node);
        }
      }
    }
  }
}

(async () => {
  try {
    console.info(`Fetching ${url}...`);
    const htmlString = await rp(url, {
      headers: {
        "User-Agent": userAgent
      }
    });
    console.info(`Fetched ${url} Successfully`);
    const dom = new JSDOM(htmlString, {
      resources: "usable",
      runScripts: "dangerously"
    });
    for (const script of dom.window.document.scripts) {
      handleScript(script);
    }
    dom.window.onerror = error => {
      process.send({ type: "error", payload: error });
    };
    const mutationObserver = new dom.window.MutationObserver(handleMutations);
    mutationObserver.observe(dom.window.document, {
      childList: true,
      subtree: true
    });
  } catch (error) {
    process.send({ type: "error", payload: error });
  }
})();
