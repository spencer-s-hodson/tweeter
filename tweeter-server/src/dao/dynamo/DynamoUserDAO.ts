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
    return Item;
  }

  // need to change table name
  public async putUser(user_alias: string, user_password: string, user_first_name: string, user_last_name: string, user_image: string, following: number, followers: number): Promise<void> {
    // is this wrong?
    const item = {
      user_alias,
      user_first_name,
      user_image,
      user_last_name,
      user_password,
      following,
      followers
    };
    await this.client.send(new PutCommand({ TableName: this.tableName, Item: item }));
  }

  // toggle follower and following updates with a boolean
  public async updateUser(user_alias: string, new_count: number, update_followers: boolean) {
    let userType: string;
    if (update_followers) {
      userType = "followers"
    }
    else {
      userType = "following";
    }

    const params = {
      TableName: this.tableName,
      Key: {
        user_alias
      },
      UpdateExpression: `SET ${userType} = :new_count`,
      ExpressionAttributeValues: {
        ":new_count": new_count,
      }
    };
    await this.client.send(new UpdateCommand(params));
  }

  // public async updateUser(user_alias: string, new_followers_count: number, new_followees_count: number) {
  //   const params = {
  //     TableName: this.tableName,
  //     Key: {
  //       user_alias
  //     },
  //     UpdateExpression: "SET followers = :new_followers_count, following = :new_followees_count",
  //     ExpressionAttributeValues: {
  //       ":new_followers_count": new_followers_count,
  //       ":new_followees_count": new_followees_count
  //     }
  //   };
  //   await this.client.send(new UpdateCommand(params));
  // }




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
}
