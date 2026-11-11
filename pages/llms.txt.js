// /llms.txt — карта сайта для ИИ-ассистентов (llmstxt.org), собирается из API.
import { buildLlmsIndex } from '@/utils/llmsText';
import {
  loadLlmsCities,
  sendLlmsText,
  sendLlmsUnavailable,
} from '@/utils/llmsData';

export async function getServerSideProps({ res }) {
  try {
    sendLlmsText(res, buildLlmsIndex(await loadLlmsCities()));
  } catch {
    sendLlmsUnavailable(res);
  }
  return { props: {} };
}

export default function LlmsTxt() {
  return null;
}
