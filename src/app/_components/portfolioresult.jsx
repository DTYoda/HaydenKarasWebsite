import Image from "next/image";

export default function PortfolioResult({ link, title, type, date }) {
  return (
    <a className="w-64 text-left" href={"/projects/" + link}>
      <Image height={256} width={256} className="w-64 h-64 bg-gray-200 rounded-2xl" />
      <div className="w-64 h-16 flex flex-col mt-3">
        <div className="bold">{title}</div> {/* Title */}
        <div> {/* Tags */}</div>
        <div className="text-gray-400">{type}</div> {/* Type */}
        <div className="text-gray-400">{date}</div> {/* Date */}
      </div>
    </a>
  );
}
