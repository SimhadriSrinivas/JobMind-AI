import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type LinkedInOpportunity = {
  id: string;
  role: string;
  companyName: string;
  city: string;
  skills: string[];
  remote: boolean;
};

export class LinkedInProvider implements OpportunityProvider<LinkedInOpportunity> {
  public readonly name = "LinkedIn";

  async search(): Promise<LinkedInOpportunity[]> {
    return [
      {
        id: "linkedin-frontend-1",
        role: "Frontend Engineer",
        companyName: "NovaCloud",
        city: "Bengaluru",
        skills: ["React", "TypeScript", "CSS"],
        remote: false,
      },
    ];
  }

  normalize(rawOpportunity: LinkedInOpportunity): Opportunity {
    return {
      id: rawOpportunity.id,
      title: rawOpportunity.role,
      company: rawOpportunity.companyName,
      location: rawOpportunity.city,
      skills: rawOpportunity.skills,
      opportunityType: rawOpportunity.remote ? "REMOTE" : "JOB",
      source: this.name,
      url: "https://www.linkedin.com/jobs/",
      isRemote: rawOpportunity.remote,
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
