import { IToasts } from "./IToasts";
import { Slide, toast, TypeOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

export class ToastService implements IToasts {
    public success(msg: string, autoClose?: number | false): void {
        this._createToastWeb(msg, "success", autoClose);
    }

    public info(msg: string, autoClose?: number | false): void {
        this._createToastWeb(msg, "info", autoClose);
    }

    public warn(msg: string, autoClose?: number | false): void {
        this._createToastWeb(msg, "warning", autoClose);
    }

    public error(msg: string, autoClose?: number | false): void {
        this._createToastWeb(msg, "error", autoClose);
    }

    private _createToastWeb(msg: string, type: TypeOptions, autoClose?: number | false): void {
        toast(msg, {
            type: type,
            autoClose: autoClose,
            position: "top-right",
            transition: Slide,
            closeOnClick: true,
            draggable: true,
            pauseOnHover: true,
        });
    }
}
