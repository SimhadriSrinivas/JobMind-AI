import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type WellfoundOpportunity = {
  uuid: string;
  name: string;
  startup: string;
  remote: boolean;
  stack: string[];
};

export class WellfoundProvider implements OpportunityProvider<WellfoundOpportunity> {
  public readonly name = "Wellfound";

  async search(): Promise<WellfoundOpportunity[]> {
    return [
      {
        uuid: "wellfound-fullstack-1",
        name: "Full Stack Engineer",
        startup: "FinLaunch",
        remote: true,
        stack: ["React", "Node.js", "PostgreSQL"],
      },
    ];
  }

  normalize(rawOpportunity: WellfoundOpportunity): Opportunity {
    return {
      id: rawOpportunity.uuid,
      title: rawOpportunity.name,
      company: rawOpportunity.startup,
      location: rawOpportunity.remote ? "Remote" : undefined,
      skills: rawOpportunity.stack,
      opportunityType: rawOpportunity.remote ? "REMOTE" : "JOB",
      source: this.name,
      url: "https://wellfound.com/jobs",
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
