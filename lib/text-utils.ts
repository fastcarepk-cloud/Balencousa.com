/**
 * Comprehensive HTML stripping and text cleaning utilities
 * Used across the application to ensure consistent text rendering
 */

// Enhanced HTML stripping function that handles multiple encoding scenarios
export function stripHtmlTags(html: string): string {
  if (typeof html !== "string" || !html) return ""

  let cleanText = html

  // First, handle HTML entities like &lt; &gt; &amp; etc.
  const entityMap: { [key: string]: string } = {
    "&lt;": "<",
    "&gt;": ">",
    "&amp;": "&",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
    "&apos;": "'",
    "&cent;": "¢",
    "&pound;": "£",
    "&yen;": "¥",
    "&euro;": "€",
    "&copy;": "©",
    "&reg;": "®",
    "&trade;": "™",
    "&hellip;": "...",
    "&mdash;": "—",
    "&ndash;": "–",
    "&lsquo;": "'",
    "&rsquo;": "'",
    "&ldquo;": '"',
    "&rdquo;": '"',
    "&bull;": "•",
    "&middot;": "·",
    "&sect;": "§",
    "&para;": "¶",
    "&dagger;": "†",
    "&Dagger;": "‡",
    "&permil;": "‰",
    "&lsaquo;": "‹",
    "&rsaquo;": "›",
    "&oline;": "‾",
    "&frasl;": "⁄",
    "&weierp;": "℘",
    "&image;": "ℑ",
    "&real;": "ℜ",
    "&alefsym;": "ℵ",
    "&larr;": "←",
    "&uarr;": "↑",
    "&rarr;": "→",
    "&darr;": "↓",
    "&harr;": "↔",
    "&crarr;": "↵",
    "&lArr;": "⇐",
    "&uArr;": "⇑",
    "&rArr;": "⇒",
    "&dArr;": "⇓",
    "&hArr;": "⇔",
  }

  // Replace HTML entities first
  Object.keys(entityMap).forEach((entity) => {
    const regex = new RegExp(entity, "gi")
    cleanText = cleanText.replace(regex, entityMap[entity])
  })

  // Handle numeric HTML entities like &#8217; &#8220; etc.
  cleanText = cleanText.replace(/&#(\d+);/g, (match, dec) => {
    try {
      return String.fromCharCode(Number.parseInt(dec, 10))
    } catch {
      return ""
    }
  })

  // Handle hex HTML entities like &#x2019; etc.
  cleanText = cleanText.replace(/&#x([0-9a-f]+);/gi, (match, hex) => {
    try {
      return String.fromCharCode(Number.parseInt(hex, 16))
    } catch {
      return ""
    }
  })

  // Remove HTML comments
  cleanText = cleanText.replace(/<!--[\s\S]*?-->/g, "")

  // Remove script and style tags with their content
  cleanText = cleanText.replace(/<(script|style)[^>]*>[\s\S]*?<\/(script|style)>/gi, "")

  // Remove HTML tags - comprehensive regex that handles nested tags, attributes, and malformed HTML
  cleanText = cleanText.replace(/<\/?[^>]*>/g, "")

  // Remove any remaining HTML-like patterns and entities
  cleanText = cleanText.replace(/&[a-zA-Z0-9#]+;/g, "")

  // Clean up extra whitespace and normalize
  cleanText = cleanText.replace(/\s+/g, " ").trim()

  // Remove any remaining angle brackets that might be left
  cleanText = cleanText.replace(/[<>]/g, "")

  // Remove any remaining control characters
  cleanText = cleanText.replace(/[\x00-\x1F\x7F]/g, "")

  return cleanText
}

// Enhanced truncate function with better word boundary handling
export function truncateText(text: string, maxLength: number): string {
  if (!text) return ""
  const cleanText = stripHtmlTags(text)
  if (cleanText.length <= maxLength) return cleanText

  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  // If we found a space and it's not too far back, use it
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace).trim() + "..."
  }

  // Otherwise, just truncate at maxLength
  return truncated.trim() + "..."
}

// Function to format review count
export function formatReviewCount(count: number): string {
  if (!count || count === 0) return ""
  return `(${count} review${count !== 1 ? "s" : ""})`
}

// Function to clean and validate text input
export function sanitizeInput(input: string): string {
  if (!input) return ""

  // Strip HTML tags
  let clean = stripHtmlTags(input)

  // Remove any potentially dangerous characters
  clean = clean.replace(/[<>'"&]/g, "")

  // Normalize whitespace
  clean = clean.replace(/\s+/g, " ").trim()

  return clean
}

// Function to extract plain text from rich content
export function extractPlainText(richContent: string, maxLength?: number): string {
  const plainText = stripHtmlTags(richContent)

  if (maxLength && plainText.length > maxLength) {
    return truncateText(plainText, maxLength)
  }

  return plainText
}

// Function to check if text contains HTML
export function containsHtml(text: string): boolean {
  if (!text) return false
  return /<[^>]*>/g.test(text)
}

// Function to preserve line breaks when stripping HTML
export function stripHtmlPreserveBreaks(html: string): string {
  if (!html) return ""

  let cleanText = html

  // Convert <br>, <p>, and <div> tags to line breaks
  cleanText = cleanText.replace(/<br\s*\/?>/gi, "\n")
  cleanText = cleanText.replace(/<\/p>/gi, "\n\n")
  cleanText = cleanText.replace(/<\/div>/gi, "\n")

  // Now strip all HTML
  cleanText = stripHtmlTags(cleanText)

  // Clean up excessive line breaks
  cleanText = cleanText.replace(/\n{3,}/g, "\n\n")

  return cleanText.trim()
}
