export class RegisterRequest {
  private _firstName: string;
  private _lastName: string;
  private _alias: string;
  private _password: string;
  private _userImageBytes: string;

  public constructor(firstName: string, lastName: string, username: string, password: string, userImageBytes: string) {
    this._firstName = firstName;
    this._lastName = lastName;    
    this._alias = username;
    this._password = password;
    this._userImageBytes = userImageBytes;
  }

  public get firstName() {
    return this._firstName;
  }

  public get lastName() {
    return this._lastName;
  }

  public get alias() {
    return this._alias;
  }

  public get password() {
    return this._password;
  }

  public get userImageBytes() {
    return this._userImageBytes;
  }
}
