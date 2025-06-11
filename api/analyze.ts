import type { VercelRequest, VercelResponse } from '@vercel/node'

// import won't work on vercel
interface UpdatableExpense {
  propertyId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  isPaid: boolean;
}

const chooseLocalePrompt = (expenses: UpdatableExpense[], locale: string) => {
  if (locale === 'mk-MK') {
    return `
      Вие сте вештачка интелигенција што помага при анализа на лични трошоци.
      Оваа апликација е наменета за изнајмување и трошоци поврзани со киријата.
      Тековната анализа треба да биде прикажана за крајниот корисник, а не за сопственикот на имотот.
      Имајте предвид дека трошоците се однесуваат на македонскиот пазар и се изразени во валутата МКД.
      EVN се однесува на струја, VODOVOD е за вода, URBAN е трошок за станот,
      RENT е кирија, а ESM е за греење преку зима, но трошокот се појавува секој месец.
      Пред да дадете анализа, проверете ги општите пазарни цени за сметки и кирија.
      Врз основа на дадената листа на трошоци, сумирајте ја вкупната сума,
      истакнете кои ставки не се платени, означете сè што изгледа невообичаено
      и дадете насоки или идеи за тоа како да се продолжи со тековното трошење.
      
      ${JSON.stringify(expenses, null, 2)}
    `
  }

  return `
    You are an AI assistant helping analyze personal spending. 
    This application is for renting and expenses for the rent. 
    The current analysis should be displayed for the end user, not the landlord.
    Consider that the expenses are for Macedonian market, in MKD currency.
    EVN stands for electricity, VODOVOD is for water, URBAN is expense for the apartment,
    RENT is rent, ESM is for heating through the winter but the expense is coming for every month.
    Before giving an analysis make sure you investigate the market overall on expenses of bills and 
    rent expenses.
    Given this list of expenses, summarize total amount, unpaid items, flag anything unusual and give
    directions or ideas on how to proceed with current spendings:
    
    ${JSON.stringify(expenses, null, 2)}
  `
}

export default async function handler (req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { expenses, locale } = req.body

    // Validate input
    if (!expenses || !Array.isArray(expenses)) {
      return res.status(400).json({ error: 'Invalid expenses data' })
    }

    // Check for API key
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      console.error('GROQ_API_KEY is not configured')
      return res.status(500).json({ error: 'API key not configured' })
    }

    const prompt = chooseLocalePrompt(expenses, locale || 'en')

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Groq API error:', response.status, errorText)
      return res.status(500).json({
        error: `Groq API error: ${response.status}`
      })
    }

    const data = await response.json()
    const summary = data.choices?.[0]?.message?.content || 'No summary available.'

    return res.status(200).json({ summary })
  } catch (error) {
    console.error('Error analyzing expenses:', error)
    return res.status(500).json({
      error: 'Failed to analyze expenses'
    })
  }
}