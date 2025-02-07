"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_worker_threads_1 = require("node:worker_threads");
var bootIoC4GameCore_1 = require("../../gameCore/bootIoC4GameCore");
var IoC_1 = require("../../IoC/IoC");
var IoCDependencyContainer_1 = require("../../IoC/IoCDependencyContainer");
var IoCResolveStrategyStd_1 = require("../../IoC/IoCResolveStrategyStd");
var IoCScopeTreeContainer_1 = require("../../IoC/IoCScopeTreeContainer");
var postBack_1 = require("./postBack");
var StrategyInterpretCmd_1 = require("./strategies/StrategyInterpretCmd");
new IoC_1.CommandIoCBootstrap(new IoCScopeTreeContainer_1.IoCScopeTreeContainer(new IoCDependencyContainer_1.IoCDependencyContainer(), "root"), new IoCResolveStrategyStd_1.IoCResolveStrategyStd()).execute();
(0, bootIoC4GameCore_1.bootIoC4GameCore)();
(0, bootIoC4GameCore_1.IoCResolveGameCore)("core.init")().then(function () {
    (0, postBack_1.postBack)("inited");
    (0, bootIoC4GameCore_1.IoCResolveGameCore)("loop.start")();
    (0, bootIoC4GameCore_1.IoCResolveGameCore)("loop.run")();
});
var interpreter = new StrategyInterpretCmd_1.StrategyInterpretCmd();
node_worker_threads_1.parentPort === null || node_worker_threads_1.parentPort === void 0 ? void 0 : node_worker_threads_1.parentPort.on("message", function (msg) {
    try {
        var cmd = interpreter.bind(JSON.parse(msg)).execute();
        if (cmd)
            (0, bootIoC4GameCore_1.IoCResolveGameCore)("cmdQueue.push")(cmd);
    }
    catch (error) {
        console.error(error);
    }
});
