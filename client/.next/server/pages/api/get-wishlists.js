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
exports.id = "pages/api/get-wishlists";
exports.ids = ["pages/api/get-wishlists"];
exports.modules = {

/***/ "@moralisweb3/next":
/*!************************************!*\
  !*** external "@moralisweb3/next" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("@moralisweb3/next");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "(api)/./pages/api/auth/[...nextauth].ts":
/*!*****************************************!*\
  !*** ./pages/api/auth/[...nextauth].ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @moralisweb3/next */ \"@moralisweb3/next\");\n/* harmony import */ var _moralisweb3_next__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_moralisweb3_next__WEBPACK_IMPORTED_MODULE_1__);\n\n\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()({\n    providers: [\n        (0,_moralisweb3_next__WEBPACK_IMPORTED_MODULE_1__.MoralisNextAuthProvider)()\n    ],\n    // adding user info to the user session object\n    callbacks: {\n        async jwt ({ token , user  }) {\n            if (user) {\n                token.user = user;\n            }\n            return token;\n        },\n        async session ({ session , token  }) {\n            session.user = token.user;\n            return session;\n        }\n    }\n}));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQWlDO0FBQzJCO0FBRTVELGlFQUFlQSxnREFBUUEsQ0FBQztJQUN0QkUsV0FBVztRQUFDRCwwRUFBdUJBO0tBQUc7SUFDdEMsOENBQThDO0lBQzlDRSxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxNQUFLLEVBQUVDLEtBQUksRUFBRSxFQUFFO1lBQ3pCLElBQUlBLE1BQU07Z0JBQ1JELE1BQU1DLElBQUksR0FBR0E7WUFDZixDQUFDO1lBQ0QsT0FBT0Q7UUFDVDtRQUNBLE1BQU1FLFNBQVEsRUFBRUEsUUFBTyxFQUFFRixNQUFLLEVBQUUsRUFBRTtZQUMvQkUsUUFBOEJELElBQUksR0FBR0QsTUFBTUMsSUFBSTtZQUNoRCxPQUFPQztRQUNUO0lBQ0Y7QUFDRixFQUFFLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21tZXJjZS8uL3BhZ2VzL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0udHM/MmU4YiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IHsgTW9yYWxpc05leHRBdXRoUHJvdmlkZXIgfSBmcm9tIFwiQG1vcmFsaXN3ZWIzL25leHRcIjtcblxuZXhwb3J0IGRlZmF1bHQgTmV4dEF1dGgoe1xuICBwcm92aWRlcnM6IFtNb3JhbGlzTmV4dEF1dGhQcm92aWRlcigpXSxcbiAgLy8gYWRkaW5nIHVzZXIgaW5mbyB0byB0aGUgdXNlciBzZXNzaW9uIG9iamVjdFxuICBjYWxsYmFja3M6IHtcbiAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICB0b2tlbi51c2VyID0gdXNlcjtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICAoc2Vzc2lvbiBhcyB7IHVzZXI6IHVua25vd24gfSkudXNlciA9IHRva2VuLnVzZXI7XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxufSk7Il0sIm5hbWVzIjpbIk5leHRBdXRoIiwiTW9yYWxpc05leHRBdXRoUHJvdmlkZXIiLCJwcm92aWRlcnMiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInVzZXIiLCJzZXNzaW9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/auth/[...nextauth].ts\n");

/***/ }),

/***/ "(api)/./pages/api/get-wishlists.ts":
/*!************************************!*\
  !*** ./pages/api/get-wishlists.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _auth_nextauth___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth/[...nextauth] */ \"(api)/./pages/api/auth/[...nextauth].ts\");\n// db에 데이터 조회\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nasync function getWishlists(userId) {\n    try {\n        const wishlist = await prisma.wishlist.findUnique({\n            where: {\n                userId: userId\n            }\n        });\n        console.log(`wishlist: ${JSON.stringify(wishlist)}`);\n        const dnftId = wishlist?.dnftIds.split(\",\").map((item)=>Number(item));\n        if (dnftId && dnftId.length > 0) {\n            const response = await prisma.dnfts.findMany({\n                where: {\n                    id: {\n                        in: dnftId\n                    }\n                }\n            });\n            console.log(response);\n            return response;\n        }\n        return [];\n    } catch (error) {\n        console.error(error);\n    }\n}\nasync function handler(req, res) {\n    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_1__.getServerSession)(req, res, _auth_nextauth___WEBPACK_IMPORTED_MODULE_2__.authOptions);\n    if (session == null) {\n        res.status(200).json({\n            dnfts: [],\n            message: \"no Session\"\n        });\n        return;\n    } // clg7rpt58000006jv7jefmty6\n    try {\n        const wishlist = await getWishlists(String(session.id));\n        res.status(200).json({\n            dnfts: wishlist,\n            message: \"Success\"\n        });\n    } catch (error) {\n        res.status(400).json({\n            message: \"Failed\"\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9wYWdlcy9hcGkvZ2V0LXdpc2hsaXN0cy50cy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxhQUFhO0FBRWdDO0FBQ0Q7QUFDTTtBQUVsRCxNQUFNRyxTQUFTLElBQUlILHdEQUFZQTtBQUUvQixlQUFlSSxhQUFhQyxNQUFjLEVBQUU7SUFDMUMsSUFBSTtRQUNGLE1BQU1DLFdBQVcsTUFBTUgsT0FBT0csUUFBUSxDQUFDQyxVQUFVLENBQUM7WUFDaERDLE9BQU87Z0JBQ0xILFFBQVFBO1lBQ1Y7UUFDRjtRQUVBSSxRQUFRQyxHQUFHLENBQUMsQ0FBQyxVQUFVLEVBQUVDLEtBQUtDLFNBQVMsQ0FBQ04sVUFBVSxDQUFDO1FBRW5ELE1BQU1PLFNBQVNQLFVBQVVRLFFBQVFDLEtBQUssQ0FBQyxLQUFLQyxHQUFHLENBQUMsQ0FBQ0MsT0FBU0MsT0FBT0Q7UUFFakUsSUFBSUosVUFBVUEsT0FBT00sTUFBTSxHQUFHLEdBQUc7WUFDL0IsTUFBTUMsV0FBVyxNQUFNakIsT0FBT2tCLEtBQUssQ0FBQ0MsUUFBUSxDQUFDO2dCQUMzQ2QsT0FBTztvQkFDTGUsSUFBSTt3QkFDRkMsSUFBSVg7b0JBQ047Z0JBQ0Y7WUFDRjtZQUNBSixRQUFRQyxHQUFHLENBQUNVO1lBQ1osT0FBT0E7UUFDVCxDQUFDO1FBRUQsT0FBTyxFQUFFO0lBQ1gsRUFBRSxPQUFPSyxPQUFPO1FBQ2RoQixRQUFRZ0IsS0FBSyxDQUFDQTtJQUNoQjtBQUNGO0FBT2UsZUFBZUMsUUFDNUJDLEdBQW1CLEVBQ25CQyxHQUEwQixFQUMxQjtJQUNBLE1BQU1DLFVBQVUsTUFBTTVCLDJEQUFnQkEsQ0FBQzBCLEtBQUtDLEtBQUsxQix3REFBV0E7SUFFNUQsSUFBSTJCLFdBQVcsSUFBSSxFQUFFO1FBQ25CRCxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVWLE9BQU8sRUFBRTtZQUFFVyxTQUFTO1FBQWE7UUFDeEQ7SUFDRixDQUFDLENBQUMsNEJBQTRCO0lBRTlCLElBQUk7UUFDRixNQUFNMUIsV0FBVyxNQUFNRixhQUFhNkIsT0FBT0osUUFBUU4sRUFBRTtRQUNyREssSUFBSUUsTUFBTSxDQUFDLEtBQUtDLElBQUksQ0FBQztZQUFFVixPQUFPZjtZQUFVMEIsU0FBUztRQUFVO0lBQzdELEVBQUUsT0FBT1AsT0FBTztRQUNkRyxJQUFJRSxNQUFNLENBQUMsS0FBS0MsSUFBSSxDQUFDO1lBQUVDLFNBQVM7UUFBUztJQUMzQztBQUNGLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb21tZXJjZS8uL3BhZ2VzL2FwaS9nZXQtd2lzaGxpc3RzLnRzPzQ5ZjQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZGLsl5Ag642w7J207YSwIOyhsO2ajFxuaW1wb3J0IHR5cGUgeyBOZXh0QXBpUmVxdWVzdCwgTmV4dEFwaVJlc3BvbnNlIH0gZnJvbSAnbmV4dCdcbmltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50J1xuaW1wb3J0IHsgZ2V0U2VydmVyU2Vzc2lvbiB9IGZyb20gJ25leHQtYXV0aCdcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnLi9hdXRoL1suLi5uZXh0YXV0aF0nXG5cbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKVxuXG5hc3luYyBmdW5jdGlvbiBnZXRXaXNobGlzdHModXNlcklkOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB3aXNobGlzdCA9IGF3YWl0IHByaXNtYS53aXNobGlzdC5maW5kVW5pcXVlKHtcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIHVzZXJJZDogdXNlcklkLFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgY29uc29sZS5sb2coYHdpc2hsaXN0OiAke0pTT04uc3RyaW5naWZ5KHdpc2hsaXN0KX1gKVxuXG4gICAgY29uc3QgZG5mdElkID0gd2lzaGxpc3Q/LmRuZnRJZHMuc3BsaXQoJywnKS5tYXAoKGl0ZW0pID0+IE51bWJlcihpdGVtKSlcblxuICAgIGlmIChkbmZ0SWQgJiYgZG5mdElkLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgcHJpc21hLmRuZnRzLmZpbmRNYW55KHtcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgaW46IGRuZnRJZCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgcmV0dXJuIHJlc3BvbnNlXG4gICAgfVxuXG4gICAgcmV0dXJuIFtdXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcihlcnJvcilcbiAgfVxufVxuXG50eXBlIERhdGEgPSB7XG4gIGRuZnRzPzogYW55XG4gIG1lc3NhZ2U6IHN0cmluZ1xufVxuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKFxuICByZXE6IE5leHRBcGlSZXF1ZXN0LFxuICByZXM6IE5leHRBcGlSZXNwb25zZTxEYXRhPlxuKSB7XG4gIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKHJlcSwgcmVzLCBhdXRoT3B0aW9ucylcblxuICBpZiAoc2Vzc2lvbiA9PSBudWxsKSB7XG4gICAgcmVzLnN0YXR1cygyMDApLmpzb24oeyBkbmZ0czogW10sIG1lc3NhZ2U6ICdubyBTZXNzaW9uJyB9KVxuICAgIHJldHVyblxuICB9IC8vIGNsZzdycHQ1ODAwMDAwNmp2N2plZm10eTZcblxuICB0cnkge1xuICAgIGNvbnN0IHdpc2hsaXN0ID0gYXdhaXQgZ2V0V2lzaGxpc3RzKFN0cmluZyhzZXNzaW9uLmlkKSlcbiAgICByZXMuc3RhdHVzKDIwMCkuanNvbih7IGRuZnRzOiB3aXNobGlzdCwgbWVzc2FnZTogJ1N1Y2Nlc3MnIH0pXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmVzLnN0YXR1cyg0MDApLmpzb24oeyBtZXNzYWdlOiAnRmFpbGVkJyB9KVxuICB9XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiZ2V0U2VydmVyU2Vzc2lvbiIsImF1dGhPcHRpb25zIiwicHJpc21hIiwiZ2V0V2lzaGxpc3RzIiwidXNlcklkIiwid2lzaGxpc3QiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInN0cmluZ2lmeSIsImRuZnRJZCIsImRuZnRJZHMiLCJzcGxpdCIsIm1hcCIsIml0ZW0iLCJOdW1iZXIiLCJsZW5ndGgiLCJyZXNwb25zZSIsImRuZnRzIiwiZmluZE1hbnkiLCJpZCIsImluIiwiZXJyb3IiLCJoYW5kbGVyIiwicmVxIiwicmVzIiwic2Vzc2lvbiIsInN0YXR1cyIsImpzb24iLCJtZXNzYWdlIiwiU3RyaW5nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./pages/api/get-wishlists.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(api)/./pages/api/get-wishlists.ts"));
module.exports = __webpack_exports__;

})();