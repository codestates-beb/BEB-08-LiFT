"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/signin";
exports.ids = ["pages/signin"];
exports.modules = {

/***/ "./pages/signin.tsx":
/*!**************************!*\
  !*** ./pages/signin.tsx ***!
  \**************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-dev-runtime */ \"@emotion/react/jsx-dev-runtime\");\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi/connectors/metaMask */ \"wagmi/connectors/metaMask\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @moralisweb3/next */ \"@moralisweb3/next\");\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_3__]);\n([wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nfunction SignIn() {\n    const { connectAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useConnect)();\n    const { disconnectAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useDisconnect)();\n    const { isConnected  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useAccount)();\n    const { signMessageAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useSignMessage)();\n    const { requestChallengeAsync  } = (0,_moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__.useAuthRequestChallengeEvm)();\n    const { push  } = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    const handleAuth = async ()=>{\n        if (isConnected) {\n            await disconnectAsync();\n        }\n        const { account , chain  } = await connectAsync({\n            connector: new wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__.MetaMaskConnector()\n        });\n        const { message  } = await requestChallengeAsync({\n            address: account,\n            chainId: chain.id\n        });\n        const signature = await signMessageAsync({\n            message\n        });\n        // redirect user after success authentication to '/user' page\n        const { url  } = await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.signIn)(\"moralis-auth\", {\n            message,\n            signature,\n            redirect: false,\n            callbackUrl: \"/user\"\n        });\n        /**\r\n         * instead of using signIn(..., redirect: \"/user\")\r\n         * we get the url from callback and push it to the router to avoid page refreshing\r\n         */ push(url);\n    };\n    return /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                children: \"Web3 Authentication\"\n            }, void 0, false, {\n                fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n                lineNumber: 37,\n                columnNumber: 13\n            }, this),\n            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                onClick: handleAuth,\n                children: \"Authenticate via Metamask\"\n            }, void 0, false, {\n                fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n                lineNumber: 38,\n                columnNumber: 13\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n        lineNumber: 36,\n        columnNumber: 9\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SignIn);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9zaWduaW4udHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE4RDtBQUNyQjtBQUNxQztBQUN0QztBQUN1QjtBQUUvRCxTQUFTUSxTQUFTO0lBQ2QsTUFBTSxFQUFFQyxhQUFZLEVBQUUsR0FBR04saURBQVVBO0lBQ25DLE1BQU0sRUFBRU8sZ0JBQWUsRUFBRSxHQUFHTCxvREFBYUE7SUFDekMsTUFBTSxFQUFFTSxZQUFXLEVBQUUsR0FBR1QsaURBQVVBO0lBQ2xDLE1BQU0sRUFBRVUsaUJBQWdCLEVBQUUsR0FBR1IscURBQWNBO0lBQzNDLE1BQU0sRUFBRVMsc0JBQXFCLEVBQUUsR0FBR04sNkVBQTBCQTtJQUM1RCxNQUFNLEVBQUVPLEtBQUksRUFBRSxHQUFHUixzREFBU0E7SUFFMUIsTUFBTVMsYUFBYSxVQUFZO1FBQzNCLElBQUlKLGFBQWE7WUFDYixNQUFNRDtRQUNWLENBQUM7UUFFRCxNQUFNLEVBQUVNLFFBQU8sRUFBRUMsTUFBSyxFQUFFLEdBQUcsTUFBTVIsYUFBYTtZQUFFUyxXQUFXLElBQUlsQix3RUFBaUJBO1FBQUc7UUFFbkYsTUFBTSxFQUFFbUIsUUFBTyxFQUFFLEdBQUcsTUFBTU4sc0JBQXNCO1lBQUVPLFNBQVNKO1lBQVNLLFNBQVNKLE1BQU1LLEVBQUU7UUFBQztRQUV0RixNQUFNQyxZQUFZLE1BQU1YLGlCQUFpQjtZQUFFTztRQUFRO1FBRW5ELDZEQUE2RDtRQUM3RCxNQUFNLEVBQUVLLElBQUcsRUFBRSxHQUFHLE1BQU12Qix1REFBTUEsQ0FBQyxnQkFBZ0I7WUFBRWtCO1lBQVNJO1lBQVdFLFVBQVUsS0FBSztZQUFFQyxhQUFhO1FBQVE7UUFDekc7OztTQUdDLEdBQ0RaLEtBQUtVO0lBQ1Q7SUFFQSxxQkFDSSx1RUFBQ0c7OzBCQUNHLHVFQUFDQzswQkFBRzs7Ozs7OzBCQUNKLHVFQUFDQztnQkFBT0MsU0FBU2Y7MEJBQVk7Ozs7Ozs7Ozs7OztBQUd6QztBQUVBLGlFQUFlUCxNQUFNQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vY29tbWVyY2UvLi9wYWdlcy9zaWduaW4udHN4PzdmOTIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0YU1hc2tDb25uZWN0b3IgfSBmcm9tICd3YWdtaS9jb25uZWN0b3JzL21ldGFNYXNrJztcclxuaW1wb3J0IHsgc2lnbkluIH0gZnJvbSAnbmV4dC1hdXRoL3JlYWN0JztcclxuaW1wb3J0IHsgdXNlQWNjb3VudCwgdXNlQ29ubmVjdCwgdXNlU2lnbk1lc3NhZ2UsIHVzZURpc2Nvbm5lY3QgfSBmcm9tICd3YWdtaSc7XHJcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcclxuaW1wb3J0IHsgdXNlQXV0aFJlcXVlc3RDaGFsbGVuZ2VFdm0gfSBmcm9tICdAbW9yYWxpc3dlYjMvbmV4dCc7XHJcblxyXG5mdW5jdGlvbiBTaWduSW4oKSB7XHJcbiAgICBjb25zdCB7IGNvbm5lY3RBc3luYyB9ID0gdXNlQ29ubmVjdCgpO1xyXG4gICAgY29uc3QgeyBkaXNjb25uZWN0QXN5bmMgfSA9IHVzZURpc2Nvbm5lY3QoKTtcclxuICAgIGNvbnN0IHsgaXNDb25uZWN0ZWQgfSA9IHVzZUFjY291bnQoKTtcclxuICAgIGNvbnN0IHsgc2lnbk1lc3NhZ2VBc3luYyB9ID0gdXNlU2lnbk1lc3NhZ2UoKTtcclxuICAgIGNvbnN0IHsgcmVxdWVzdENoYWxsZW5nZUFzeW5jIH0gPSB1c2VBdXRoUmVxdWVzdENoYWxsZW5nZUV2bSgpO1xyXG4gICAgY29uc3QgeyBwdXNoIH0gPSB1c2VSb3V0ZXIoKTtcclxuXHJcbiAgICBjb25zdCBoYW5kbGVBdXRoID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIGlmIChpc0Nvbm5lY3RlZCkge1xyXG4gICAgICAgICAgICBhd2FpdCBkaXNjb25uZWN0QXN5bmMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHsgYWNjb3VudCwgY2hhaW4gfSA9IGF3YWl0IGNvbm5lY3RBc3luYyh7IGNvbm5lY3RvcjogbmV3IE1ldGFNYXNrQ29ubmVjdG9yKCkgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHsgbWVzc2FnZSB9ID0gYXdhaXQgcmVxdWVzdENoYWxsZW5nZUFzeW5jKHsgYWRkcmVzczogYWNjb3VudCwgY2hhaW5JZDogY2hhaW4uaWQgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNpZ25hdHVyZSA9IGF3YWl0IHNpZ25NZXNzYWdlQXN5bmMoeyBtZXNzYWdlIH0pO1xyXG5cclxuICAgICAgICAvLyByZWRpcmVjdCB1c2VyIGFmdGVyIHN1Y2Nlc3MgYXV0aGVudGljYXRpb24gdG8gJy91c2VyJyBwYWdlXHJcbiAgICAgICAgY29uc3QgeyB1cmwgfSA9IGF3YWl0IHNpZ25JbignbW9yYWxpcy1hdXRoJywgeyBtZXNzYWdlLCBzaWduYXR1cmUsIHJlZGlyZWN0OiBmYWxzZSwgY2FsbGJhY2tVcmw6ICcvdXNlcicgfSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogaW5zdGVhZCBvZiB1c2luZyBzaWduSW4oLi4uLCByZWRpcmVjdDogXCIvdXNlclwiKVxyXG4gICAgICAgICAqIHdlIGdldCB0aGUgdXJsIGZyb20gY2FsbGJhY2sgYW5kIHB1c2ggaXQgdG8gdGhlIHJvdXRlciB0byBhdm9pZCBwYWdlIHJlZnJlc2hpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdXNoKHVybCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGgzPldlYjMgQXV0aGVudGljYXRpb248L2gzPlxyXG4gICAgICAgICAgICA8YnV0dG9uIG9uQ2xpY2s9e2hhbmRsZUF1dGh9PkF1dGhlbnRpY2F0ZSB2aWEgTWV0YW1hc2s8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICk7XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFNpZ25JbjtcclxuIl0sIm5hbWVzIjpbIk1ldGFNYXNrQ29ubmVjdG9yIiwic2lnbkluIiwidXNlQWNjb3VudCIsInVzZUNvbm5lY3QiLCJ1c2VTaWduTWVzc2FnZSIsInVzZURpc2Nvbm5lY3QiLCJ1c2VSb3V0ZXIiLCJ1c2VBdXRoUmVxdWVzdENoYWxsZW5nZUV2bSIsIlNpZ25JbiIsImNvbm5lY3RBc3luYyIsImRpc2Nvbm5lY3RBc3luYyIsImlzQ29ubmVjdGVkIiwic2lnbk1lc3NhZ2VBc3luYyIsInJlcXVlc3RDaGFsbGVuZ2VBc3luYyIsInB1c2giLCJoYW5kbGVBdXRoIiwiYWNjb3VudCIsImNoYWluIiwiY29ubmVjdG9yIiwibWVzc2FnZSIsImFkZHJlc3MiLCJjaGFpbklkIiwiaWQiLCJzaWduYXR1cmUiLCJ1cmwiLCJyZWRpcmVjdCIsImNhbGxiYWNrVXJsIiwiZGl2IiwiaDMiLCJidXR0b24iLCJvbkNsaWNrIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/signin.tsx\n");

/***/ }),

/***/ "@emotion/react/jsx-dev-runtime":
/*!*************************************************!*\
  !*** external "@emotion/react/jsx-dev-runtime" ***!
  \*************************************************/
/***/ ((module) => {

module.exports = require("@emotion/react/jsx-dev-runtime");

/***/ }),

/***/ "@moralisweb3/next":
/*!************************************!*\
  !*** external "@moralisweb3/next" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@moralisweb3/next");

/***/ }),

/***/ "next-auth/react":
/*!**********************************!*\
  !*** external "next-auth/react" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("next-auth/react");

/***/ }),

/***/ "next/router":
/*!******************************!*\
  !*** external "next/router" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("next/router");

/***/ }),

/***/ "wagmi":
/*!************************!*\
  !*** external "wagmi" ***!
  \************************/
/***/ ((module) => {

module.exports = import("wagmi");;

/***/ }),

/***/ "wagmi/connectors/metaMask":
/*!********************************************!*\
  !*** external "wagmi/connectors/metaMask" ***!
  \********************************************/
/***/ ((module) => {

module.exports = import("wagmi/connectors/metaMask");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/signin.tsx"));
module.exports = __webpack_exports__;

})();