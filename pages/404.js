import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function NotFoundPage() {
  const router = useRouter()
  const [homeHref, setHomeHref] = useState('/samara')

  // Если история пустая, кнопка "Назад" поведёт на главную
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back()
    } else {
      router.push(homeHref) // если истории нет — ведём на "/{city}" или "/"
    }
  }

  // (необязательно) убираем фокус с активных элементов после монтирования
  useEffect(() => {
    if (typeof document !== 'undefined') document.activeElement?.blur?.()
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('myCity')
      if (raw) {
        // чуть-чуть санитайза, чтобы не получить странные символы
        const city = String(raw).trim().toLowerCase().replace(/[^a-z0-9_-]/gi, '')
        if (city) setHomeHref(`/${city}`)
      }
    } catch {}
    // снимаем фокус с активных элементов (необязательно)
    document.activeElement?.blur?.()
  }, [])

  return (
    <>
      <Head>
        <title>Страница не найдена — 404</title>
        {/* Для подстраховки (необязательно): поисковики и так не индексируют 404 */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="wrap" role="main" aria-labelledby="notfound-title">
        <div className="card">
          <div className="code">404</div>
          <h1 id="notfound-title">Страница не найдена</h1>
          <p className="desc">
            К сожалению, такой страницы нет. Проверьте адрес или воспользуйтесь кнопками ниже.
          </p>

          <div className="actions">
            <button className="btn secondary" onClick={goBack}>
              ← Назад
            </button>
            <Link href={homeHref} className="btn primary">
              На главную
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background:
            radial-gradient(1200px 600px at 10% -10%, rgba(204, 0, 51, 0.08), transparent 60%),
            radial-gradient(1000px 500px at 110% 110%, rgba(0, 0, 0, 0.06), transparent 60%),
            var(--bg);
        }
        :global(html) {
          --bg: #f7f7f8;
          --card: #ffffff;
          --text: #11181c;
          --muted: #6b7280;
          --primary: #cc0033;
          --primary-contrast: #ffffff;
          --border: #e5e7eb;
        }
        
        .card {
          max-width: 680px;
          width: 100%;
          background: var(--card);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
          padding: 32px 28px;
          text-align: center;
        }
        .code {
          font-size: clamp(56px, 10vw, 96px);
          font-weight: 800;
          letter-spacing: 2px;
          line-height: 1;
          color: var(--primary);
          margin-bottom: 8px;
        }
        h1 {
          font-size: clamp(20px, 3vw, 28px);
          margin: 8px 0 10px;
        }
        .desc {
          color: var(--muted);
          margin: 0 0 20px;
        }
        .actions {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
        }
        .btn {
          appearance: none;
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 10px 16px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          line-height: 1;
          transition: transform 0.05s ease, background 0.2s ease, border-color 0.2s ease;
          user-select: none;
        }
        .btn:active {
          transform: translateY(1px);
        }
        .btn.primary {
          background: var(--primary);
          color: var(--primary-contrast);
          border-color: var(--primary);
        }
        .btn.primary:hover {
          filter: brightness(1.05);
        }
        .btn.secondary {
          background: transparent;
          color: var(--text);
        }
        .btn.secondary:hover {
          border-color: #cbd5e1;
        }
      `}</style>
    </>
  )
}