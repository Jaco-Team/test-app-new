import { expect, test } from '@playwright/test';

test('storage-page table borders override imported spreadsheet styles', async ({
  page,
}) => {
  await page.goto('/404');
  await page.evaluate(() => {
    const tableContainer = document.createElement('div');
    tableContainer.className = 'PageStorageConditions';
    tableContainer.innerHTML = `
      <table>
        <tbody>
          <tr>
            <td rowspan="2" style="border-top-style: none; border-bottom: 0.5pt solid black;">
              Роллы в ассортименте
            </td>
            <td>Срок хранения 24 часа</td>
          </tr>
          <tr><td>Срок хранения не более 3 часов</td></tr>
        </tbody>
      </table>
    `;
    document.body.append(tableContainer);
  });

  const importedCell = page.locator('.PageStorageConditions td').first();
  await expect(importedCell).toHaveCSS('border-top-width', '1px');
  await expect(importedCell).toHaveCSS('border-top-style', 'solid');
  await expect(importedCell).toHaveCSS(
    'border-top-color',
    'rgb(217, 217, 217)'
  );
  await expect(importedCell).toHaveCSS('border-bottom-width', '1px');
  await expect(importedCell).toHaveCSS(
    'border-bottom-color',
    'rgb(217, 217, 217)'
  );
});
