import Head from 'next/head';
import { serializeStructuredData } from '@/utils/structuredData';

export default function StructuredData({ data }) {
  if (!data) return null;
  return (
    <Head>
      <script
        key="page-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeStructuredData(data) }}
      />
    </Head>
  );
}
