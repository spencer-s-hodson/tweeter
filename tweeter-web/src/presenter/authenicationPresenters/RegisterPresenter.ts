import { Buffer } from "buffer";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { ChangeEvent } from "react";

export interface RegisterView {
  navigate: (url: string) => void;
  updateUserInfo: (currentUser: User, displayedUser: User | null, authToken: AuthToken, remember: boolean) => void;
  displayErrorMessage: (message: string) => void;
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter {
  private view: RegisterView;
  private service: UserService;

  public constructor(view: RegisterView) {
    this.view = view;
    this.service = new UserService();
  }

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

  // go look for the message on slack about rememberMe
  public async doRegister(firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, rememberMe: boolean) {
    try {
      let [user, authToken] = await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to register user because of exception: ${error}`
      );
    };
  };

  public checkSubmitButtonStatus(firstName: string, lastName: string, alias: string, password: string, imageUrl: string): boolean {
    return !firstName || !lastName || !alias || !password || !imageUrl;
  };
};