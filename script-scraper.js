const { fork } = require("child_process");
const { EventEmitter } = require("events");
const { default: asyncify } = require("callback-to-async-iterator");

class ScriptScraper extends EventEmitter {
  constructor(url, userAgent) {
    super();
    this.worker = fork("./worker", {
      env: {
        URL: url,
        USER_AGENT: userAgent
      },
      silent: true,
      detached: true,
      stdio: "ignore"
    });
    this.worker.on("message", message => {
      if (message.type === "data") {
        this.emit("data", script);
      }
    });
    this.worker.on("error", error => {
      if (message.type === "error") {
        throw message.payload;
      }
    });
  }
  [Symbol.asyncIterator]() {
    return asyncify(callback => {
      this.on("data", script => {
        callback(script);
      });
    });
  }
  close() {
    this.worker.close();
  }
}
