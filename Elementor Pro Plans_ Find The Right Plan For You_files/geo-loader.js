/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./modules/network/assets/js/geo-script.js
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Class GeoTrace
 */
class GeoTrace {
  constructor() {
    // Global fetch error flag
    _defineProperty(this, "fetchError", false);
  }
  /**
   * Retrieve client the location code.
   * @returns {Promise<*|boolean>}
   */
  async getLocationCode() {
    let storageGeoCode = GeoTrace.getFromStorage();
    if (storageGeoCode) {
      return storageGeoCode;
    }
    try {
      let response = await GeoTrace.fetchCloudflareCgiTrace();
      let text = await response.text();
      storageGeoCode = this.extractFromTraceEndpoint(text, 'loc');
      GeoTrace.saveToStorage(storageGeoCode);
    } catch (e) {
      this.fetchError = true;
    }
    return storageGeoCode;
  }

  /**
   * Retrieve client IP address.
   * @returns {Promise<*|boolean>}
   */
  async getIpAddress() {
    let ip;
    try {
      let response = await GeoTrace.fetchCloudflareCgiTrace();
      let text = await response.text();
      ip = this.extractFromTraceEndpoint(text, 'ip');
    } catch (e) {
      this.fetchError = true;
    }
    return ip;
  }

  /**
   * extractFromTraceEndpoint
   * @param responseText
   * @param param
   * @return {*}
   */
  extractFromTraceEndpoint(responseText, param) {
    let paramValue;
    if (responseText) {
      paramValue = responseText.split(param + '=')[1].split("\n")[0];
    } else {
      throw 'responseEmpty';
    }
    return paramValue;
  }

  /**
   * Retrieve the client data trace.
   * @returns {Promise<Response>}
   */
  static async fetchCloudflareCgiTrace() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GeoTrace.fetchTimeout);
    const response = await fetch(GeoTrace.traceEndpoint, {
      mode: "cors"
    });
    clearTimeout(timeoutId);
    return response;
  }

  /**
   * Save the data ( geo location code ) to the local storage
   * @param data
   */
  static saveToStorage(data) {
    if (GeoTrace.isLocalStorageOn()) {
      window.localStorage.setItem(GeoTrace.storageKey, JSON.stringify(data));
    }
  }

  /**
   * Get the data from the local storage
   * @returns {any|boolean}
   */
  static getFromStorage() {
    return GeoTrace.isLocalStorageOn() ? JSON.parse(window.localStorage.getItem(GeoTrace.storageKey)) : false;
  }

  /**
   * Check if the local storage is available
   * @returns {boolean}
   */
  static isLocalStorageOn() {
    return 'undefined' !== typeof window.localStorage;
  }
}
// This endpoint obtain the information about the user (this information includes the country code)
_defineProperty(GeoTrace, "traceEndpoint", 'https://elementor.com/cdn-cgi/trace');
// Fetch timeout ( 3 sec )
_defineProperty(GeoTrace, "fetchTimeout", 3000);
// The key name which the information from the fetch will be stored
_defineProperty(GeoTrace, "storageKey", 'elGeoLocationCode');
;// CONCATENATED MODULE: ./modules/network/assets/js/geo-loader.js


/**
 * class Geo_Loader
 */
class Geo_Loader {
  async load() {
    await new GeoTrace().getLocationCode();
  }
}
new Geo_Loader().load();
/******/ })()
;
//# sourceMappingURL=geo-loader.js.map