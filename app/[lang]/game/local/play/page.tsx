import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/dictionaries';
import { Game } from "./_components/game";

const Page = async ({
  params,
}: {
  params: { lang: string };
}) => {
  if (!hasLocale(params.lang)) notFound();

  const dict = await getDictionary(params.lang);

  return <Game dict={dict} />;
};

export default Page;
