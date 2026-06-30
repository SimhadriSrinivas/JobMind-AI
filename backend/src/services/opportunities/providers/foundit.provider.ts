import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type FounditOpportunity = {
  ref: string;
  position: string;
  employer: string;
  place: string;
  contractType: string;
  keywords: string[];
};

export class FounditProvider implements OpportunityProvider<FounditOpportunity> {
  public readonly name = "Foundit";

  async search(): Promise<FounditOpportunity[]> {
    return [
      {
        ref: "foundit-qa-1",
        position: "QA Automation Engineer",
        employer: "TestGrid",
        place: "Pune",
        contractType: "Full Time",
        keywords: ["Selenium", "Java", "API Testing"],
      },
    ];
  }

  normalize(rawOpportunity: FounditOpportunity): Opportunity {
    return {
      id: rawOpportunity.ref,
      title: rawOpportunity.position,
      company: rawOpportunity.employer,
      location: rawOpportunity.place,
      skills: rawOpportunity.keywords,
      employmentType: rawOpportunity.contractType,
      opportunityType: "JOB",
      source: this.name,
      url: "https://www.foundit.in/",
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
