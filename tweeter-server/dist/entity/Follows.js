"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follows = void 0;
class Follows {
    constructor(followerHandle, followerName, followeeHandle, followeeName) {
        this.followerHandle = followerHandle;
        this.followerName = followerName;
        this.followeeHandle = followeeHandle;
        this.followeeName = followeeName;
    }
    toString() {
        return ("Follows {" +
            "followerHandle='" +
            this.followerHandle +
            "'" +
            ", followerName='" +
            this.followeeName +
            "'" +
            ", followeeHandle=" +
            this.followeeHandle +
            "'" +
            ", followeeName=" +
            this.followeeName +
            "}");
    }
}
exports.Follows = Follows;
