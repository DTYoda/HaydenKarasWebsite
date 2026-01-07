import Link from "next/link";
import Image from "next/image";

export default function LatestProjects({ projects }) {
  const latestProjects = projects.slice(0, 3);

  return (
    <section className="w-full mb-20 fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Latest Projects</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Recent work showcasing my skills and creativity
          </p>
        </div>
        <Link
          href="/portfolio"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black font-semibold rounded-lg transition-all duration-300 hover-lift glow-orange-hover whitespace-nowrap"
        >
          View All Projects →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {latestProjects.map((project, index) => {
          const images = project.images ? JSON.parse(project.images) : [];
          const imagePath = images.length > 0 
            ? `/${project.urlTitle}/${images[0]}`
            : null;

          return (
            <Link
              key={index}
              href={`/portfolio/${project.urlTitle}`}
              className="group glass rounded-2xl overflow-hidden hover-lift transition-all duration-300 border border-orange-500/20 hover:border-orange-500/50"
              style={{
                animation: `floatIn 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              {imagePath && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={imagePath}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-2 group-hover:text-orange-500 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-orange-500/80 font-medium mb-2">
                  {project.type}
                </p>
                <p className="text-xs text-gray-500">{project.date}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

