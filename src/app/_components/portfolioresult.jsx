import Image from "next/image";

export default function PortfolioResult({ link, title, type, date, image }) {
  return (
    <a className="w-64 text-left group" href={"/portfolio/" + link}>
      <Image
        height={256}
        width={256}
        className="group-hover:scale-110 transition-all w-64 h-64 rounded-2xl group-hover:border  border-orange-500"
        src={"/" + link + "/" + image}
      />
      <div className="w-64 h-16 flex flex-col mt-3">
        <div className="bold w-fit">
          {title}{" "}
          <span class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-orange-500"></span>
        </div>{" "}
        {/* Title */}
        <div> {/* Tags */}</div>
        <div className="text-gray-400 ">{type}</div> {/* Type */}
        <div className="text-gray-400 ">{date}</div> {/* Date */}
      </div>
    </a>
  );
}
