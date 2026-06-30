import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type NaukriOpportunity = {
  jobId: string;
  title: string;
  organization: string;
  location: string;
  minExperience: number;
  tags: string[];
};

export class NaukriProvider implements OpportunityProvider<NaukriOpportunity> {
  public readonly name = "Naukri";

  async search(): Promise<NaukriOpportunity[]> {
    return [
      {
        jobId: "naukri-backend-1",
        title: "Backend Developer",
        organization: "DataNest",
        location: "Hyderabad",
        minExperience: 2,
        tags: ["Node.js", "Express", "MongoDB"],
      },
    ];
  }

  normalize(rawOpportunity: NaukriOpportunity): Opportunity {
    return {
      id: rawOpportunity.jobId,
      title: rawOpportunity.title,
      company: rawOpportunity.organization,
      location: rawOpportunity.location,
      experience: rawOpportunity.minExperience,
      skills: rawOpportunity.tags,
      opportunityType: "JOB",
      source: this.name,
      url: "https://www.naukri.com/",
      isRemote: false,
      createdAt: new Date(),
    };
  }

  async healthCheck() {
    return {
      provider: this.name,
      healthy: true,
      message: "Mock provider available",
    };
  }
}
