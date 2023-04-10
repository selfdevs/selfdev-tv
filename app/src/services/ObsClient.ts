class ObsClient {
  private client: WebSocket;
  private connected: boolean = false;

  constructor() {
    console.log('ObsClient constructor');
    this.client = new WebSocket('ws://localhost:4455');

    this.client.onopen = () => {
      console.log('ObsClient connected');
      this.connected = true;
      this.identify();
    };
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
      }),
    );
  }

  public switchToScene(sceneName: string): void {
    if (!this.isConnected) return;
    this.client.send(
      JSON.stringify({
        op: 6,
        d: {
          requestType: 'SetCurrentProgramScene',
          requestId: 'f819dcf0-89cc-11eb-8f0e-382c4ac93b9c',
          requestData: {
            sceneName,
          },
        },
      }),
    );
  }

  public async getSourceScreenshot(sourceName: string): Promise<string> {
    if (!this.isConnected) return;
    const requestId = crypto.randomUUID();
    this.client.send(
      JSON.stringify({
        op: 6,
        d: {
          requestType: 'GetSourceScreenshot',
          requestId: requestId,
          requestData: {
            sourceName,
            imageFormat: 'png',
            saveToFilePath: false,
          },
        },
      }),
    );
    return new Promise((resolve) => {
      const listener = (event) => {
        const data = JSON.parse(event.data);
        if (data.op === 7 && data.d.requestId === requestId) {
          resolve(data.d.responseData.imageData);
          this.client.removeEventListener('message', listener);
        }
      };
      this.client.addEventListener('message', listener);
    });
  }

  public getCurrentScene(): Promise<string> {
    if (!this.isConnected) return;
    const requestId = crypto.randomUUID();
    this.client.send(
      JSON.stringify({
        op: 6,
        d: {
          requestType: 'GetCurrentProgramScene',
          requestId: requestId,
        },
      }),
    );
    return new Promise((resolve) => {
      const listener = (event) => {
        const data = JSON.parse(event.data);
        if (data.op === 7 && data.d.requestId === requestId) {
          resolve(data.d.responseData.currentProgramSceneName);
          this.client.removeEventListener('message', listener);
        }
      };
      this.client.addEventListener('message', listener);
    });
  }
}

export default new ObsClient();
