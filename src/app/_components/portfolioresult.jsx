import Image from "next/image";

export default function PortfolioResult({ link, title, type, date, image }) {
  return (
    <a className="w-64 text-left" href={"/portfolio/" + link}>
      <Image
        height={256}
        width={256}
        className="w-64 h-64 rounded-2xl"
        src={"/" + link + "/" + image}
      />
      <div className="w-64 h-16 flex flex-col mt-3">
        <div className="bold">{title}</div> {/* Title */}
        <div> {/* Tags */}</div>
        <div className="text-gray-400">{type}</div> {/* Type */}
        <div className="text-gray-400">{date}</div> {/* Date */}
      </div>
    </a>
  );
}
