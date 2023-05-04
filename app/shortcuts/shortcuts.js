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
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterAll = exports.unregisterKeystroke = exports.registerKeystroke = void 0;
const main_1 = require("../stores/main");
const electron_1 = require("electron");
const createAction = (currentState, shortcut) => __awaiter(void 0, void 0, void 0, function* () {
    return () => {
        var _a, _b;
        console.log(`Action executed`);
        const clipboardText = (_b = (_a = electron_1.clipboard.readText()) === null || _a === void 0 ? void 0 : _a.toString()) === null || _b === void 0 ? void 0 : _b.trim();
        const updatedState = Object.assign(Object.assign({}, currentState), { query: clipboardText !== null && clipboardText !== void 0 ? clipboardText : '', messages: [
                { role: 'system', content: shortcut.system },
            ] });
        (0, main_1.updateState)(updatedState);
    };
});
const registerKeystroke = (currentState, shortcut) => __awaiter(void 0, void 0, void 0, function* () {
    if (electron_1.globalShortcut.isRegistered(shortcut.keystroke))
        return;
    const action = yield createAction(currentState, shortcut);
    const ret = electron_1.globalShortcut.register(shortcut.keystroke, action);
    if (!ret) {
        console.log(`${shortcut.keystroke} registration failed`);
    }
    // Check whether a shortcut is registered.
    console.log(`${shortcut.keystroke} registration result: ${electron_1.globalShortcut.isRegistered(shortcut.keystroke)}`);
});
exports.registerKeystroke = registerKeystroke;
const unregisterKeystroke = (shortcut) => __awaiter(void 0, void 0, void 0, function* () {
    electron_1.globalShortcut.unregister(shortcut.keystroke);
});
exports.unregisterKeystroke = unregisterKeystroke;
const unregisterAll = () => {
    electron_1.globalShortcut.unregisterAll();
};
exports.unregisterAll = unregisterAll;
//# sourceMappingURL=shortcuts.js.map