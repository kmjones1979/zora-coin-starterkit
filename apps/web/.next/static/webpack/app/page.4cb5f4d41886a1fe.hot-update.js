"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/page",{

/***/ "(app-pages-browser)/./app/hooks/useCoinCreation.ts":
/*!**************************************!*\
  !*** ./app/hooks/useCoinCreation.ts ***!
  \**************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   useCoinCreation: () => (/* binding */ useCoinCreation)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(app-pages-browser)/../../node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/../../node_modules/wagmi/dist/esm/hooks/useAccount.js\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/../../node_modules/wagmi/dist/esm/hooks/usePublicClient.js\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/../../node_modules/wagmi/dist/esm/hooks/useWriteContract.js\");\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! wagmi */ \"(app-pages-browser)/../../node_modules/wagmi/dist/esm/hooks/useTransaction.js\");\n/* harmony import */ var _zoralabs_coins_sdk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @zoralabs/coins-sdk */ \"(app-pages-browser)/../../node_modules/@zoralabs/coins-sdk/dist/index.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/zora.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/base.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/baseSepolia.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/optimism.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/arbitrum.js\");\n/* harmony import */ var viem_chains__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! viem/chains */ \"(app-pages-browser)/../../node_modules/viem/_esm/chains/definitions/blast.js\");\n/* harmony import */ var _config_chains__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config/chains */ \"(app-pages-browser)/./app/config/chains.ts\");\n/* harmony import */ var _config_abis__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../config/abis */ \"(app-pages-browser)/./app/config/abis.ts\");\n/* harmony import */ var _contexts_DebugContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../contexts/DebugContext */ \"(app-pages-browser)/./app/contexts/DebugContext.tsx\");\n\n\n\n\n\n\n\nconst CHAIN_CONFIGS = {\n    [viem_chains__WEBPACK_IMPORTED_MODULE_4__.zora.id]: viem_chains__WEBPACK_IMPORTED_MODULE_4__.zora,\n    [viem_chains__WEBPACK_IMPORTED_MODULE_5__.base.id]: viem_chains__WEBPACK_IMPORTED_MODULE_5__.base,\n    [viem_chains__WEBPACK_IMPORTED_MODULE_6__.baseSepolia.id]: viem_chains__WEBPACK_IMPORTED_MODULE_6__.baseSepolia,\n    [viem_chains__WEBPACK_IMPORTED_MODULE_7__.optimism.id]: viem_chains__WEBPACK_IMPORTED_MODULE_7__.optimism,\n    [viem_chains__WEBPACK_IMPORTED_MODULE_8__.arbitrum.id]: viem_chains__WEBPACK_IMPORTED_MODULE_8__.arbitrum,\n    [viem_chains__WEBPACK_IMPORTED_MODULE_9__.blast.id]: viem_chains__WEBPACK_IMPORTED_MODULE_9__.blast\n};\nfunction useCoinCreation(param) {\n    let { name, symbol, uri, owners, payoutRecipient, platformReferrer, initialPurchaseWei = BigInt(0), chainId } = param;\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);\n    const [status, setStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(\"\");\n    const [tokenAddress, setTokenAddress] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);\n    const { address } = (0,wagmi__WEBPACK_IMPORTED_MODULE_10__.useAccount)();\n    const publicClient = (0,wagmi__WEBPACK_IMPORTED_MODULE_11__.usePublicClient)();\n    const { isDebug } = (0,_contexts_DebugContext__WEBPACK_IMPORTED_MODULE_3__.useDebug)();\n    const coinParams = {\n        name: name.trim(),\n        symbol: symbol.trim(),\n        uri: uri.trim(),\n        owners: [\n            payoutRecipient\n        ],\n        payoutRecipient,\n        platformReferrer: payoutRecipient,\n        initialPurchaseWei,\n        factoryAddress: _config_chains__WEBPACK_IMPORTED_MODULE_1__.CHAINS[chainId].factory\n    };\n    if (isDebug) {\n        console.log(\"Coin creation parameters:\", {\n            ...coinParams,\n            initialPurchaseWei: initialPurchaseWei.toString()\n        });\n    }\n    const { writeContract, data: hash, isPending: isLoading, error: writeError } = (0,wagmi__WEBPACK_IMPORTED_MODULE_12__.useWriteContract)({\n        mutation: {\n            onSuccess: {\n                \"useCoinCreation.useContractWrite\": ()=>{\n                    if (isDebug) {\n                        console.log(\"Transaction sent with hash:\", hash);\n                    }\n                    setStatus(\"Transaction sent! Please check the explorer for confirmation.\");\n                }\n            }[\"useCoinCreation.useContractWrite\"],\n            onError: {\n                \"useCoinCreation.useContractWrite\": (err)=>{\n                    var _err_message, _err_message1, _err_message2;\n                    if (isDebug) {\n                        console.error(\"Transaction failed:\", err);\n                    }\n                    if ((_err_message = err.message) === null || _err_message === void 0 ? void 0 : _err_message.includes(\"insufficient funds\")) {\n                        setStatus(\"Transaction failed: Insufficient funds for gas\");\n                    } else if ((_err_message1 = err.message) === null || _err_message1 === void 0 ? void 0 : _err_message1.includes(\"user rejected\")) {\n                        setStatus(\"Transaction cancelled by user\");\n                    } else if ((_err_message2 = err.message) === null || _err_message2 === void 0 ? void 0 : _err_message2.includes(\"nonce\")) {\n                        setStatus(\"Transaction failed: Nonce error. Please try again.\");\n                    } else {\n                        setStatus(\"Transaction failed: \".concat(err.message));\n                    }\n                }\n            }[\"useCoinCreation.useContractWrite\"]\n        }\n    });\n    const { data: transactionData, isSuccess } = (0,wagmi__WEBPACK_IMPORTED_MODULE_13__.useTransaction)({\n        hash: hash || undefined,\n        chainId\n    });\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)({\n        \"useCoinCreation.useEffect\": ()=>{\n            if (hash) {\n                if (isDebug) {\n                    console.log(\"Transaction sent with hash:\", hash);\n                }\n                setStatus(\"Transaction sent! Hash: \".concat(hash));\n            }\n        }\n    }[\"useCoinCreation.useEffect\"], [\n        hash,\n        isDebug\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)({\n        \"useCoinCreation.useEffect\": ()=>{\n            if (writeError) {\n                if (isDebug) {\n                    console.error(\"Write error:\", writeError);\n                }\n                setStatus(\"Error: \".concat(writeError.message));\n            }\n        }\n    }[\"useCoinCreation.useEffect\"], [\n        writeError,\n        isDebug\n    ]);\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)({\n        \"useCoinCreation.useEffect\": ()=>{\n            const handleTransactionReceipt = {\n                \"useCoinCreation.useEffect.handleTransactionReceipt\": async ()=>{\n                    if (hash && publicClient) {\n                        try {\n                            const receipt = await publicClient.waitForTransactionReceipt({\n                                hash\n                            });\n                            if (receipt.status === \"success\") {\n                                setError(null);\n                                const coinDeployment = (0,_zoralabs_coins_sdk__WEBPACK_IMPORTED_MODULE_14__.getCoinCreateFromLogs)(receipt);\n                                if (coinDeployment === null || coinDeployment === void 0 ? void 0 : coinDeployment.coin) {\n                                    setTokenAddress(coinDeployment.coin);\n                                    setStatus(\"Coin created successfully!\");\n                                } else {\n                                    setError(new Error(\"Failed to extract coin address from transaction receipt\"));\n                                    setStatus(\"Transaction successful but failed to get coin address\");\n                                }\n                            } else {\n                                setError(new Error(\"Transaction failed\"));\n                                setStatus(\"Transaction failed\");\n                            }\n                        } catch (err) {\n                            if (isDebug) {\n                                console.error(\"Error processing transaction receipt:\", err);\n                            }\n                            setError(err);\n                            setStatus(\"Error processing transaction receipt\");\n                        }\n                    }\n                }\n            }[\"useCoinCreation.useEffect.handleTransactionReceipt\"];\n            handleTransactionReceipt();\n        }\n    }[\"useCoinCreation.useEffect\"], [\n        hash,\n        publicClient,\n        isDebug\n    ]);\n    const resetTransaction = ()=>{\n        setError(null);\n        setStatus(\"\");\n        setTokenAddress(null);\n    };\n    const write = async ()=>{\n        try {\n            const contractCallParams = await (0,_zoralabs_coins_sdk__WEBPACK_IMPORTED_MODULE_14__.createCoinCall)(coinParams);\n            if (isDebug) {\n                console.log(\"Contract call parameters:\", {\n                    address: contractCallParams.address,\n                    factoryAddress: _config_chains__WEBPACK_IMPORTED_MODULE_1__.CHAINS[chainId].factory,\n                    chainId,\n                    abi: contractCallParams.abi,\n                    functionName: contractCallParams.functionName,\n                    args: contractCallParams.args\n                });\n            }\n            writeContract({\n                address: _config_chains__WEBPACK_IMPORTED_MODULE_1__.CHAINS[chainId].factory,\n                abi: _config_abis__WEBPACK_IMPORTED_MODULE_2__.coinFactoryABI,\n                functionName: contractCallParams.functionName,\n                args: contractCallParams.args,\n                value: initialPurchaseWei ? BigInt(initialPurchaseWei) : undefined,\n                chain: CHAIN_CONFIGS[chainId],\n                account: address\n            });\n        } catch (err) {\n            setError(err);\n            setStatus(\"Transaction failed\");\n        }\n    };\n    return {\n        write,\n        isLoading,\n        error,\n        transactionHash: hash,\n        status,\n        isSuccess: !!transactionData,\n        tokenAddress,\n        resetTransaction\n    };\n}\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2FwcC9ob29rcy91c2VDb2luQ3JlYXRpb24udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBNEM7QUFPN0I7QUFFNkQ7QUFRdkQ7QUFFcUI7QUFDTTtBQUVJO0FBYXBELE1BQU1pQixnQkFBZ0I7SUFDbEIsQ0FBQ1QsNkNBQUlBLENBQUNVLEVBQUUsQ0FBQyxFQUFFViw2Q0FBSUE7SUFDZixDQUFDQyw2Q0FBSUEsQ0FBQ1MsRUFBRSxDQUFDLEVBQUVULDZDQUFJQTtJQUNmLENBQUNJLG9EQUFXQSxDQUFDSyxFQUFFLENBQUMsRUFBRUwsb0RBQVdBO0lBQzdCLENBQUNILGlEQUFRQSxDQUFDUSxFQUFFLENBQUMsRUFBRVIsaURBQVFBO0lBQ3ZCLENBQUNDLGlEQUFRQSxDQUFDTyxFQUFFLENBQUMsRUFBRVAsaURBQVFBO0lBQ3ZCLENBQUNDLDhDQUFLQSxDQUFDTSxFQUFFLENBQUMsRUFBRU4sOENBQUtBO0FBQ3JCO0FBRU8sU0FBU08sZ0JBQWdCLEtBU1Q7UUFUUyxFQUM1QkMsSUFBSSxFQUNKQyxNQUFNLEVBQ05DLEdBQUcsRUFDSEMsTUFBTSxFQUNOQyxlQUFlLEVBQ2ZDLGdCQUFnQixFQUNoQkMscUJBQXFCQyxPQUFPLEVBQUUsRUFDOUJDLE9BQU8sRUFDWSxHQVRTO0lBVTVCLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHOUIsK0NBQVFBLENBQWU7SUFDakQsTUFBTSxDQUFDK0IsUUFBUUMsVUFBVSxHQUFHaEMsK0NBQVFBLENBQVM7SUFDN0MsTUFBTSxDQUFDaUMsY0FBY0MsZ0JBQWdCLEdBQUdsQywrQ0FBUUEsQ0FBcUI7SUFDckUsTUFBTSxFQUFFbUMsT0FBTyxFQUFFLEdBQUc5QixrREFBVUE7SUFDOUIsTUFBTStCLGVBQWVoQyx1REFBZUE7SUFDcEMsTUFBTSxFQUFFaUMsT0FBTyxFQUFFLEdBQUdyQixnRUFBUUE7SUFFNUIsTUFBTXNCLGFBQWE7UUFDZmxCLE1BQU1BLEtBQUttQixJQUFJO1FBQ2ZsQixRQUFRQSxPQUFPa0IsSUFBSTtRQUNuQmpCLEtBQUtBLElBQUlpQixJQUFJO1FBQ2JoQixRQUFRO1lBQUNDO1NBQWdCO1FBQ3pCQTtRQUNBQyxrQkFBa0JEO1FBQ2xCRTtRQUNBYyxnQkFBZ0IxQixrREFBTSxDQUFDYyxRQUErQixDQUNqRGEsT0FBTztJQUNoQjtJQUVBLElBQUlKLFNBQVM7UUFDVEssUUFBUUMsR0FBRyxDQUFDLDZCQUE2QjtZQUNyQyxHQUFHTCxVQUFVO1lBQ2JaLG9CQUFvQkEsbUJBQW1Ca0IsUUFBUTtRQUNuRDtJQUNKO0lBRUEsTUFBTSxFQUNGQyxhQUFhLEVBQ2JDLE1BQU1DLElBQUksRUFDVkMsV0FBV0MsU0FBUyxFQUNwQnBCLE9BQU9xQixVQUFVLEVBQ3BCLEdBQUdoRCx3REFBZ0JBLENBQUM7UUFDakJpRCxVQUFVO1lBQ05DLFNBQVM7b0RBQUU7b0JBQ1AsSUFBSWYsU0FBUzt3QkFDVEssUUFBUUMsR0FBRyxDQUFDLCtCQUErQkk7b0JBQy9DO29CQUNBZixVQUNJO2dCQUVSOztZQUNBcUIsT0FBTztvREFBRSxDQUFDQzt3QkFJRkEsY0FFT0EsZUFFQUE7b0JBUFgsSUFBSWpCLFNBQVM7d0JBQ1RLLFFBQVFiLEtBQUssQ0FBQyx1QkFBdUJ5QjtvQkFDekM7b0JBQ0EsS0FBSUEsZUFBQUEsSUFBSUMsT0FBTyxjQUFYRCxtQ0FBQUEsYUFBYUUsUUFBUSxDQUFDLHVCQUF1Qjt3QkFDN0N4QixVQUFVO29CQUNkLE9BQU8sS0FBSXNCLGdCQUFBQSxJQUFJQyxPQUFPLGNBQVhELG9DQUFBQSxjQUFhRSxRQUFRLENBQUMsa0JBQWtCO3dCQUMvQ3hCLFVBQVU7b0JBQ2QsT0FBTyxLQUFJc0IsZ0JBQUFBLElBQUlDLE9BQU8sY0FBWEQsb0NBQUFBLGNBQWFFLFFBQVEsQ0FBQyxVQUFVO3dCQUN2Q3hCLFVBQ0k7b0JBRVIsT0FBTzt3QkFDSEEsVUFBVSx1QkFBbUMsT0FBWnNCLElBQUlDLE9BQU87b0JBQ2hEO2dCQUNKOztRQUNKO0lBQ0o7SUFFQSxNQUFNLEVBQUVULE1BQU1XLGVBQWUsRUFBRUMsU0FBUyxFQUFFLEdBQUd2RCxzREFBY0EsQ0FBQztRQUN4RDRDLE1BQU1BLFFBQVFZO1FBQ2QvQjtJQUNKO0lBRUEzQixnREFBU0E7cUNBQUM7WUFDTixJQUFJOEMsTUFBTTtnQkFDTixJQUFJVixTQUFTO29CQUNUSyxRQUFRQyxHQUFHLENBQUMsK0JBQStCSTtnQkFDL0M7Z0JBQ0FmLFVBQVUsMkJBQWdDLE9BQUxlO1lBQ3pDO1FBQ0o7b0NBQUc7UUFBQ0E7UUFBTVY7S0FBUTtJQUVsQnBDLGdEQUFTQTtxQ0FBQztZQUNOLElBQUlpRCxZQUFZO2dCQUNaLElBQUliLFNBQVM7b0JBQ1RLLFFBQVFiLEtBQUssQ0FBQyxnQkFBZ0JxQjtnQkFDbEM7Z0JBQ0FsQixVQUFVLFVBQTZCLE9BQW5Ca0IsV0FBV0ssT0FBTztZQUMxQztRQUNKO29DQUFHO1FBQUNMO1FBQVliO0tBQVE7SUFFeEJwQyxnREFBU0E7cUNBQUM7WUFDTixNQUFNMkQ7c0VBQTJCO29CQUM3QixJQUFJYixRQUFRWCxjQUFjO3dCQUN0QixJQUFJOzRCQUNBLE1BQU15QixVQUNGLE1BQU16QixhQUFhMEIseUJBQXlCLENBQUM7Z0NBQ3pDZjs0QkFDSjs0QkFFSixJQUFJYyxRQUFROUIsTUFBTSxLQUFLLFdBQVc7Z0NBQzlCRCxTQUFTO2dDQUNULE1BQU1pQyxpQkFBaUJ4RCwyRUFBcUJBLENBQUNzRDtnQ0FDN0MsSUFBSUUsMkJBQUFBLHFDQUFBQSxlQUFnQkMsSUFBSSxFQUFFO29DQUN0QjlCLGdCQUFnQjZCLGVBQWVDLElBQUk7b0NBQ25DaEMsVUFBVTtnQ0FDZCxPQUFPO29DQUNIRixTQUNJLElBQUltQyxNQUNBO29DQUdSakMsVUFDSTtnQ0FFUjs0QkFDSixPQUFPO2dDQUNIRixTQUFTLElBQUltQyxNQUFNO2dDQUNuQmpDLFVBQVU7NEJBQ2Q7d0JBQ0osRUFBRSxPQUFPc0IsS0FBSzs0QkFDVixJQUFJakIsU0FBUztnQ0FDVEssUUFBUWIsS0FBSyxDQUNULHlDQUNBeUI7NEJBRVI7NEJBQ0F4QixTQUFTd0I7NEJBQ1R0QixVQUFVO3dCQUNkO29CQUNKO2dCQUNKOztZQUVBNEI7UUFDSjtvQ0FBRztRQUFDYjtRQUFNWDtRQUFjQztLQUFRO0lBRWhDLE1BQU02QixtQkFBbUI7UUFDckJwQyxTQUFTO1FBQ1RFLFVBQVU7UUFDVkUsZ0JBQWdCO0lBQ3BCO0lBRUEsTUFBTWlDLFFBQVE7UUFDVixJQUFJO1lBQ0EsTUFBTUMscUJBQXFCLE1BQU05RCxvRUFBY0EsQ0FBQ2dDO1lBQ2hELElBQUlELFNBQVM7Z0JBQ1RLLFFBQVFDLEdBQUcsQ0FBQyw2QkFBNkI7b0JBQ3JDUixTQUFTaUMsbUJBQW1CakMsT0FBTztvQkFDbkNLLGdCQUNJMUIsa0RBQU0sQ0FBQ2MsUUFBK0IsQ0FBQ2EsT0FBTztvQkFDbERiO29CQUNBeUMsS0FBS0QsbUJBQW1CQyxHQUFHO29CQUMzQkMsY0FBY0YsbUJBQW1CRSxZQUFZO29CQUM3Q0MsTUFBTUgsbUJBQW1CRyxJQUFJO2dCQUNqQztZQUNKO1lBQ0ExQixjQUFjO2dCQUNWVixTQUFTckIsa0RBQU0sQ0FBQ2MsUUFBK0IsQ0FDMUNhLE9BQU87Z0JBQ1o0QixLQUFLdEQsd0RBQWNBO2dCQUNuQnVELGNBQWNGLG1CQUFtQkUsWUFBWTtnQkFDN0NDLE1BQU1ILG1CQUFtQkcsSUFBSTtnQkFDN0JDLE9BQU85QyxxQkFDREMsT0FBT0Qsc0JBQ1BpQztnQkFDTmMsT0FBT3hELGFBQWEsQ0FBQ1csUUFBUTtnQkFDN0I4QyxTQUFTdkM7WUFDYjtRQUNKLEVBQUUsT0FBT21CLEtBQUs7WUFDVnhCLFNBQVN3QjtZQUNUdEIsVUFBVTtRQUNkO0lBQ0o7SUFFQSxPQUFPO1FBQ0htQztRQUNBbEI7UUFDQXBCO1FBQ0E4QyxpQkFBaUI1QjtRQUNqQmhCO1FBQ0EyQixXQUFXLENBQUMsQ0FBQ0Q7UUFDYnhCO1FBQ0FpQztJQUNKO0FBQ0oiLCJzb3VyY2VzIjpbIi9Vc2Vycy9rZXZpbmpvbmVzL3pvcmEtY29pbi1zdGFydGVya2l0L2FwcHMvd2ViL2FwcC9ob29rcy91c2VDb2luQ3JlYXRpb24udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHtcbiAgICB1c2VDb250cmFjdFdyaXRlLFxuICAgIHVzZVRyYW5zYWN0aW9uLFxuICAgIHVzZVB1YmxpY0NsaWVudCxcbiAgICB1c2VBY2NvdW50LFxuICAgIHVzZUNoYWluSWQsXG59IGZyb20gXCJ3YWdtaVwiO1xuaW1wb3J0IHsgd2FpdEZvclRyYW5zYWN0aW9uIH0gZnJvbSBcIndhZ21pL2FjdGlvbnNcIjtcbmltcG9ydCB7IGNyZWF0ZUNvaW5DYWxsLCBnZXRDb2luQ3JlYXRlRnJvbUxvZ3MgfSBmcm9tIFwiQHpvcmFsYWJzL2NvaW5zLXNka1wiO1xuaW1wb3J0IHtcbiAgICB6b3JhLFxuICAgIGJhc2UsXG4gICAgb3B0aW1pc20sXG4gICAgYXJiaXRydW0sXG4gICAgYmxhc3QsXG4gICAgYmFzZVNlcG9saWEsXG59IGZyb20gXCJ2aWVtL2NoYWluc1wiO1xuaW1wb3J0IHsgQWRkcmVzcyBhcyBWaWVtQWRkcmVzcywgVHJhbnNhY3Rpb25SZWNlaXB0LCBMb2cgfSBmcm9tIFwidmllbVwiO1xuaW1wb3J0IHsgQ0hBSU5TIH0gZnJvbSBcIi4uL2NvbmZpZy9jaGFpbnNcIjtcbmltcG9ydCB7IGNvaW5GYWN0b3J5QUJJIH0gZnJvbSBcIi4uL2NvbmZpZy9hYmlzXCI7XG5pbXBvcnQgeyBodHRwIH0gZnJvbSBcInZpZW1cIjtcbmltcG9ydCB7IHVzZURlYnVnIH0gZnJvbSBcIi4uL2NvbnRleHRzL0RlYnVnQ29udGV4dFwiO1xuXG5pbnRlcmZhY2UgVXNlQ29pbkNyZWF0aW9uUHJvcHMge1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzeW1ib2w6IHN0cmluZztcbiAgICB1cmk6IHN0cmluZztcbiAgICBvd25lcnM/OiBWaWVtQWRkcmVzc1tdO1xuICAgIHBheW91dFJlY2lwaWVudDogVmllbUFkZHJlc3M7XG4gICAgcGxhdGZvcm1SZWZlcnJlcj86IFZpZW1BZGRyZXNzO1xuICAgIGluaXRpYWxQdXJjaGFzZVdlaT86IGJpZ2ludDtcbiAgICBjaGFpbklkOiBudW1iZXI7XG59XG5cbmNvbnN0IENIQUlOX0NPTkZJR1MgPSB7XG4gICAgW3pvcmEuaWRdOiB6b3JhLFxuICAgIFtiYXNlLmlkXTogYmFzZSxcbiAgICBbYmFzZVNlcG9saWEuaWRdOiBiYXNlU2Vwb2xpYSxcbiAgICBbb3B0aW1pc20uaWRdOiBvcHRpbWlzbSxcbiAgICBbYXJiaXRydW0uaWRdOiBhcmJpdHJ1bSxcbiAgICBbYmxhc3QuaWRdOiBibGFzdCxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VDb2luQ3JlYXRpb24oe1xuICAgIG5hbWUsXG4gICAgc3ltYm9sLFxuICAgIHVyaSxcbiAgICBvd25lcnMsXG4gICAgcGF5b3V0UmVjaXBpZW50LFxuICAgIHBsYXRmb3JtUmVmZXJyZXIsXG4gICAgaW5pdGlhbFB1cmNoYXNlV2VpID0gQmlnSW50KDApLFxuICAgIGNoYWluSWQsXG59OiBVc2VDb2luQ3JlYXRpb25Qcm9wcykge1xuICAgIGNvbnN0IFtlcnJvciwgc2V0RXJyb3JdID0gdXNlU3RhdGU8RXJyb3IgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCBbc3RhdHVzLCBzZXRTdGF0dXNdID0gdXNlU3RhdGU8c3RyaW5nPihcIlwiKTtcbiAgICBjb25zdCBbdG9rZW5BZGRyZXNzLCBzZXRUb2tlbkFkZHJlc3NdID0gdXNlU3RhdGU8VmllbUFkZHJlc3MgfCBudWxsPihudWxsKTtcbiAgICBjb25zdCB7IGFkZHJlc3MgfSA9IHVzZUFjY291bnQoKTtcbiAgICBjb25zdCBwdWJsaWNDbGllbnQgPSB1c2VQdWJsaWNDbGllbnQoKTtcbiAgICBjb25zdCB7IGlzRGVidWcgfSA9IHVzZURlYnVnKCk7XG5cbiAgICBjb25zdCBjb2luUGFyYW1zID0ge1xuICAgICAgICBuYW1lOiBuYW1lLnRyaW0oKSxcbiAgICAgICAgc3ltYm9sOiBzeW1ib2wudHJpbSgpLFxuICAgICAgICB1cmk6IHVyaS50cmltKCksXG4gICAgICAgIG93bmVyczogW3BheW91dFJlY2lwaWVudF0sXG4gICAgICAgIHBheW91dFJlY2lwaWVudCxcbiAgICAgICAgcGxhdGZvcm1SZWZlcnJlcjogcGF5b3V0UmVjaXBpZW50LFxuICAgICAgICBpbml0aWFsUHVyY2hhc2VXZWksXG4gICAgICAgIGZhY3RvcnlBZGRyZXNzOiBDSEFJTlNbY2hhaW5JZCBhcyBrZXlvZiB0eXBlb2YgQ0hBSU5TXVxuICAgICAgICAgICAgLmZhY3RvcnkgYXMgYDB4JHtzdHJpbmd9YCxcbiAgICB9O1xuXG4gICAgaWYgKGlzRGVidWcpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDb2luIGNyZWF0aW9uIHBhcmFtZXRlcnM6XCIsIHtcbiAgICAgICAgICAgIC4uLmNvaW5QYXJhbXMsXG4gICAgICAgICAgICBpbml0aWFsUHVyY2hhc2VXZWk6IGluaXRpYWxQdXJjaGFzZVdlaS50b1N0cmluZygpLFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7XG4gICAgICAgIHdyaXRlQ29udHJhY3QsXG4gICAgICAgIGRhdGE6IGhhc2gsXG4gICAgICAgIGlzUGVuZGluZzogaXNMb2FkaW5nLFxuICAgICAgICBlcnJvcjogd3JpdGVFcnJvcixcbiAgICB9ID0gdXNlQ29udHJhY3RXcml0ZSh7XG4gICAgICAgIG11dGF0aW9uOiB7XG4gICAgICAgICAgICBvblN1Y2Nlc3M6ICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlRyYW5zYWN0aW9uIHNlbnQgd2l0aCBoYXNoOlwiLCBoYXNoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgICAgICAgICAgICBcIlRyYW5zYWN0aW9uIHNlbnQhIFBsZWFzZSBjaGVjayB0aGUgZXhwbG9yZXIgZm9yIGNvbmZpcm1hdGlvbi5cIlxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25FcnJvcjogKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJUcmFuc2FjdGlvbiBmYWlsZWQ6XCIsIGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChlcnIubWVzc2FnZT8uaW5jbHVkZXMoXCJpbnN1ZmZpY2llbnQgZnVuZHNcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdHVzKFwiVHJhbnNhY3Rpb24gZmFpbGVkOiBJbnN1ZmZpY2llbnQgZnVuZHMgZm9yIGdhc1wiKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVyci5tZXNzYWdlPy5pbmNsdWRlcyhcInVzZXIgcmVqZWN0ZWRcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdHVzKFwiVHJhbnNhY3Rpb24gY2FuY2VsbGVkIGJ5IHVzZXJcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlcnIubWVzc2FnZT8uaW5jbHVkZXMoXCJub25jZVwiKSkge1xuICAgICAgICAgICAgICAgICAgICBzZXRTdGF0dXMoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIlRyYW5zYWN0aW9uIGZhaWxlZDogTm9uY2UgZXJyb3IuIFBsZWFzZSB0cnkgYWdhaW4uXCJcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRTdGF0dXMoYFRyYW5zYWN0aW9uIGZhaWxlZDogJHtlcnIubWVzc2FnZX1gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgeyBkYXRhOiB0cmFuc2FjdGlvbkRhdGEsIGlzU3VjY2VzcyB9ID0gdXNlVHJhbnNhY3Rpb24oe1xuICAgICAgICBoYXNoOiBoYXNoIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgY2hhaW5JZCxcbiAgICB9KTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmIChoYXNoKSB7XG4gICAgICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHJhbnNhY3Rpb24gc2VudCB3aXRoIGhhc2g6XCIsIGhhc2gpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2V0U3RhdHVzKGBUcmFuc2FjdGlvbiBzZW50ISBIYXNoOiAke2hhc2h9YCk7XG4gICAgICAgIH1cbiAgICB9LCBbaGFzaCwgaXNEZWJ1Z10pO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgaWYgKHdyaXRlRXJyb3IpIHtcbiAgICAgICAgICAgIGlmIChpc0RlYnVnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIldyaXRlIGVycm9yOlwiLCB3cml0ZUVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNldFN0YXR1cyhgRXJyb3I6ICR7d3JpdGVFcnJvci5tZXNzYWdlfWApO1xuICAgICAgICB9XG4gICAgfSwgW3dyaXRlRXJyb3IsIGlzRGVidWddKTtcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGNvbnN0IGhhbmRsZVRyYW5zYWN0aW9uUmVjZWlwdCA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGlmIChoYXNoICYmIHB1YmxpY0NsaWVudCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlY2VpcHQgPVxuICAgICAgICAgICAgICAgICAgICAgICAgYXdhaXQgcHVibGljQ2xpZW50LndhaXRGb3JUcmFuc2FjdGlvblJlY2VpcHQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAocmVjZWlwdC5zdGF0dXMgPT09IFwic3VjY2Vzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcihudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvaW5EZXBsb3ltZW50ID0gZ2V0Q29pbkNyZWF0ZUZyb21Mb2dzKHJlY2VpcHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvaW5EZXBsb3ltZW50Py5jb2luKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VG9rZW5BZGRyZXNzKGNvaW5EZXBsb3ltZW50LmNvaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNldFN0YXR1cyhcIkNvaW4gY3JlYXRlZCBzdWNjZXNzZnVsbHkhXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJGYWlsZWQgdG8gZXh0cmFjdCBjb2luIGFkZHJlc3MgZnJvbSB0cmFuc2FjdGlvbiByZWNlaXB0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0U3RhdHVzKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIlRyYW5zYWN0aW9uIHN1Y2Nlc3NmdWwgYnV0IGZhaWxlZCB0byBnZXQgY29pbiBhZGRyZXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IobmV3IEVycm9yKFwiVHJhbnNhY3Rpb24gZmFpbGVkXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFN0YXR1cyhcIlRyYW5zYWN0aW9uIGZhaWxlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIkVycm9yIHByb2Nlc3NpbmcgdHJhbnNhY3Rpb24gcmVjZWlwdDpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2V0RXJyb3IoZXJyIGFzIEVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgc2V0U3RhdHVzKFwiRXJyb3IgcHJvY2Vzc2luZyB0cmFuc2FjdGlvbiByZWNlaXB0XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBoYW5kbGVUcmFuc2FjdGlvblJlY2VpcHQoKTtcbiAgICB9LCBbaGFzaCwgcHVibGljQ2xpZW50LCBpc0RlYnVnXSk7XG5cbiAgICBjb25zdCByZXNldFRyYW5zYWN0aW9uID0gKCkgPT4ge1xuICAgICAgICBzZXRFcnJvcihudWxsKTtcbiAgICAgICAgc2V0U3RhdHVzKFwiXCIpO1xuICAgICAgICBzZXRUb2tlbkFkZHJlc3MobnVsbCk7XG4gICAgfTtcblxuICAgIGNvbnN0IHdyaXRlID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29udHJhY3RDYWxsUGFyYW1zID0gYXdhaXQgY3JlYXRlQ29pbkNhbGwoY29pblBhcmFtcyk7XG4gICAgICAgICAgICBpZiAoaXNEZWJ1Zykge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29udHJhY3QgY2FsbCBwYXJhbWV0ZXJzOlwiLCB7XG4gICAgICAgICAgICAgICAgICAgIGFkZHJlc3M6IGNvbnRyYWN0Q2FsbFBhcmFtcy5hZGRyZXNzLFxuICAgICAgICAgICAgICAgICAgICBmYWN0b3J5QWRkcmVzczpcbiAgICAgICAgICAgICAgICAgICAgICAgIENIQUlOU1tjaGFpbklkIGFzIGtleW9mIHR5cGVvZiBDSEFJTlNdLmZhY3RvcnksXG4gICAgICAgICAgICAgICAgICAgIGNoYWluSWQsXG4gICAgICAgICAgICAgICAgICAgIGFiaTogY29udHJhY3RDYWxsUGFyYW1zLmFiaSxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lOiBjb250cmFjdENhbGxQYXJhbXMuZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzOiBjb250cmFjdENhbGxQYXJhbXMuYXJncyxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdyaXRlQ29udHJhY3Qoe1xuICAgICAgICAgICAgICAgIGFkZHJlc3M6IENIQUlOU1tjaGFpbklkIGFzIGtleW9mIHR5cGVvZiBDSEFJTlNdXG4gICAgICAgICAgICAgICAgICAgIC5mYWN0b3J5IGFzIGAweCR7c3RyaW5nfWAsXG4gICAgICAgICAgICAgICAgYWJpOiBjb2luRmFjdG9yeUFCSSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbk5hbWU6IGNvbnRyYWN0Q2FsbFBhcmFtcy5mdW5jdGlvbk5hbWUsXG4gICAgICAgICAgICAgICAgYXJnczogY29udHJhY3RDYWxsUGFyYW1zLmFyZ3MsXG4gICAgICAgICAgICAgICAgdmFsdWU6IGluaXRpYWxQdXJjaGFzZVdlaVxuICAgICAgICAgICAgICAgICAgICA/IEJpZ0ludChpbml0aWFsUHVyY2hhc2VXZWkpXG4gICAgICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgIGNoYWluOiBDSEFJTl9DT05GSUdTW2NoYWluSWRdLFxuICAgICAgICAgICAgICAgIGFjY291bnQ6IGFkZHJlc3MgYXMgYDB4JHtzdHJpbmd9YCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHNldEVycm9yKGVyciBhcyBFcnJvcik7XG4gICAgICAgICAgICBzZXRTdGF0dXMoXCJUcmFuc2FjdGlvbiBmYWlsZWRcIik7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd3JpdGUsXG4gICAgICAgIGlzTG9hZGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIHRyYW5zYWN0aW9uSGFzaDogaGFzaCxcbiAgICAgICAgc3RhdHVzLFxuICAgICAgICBpc1N1Y2Nlc3M6ICEhdHJhbnNhY3Rpb25EYXRhLFxuICAgICAgICB0b2tlbkFkZHJlc3MsXG4gICAgICAgIHJlc2V0VHJhbnNhY3Rpb24sXG4gICAgfTtcbn1cbiJdLCJuYW1lcyI6WyJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInVzZUNvbnRyYWN0V3JpdGUiLCJ1c2VUcmFuc2FjdGlvbiIsInVzZVB1YmxpY0NsaWVudCIsInVzZUFjY291bnQiLCJjcmVhdGVDb2luQ2FsbCIsImdldENvaW5DcmVhdGVGcm9tTG9ncyIsInpvcmEiLCJiYXNlIiwib3B0aW1pc20iLCJhcmJpdHJ1bSIsImJsYXN0IiwiYmFzZVNlcG9saWEiLCJDSEFJTlMiLCJjb2luRmFjdG9yeUFCSSIsInVzZURlYnVnIiwiQ0hBSU5fQ09ORklHUyIsImlkIiwidXNlQ29pbkNyZWF0aW9uIiwibmFtZSIsInN5bWJvbCIsInVyaSIsIm93bmVycyIsInBheW91dFJlY2lwaWVudCIsInBsYXRmb3JtUmVmZXJyZXIiLCJpbml0aWFsUHVyY2hhc2VXZWkiLCJCaWdJbnQiLCJjaGFpbklkIiwiZXJyb3IiLCJzZXRFcnJvciIsInN0YXR1cyIsInNldFN0YXR1cyIsInRva2VuQWRkcmVzcyIsInNldFRva2VuQWRkcmVzcyIsImFkZHJlc3MiLCJwdWJsaWNDbGllbnQiLCJpc0RlYnVnIiwiY29pblBhcmFtcyIsInRyaW0iLCJmYWN0b3J5QWRkcmVzcyIsImZhY3RvcnkiLCJjb25zb2xlIiwibG9nIiwidG9TdHJpbmciLCJ3cml0ZUNvbnRyYWN0IiwiZGF0YSIsImhhc2giLCJpc1BlbmRpbmciLCJpc0xvYWRpbmciLCJ3cml0ZUVycm9yIiwibXV0YXRpb24iLCJvblN1Y2Nlc3MiLCJvbkVycm9yIiwiZXJyIiwibWVzc2FnZSIsImluY2x1ZGVzIiwidHJhbnNhY3Rpb25EYXRhIiwiaXNTdWNjZXNzIiwidW5kZWZpbmVkIiwiaGFuZGxlVHJhbnNhY3Rpb25SZWNlaXB0IiwicmVjZWlwdCIsIndhaXRGb3JUcmFuc2FjdGlvblJlY2VpcHQiLCJjb2luRGVwbG95bWVudCIsImNvaW4iLCJFcnJvciIsInJlc2V0VHJhbnNhY3Rpb24iLCJ3cml0ZSIsImNvbnRyYWN0Q2FsbFBhcmFtcyIsImFiaSIsImZ1bmN0aW9uTmFtZSIsImFyZ3MiLCJ2YWx1ZSIsImNoYWluIiwiYWNjb3VudCIsInRyYW5zYWN0aW9uSGFzaCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./app/hooks/useCoinCreation.ts\n"));

/***/ })

});