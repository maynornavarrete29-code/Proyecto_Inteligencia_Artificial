export async function sendPrediction(inputText: string) {
  const url = 'http://localhost:8000/api/v1/predict'
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ input_text: inputText }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API error: ${res.status} ${text}`)
  }

  return res.json()
}
