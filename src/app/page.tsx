import { PageHeading } from "@/components/layout/PageHeading";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <PageHeading title="Land of Odd"/>
      <nav className="bg-gray-800 text-white font-bold text-7xl h-full p-40 text-center">
        <ul className="*:mb-4">
          <li><Link className="hover:underline" href={"/new-game"}>New Game</Link></li>
          <li><Link className="hover:underline" href={"/new-game"}>Humours</Link></li>
          <li className="last:mb-0"><Link className="hover:underline" href={"/new-game"}>Illusions</Link></li>
        </ul>
      </nav>
    </div>
  );
}