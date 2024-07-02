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
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var telegraf_1 = require("telegraf");
var downloadVoiceFile_1 = require("./lib/downloadVoiceFile");
var postToWhisper_1 = require("./lib/postToWhisper");
var htApi_1 = require("./lib/htApi");
var fs_1 = require("fs");
var chatWithTools_1 = require("./models/chatWithTools");
var workDir = "./tmp";
var telegramToken = process.env.TELEGRAM_TOKEN;
var bot = new telegraf_1.Telegraf(telegramToken);
var model = new chatWithTools_1.Model();
if (!(0, fs_1.existsSync)(workDir)) {
    (0, fs_1.mkdirSync)(workDir);
}
bot.start(function (ctx) {
    ctx.reply("Welcome to my Telegram bot!");
});
bot.help(function (ctx) {
    ctx.reply("Send me a message and I will echo it back to you.");
});
bot.on("voice", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var voice, localFilePath, error_1, transcription, response, error_2, responseTranscriptionPath, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(process.env.SERVE_THIS_USER_ONLY && parseInt(process.env.SERVE_THIS_USER_ONLY) !== ctx.message.chat.id)) return [3 /*break*/, 2];
                console.log("User ".concat(ctx.message.chat.id.toString(), " is not allowed to be served."));
                return [4 /*yield*/, ctx.reply("Sorry, you're not allowed to be served by me.")];
            case 1:
                _a.sent();
                return [2 /*return*/];
            case 2:
                voice = ctx.message.voice;
                return [4 /*yield*/, ctx.sendChatAction("typing")];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 8]);
                return [4 /*yield*/, (0, downloadVoiceFile_1.downloadVoiceFile)(workDir, voice.file_id, bot)];
            case 5:
                localFilePath = _a.sent();
                return [3 /*break*/, 8];
            case 6:
                error_1 = _a.sent();
                console.log(error_1);
                return [4 /*yield*/, ctx.reply("Whoops! There was an error while downloading the voice file. Maybe ffmpeg is not installed?")];
            case 7:
                _a.sent();
                return [2 /*return*/];
            case 8: return [4 /*yield*/, (0, postToWhisper_1.postToWhisper)(model.openai, localFilePath)];
            case 9:
                transcription = _a.sent();
                return [4 /*yield*/, ctx.reply("Transcription: ".concat(transcription))];
            case 10:
                _a.sent();
                return [4 /*yield*/, ctx.sendChatAction("typing")];
            case 11:
                _a.sent();
                _a.label = 12;
            case 12:
                _a.trys.push([12, 14, , 16]);
                return [4 /*yield*/, model.call(transcription)];
            case 13:
                response = _a.sent();
                return [3 /*break*/, 16];
            case 14:
                error_2 = _a.sent();
                console.log(error_2);
                return [4 /*yield*/, ctx.reply("Whoops! There was an error while talking to OpenAI. See logs for details.")];
            case 15:
                _a.sent();
                return [2 /*return*/];
            case 16:
                console.log(response);
                return [4 /*yield*/, ctx.reply(response)];
            case 17:
                _a.sent();
                _a.label = 18;
            case 18:
                _a.trys.push([18, 22, , 24]);
                return [4 /*yield*/, (0, htApi_1.textToSpeech)(response)];
            case 19:
                responseTranscriptionPath = _a.sent();
                return [4 /*yield*/, ctx.sendChatAction("typing")];
            case 20:
                _a.sent();
                return [4 /*yield*/, ctx.replyWithVoice({
                        source: (0, fs_1.createReadStream)(responseTranscriptionPath),
                        filename: localFilePath,
                    })];
            case 21:
                _a.sent();
                return [3 /*break*/, 24];
            case 22:
                error_3 = _a.sent();
                console.log(error_3);
                return [4 /*yield*/, ctx.reply("Whoops! There was an error while synthesizing the response via play.ht. See logs for details.")];
            case 23:
                _a.sent();
                return [3 /*break*/, 24];
            case 24: return [2 /*return*/];
        }
    });
}); });
bot.on("message", function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var text, response, error_4, message;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                text = ctx.message.text;
                if (!text) {
                    ctx.reply("Please send a text message.");
                    return [2 /*return*/];
                }
                console.log("Input: ", text);
                return [4 /*yield*/, ctx.sendChatAction("typing")];
            case 1:
                _d.sent();
                _d.label = 2;
            case 2:
                _d.trys.push([2, 5, , 7]);
                return [4 /*yield*/, model.call(text)];
            case 3:
                response = _d.sent();
                return [4 /*yield*/, ctx.reply(response)];
            case 4:
                _d.sent();
                return [3 /*break*/, 7];
            case 5:
                error_4 = _d.sent();
                console.log(error_4);
                message = JSON.stringify((_c = (_b = (_a = error_4 === null || error_4 === void 0 ? void 0 : error_4.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) !== null && _c !== void 0 ? _c : "Unable to extract error");
                console.log({ message: message });
                return [4 /*yield*/, ctx.reply("Whoops! There was an error while talking to OpenAI. Error: " + message)];
            case 6:
                _d.sent();
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
bot.launch().then(function () {
    console.log("Bot launched");
});
process.on("SIGTERM", function () {
    bot.stop();
});
