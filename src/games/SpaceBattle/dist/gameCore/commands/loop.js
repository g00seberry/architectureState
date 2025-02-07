"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandGameLoopStopSoft = exports.CommandLoopStop = exports.CommandLoopStart = exports.CommandLoopRun = void 0;
var CommandMoveTo_1 = require("../../games/SpaceBattle/commands/CommandMoveTo");
var CommandRun_1 = require("../../games/SpaceBattle/commands/CommandRun");
var CoreCmd_1 = require("../CoreCmd");
var ExceptionHandlerCmd_1 = require("../ExceptionHandlerCmd/ExceptionHandlerCmd");
var isGameLoopActive = false;
var MoveToState = /** @class */ (function () {
    function MoveToState(parent) {
        this.parent = parent;
    }
    MoveToState.prototype.do = function (cmd) {
        if (cmd.constructor.name === CommandRun_1.CommandRun.name) {
            this.changeState();
        }
        else {
            console.log("MoveToState");
            cmd.execute();
        }
    };
    MoveToState.prototype.changeState = function () {
        this.parent.state = new RegularState(this.parent);
    };
    return MoveToState;
}());
var RegularState = /** @class */ (function () {
    function RegularState(parent) {
        this.parent = parent;
    }
    RegularState.prototype.do = function (cmd) {
        if (cmd.constructor.name === CommandMoveTo_1.CommandMoveTo.name) {
            this.changeState();
        }
        else {
            console.log("RegularState");
            cmd.execute();
        }
    };
    RegularState.prototype.changeState = function () {
        this.parent.state = new MoveToState(this.parent);
    };
    return RegularState;
}());
var CommandLoopRun = /** @class */ (function () {
    function CommandLoopRun() {
        this.state = new RegularState(this);
    }
    CommandLoopRun.prototype.execute = function () {
        return __awaiter(this, void 0, void 0, function () {
            var core, _a, cmdExceptionHandler, cmdQueue, cmd, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        core = (0, CoreCmd_1.getCoreCmd)();
                        _a = core.config, cmdExceptionHandler = _a.cmdExceptionHandler, cmdQueue = _a.cmdQueue;
                        _b.label = 1;
                    case 1:
                        if (!isGameLoopActive) return [3 /*break*/, 8];
                        cmd = cmdQueue.dequeue();
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 6, , 7]);
                        if (!cmd) return [3 /*break*/, 3];
                        this.state.do(cmd);
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, new Promise(function (res) { return setTimeout(res, 10); })];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        cmdExceptionHandler.handle((0, ExceptionHandlerCmd_1.makeExceptionHadlerContextCmd)(cmd, error_1));
                        return [3 /*break*/, 7];
                    case 7: return [3 /*break*/, 1];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    return CommandLoopRun;
}());
exports.CommandLoopRun = CommandLoopRun;
var CommandLoopStart = /** @class */ (function () {
    function CommandLoopStart() {
    }
    CommandLoopStart.prototype.execute = function () {
        isGameLoopActive = true;
    };
    return CommandLoopStart;
}());
exports.CommandLoopStart = CommandLoopStart;
var CommandLoopStop = /** @class */ (function () {
    function CommandLoopStop() {
    }
    CommandLoopStop.prototype.execute = function () {
        isGameLoopActive = false;
    };
    return CommandLoopStop;
}());
exports.CommandLoopStop = CommandLoopStop;
var CommandGameLoopStopSoft = /** @class */ (function () {
    function CommandGameLoopStopSoft() {
    }
    CommandGameLoopStopSoft.prototype.execute = function () {
        new CommandLoopStop().execute();
        var core = (0, CoreCmd_1.getCoreCmd)();
        var _a = core.config, cmdExceptionHandler = _a.cmdExceptionHandler, cmdQueue = _a.cmdQueue;
        while (!cmdQueue.isEmpty()) {
            var cmd = cmdQueue.dequeue();
            try {
                cmd.execute();
            }
            catch (error) {
                cmdExceptionHandler.handle((0, ExceptionHandlerCmd_1.makeExceptionHadlerContextCmd)(cmd, error));
            }
        }
    };
    return CommandGameLoopStopSoft;
}());
exports.CommandGameLoopStopSoft = CommandGameLoopStopSoft;
