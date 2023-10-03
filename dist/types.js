"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = exports.PluginType = exports.Area = void 0;
var Area;
(function (Area) {
    Area[Area["BACKEND"] = 0] = "BACKEND";
    Area[Area["FRONTEND"] = 1] = "FRONTEND";
    Area[Area["DATABASE"] = 2] = "DATABASE";
    Area[Area["INFRA"] = 3] = "INFRA";
})(Area || (exports.Area = Area = {}));
var PluginType;
(function (PluginType) {
    PluginType[PluginType["FILTER_AREA"] = 0] = "FILTER_AREA";
    PluginType[PluginType["BOLD_TEXT"] = 1] = "BOLD_TEXT";
})(PluginType || (exports.PluginType = PluginType = {}));
exports.initialState = {
    areas: [
        Area.FRONTEND,
        Area.BACKEND,
        Area.INFRA,
        Area.DATABASE
    ],
    boldWords: [],
};
