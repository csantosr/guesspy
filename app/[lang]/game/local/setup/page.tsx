import { notFound } from 'next/navigation';
import { getDictionary, hasLocale } from '@/dictionaries';
import { LocalUsersForm } from "./_components/form";

const Page = async ({
  params,
}: {
  params: { lang: string };
}) => {
  if (!hasLocale(params.lang)) notFound();

  const dict = await getDictionary(params.lang);

  return (
    <div className="w-2/3">
      <LocalUsersForm dict={dict} lang={params.lang} />
    </div>
  );
};

export default Page;
