import { FakeData, User } from "tweeter-shared";
import { DAO } from "../DAO";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import { UserDAO } from "../interfaces/UserDAO";
import { ObjectCannedACL, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


export class DynamoUserDAO extends DAO implements UserDAO {
  protected tableName: string = "users";

  public async getUser(user_alias: string): Promise<any> {
    const key = {
      user_alias
    };
    const { Item } = await this.client.send(new GetCommand({ TableName: this.tableName, Key: key }));

    // convert the DynamoUser into a usable user
    const user = this.dynamoUserToUser(Item);
    return user;
  }

  // need to change table name
  public async putUser(user_alias: string, user_password: string, user_first_name: string, user_last_name: string, user_image: string): Promise<void> {
    // is this wrong?
    const item = {
      user_alias,
      user_first_name,
      user_image,
      user_last_name,
      user_password
    };
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  public async putImage(fileName: string, imageStringBase64Encoded: string): Promise<string> {
    const BUCKET = "my-tweeter-bucket";
    const REGION = "us-west-2";
    let decodedImageBuffer: Buffer = Buffer.from(imageStringBase64Encoded, "base64");
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/png",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return (
      `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`
      );
    } catch (error) {
      throw Error("s3 put image failed with: " + error);
    }
  }

  private dynamoUserToUser(user: any) {
    // this is how it was given to me

    console.log("user in dao: " + JSON.stringify(user));

    interface DyanmoUser {
      user_first_name: string
      user_last_name: string
      user_alias: string
      user_password: string
      user_image: string
    }

    const dyanmoUser: DyanmoUser = user as unknown as DyanmoUser;

    console.log("DYNAMO USER: " + JSON.stringify(dyanmoUser));

    return new User(
      dyanmoUser.user_first_name,
      dyanmoUser.user_last_name,
      dyanmoUser.user_alias,
      dyanmoUser.user_image
    );
  }
}
