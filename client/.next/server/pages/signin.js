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

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/react/jsx-dev-runtime */ \"@emotion/react/jsx-dev-runtime\");\n/* harmony import */ var _emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi/connectors/metaMask */ \"wagmi/connectors/metaMask\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/react */ \"next-auth/react\");\n/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! wagmi */ \"wagmi\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/router */ \"next/router\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @moralisweb3/next */ \"@moralisweb3/next\");\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_3__]);\n([wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__, wagmi__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\nfunction SignIn() {\n    const { connectAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useConnect)();\n    const { disconnectAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useDisconnect)();\n    const { isConnected  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useAccount)();\n    const { signMessageAsync  } = (0,wagmi__WEBPACK_IMPORTED_MODULE_3__.useSignMessage)();\n    const { requestChallengeAsync  } = (0,_moralisweb3_next__WEBPACK_IMPORTED_MODULE_5__.useAuthRequestChallengeEvm)();\n    const { push  } = (0,next_router__WEBPACK_IMPORTED_MODULE_4__.useRouter)();\n    const handleAuth = async ()=>{\n        if (isConnected) {\n            await disconnectAsync();\n        }\n        const { account , chain  } = await connectAsync({\n            connector: new wagmi_connectors_metaMask__WEBPACK_IMPORTED_MODULE_1__.MetaMaskConnector()\n        });\n        const { message  } = await requestChallengeAsync({\n            address: account,\n            chainId: chain.id\n        });\n        const signature = await signMessageAsync({\n            message\n        });\n        // redirect user after success authentication to '/user' page\n        const { url  } = await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_2__.signIn)(\"moralis-auth\", {\n            message,\n            signature,\n            redirect: false,\n            callbackUrl: \"/\"\n        });\n        /**\r\n     * instead of using signIn(..., redirect: \"/user\")\r\n     * we get the url from callback and push it to the router to avoid page refreshing\r\n     */ fetch(`/api/auth/sign-up?address=${account}`) // user DB에 저장\n        .then((res)=>res.json()).then((data)=>console.log(data));\n        fetch(`/api/auth/enroll-wishlist?address=${account}`) // wishlist DB에 저장\n        .then((res)=>res.json()).then((data)=>console.log(data));\n        push(url);\n    };\n    return /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        children: [\n            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"h3\", {\n                children: \"Web3 Authentication\"\n            }, void 0, false, {\n                fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n                lineNumber: 53,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,_emotion_react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"button\", {\n                className: \"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto mb-5\",\n                onClick: handleAuth,\n                children: \"Authenticate via Metamask\"\n            }, void 0, false, {\n                fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n                lineNumber: 54,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/euijunlee/BEB-08-LiFT-3/client/pages/signin.tsx\",\n        lineNumber: 52,\n        columnNumber: 5\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SignIn);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9zaWduaW4udHN4LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUE4RDtBQUNyQjtBQUNxQztBQUN0QztBQUN1QjtBQUUvRCxTQUFTUSxTQUFTO0lBQ2hCLE1BQU0sRUFBRUMsYUFBWSxFQUFFLEdBQUdOLGlEQUFVQTtJQUNuQyxNQUFNLEVBQUVPLGdCQUFlLEVBQUUsR0FBR0wsb0RBQWFBO0lBQ3pDLE1BQU0sRUFBRU0sWUFBVyxFQUFFLEdBQUdULGlEQUFVQTtJQUNsQyxNQUFNLEVBQUVVLGlCQUFnQixFQUFFLEdBQUdSLHFEQUFjQTtJQUMzQyxNQUFNLEVBQUVTLHNCQUFxQixFQUFFLEdBQUdOLDZFQUEwQkE7SUFDNUQsTUFBTSxFQUFFTyxLQUFJLEVBQUUsR0FBR1Isc0RBQVNBO0lBRTFCLE1BQU1TLGFBQWEsVUFBWTtRQUM3QixJQUFJSixhQUFhO1lBQ2YsTUFBTUQ7UUFDUixDQUFDO1FBRUQsTUFBTSxFQUFFTSxRQUFPLEVBQUVDLE1BQUssRUFBRSxHQUFHLE1BQU1SLGFBQWE7WUFDNUNTLFdBQVcsSUFBSWxCLHdFQUFpQkE7UUFDbEM7UUFFQSxNQUFNLEVBQUVtQixRQUFPLEVBQUUsR0FBRyxNQUFNTixzQkFBc0I7WUFDOUNPLFNBQVNKO1lBQ1RLLFNBQVNKLE1BQU1LLEVBQUU7UUFDbkI7UUFFQSxNQUFNQyxZQUFZLE1BQU1YLGlCQUFpQjtZQUFFTztRQUFRO1FBQ25ELDZEQUE2RDtRQUM3RCxNQUFNLEVBQUVLLElBQUcsRUFBRSxHQUFHLE1BQU12Qix1REFBTUEsQ0FBQyxnQkFBZ0I7WUFDM0NrQjtZQUNBSTtZQUNBRSxVQUFVLEtBQUs7WUFDZkMsYUFBYTtRQUNmO1FBQ0E7OztLQUdDLEdBQ0RDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRVgsUUFBUSxDQUFDLEVBQUUsY0FBYztTQUN6RFksSUFBSSxDQUFDLENBQUNDLE1BQVFBLElBQUlDLElBQUksSUFDdEJGLElBQUksQ0FBQyxDQUFDRyxPQUFTQyxRQUFRQyxHQUFHLENBQUNGO1FBRTlCSixNQUFNLENBQUMsa0NBQWtDLEVBQUVYLFFBQVEsQ0FBQyxFQUFFLGtCQUFrQjtTQUNyRVksSUFBSSxDQUFDLENBQUNDLE1BQVFBLElBQUlDLElBQUksSUFDdEJGLElBQUksQ0FBQyxDQUFDRyxPQUFTQyxRQUFRQyxHQUFHLENBQUNGO1FBQzlCakIsS0FBS1U7SUFDUDtJQUVBLHFCQUNFLHVFQUFDVTs7MEJBQ0MsdUVBQUNDOzBCQUFHOzs7Ozs7MEJBQ0osdUVBQUNDO2dCQUNDQyxXQUFVO2dCQUNWQyxTQUFTdkI7MEJBQ1Y7Ozs7Ozs7Ozs7OztBQUtQO0FBRUEsaUVBQWVQLE1BQU1BLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21tZXJjZS8uL3BhZ2VzL3NpZ25pbi50c3g/N2Y5MiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRhTWFza0Nvbm5lY3RvciB9IGZyb20gJ3dhZ21pL2Nvbm5lY3RvcnMvbWV0YU1hc2snO1xyXG5pbXBvcnQgeyBzaWduSW4gfSBmcm9tICduZXh0LWF1dGgvcmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VBY2NvdW50LCB1c2VDb25uZWN0LCB1c2VTaWduTWVzc2FnZSwgdXNlRGlzY29ubmVjdCB9IGZyb20gJ3dhZ21pJztcclxuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xyXG5pbXBvcnQgeyB1c2VBdXRoUmVxdWVzdENoYWxsZW5nZUV2bSB9IGZyb20gJ0Btb3JhbGlzd2ViMy9uZXh0JztcclxuXHJcbmZ1bmN0aW9uIFNpZ25JbigpIHtcclxuICBjb25zdCB7IGNvbm5lY3RBc3luYyB9ID0gdXNlQ29ubmVjdCgpO1xyXG4gIGNvbnN0IHsgZGlzY29ubmVjdEFzeW5jIH0gPSB1c2VEaXNjb25uZWN0KCk7XHJcbiAgY29uc3QgeyBpc0Nvbm5lY3RlZCB9ID0gdXNlQWNjb3VudCgpO1xyXG4gIGNvbnN0IHsgc2lnbk1lc3NhZ2VBc3luYyB9ID0gdXNlU2lnbk1lc3NhZ2UoKTtcclxuICBjb25zdCB7IHJlcXVlc3RDaGFsbGVuZ2VBc3luYyB9ID0gdXNlQXV0aFJlcXVlc3RDaGFsbGVuZ2VFdm0oKTtcclxuICBjb25zdCB7IHB1c2ggfSA9IHVzZVJvdXRlcigpO1xyXG5cclxuICBjb25zdCBoYW5kbGVBdXRoID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgaWYgKGlzQ29ubmVjdGVkKSB7XHJcbiAgICAgIGF3YWl0IGRpc2Nvbm5lY3RBc3luYygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgYWNjb3VudCwgY2hhaW4gfSA9IGF3YWl0IGNvbm5lY3RBc3luYyh7XHJcbiAgICAgIGNvbm5lY3RvcjogbmV3IE1ldGFNYXNrQ29ubmVjdG9yKCksXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB7IG1lc3NhZ2UgfSA9IGF3YWl0IHJlcXVlc3RDaGFsbGVuZ2VBc3luYyh7XHJcbiAgICAgIGFkZHJlc3M6IGFjY291bnQsXHJcbiAgICAgIGNoYWluSWQ6IGNoYWluLmlkLFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2lnbmF0dXJlID0gYXdhaXQgc2lnbk1lc3NhZ2VBc3luYyh7IG1lc3NhZ2UgfSk7XHJcbiAgICAvLyByZWRpcmVjdCB1c2VyIGFmdGVyIHN1Y2Nlc3MgYXV0aGVudGljYXRpb24gdG8gJy91c2VyJyBwYWdlXHJcbiAgICBjb25zdCB7IHVybCB9ID0gYXdhaXQgc2lnbkluKCdtb3JhbGlzLWF1dGgnLCB7XHJcbiAgICAgIG1lc3NhZ2UsXHJcbiAgICAgIHNpZ25hdHVyZSxcclxuICAgICAgcmVkaXJlY3Q6IGZhbHNlLFxyXG4gICAgICBjYWxsYmFja1VybDogJy8nLFxyXG4gICAgfSk7XHJcbiAgICAvKipcclxuICAgICAqIGluc3RlYWQgb2YgdXNpbmcgc2lnbkluKC4uLiwgcmVkaXJlY3Q6IFwiL3VzZXJcIilcclxuICAgICAqIHdlIGdldCB0aGUgdXJsIGZyb20gY2FsbGJhY2sgYW5kIHB1c2ggaXQgdG8gdGhlIHJvdXRlciB0byBhdm9pZCBwYWdlIHJlZnJlc2hpbmdcclxuICAgICAqL1xyXG4gICAgZmV0Y2goYC9hcGkvYXV0aC9zaWduLXVwP2FkZHJlc3M9JHthY2NvdW50fWApIC8vIHVzZXIgRELsl5Ag7KCA7J6lXHJcbiAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgIC50aGVuKChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhKSk7XHJcblxyXG4gICAgZmV0Y2goYC9hcGkvYXV0aC9lbnJvbGwtd2lzaGxpc3Q/YWRkcmVzcz0ke2FjY291bnR9YCkgLy8gd2lzaGxpc3QgRELsl5Ag7KCA7J6lXHJcbiAgICAgIC50aGVuKChyZXMpID0+IHJlcy5qc29uKCkpXHJcbiAgICAgIC50aGVuKChkYXRhKSA9PiBjb25zb2xlLmxvZyhkYXRhKSk7XHJcbiAgICBwdXNoKHVybCk7XHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXY+XHJcbiAgICAgIDxoMz5XZWIzIEF1dGhlbnRpY2F0aW9uPC9oMz5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzTmFtZT0nYmctYmx1ZS01MDAgaG92ZXI6YmctYmx1ZS03MDAgdGV4dC13aGl0ZSBmb250LWJvbGQgcHktMiBweC00IHJvdW5kZWQgbWwtYXV0byBtYi01J1xyXG4gICAgICAgIG9uQ2xpY2s9e2hhbmRsZUF1dGh9XHJcbiAgICAgID5cclxuICAgICAgICBBdXRoZW50aWNhdGUgdmlhIE1ldGFtYXNrXHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2lnbkluO1xyXG4iXSwibmFtZXMiOlsiTWV0YU1hc2tDb25uZWN0b3IiLCJzaWduSW4iLCJ1c2VBY2NvdW50IiwidXNlQ29ubmVjdCIsInVzZVNpZ25NZXNzYWdlIiwidXNlRGlzY29ubmVjdCIsInVzZVJvdXRlciIsInVzZUF1dGhSZXF1ZXN0Q2hhbGxlbmdlRXZtIiwiU2lnbkluIiwiY29ubmVjdEFzeW5jIiwiZGlzY29ubmVjdEFzeW5jIiwiaXNDb25uZWN0ZWQiLCJzaWduTWVzc2FnZUFzeW5jIiwicmVxdWVzdENoYWxsZW5nZUFzeW5jIiwicHVzaCIsImhhbmRsZUF1dGgiLCJhY2NvdW50IiwiY2hhaW4iLCJjb25uZWN0b3IiLCJtZXNzYWdlIiwiYWRkcmVzcyIsImNoYWluSWQiLCJpZCIsInNpZ25hdHVyZSIsInVybCIsInJlZGlyZWN0IiwiY2FsbGJhY2tVcmwiLCJmZXRjaCIsInRoZW4iLCJyZXMiLCJqc29uIiwiZGF0YSIsImNvbnNvbGUiLCJsb2ciLCJkaXYiLCJoMyIsImJ1dHRvbiIsImNsYXNzTmFtZSIsIm9uQ2xpY2siXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/signin.tsx\n");

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