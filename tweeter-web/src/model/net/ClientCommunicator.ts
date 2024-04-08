import { TweeterRequest, TweeterResponse } from "tweeter-shared";

export class ClientCommunicator {
  private SERVER_URL: string;
  constructor(SERVER_URL: string) {
    this.SERVER_URL = SERVER_URL;
  }

  async doPost<T extends TweeterRequest, U extends TweeterResponse>(req: T, endpoint: string): Promise<U> {
    const url = this.SERVER_URL + endpoint;
    const request = {
      method: "post",
      headers: new Headers({
        // "Content-Type": "application/json", // Change the Content-Type to application/json
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      }),
      body: JSON.stringify(req),
    };

    console.log("Request Before Sent: " + request.body);  // looks fine here

    try {
      // something goes wrong here?
      const resp: Response = await fetch(url, request);  // issue is here
      console.log("Response After Sent: " + JSON.stringify(resp));
      if (resp.ok) {
        const response: U = await resp.json();
        console.log("Response After .json: " + JSON.stringify(response));
        return response;
      } else {
        const error = await resp.json();
        throw new Error(error.errorMessage);
      }

    } catch (err) {
      throw new Error(
        "Client communicator doPost failed:\n" + (err as Error).message
      );
    }
  }
}
