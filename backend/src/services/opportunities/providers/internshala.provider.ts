import { Opportunity } from "../../../types/opportunity.types";
import { OpportunityProvider } from "../core/provider.interface";

type InternshalaOpportunity = {
  internshipId: string;
  profile: string;
  company: string;
  city: string;
  stipend?: number;
  requiredSkills: string[];
};

export class InternshalaProvider
  implements OpportunityProvider<InternshalaOpportunity>
{
  public readonly name = "Internshala";

  async search(): Promise<InternshalaOpportunity[]> {
    return [
      {
        internshipId: "internshala-ml-1",
        profile: "Machine Learning Intern",
        company: "LearnAI Labs",
        city: "Remote",
        stipend: 15000,
        requiredSkills: ["Python", "Machine Learning", "Pandas"],
      },
    ];
  }

  normalize(rawOpportunity: InternshalaOpportunity): Opportunity {
    return {
      id: rawOpportunity.internshipId,
      title: rawOpportunity.profile,
      company: rawOpportunity.company,
      location: rawOpportunity.city,
      salary: rawOpportunity.stipend,
      currency: "INR",
      skills: rawOpportunity.requiredSkills,
      opportunityType: "INTERNSHIP",
      source: this.name,
      url: "https://internshala.com/",
      isRemote: rawOpportunity.city.toLowerCase() === "remote",
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
