import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type CompanyCareerOpportunity = {
  slug: string;
  title: string;
  company: string;
  location: string;
  type: string;
  skills: string[];
};

export class CompanyCareerProvider
  implements OpportunityProvider<CompanyCareerOpportunity>
{
  public readonly name = "Company Career Page";

  async search(): Promise<CompanyCareerOpportunity[]> {
    return [
      {
        slug: "career-page-devops-1",
        title: "DevOps Engineer",
        company: "CloudForge",
        location: "Chennai",
        type: "Contract",
        skills: ["AWS", "Docker", "Kubernetes"],
      },
    ];
  }

  normalize(rawOpportunity: CompanyCareerOpportunity): Opportunity {
    return {
      id: rawOpportunity.slug,
      title: rawOpportunity.title,
      company: rawOpportunity.company,
      location: rawOpportunity.location,
      employmentType: rawOpportunity.type,
      skills: rawOpportunity.skills,
      opportunityType: rawOpportunity.type === "Contract" ? "CONTRACT" : "CAREER_PAGE",
      source: this.name,
      url: "https://careers.example.com/",
      isRemote: rawOpportunity.location.toLowerCase() === "remote",
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
