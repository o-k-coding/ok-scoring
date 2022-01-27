"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var child_process_1 = require("child_process");
function goServeExecutor(options, context) {
    var _a, _b;
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var projectName, sourceRoot, mainFile, command;
        return tslib_1.__generator(this, function (_c) {
            projectName = context === null || context === void 0 ? void 0 : context.projectName;
            sourceRoot = (_b = (_a = context === null || context === void 0 ? void 0 : context.workspace) === null || _a === void 0 ? void 0 : _a.projects[projectName]) === null || _b === void 0 ? void 0 : _b.sourceRoot;
            console.log('source root', sourceRoot);
            mainFile = options.main || 'main.go';
            command = "go run " + mainFile;
            try {
                console.log("Executing command: " + command);
                child_process_1.execSync(command, { cwd: sourceRoot, stdio: [0, 1, 2] });
                return [2 /*return*/, { success: true }];
            }
            catch (e) {
                console.error("Failed to execute command: " + command, e);
                return [2 /*return*/, { success: false }];
            }
            return [2 /*return*/];
        });
    });
}
exports.default = goServeExecutor;
//# sourceMappingURL=impl.js.map