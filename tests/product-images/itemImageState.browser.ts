import { act, createElement, StrictMode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import useItemImageState from '../../modules/home/cardItem/useItemImageState';

type ImageProps = { src: string; shouldLoad: boolean; itemReady: boolean };
let container: HTMLDivElement;
let root: Root;
let image: ReturnType<typeof useItemImageState>;

function Probe({ src, shouldLoad, itemReady }: ImageProps) {
  image = useItemImageState(src, shouldLoad, itemReady);
  return null;
}

const render = async (props: Partial<ImageProps> = {}) => {
  await act(async () => {
    root.render(
      createElement(StrictMode, null, createElement(Probe, {
        src: '/product.jpg', shouldLoad: true, itemReady: true, ...props,
      }))
    );
  });
};

beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
});

describe('повторная загрузка изображения товара', () => {
  it('после ошибки повторное открытие того же товара начинает новую загрузку', async () => {
    await render();
    await act(async () => image.onError());
    expect(image.hasError).toBe(true);
    expect(image.isLoading).toBe(false);

    await render({ itemReady: false });
    await render();
    expect(image.hasError).toBe(false);
    expect(image.isLoading).toBe(true);

    await act(async () => image.onLoad());
    expect(image.isLoading).toBe(false);
    expect(image.hasError).toBe(false);
  });

  it('успешно загруженное изображение остаётся загруженным при обычной перерисовке', async () => {
    await render();
    await act(async () => image.onLoad());
    await render();
    expect(image.isLoading).toBe(false);
    expect(image.hasError).toBe(false);
  });

  it('смена товара и возврат не восстанавливают прежнюю ошибку', async () => {
    await render();
    await act(async () => image.onError());
    await render({ src: '/other-product.jpg' });
    await act(async () => image.onLoad());
    await render();
    expect(image.hasError).toBe(false);
    expect(image.isLoading).toBe(true);
  });

  it('запоздавшая ошибка закрытой модалки не портит результат новой загрузки', async () => {
    await render();
    const oldError = image.onError;
    await render({ itemReady: false });
    await render();
    await act(async () => image.onLoad());
    await act(async () => oldError());
    expect(image.hasError).toBe(false);
    expect(image.isLoading).toBe(false);
  });

  it('запоздавшая загрузка прежнего товара не скрывает скелетон нового', async () => {
    await render();
    const oldLoad = image.onLoad;
    await render({ src: '/other-product.jpg' });
    await act(async () => oldLoad());
    expect(image.hasError).toBe(false);
    expect(image.isLoading).toBe(true);
  });

  it('отсутствующее изображение показывает заглушку без бесконечного скелетона', async () => {
    await render({ shouldLoad: false });
    expect(image.hasError).toBe(false);
    expect(image.isLoading).toBe(false);
  });
});
