"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postBack = void 0;
var worker_threads_1 = require("worker_threads");
var postBack = function (data) {
    worker_threads_1.parentPort.postMessage(data);
};
exports.postBack = postBack;
