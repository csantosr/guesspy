import Link from "next/link";
import FuzzyText from "@/primitives/components/FuzzyText";
import { Button } from "@/primitives/components/ui/button";
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from '@/dictionaries'

const Page = async ({
  params,
}: {
  params: { lang: string };
}) => {
  if (!hasLocale(params.lang)) notFound()

  const dict = await getDictionary(params.lang)

  return (
    <div className="flex flex-col gap-4">
      <FuzzyText>Guesspy</FuzzyText>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-10">
        <Link className="w-full sm:w-auto" href={`/${params.lang}/game/local/setup`}>
          <Button className="w-full sm:w-auto">{dict.game.local}</Button>
        </Link>
        <Button disabled>{dict.game.room}</Button>
      </div>
    </div>
  );
}

export default Page;
