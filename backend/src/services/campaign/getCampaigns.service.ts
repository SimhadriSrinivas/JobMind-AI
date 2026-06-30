import { FilterQuery } from "mongoose";
import Campaign, { ICampaign } from "../../models/campaign.model";

export const getCampaigns = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;
  const filter: FilterQuery<ICampaign> = { userId };

  if (typeof query.status === "string") {
    filter.status = query.status;
  }

  const [campaigns, total] = await Promise.all([
    Campaign.find(filter).sort({ updatedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
    Campaign.countDocuments(filter),
  ]);

  return {
    campaigns,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const parsePositiveNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
