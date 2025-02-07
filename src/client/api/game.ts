import axios from "axios";
import { GameMessage } from "../../types";
import { AuthData, GameAuthInfo } from "./types";

export const runGame = async (id: string) => {
  const res = await axios.post(`http://localhost:3000/game/${id}/run`);
  return res;
};

export const authInGame = async (data: GameAuthInfo): Promise<AuthData> => {
  return { accessToken: "1", refreshToken: "2" };
};
