// /llms-full.txt — полное меню всех городов с ценами одним файлом.
import { buildLlmsFull } from '@/utils/llmsText';
import {
  loadLlmsCities,
  sendLlmsText,
  sendLlmsUnavailable,
} from '@/utils/llmsData';

export async function getServerSideProps({ res }) {
  try {
    sendLlmsText(
      res,
      buildLlmsFull(await loadLlmsCities({ withDetails: false }))
    );
  } catch {
    sendLlmsUnavailable(res);
  }
  return { props: {} };
}

export default function LlmsFullTxt() {
  return null;
}
