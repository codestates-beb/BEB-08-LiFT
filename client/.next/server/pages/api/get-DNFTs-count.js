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
exports.id = "pages/api/get-DNFTs-count";
exports.ids = ["pages/api/get-DNFTs-count"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "(api)/./pages/api/get-DNFTs-count.ts":
/*!**************************************!*\
  !*** ./pages/api/get-DNFTs-count.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n// db에 데이터 조회\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function getDNFTsCount(category, contains) {\n    const containCondition = contains && contains !== \"\" ? {\n        name: {\n            contains: contains\n        }\n    } : undefined;\n    const where = category && category != -1 ? {\n        category_id: category,\n        ...containCondition\n    } : containCondition ? containCondition : undefined;\n    try {\n        const response = await prisma.dnfts.count({\n            where: where\n        });\n        console.log(response);\n        return response;\n    } catch (error) {\n        console.error(error);\n    }\n}\nasync function handler(req, res) {\n    const { category , contains  } = req.query;\n    try {\n        const dnfts = await getDNFTsCount(Number(category), String(contains));\n        res.status(200).json({\n            dnfts: dnfts,\n            message: \"Success\"\n        });\n    } catch (error) {\n        res.status(400).json({\n            message: \"Failed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ2V0LURORlRzLWNvdW50LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGFBQWE7QUFFZ0M7QUFFN0MsTUFBTUMsU0FBUyxJQUFJRCx3REFBWUE7QUFFL0IsZUFBZUUsY0FBY0MsUUFBZ0IsRUFBRUMsUUFBZ0IsRUFBRTtJQUMvRCxNQUFNQyxtQkFDSkQsWUFBWUEsYUFBYSxLQUNyQjtRQUNFRSxNQUFNO1lBQUVGLFVBQVVBO1FBQVM7SUFDN0IsSUFDQUcsU0FBUztJQUVmLE1BQU1DLFFBQ0pMLFlBQVlBLFlBQVksQ0FBQyxJQUNyQjtRQUNFTSxhQUFhTjtRQUNiLEdBQUdFLGdCQUFnQjtJQUNyQixJQUNBQSxtQkFDQUEsbUJBQ0FFLFNBQVM7SUFFZixJQUFJO1FBQ0YsTUFBTUcsV0FBVyxNQUFNVCxPQUFPVSxLQUFLLENBQUNDLEtBQUssQ0FBQztZQUFFSixPQUFPQTtRQUFNO1FBQ3pESyxRQUFRQyxHQUFHLENBQUNKO1FBQ1osT0FBT0E7SUFDVCxFQUFFLE9BQU9LLE9BQU87UUFDZEYsUUFBUUUsS0FBSyxDQUFDQTtJQUNoQjtBQUNGO0FBT2UsZUFBZUMsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUEwQixFQUMxQjtJQUNBLE1BQU0sRUFBRWYsU0FBUSxFQUFFQyxTQUFRLEVBQUUsR0FBR2EsSUFBSUUsS0FBSztJQUN4QyxJQUFJO1FBQ0YsTUFBTVIsUUFBUSxNQUFNVCxjQUFja0IsT0FBT2pCLFdBQVdrQixPQUFPakI7UUFDM0RjLElBQUlJLE1BQU0sQ0FBQyxLQUFLQyxJQUFJLENBQUM7WUFBRVosT0FBT0E7WUFBT2EsU0FBUztRQUFVO0lBQzFELEVBQUUsT0FBT1QsT0FBTztRQUNkRyxJQUFJSSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBUztJQUMzQztBQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21tZXJjZS8uL3BhZ2VzL2FwaS9nZXQtRE5GVHMtY291bnQudHM/OWNlZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBkYuyXkCDrjbDsnbTthLAg7KGw7ZqMXG5pbXBvcnQgdHlwZSB7IE5leHRBcGlSZXF1ZXN0LCBOZXh0QXBpUmVzcG9uc2UgfSBmcm9tICduZXh0J1xuaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5hc3luYyBmdW5jdGlvbiBnZXRETkZUc0NvdW50KGNhdGVnb3J5OiBudW1iZXIsIGNvbnRhaW5zOiBzdHJpbmcpIHtcbiAgY29uc3QgY29udGFpbkNvbmRpdGlvbiA9XG4gICAgY29udGFpbnMgJiYgY29udGFpbnMgIT09ICcnXG4gICAgICA/IHtcbiAgICAgICAgICBuYW1lOiB7IGNvbnRhaW5zOiBjb250YWlucyB9LFxuICAgICAgICB9XG4gICAgICA6IHVuZGVmaW5lZFxuXG4gIGNvbnN0IHdoZXJlID1cbiAgICBjYXRlZ29yeSAmJiBjYXRlZ29yeSAhPSAtMVxuICAgICAgPyB7XG4gICAgICAgICAgY2F0ZWdvcnlfaWQ6IGNhdGVnb3J5LFxuICAgICAgICAgIC4uLmNvbnRhaW5Db25kaXRpb24sXG4gICAgICAgIH1cbiAgICAgIDogY29udGFpbkNvbmRpdGlvblxuICAgICAgPyBjb250YWluQ29uZGl0aW9uXG4gICAgICA6IHVuZGVmaW5lZFxuXG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBwcmlzbWEuZG5mdHMuY291bnQoeyB3aGVyZTogd2hlcmUgfSlcbiAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICByZXR1cm4gcmVzcG9uc2VcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycm9yKVxuICB9XG59XG5cbnR5cGUgRGF0YSA9IHtcbiAgZG5mdHM/OiBhbnlcbiAgbWVzc2FnZTogc3RyaW5nXG59XG5cbmV4cG9ydCBkZWZhdWx0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoXG4gIHJlcTogTmV4dEFwaVJlcXVlc3QsXG4gIHJlczogTmV4dEFwaVJlc3BvbnNlPERhdGE+XG4pIHtcbiAgY29uc3QgeyBjYXRlZ29yeSwgY29udGFpbnMgfSA9IHJlcS5xdWVyeVxuICB0cnkge1xuICAgIGNvbnN0IGRuZnRzID0gYXdhaXQgZ2V0RE5GVHNDb3VudChOdW1iZXIoY2F0ZWdvcnkpLCBTdHJpbmcoY29udGFpbnMpKVxuICAgIHJlcy5zdGF0dXMoMjAwKS5qc29uKHsgZG5mdHM6IGRuZnRzLCBtZXNzYWdlOiAnU3VjY2VzcycgfSlcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXMuc3RhdHVzKDQwMCkuanNvbih7IG1lc3NhZ2U6ICdGYWlsZWQnIH0pXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJnZXRETkZUc0NvdW50IiwiY2F0ZWdvcnkiLCJjb250YWlucyIsImNvbnRhaW5Db25kaXRpb24iLCJuYW1lIiwidW5kZWZpbmVkIiwid2hlcmUiLCJjYXRlZ29yeV9pZCIsInJlc3BvbnNlIiwiZG5mdHMiLCJjb3VudCIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsImhhbmRsZXIiLCJyZXEiLCJyZXMiLCJxdWVyeSIsIk51bWJlciIsIlN0cmluZyIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/get-DNFTs-count.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/get-DNFTs-count.ts"));
module.exports = __webpack_exports__;

})();