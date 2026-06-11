'use client'

import { useState } from 'react'
import { Lang } from '@/lib/content'

interface CopyLinkButtonProps {
  lang: Lang
}

export default function CopyLinkButton({ lang }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (typeof window === 'undefined') return
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea')
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (e) {
        // ignore
      }
    }
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        border: '1px solid var(--color-mist)',
        borderRadius: '2px',
        fontSize: '13px',
        fontWeight: 600,
        color: copied ? 'var(--color-navy)' : 'var(--color-navy)',
        background: copied ? 'var(--color-bone)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
      onMouseEnter={e => {
        if (!copied) e.currentTarget.style.background = 'var(--color-bone)'
      }}
      onMouseLeave={e => {
        if (!copied) e.currentTarget.style.background = 'transparent'
      }}
    >
      <span style={{ fontSize: '14px' }}>{copied ? '✓' : '🔗'}</span>
      {copied
        ? (lang === 'en' ? 'Link copied!' : 'Link disalin!')
        : (lang === 'en' ? 'Copy link' : 'Salin link')
      }
    </button>
  )
}
