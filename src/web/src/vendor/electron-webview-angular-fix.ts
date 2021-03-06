//  https://github.com/electron/electron/issues/10176

const originalRemoveEventListener = window.removeEventListener;

function removeEventListenerOverloaded(this: any, eventName: string, listener?: EventListenerOrEventListenerObject) {
    if (listener && needToCallOriginalMethod(eventName, listener.toString())) {
        // calling native/original implementation
        return originalRemoveEventListener.apply(this, arguments as any);
    }

    // calling implementation patched by Zone.js
    return EventTarget.prototype.removeEventListener.apply(this, arguments as any);
}

function needToCallOriginalMethod(eventName: string, listenerFunctionStringified: string): boolean {
    return eventName === "readystatechange"
        && listenerFunctionStringified.indexOf("registerBrowserPluginElement()") !== -1
        && listenerFunctionStringified.indexOf("registerWebViewElement()") !== -1;
}

window.removeEventListener = removeEventListenerOverloaded;
