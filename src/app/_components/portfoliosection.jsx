import PortfolioSectionClient from "./portfoliosectionclient";

export default function PortfolioSection({ initialProjects = [] }) {
  return <PortfolioSectionClient initialProjects={initialProjects} />;
}
