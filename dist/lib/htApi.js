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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.textToSpeech = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = require("fs");
var htApiUserId = process.env.PLAY_HT_USER_ID;
var htApiSecretKey = process.env.PLAY_HT_SECRET_KEY;
var htVoice = process.env.PLAY_HT_VOICE;
function textToSpeech(text) {
    return __awaiter(this, void 0, void 0, function () {
        function downloadTranscript() {
            return __awaiter(this, void 0, void 0, function () {
                var status;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, axios_1.default.get(transcriptionStatusUrl, { headers: headers })];
                        case 1:
                            status = _a.sent();
                            console.log(status.data);
                            if (status.data.converted) {
                                return [2 /*return*/, status.data.audioUrl];
                            }
                            return [2 /*return*/];
                    }
                });
            });
        }
        var endpoint, headers, data, response, transcriptionId, transcriptionStatusUrl, audioUrl, transcriptPath, writestream, download;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!htApiUserId || !htApiSecretKey) {
                        throw new Error("Play.ht API credentials not set.");
                    }
                    endpoint = "https://play.ht/api/v1/convert";
                    headers = {
                        Authorization: htApiSecretKey,
                        "X-User-ID": htApiUserId,
                        "Content-Type": "application/json",
                    };
                    data = {
                        voice: htVoice || "en-US-MichelleNeural",
                        ssml: ["<speak><p>".concat(text, "</p></speak>")],
                        title: text.substring(0, 36),
                    };
                    return [4 /*yield*/, axios_1.default.post(endpoint, data, { headers: headers })];
                case 1:
                    response = _a.sent();
                    console.log(response.data);
                    transcriptionId = response.data.transcriptionId;
                    transcriptionStatusUrl = "https://play.ht/api/v1/articleStatus?transcriptionId=".concat(transcriptionId);
                    _a.label = 2;
                case 2:
                    if (!(audioUrl === undefined)) return [3 /*break*/, 5];
                    console.log("Check if transcript is ready...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1500); })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, downloadTranscript()];
                case 4:
                    audioUrl = _a.sent();
                    return [3 /*break*/, 2];
                case 5:
                    transcriptPath = "./tmp/ht-".concat(transcriptionId, ".mp3");
                    writestream = (0, fs_1.createWriteStream)(transcriptPath);
                    return [4 /*yield*/, (0, axios_1.default)({
                            method: "GET",
                            url: audioUrl,
                            responseType: "stream",
                        })];
                case 6:
                    download = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                download.data.pipe(writestream);
                                writestream.on("finish", resolve);
                                writestream.on("error", reject);
                                return [2 /*return*/];
                            });
                        }); })];
                case 7:
                    _a.sent();
                    return [2 /*return*/, transcriptPath];
            }
        });
    });
}
exports.textToSpeech = textToSpeech;
