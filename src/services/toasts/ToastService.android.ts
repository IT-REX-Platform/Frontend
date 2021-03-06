import { IToasts } from "./IToasts";

export class ToastService implements IToasts {
    public success(msg: string): void {
        // TODO: create toast handling for Android.
        console.log(msg);
    }

    public info(msg: string): void {
        // TODO: create toast handling for Android.
        console.log(msg);
    }

    public warn(msg: string): void {
        // TODO: create toast handling for Android.
        console.log(msg);
    }

    public error(msg: string): void {
        // TODO: create toast handling for Android.
        console.log(msg);
    }
}
