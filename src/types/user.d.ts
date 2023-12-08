import { User } from "@prisma/client";

type UserInfos = Omit<User, "password">;
