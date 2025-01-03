import Navigation from "../_components/navigation";
import StartQuote from "../_components/startquote";
import AdminPage from "../_components/adminpage";
import { PrismaClient } from "@prisma/client";

export default function Admin() {
  return (
    <div>
      <div className="flex flex-col h-screen w-screen">
        <Navigation />
        <div className="w-screen flex justify-center grow">
          <StartQuote
            quote="Admin"
            author="Hayden"
            links={["LinkedIn", "GitHub"]}
          />
        </div>
      </div>
      <AdminPage />
    </div>
  );
}
