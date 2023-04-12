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
exports.id = "pages/api/get-categories";
exports.ids = ["pages/api/get-categories"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./pages/api/get-categories.ts":
/*!*************************************!*\
  !*** ./pages/api/get-categories.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// db에 데이터 조회\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function getCategories() {\n    try {\n        const response = await prisma.categories.findMany({});\n        console.log(response);\n        return response;\n    } catch (error) {\n        console.error(error);\n    }\n}\nasync function handler(req, res) {\n    try {\n        const dnfts = await getCategories();\n        res.status(200).json({\n            dnfts: dnfts,\n            message: \"Success\"\n        });\n    } catch (error) {\n        res.status(400).json({\n            message: \"Failed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ2V0LWNhdGVnb3JpZXMudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsYUFBYTtBQUVnQztBQUU3QyxNQUFNQyxTQUFTLElBQUlELHdEQUFZQTtBQUUvQixlQUFlRSxnQkFBZ0I7SUFDN0IsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUYsT0FBT0csVUFBVSxDQUFDQyxRQUFRLENBQUMsQ0FBQztRQUNuREMsUUFBUUMsR0FBRyxDQUFDSjtRQUNaLE9BQU9BO0lBQ1QsRUFBRSxPQUFPSyxPQUFPO1FBQ2RGLFFBQVFFLEtBQUssQ0FBQ0E7SUFDaEI7QUFDRjtBQU9lLGVBQWVDLFFBQzVCQyxHQUFtQixFQUNuQkMsR0FBMEIsRUFDMUI7SUFDQSxJQUFJO1FBQ0YsTUFBTUMsUUFBUSxNQUFNVjtRQUNwQlMsSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFRixPQUFPQTtZQUFPRyxTQUFTO1FBQVU7SUFDMUQsRUFBRSxPQUFPUCxPQUFPO1FBQ2RHLElBQUlFLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRUMsU0FBUztRQUFTO0lBQzNDO0FBQ0YsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2NvbW1lcmNlLy4vcGFnZXMvYXBpL2dldC1jYXRlZ29yaWVzLnRzP2FjYjUiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZGLsl5Ag642w7J207YSwIOyhsO2ajFxuaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCdcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuXG5jb25zdCBwcmlzbWEgPSBuZXcgUHJpc21hQ2xpZW50KClcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q2F0ZWdvcmllcygpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHByaXNtYS5jYXRlZ29yaWVzLmZpbmRNYW55KHt9KVxuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgIHJldHVybiByZXNwb25zZVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpXG4gIH1cbn1cblxudHlwZSBEYXRhID0ge1xuICBkbmZ0cz86IGFueVxuICBtZXNzYWdlOiBzdHJpbmdcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihcbiAgcmVxOiBOZXh0QXBpUmVxdWVzdCxcbiAgcmVzOiBOZXh0QXBpUmVzcG9uc2U8RGF0YT5cbikge1xuICB0cnkge1xuICAgIGNvbnN0IGRuZnRzID0gYXdhaXQgZ2V0Q2F0ZWdvcmllcygpXG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkbmZ0czogZG5mdHMsIG1lc3NhZ2U6ICdTdWNjZXNzJyB9KVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlcy5zdGF0dXMoNDAwKS5qc29uKHsgbWVzc2FnZTogJ0ZhaWxlZCcgfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsInByaXNtYSIsImdldENhdGVnb3JpZXMiLCJyZXNwb25zZSIsImNhdGVnb3JpZXMiLCJmaW5kTWFueSIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJkbmZ0cyIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/get-categories.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/get-categories.ts"));
module.exports = __webpack_exports__;

})();