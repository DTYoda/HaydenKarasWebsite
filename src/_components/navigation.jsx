import Link from "next/link";

export default function Navigation() {
    return (<div className="flex gap-4 justify-center w-screen">
        <Link className="hover:bg-green-400" href="/">HK</Link>
        <Link className="hover:bg-green-400" href="/portfolio">Portfolio</Link>
        <Link className="hover:bg-green-400" href="/about">About</Link>
        <Link className="hover:bg-green-400" href="/contact">Contact</Link>
    </div>);
};