import { SystemService } from "./SystemService";
import { EventEmitter } from "events";
import { Transaction } from "@sentry/types";

export class BluetoothService extends EventEmitter {

    private services: SystemService[] = [];

    private stream: SystemService;

    private single: SystemService;

    public constructor(transaction: Transaction) {
        super();

        this.services.push(...[
            new SystemService("bthelper@hci0", transaction),
            new SystemService("bt-agent", transaction),
            new SystemService("bluetooth", transaction),
            new SystemService("bluealsa", transaction),
        ]);

        this.stream = new SystemService("bluemusic-playback", transaction);

        this.single = new SystemService("bluetooth-playback", transaction);
    }

    public async start() {
        for await (const service of this.services) {
            this.emit("beforeStart", service.getServiceName());
            await service.start();
            this.emit("afterStart", service.getServiceName());
        }
    }

    public async stop() {
        for await (const service of this.services) {
            this.emit("beforeStop", service.getServiceName());
            await service.stop();
            this.emit("afterStop", service.getServiceName());
        }
    }

    public async startStream() {
        this.emit("beforeStart", this.stream.getServiceName());
        await this.stream.start();
        this.emit("afterStart", this.stream.getServiceName());
    }

    public async startSingle() {
        this.emit("beforeStart", this.single.getServiceName());
        await this.single.start();
        this.emit("afterStart", this.single.getServiceName());
    }

    public async stopStream() {
        this.emit("beforeStop", this.stream.getServiceName());
        await this.stream.stop();
        this.emit("afterStop", this.stream.getServiceName());
    }

    public async stopSingle() {
        this.emit("beforeStop", this.single.getServiceName());
        await this.single.stop();
        this.emit("afterStop", this.single.getServiceName());
    }
}
