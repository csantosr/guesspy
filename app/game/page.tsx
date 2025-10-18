import Link from "next/link";
import FuzzyText from "@/primitives/components/FuzzyText";
import { Button } from "@/primitives/components/ui/button";

const Page = () => (
  <div className="flex flex-col gap-4">
    <FuzzyText>Guesspy</FuzzyText>
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-10">
      <Link className="w-full sm:w-auto" href="/game/local/setup">
        <Button className="w-full sm:w-auto">Local Game</Button>
      </Link>
      <Button disabled>Create Room</Button>
    </div>
  </div>
);

export default Page;
