import { NextApiRequest, NextApiResponse } from "next";
import { fetchStatsForUser } from "../../api/stats-helpers";

interface ExtendedNextReq extends NextApiRequest {
  body: {
    userId: string;
  };
}

export default async function StatsHendler(
  req: ExtendedNextReq,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const userId = req.body.userId;
      const data = await fetchStatsForUser(userId);
      res.status(200).send(data);
    }
  } catch (e) {
    res.status(500).json({ message: "Server error", error: e });
  }
}
