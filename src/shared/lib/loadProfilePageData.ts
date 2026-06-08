import { loadCabinetPageData } from './loadCabinetPageData';
import type { HomePageRawData } from './loadHomePageData';

export async function loadProfilePageData(
  cityParam: string | string[] | undefined
): Promise<HomePageRawData> {
  return loadCabinetPageData('profile', cityParam);
}
