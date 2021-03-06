import { BidirectionalSocket, CommandController } from "@soundsystem/network";
import { Command } from "@soundsystem/network";
import { Logger } from "@nestjs/common";
import { SoundNodeData } from "@soundsystem/common";

export class SoundServerController extends CommandController<SoundNodeData> {

    private readonly logger = new Logger("SoundServerController");

    public constructor() {
        super();

        this.set("configuration", this.configuration.bind(this));
    }

    public async configuration(data: SoundNodeData, command: Command, socket: BidirectionalSocket<SoundNodeData>) {
        if(null === socket.getUserData()) {
            this.logger.log(`First configuration ${data.hostname}`);
        }

        socket.setUserData(data);
    }

}
