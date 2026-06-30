import { Response } from "express";
import { searchOpportunities } from "../services/opportunities/core/opportunityAggregator.service";
import { getProviderStatuses } from "../services/opportunities/core/providerRegistry";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const searchOpportunitiesController = asyncHandler(async (req, res: Response) => {
  const result = await searchOpportunities(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, result, "Opportunities fetched successfully"));
});

export const getOpportunityProvidersController = asyncHandler(
  async (_req, res: Response) => {
    const providers = await getProviderStatuses();

    res
      .status(200)
      .json(new ApiResponse(200, { providers }, "Opportunity providers fetched"));
  }
);
