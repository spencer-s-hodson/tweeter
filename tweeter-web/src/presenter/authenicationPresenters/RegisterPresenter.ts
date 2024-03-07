import { Buffer } from "buffer";
import { ChangeEvent } from "react";
import { AuthenticationPresenter, AuthenticationView } from "./AuthenticationPresenter";
import { AuthToken, User } from "tweeter-shared";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter {
  public handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    this.handleImageFile(file);
  };

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  public checkSubmitButtonStatus(alias: string, password: string, firstName: string, lastName: string, imageUrl: string): boolean {
    return !firstName || !lastName || !alias || !password || !imageUrl;
  };

  public async doRegister(firstName: string, lastName: string, alias: string, password: string, userImageBytes: Uint8Array, rememberMe: boolean, originalUrl: string) {
    this.doAuthentication(() => this.service.register(firstName, lastName, alias, password, userImageBytes), rememberMe, originalUrl )
  }

  protected getItemDesription(): string {
    return "register user";
  };

  protected get view() {
    return super.view as RegisterView;
  };
};
