import "../../../setupTests.ts";
// @ts-ignore
import { ToastService as ToastServiceWeb } from "../../../src/services/toasts/ToastService.ts";
import { ToastService as ToastServiceAndroid } from "../../../src/services/toasts/ToastService.android";
import { ToastService as ToastServiceIos } from "../../../src/services/toasts/ToastService.ios";

// Disable logs in ToastService.
console.log = jest.fn();

describe("test Web toast service", () => {
    const toastWeb: ToastServiceWeb = new ToastServiceWeb();

    it("check if toast method sucess is called", async () => {
        expect(toastWeb.success("sucess_msg")).toBe(undefined);
    });

    it("check if toast method info is called", async () => {
        expect(toastWeb.info("info_msg")).toBe(undefined);
    });

    it("check if toast method warn is called", async () => {
        expect(toastWeb.warn("warn_msg")).toBe(undefined);
    });

    it("check if toast method error is called", async () => {
        expect(toastWeb.error("error_msg")).toBe(undefined);
    });
});

describe("test Android toast service", () => {
    const toastAndroid: ToastServiceAndroid = new ToastServiceAndroid();

    it("check if toast method sucess is called", async () => {
        expect(toastAndroid.success("sucess_msg")).toBe(undefined);
    });

    it("check if toast method info is called", async () => {
        expect(toastAndroid.info("info_msg")).toBe(undefined);
    });

    it("check if toast method warn is called", async () => {
        expect(toastAndroid.warn("warn_msg")).toBe(undefined);
    });

    it("check if toast method error is called", async () => {
        expect(toastAndroid.error("error_msg")).toBe(undefined);
    });
});

describe("test iOS toast service", () => {
    const toastIos: ToastServiceIos = new ToastServiceIos();

    it("check if toast method sucess is called", async () => {
        expect(toastIos.success("sucess_msg")).toBe(undefined);
    });

    it("check if toast method info is called", async () => {
        expect(toastIos.info("info_msg")).toBe(undefined);
    });

    it("check if toast method warn is called", async () => {
        expect(toastIos.warn("warn_msg")).toBe(undefined);
    });

    it("check if toast method error is called", async () => {
        expect(toastIos.error("error_msg")).toBe(undefined);
    });
});
