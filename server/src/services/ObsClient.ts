import WebSocket from "ws";

class ObsClient {
  public client: WebSocket;
  private connected: boolean = false;

  async connect(): Promise<void> {
    console.log("ObsClient connecting...");
    return new Promise<void>((resolve, reject) => {
      this.client = new WebSocket("ws://localhost:4455");

      this.client.onopen = () => {
        console.log("ObsClient connected");
        this.connected = true;
        this.identify();
        resolve();
      };

      this.client.addEventListener("message", (message) => {
        const data = JSON.parse(message.data.toString());
        console.log(data);
      });
    });
  }

  public get isConnected(): boolean {
    return this.connected;
  }

  private identify(): void {
    this.client.send(
      JSON.stringify({
        op: 1,
        d: {
          rpcVersion: 1,
        },
      })
    );
  }

  private async sendRequest(
    requestType: string,
    requestData: any
  ): Promise<any> {
    const requestId = crypto.randomUUID();
    this.client.send(
      JSON.stringify({
        op: 6,
        d: {
          requestType,
          requestId,
          requestData,
        },
      })
    );
    return new Promise((resolve) => {
      const listener = (message) => {
        const data = JSON.parse(message.data.toString());
        if (data.d.requestId === requestId) {
          resolve(data);
          this.client.removeEventListener("message", listener);
        }
      };
      this.client.addEventListener("message", listener);
    });
  }

  public getInputKindList(): Promise<any> {
    return this.sendRequest("GetInputKindList", {});
  }

  public createInput(): Promise<any> {
    return this.sendRequest("CreateInput", {
      inputName: "test",
      inputKind: "ffmpeg_source",
      sceneName: "slot1",
      inputSettings: {
        local_file:
          "/Users/experimental/dev/broadcast-preview/server/assets/particules.mp4",
      },
    });
  }

  public getInputsList(): Promise<any> {
    return this.sendRequest("GetInputList", {});
  }

  public getInputSettings(inputName: string): Promise<any> {
    return this.sendRequest("GetInputSettings", { inputName });
  }

  public setInputSettings(inputName: string, inputSettings: any): Promise<any> {
    return this.sendRequest("SetInputSettings", { inputName, inputSettings });
  }
  public switchToScene(sceneName: string): void {
    if (!this.isConnected) return;
    this.client.send(
      JSON.stringify({
        op: 6,
        d: {
          requestType: "SetCurrentProgramScene",
          requestId: "f819dcf0-89cc-11eb-8f0e-382c4ac93b9c",
          requestData: {
            sceneName,
          },
        },
      })
    );
  }
}

export default new ObsClient();
