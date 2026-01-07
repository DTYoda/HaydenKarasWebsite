import Link from "next/link";
export default function StartQuote({ quote, author, links }) {
  return (
    <div className="max-w-6xl w-full px-6 grow flex flex-col justify-start pt-32 relative">
      {/* Background decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 fade-in py-8">
        <div className="mb-6 sm:mb-8">
          <span className="mono text-orange-500 text-xl sm:text-2xl md:text-3xl">{'"'}</span>
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight inline">
            {quote}
          </h1>
          <span className="mono text-orange-500 text-xl sm:text-2xl md:text-3xl">{'"'}</span>
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-6 sm:mt-8 mb-6 sm:mb-8">
          <span className="mono text-orange-500 mr-2 sm:mr-3">{">"}</span>
          <span className="text-gray-300 font-medium">{author}</span>
        </div>
        <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
          {links.map((link, id) => (
            <Link
              key={id}
              className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 font-semibold rounded-lg transition-all duration-300 hover-lift text-sm sm:text-base"
              target={link[0][0] != "#" ? "_blank" : ""}
              href={link[0]}
            >
              {link[1]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
